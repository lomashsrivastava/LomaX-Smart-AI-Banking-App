import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import CustomerAccount from '../models/CustomerAccount';
import User from '../models/User';
import Account from '../models/Account';

// GET /api/customer-accounts/pending
export const getPendingAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pending = await CustomerAccount.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, data: pending });
  } catch (error) {
    console.error('Fetch pending accounts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/customer-accounts/approved
export const getApprovedAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const approved = await CustomerAccount.find({ status: 'approved' }).sort({ approvedAt: -1 }).lean();
    
    const data = await Promise.all(approved.map(async (ca) => {
      const acc = await Account.findOne({ accountNumber: ca.accountNumber });
      return {
        ...ca,
        initialDeposit: acc ? acc.balance : ca.initialDeposit
      };
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch approved accounts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/customer-accounts/all
export const getAllCustomerAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const all = await CustomerAccount.find().sort({ createdAt: -1 }).lean();
    const data = await Promise.all(all.map(async (ca) => {
      if (ca.status === 'approved') {
        const acc = await Account.findOne({ accountNumber: ca.accountNumber });
        return {
          ...ca,
          initialDeposit: acc ? acc.balance : ca.initialDeposit
        };
      }
      return ca;
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch all accounts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// POST /api/customer-accounts/:id/approve
export const approveAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ca = await CustomerAccount.findById(id);

    if (!ca) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }
    if (ca.status !== 'pending') {
      res.status(400).json({ success: false, message: `Application is already ${ca.status}` });
      return;
    }

    // 1. Create User
    const hashedPass = await bcrypt.hash(ca.plainPassword, 10);
    const newUser = new User({
      customerId: ca.customerId,
      password: hashedPass,
      role: 'customer',
      firstName: ca.firstName,
      lastName: ca.lastName,
      email: ca.email,
      mobile: ca.mobile,
      pan: ca.pan,
      aadhaar: ca.aadhaar,
      status: 'active',
      registrationData: ca.registrationData,
    });
    await newUser.save();

    // 2. Create Account
    const newAccount = new Account({
      accountNumber: ca.accountNumber,
      cifNumber: ca.customerId,
      user: newUser._id,
      accountType: ca.accountType,
      balance: ca.initialDeposit,
      branchName: ca.branchName,
      branchCode: ca.branchCode,
      ifscCode: ca.ifscCode,
      status: 'active',
      services: ca.services,
    });
    await newAccount.save();

    // 3. Update CustomerAccount
    ca.status = 'approved';
    ca.approvedAt = new Date();
    ca.userId = newUser._id as any;
    ca.accountId = newAccount._id as any;
    await ca.save();

    res.json({ success: true, message: 'Account approved and activated successfully', customerId: ca.customerId });
  } catch (error: any) {
    console.error('Approve account error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to approve account' });
  }
};

// POST /api/customer-accounts/:id/reject
export const rejectAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ca = await CustomerAccount.findById(id);
    if (!ca) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    ca.status = 'rejected';
    ca.rejectedAt = new Date();
    ca.rejectionReason = reason || 'Rejected by administrator';
    await ca.save();

    res.json({ success: true, message: 'Application rejected' });
  } catch (error) {
    console.error('Reject account error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject application' });
  }
};

// DELETE /api/customer-accounts/:id
export const deleteCustomerAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ca = await CustomerAccount.findByIdAndDelete(id);

    if (!ca) {
      res.status(404).json({ success: false, message: 'Customer account not found' });
      return;
    }

    // Cascade delete user and bank account if it was approved
    if (ca.userId) {
      await User.findByIdAndDelete(ca.userId);
    }
    if (ca.accountId) {
      await Account.findByIdAndDelete(ca.accountId);
    } else {
      // Fallback in case of mismatch
      await Account.deleteMany({ cifNumber: ca.customerId });
      await User.deleteMany({ customerId: ca.customerId });
    }

    res.json({ success: true, message: 'Account application and related records successfully deleted' });
  } catch (error) {
    console.error('Delete customer account error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete customer account' });
  }
};

// PUT /api/customer-accounts/:id
export const updateCustomerAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ca = await CustomerAccount.findById(id);
    if (!ca) {
      res.status(404).json({ success: false, message: 'Customer account not found' });
      return;
    }

    // Update CustomerAccount record fields
    const directFields = ['firstName', 'lastName', 'email', 'mobile', 'pan', 'aadhaar', 'accountType', 'initialDeposit'];
    for (const field of directFields) {
      if (updateData[field] !== undefined) {
        (ca as any)[field] = updateData[field];
      }
    }

    if (updateData.services !== undefined) {
      ca.services = updateData.services;
      ca.markModified('services');
    }

    if (updateData.registrationData !== undefined) {
      ca.registrationData = { ...ca.registrationData, ...updateData.registrationData };
      ca.markModified('registrationData');
    }

    await ca.save();

    // If approved, update the related User and Account records too
    if (ca.userId) {
      await User.findByIdAndUpdate(ca.userId, {
        firstName: ca.firstName,
        lastName: ca.lastName,
        email: ca.email,
        mobile: ca.mobile,
        pan: ca.pan,
        aadhaar: ca.aadhaar,
      });
    }

    if (ca.accountId) {
      await Account.findByIdAndUpdate(ca.accountId, {
        accountType: ca.accountType,
        balance: ca.initialDeposit,
        services: ca.services,
      });
    }

    res.json({ success: true, message: 'Account updated successfully', data: ca });
  } catch (error: any) {
    console.error('Update customer account error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update customer account' });
  }
};
