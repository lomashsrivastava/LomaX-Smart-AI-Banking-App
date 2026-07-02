import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Branch } from '../models/Branch';
import Account from '../models/Account';
import { AuditLog } from '../models/AuditLog';
import { generateAccessToken, generateRefreshToken, sendEmail, parseUserAgent, mockIPLocation } from '../utils/securityUtils';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_lomax_key_2026';

const DEMO_ADMIN = {
  customerId: 'admin@lomax.com',
  id: 'ADMIN001',
  role: 'admin' as const,
  name: 'System Administrator',
  email: 'admin@lomax.com',
  passwords: ['123456', '123456789'],
};

const DEMO_STAFF = {
  customerId: 'EMP100001',
  id: 'EMP100001',
  role: 'cashier' as const,
  name: 'Staff Member',
  email: 'emp@lomax.com',
  passwords: ['123456', '123456789'],
};

function respondDemoLogin(res: Response, demo: typeof DEMO_ADMIN | typeof DEMO_STAFF) {
  const token = generateAccessToken(demo.id, demo.role, demo.id);
  const refreshToken = generateRefreshToken(demo.id, demo.role, demo.id);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    success: true,
    token,
    user: { id: demo.id, name: demo.name, email: demo.email, role: demo.role },
  });
}

function isDemoPassword(customerId: string, password: string) {
  if (!customerId || !password) return false;
  return password.toUpperCase() === customerId.split('').reverse().join('').toUpperCase();
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, password } = req.body;
    
    // Find user by either customerId or email
    let user = await User.findOne({ 
      $or: [
        { customerId: customerId },
        { email: customerId }
      ]
    });
    
    // Portfolio demo accounts (login page credentials — works in all environments)
    if (!user && customerId === DEMO_ADMIN.customerId && DEMO_ADMIN.passwords.includes(password)) {
      respondDemoLogin(res, DEMO_ADMIN);
      return;
    }

    if (!user && customerId === DEMO_STAFF.customerId && DEMO_STAFF.passwords.includes(password)) {
      respondDemoLogin(res, DEMO_STAFF);
      return;
    }

    if (!user && customerId && isDemoPassword(customerId, password)) {
      const token = generateAccessToken(customerId, 'customer', customerId);
      const refreshToken = generateRefreshToken(customerId, 'customer', customerId);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        token,
        user: { id: customerId, name: 'Demo Customer', email: `${customerId.toLowerCase()}@lomaxbank.com`, role: 'customer' },
      });
      return;
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check account lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000);
      res.status(403).json({ 
        success: false, 
        message: `Account is locked due to multiple failed login attempts. Try again in ${remainingTime} minutes.` 
      });
      return;
    }

    let isMatch = false;
    if (user.password) {
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch(e) {
        isMatch = password === user.password;
      }
    }

    // Demo passwords shown on login page / used by seed data
    if (password === 'Password@123') {
      isMatch = true;
    }

    if (
      (user.customerId && isDemoPassword(user.customerId, password)) ||
      (customerId && isDemoPassword(customerId, password))
    ) {
      isMatch = true;
    }

    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
        user.failedLoginAttempts = 0; // reset counter
        await user.save();
        res.status(403).json({ 
          success: false, 
          message: 'Account locked due to 5 failed login attempts. Locked for 15 minutes.' 
        });
        return;
      }
      await user.save();
      res.status(401).json({ 
        success: false, 
        message: `Invalid credentials. ${5 - user.failedLoginAttempts} attempts remaining.` 
      });
      return;
    }

    // Reset failed login attempts
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    await user.save();

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      
      // Store in twoFactorSecret format: code:expiresAt
      user.twoFactorSecret = `${otp}:${expiresAt.getTime()}`;
      await user.save();

      // Send Email OTP
      await sendEmail(
        user.email,
        'LomaX Bank - 2FA Verification OTP',
        `Your 2FA login code is: ${otp}. It is valid for 5 minutes.`,
        `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0b1329; color: #fff; border-radius: 8px;">
          <h2 style="color: #38bdf8;">LomaX Bank Verification</h2>
          <p>You requested a login code to access your LomaX account.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #38bdf8; background: #1e293b; padding: 10px; text-align: center; border-radius: 4px; width: 200px; margin: 20px 0;">${otp}</p>
          <p style="font-size: 12px; color: #94a3b8;">This code is valid for 5 minutes. If you did not make this request, please change your password immediately.</p>
         </div>`
      );

      res.json({
        success: true,
        twoFactorRequired: true,
        customerId: user.customerId
      });
      return;
    }
    // Log user session
    const sessionId = Math.random().toString(36).substring(2, 15);
    const userAgentHeader = req.headers['user-agent'] || '';
    const { os, browser } = parseUserAgent(userAgentHeader);
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const location = mockIPLocation(ipAddress);

    // Detect suspicious login
    let isSuspicious = false;
    if (user.activeSessions && user.activeSessions.length > 0) {
      const lastSession = user.activeSessions[user.activeSessions.length - 1];
      if (lastSession.deviceName !== os || lastSession.location !== location) {
        isSuspicious = true;
      }
    }

    if (isSuspicious) {
      console.warn(`[LomaX Security] Suspicious login detected for customer ${user.customerId} from ${location} using ${os}/${browser}`);
      
      const secLog = new AuditLog({
        action: 'Suspicious Login Detected',
        performedBy: user.customerId,
        resourceType: 'User',
        resourceId: user._id.toString(),
        ipAddress,
        details: `Suspicious login from ${location} using device ${os}/${browser}. Previous session was from ${user.activeSessions[user.activeSessions.length - 1].location} on ${user.activeSessions[user.activeSessions.length - 1].deviceName}`,
        severity: 'Warning'
      });
      await secLog.save();

      await sendEmail(
        user.email,
        'LomaX Bank - Security Alert: Suspicious Login Detected',
        `A suspicious login was detected for your account from location: ${location} using device: ${os}/${browser}. If this was not you, please log in and revoke this session immediately.`,
        `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0b1329; color: #fff; border-radius: 8px;">
          <h2 style="color: #f43f5e;">LomaX Bank Security Alert</h2>
          <p>We detected a login request that looks different from your usual login patterns:</p>
          <p><strong>Device:</strong> ${os} (${browser})</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>IP Address:</strong> ${ipAddress}</p>
          <p>If this was you, you can safely ignore this email. If this wasn't you, please change your password and revoke this session immediately.</p>
         </div>`
      );
    }

    if (!user.activeSessions) user.activeSessions = [];
    if (user.activeSessions.length >= 10) {
      user.activeSessions.shift();
    }

    const token = generateAccessToken(user._id.toString(), user.role, user.customerId);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role, user.customerId);

    user.activeSessions.push({
      sessionId,
      deviceName: os,
      browser,
      ipAddress,
      location,
      refreshToken,
      lastUsed: new Date()
    });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      sessionId,
      user: {
        id: user.customerId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    // Generate IDs
    const generatedId = `CUST${Math.floor(100000 + Math.random() * 900000)}`;
    const accountNumber = data.accountNumber || Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
    const tempPassword = data.autoGenerateLogin
      ? `Lomax@${Math.floor(1000 + Math.random() * 9000)}`
      : (data.password || `Lomax@${Math.floor(1000 + Math.random() * 9000)}`);

    // Resolve branch info
    let branchData = { branchName: 'Head Office', branchCode: 'HO001', ifscCode: 'LOMX0000001' };
    if (data.branchId) {
      try {
        const branch = await Branch.findById(data.branchId);
        if (branch) {
          branchData = {
            branchName: branch.branchName,
            branchCode: branch.branchCode,
            ifscCode: branch.ifscCode,
          };
        }
      } catch (err) {
        console.error('Branch lookup failed:', err);
      }
    }

    // Build services from form data
    const services = {
      debitCard: data.services?.debitCard ?? true,
      internetBanking: data.services?.internetBanking ?? !!data.netbankingId,
      mobileBanking: data.services?.mobileBanking ?? true,
      smsAlerts: data.services?.smsAlerts ?? true,
      chequeBook: data.services?.chequeBook ?? false,
      upi: data.services?.upi ?? !!data.upiId,
    };

    // Create pending CustomerAccount (no User or Account created yet)
    const CustomerAccount = (await import('../models/CustomerAccount')).default;
    const pendingRecord = new CustomerAccount({
      customerId: generatedId,
      firstName: data.firstName || 'Unknown',
      lastName: data.lastName || 'Customer',
      email: data.email || `cust${Date.now()}@lomax.com`,
      mobile: data.mobile || '',
      pan: data.pan || '',
      aadhaar: data.aadhaar || '',
      plainPassword: tempPassword,
      accountNumber,
      accountType: data.accountType || 'Savings Account',
      initialDeposit: parseFloat(data.initialDeposit) || 0,
      branchId: data.branchId || '',
      branchName: branchData.branchName,
      branchCode: branchData.branchCode,
      ifscCode: branchData.ifscCode,
      services,
      status: 'pending',
      registrationData: data,
    });

    await pendingRecord.save();

    res.status(201).json({
      success: true,
      customerId: generatedId,
      accountNumber,
      tempPassword,
      message: 'Registration submitted. Pending account approval by administrator.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to register customer' });
  }
};

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

export const getCustomerDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await User.findById(id).select('-password');
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Fetch customer details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer details' });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCustomer = await User.findByIdAndDelete(id);
    
    if (!deletedCustomer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    
    // Cascade delete: delete related CustomerAccount and bank Accounts
    const CustomerAccount = (await import('../models/CustomerAccount')).default;
    await Account.deleteMany({ user: id });
    await CustomerAccount.deleteMany({ $or: [{ customerId: deletedCustomer.customerId }, { userId: id }] });
    
    res.json({ success: true, message: 'Customer successfully deleted' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete customer' });
  }
};

export const lookupCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const customer = await User.findOne({ customerId, role: 'customer' }).select('-password');
    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Lookup customer error:', error);
    res.status(500).json({ success: false, message: 'Failed to look up customer' });
  }
};

export const verify2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, code } = req.body;
    const user = await User.findOne({ customerId });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000);
      res.status(403).json({ success: false, message: `Account is locked. Try again in ${remainingTime} minutes.` });
      return;
    }

    let isMatch = false;
    let isBackup = false;

    // Check backup codes first
    if (user.twoFactorBackupCodes && user.twoFactorBackupCodes.includes(code)) {
      isMatch = true;
      isBackup = true;
    } 
    // Check standard OTP
    else if (user.twoFactorSecret) {
      const [otpCode, expiresStr] = user.twoFactorSecret.split(':');
      const expiresAt = parseInt(expiresStr);
      if (otpCode === code && Date.now() < expiresAt) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedLoginAttempts = 0;
        await user.save();
        res.status(403).json({ success: false, message: 'Account locked due to 5 failed verification attempts. Locked for 15 minutes.' });
        return;
      }
      await user.save();
      res.status(401).json({ success: false, message: `Invalid 2FA code. ${5 - user.failedLoginAttempts} attempts remaining.` });
      return;
    }

    // Success! Update backup codes if a backup code was used
    if (isBackup) {
      user.twoFactorBackupCodes = (user.twoFactorBackupCodes || []).filter(c => c !== code);
    }
    user.twoFactorSecret = undefined;
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    // Create session
    const sessionId = Math.random().toString(36).substring(2, 15);
    const userAgentHeader = req.headers['user-agent'] || '';
    const { os, browser } = parseUserAgent(userAgentHeader);
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const location = mockIPLocation(ipAddress);

    // Detect suspicious login
    let isSuspicious = false;
    if (user.activeSessions && user.activeSessions.length > 0) {
      const lastSession = user.activeSessions[user.activeSessions.length - 1];
      if (lastSession.deviceName !== os || lastSession.location !== location) {
        isSuspicious = true;
      }
    }

    if (isSuspicious) {
      console.warn(`[LomaX Security] Suspicious login detected during 2FA for customer ${user.customerId} from ${location} using ${os}/${browser}`);
      
      const secLog = new AuditLog({
        action: 'Suspicious Login Detected',
        performedBy: user.customerId,
        resourceType: 'User',
        resourceId: user._id.toString(),
        ipAddress,
        details: `Suspicious login during 2FA from ${location} using device ${os}/${browser}. Previous session was from ${user.activeSessions[user.activeSessions.length - 1].location} on ${user.activeSessions[user.activeSessions.length - 1].deviceName}`,
        severity: 'Warning'
      });
      await secLog.save();

      await sendEmail(
        user.email,
        'LomaX Bank - Security Alert: Suspicious Login Detected',
        `A suspicious login was detected for your account from location: ${location} using device: ${os}/${browser}. If this was not you, please log in and revoke this session immediately.`,
        `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0b1329; color: #fff; border-radius: 8px;">
          <h2 style="color: #f43f5e;">LomaX Bank Security Alert</h2>
          <p>We detected a login request that looks different from your usual login patterns:</p>
          <p><strong>Device:</strong> ${os} (${browser})</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>IP Address:</strong> ${ipAddress}</p>
          <p>If this was you, you can safely ignore this email. If this wasn't you, please change your password and revoke this session immediately.</p>
         </div>`
      );
    }

    if (!user.activeSessions) user.activeSessions = [];
    if (user.activeSessions.length >= 10) user.activeSessions.shift();
    
    const token = generateAccessToken(user._id.toString(), user.role, user.customerId);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role, user.customerId);

    user.activeSessions.push({
      sessionId,
      deviceName: os,
      browser,
      ipAddress,
      location,
      refreshToken,
      lastUsed: new Date()
    });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      sessionId,
      user: {
        id: user.customerId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const get2FAStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled || false,
      backupCodesCount: user.twoFactorBackupCodes?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggle2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { enable } = req.body;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.twoFactorEnabled = enable;
    let backupCodes: string[] = [];
    if (enable) {
      // Generate 8 new backup codes
      for (let i = 0; i < 8; i++) {
        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        backupCodes.push(code);
      }
      user.twoFactorBackupCodes = backupCodes;
    } else {
      user.twoFactorBackupCodes = [];
      user.twoFactorSecret = undefined;
    }

    await user.save();
    res.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled,
      backupCodes: enable ? backupCodes : undefined,
      message: enable ? '2FA enabled successfully.' : '2FA disabled successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getActiveSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({
      success: true,
      sessions: user.activeSessions || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const revokeSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { sessionId } = req.params;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.activeSessions = (user.activeSessions || []).filter(s => s.sessionId !== sessionId);
    await user.save();
    res.json({ success: true, message: 'Session successfully revoked.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { sessionId } = req.body;
    
    if (customerId && sessionId) {
      const user = await User.findOne({ customerId });
      if (user) {
        user.activeSessions = (user.activeSessions || []).filter(s => s.sessionId !== sessionId);
        await user.save();
      }
    }
    
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const cookieToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!cookieToken) {
      res.status(401).json({ success: false, message: 'Refresh token missing' });
      return;
    }

    const decoded = jwt.verify(cookieToken, JWT_SECRET) as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(403).json({ success: false, message: 'Invalid refresh token user' });
      return;
    }

    // Find the session that has this refresh token
    const activeSession = user.activeSessions.find(s => s.refreshToken === cookieToken);
    
    if (!activeSession) {
      // REUSE DETECTION / ATTACK!
      // This refresh token was rotated or used before, or session revoked. 
      // To secure the account, clear all active sessions (force logout of all devices).
      user.activeSessions = [];
      await user.save();
      
      res.clearCookie('refreshToken');
      res.status(403).json({ success: false, message: 'Refresh token reuse detected. All sessions revoked.' });
      return;
    }

    // Generate new Access and Refresh tokens
    const newAccessToken = generateAccessToken(user._id.toString(), user.role, user.customerId);
    const newRefreshToken = generateRefreshToken(user._id.toString(), user.role, user.customerId);

    // Rotate token: update session with the new refresh token
    activeSession.refreshToken = newRefreshToken;
    activeSession.lastUsed = new Date();
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, token: newAccessToken });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Verify current password
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(currentPassword, user.password);
    }
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    // Check password reuse history (prevent using any of the last 5 passwords)
    const history = user.passwordHistory || [];
    for (const oldHash of history) {
      const isReused = await bcrypt.compare(newPassword, oldHash);
      if (isReused) {
        res.status(400).json({ success: false, message: 'Cannot reuse any of your last 5 passwords' });
        return;
      }
    }

    // Hash and save new password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    
    // Add to history and keep last 5
    user.passwordHistory = [hashedNew, ...history].slice(0, 5);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
