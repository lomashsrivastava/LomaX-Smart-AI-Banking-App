import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_lomax_key_2026';

export const generateAccessToken = (userId: string, role: string, customerId: string): string => {
  return jwt.sign({ id: userId, role, customerId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string, role: string, customerId: string): string => {
  return jwt.sign({ id: userId, role, customerId }, JWT_SECRET, { expiresIn: '7d' });
};

// SMTP Transporter setup
let transporter: nodemailer.Transporter | null = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<boolean> => {
  try {
    if (transporter) {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'LomaX Bank'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: html || text,
      });
      console.log(`[LomaX Email] ✓ Sent to ${to}: "${subject}"`);
      return true;
    } else {
      // Development fallback: log to file
      const logDir = path.join(process.cwd(), 'email_logs');
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      const logFile = path.join(logDir, `${Date.now()}_email.log`);
      const content = [
        '='.repeat(60),
        `[LomaX Email Logger] ${new Date().toISOString()}`,
        `To:      ${to}`,
        `Subject: ${subject}`,
        '-'.repeat(60),
        text,
        '='.repeat(60), '',
      ].join('\n');
      fs.writeFileSync(logFile, content, 'utf-8');
      console.log(`[LomaX Email] No SMTP configured. Logged to: ${logFile}`);
      return true;
    }
  } catch (error) {
    console.error(`[LomaX Email] ✗ Failed to send to ${to}:`, error);
    return false;
  }
};

// Device parsing helper
export const parseUserAgent = (userAgent: string = ''): { os: string; browser: string } => {
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  const ua = userAgent.toLowerCase();

  // OS Detection
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Browser Detection
  if (ua.includes('chrome') || ua.includes('crios')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge') || ua.includes('edg')) browser = 'Edge';

  return { os, browser };
};

// Location mocking helper for testing / heatmaps
export const mockIPLocation = (ip: string = ''): string => {
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost')) {
    return 'Lucknow'; // Default development location for demo purposes
  }
  
  // Hash the IP string to map it to a demo city for the heatmap
  const cities = ['Lucknow', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Kolkata'];
  let sum = 0;
  for (let i = 0; i < ip.length; i++) {
    sum += ip.charCodeAt(i);
  }
  return cities[sum % cities.length];
};
