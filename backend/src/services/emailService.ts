import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// ─── Log directory for development fallback ────────────────────────────────
const LOG_DIR = path.join(process.cwd(), 'email_logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ─── Create transporter ────────────────────────────────────────────────────
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587');

  if (host && user && pass) {
    // Production: real SMTP (Gmail / Brevo / SendGrid)
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Development fallback: log emails to file instead of sending
  return null;
};

const transporter = createTransporter();

// ─── Write fallback log ────────────────────────────────────────────────────
const writeEmailLog = (to: string, subject: string, text: string) => {
  const timestamp = new Date().toISOString();
  const logFile = path.join(LOG_DIR, `${Date.now()}_email.log`);
  const content = [
    '='.repeat(60),
    `[LomaX Email Logger] ${timestamp}`,
    `To:      ${to}`,
    `Subject: ${subject}`,
    '-'.repeat(60),
    text,
    '='.repeat(60),
    '',
  ].join('\n');

  fs.writeFileSync(logFile, content, 'utf-8');
  console.log(`[LomaX Email] No SMTP configured. Email logged to: ${logFile}`);
};

// ─── Public sendEmail function ─────────────────────────────────────────────
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  if (!transporter) {
    writeEmailLog(to, subject, text);
    return;
  }

  try {
    const fromName = process.env.SMTP_FROM_NAME || 'LomaX Banking';
    const fromEmail = process.env.SMTP_USER || 'noreply@lomax.bank';

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
      html: html || `<p>${text.replace(/\n/g, '<br>')}</p>`,
    });

    console.log(`[LomaX Email] ✓ Sent to ${to} — "${subject}"`);
  } catch (error: any) {
    console.error(`[LomaX Email] ✗ Failed to send to ${to}:`, error.message);
    // Always fall back to file log so nothing is lost
    writeEmailLog(to, subject, text);
  }
};

// ─── Utility: send a standard banking notification email ──────────────────
export const sendBankingAlert = async (
  to: string,
  customerName: string,
  eventTitle: string,
  eventBody: string
): Promise<void> => {
  const subject = `LomaX Banking — ${eventTitle}`;
  const text = `Dear ${customerName},\n\n${eventBody}\n\nThis is an automated message. Do not reply.\n\nRegards,\nLomaX Core Banking Team`;
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background:#020617; padding:32px; color:#e2e8f0; max-width:580px; margin:auto; border-radius:12px;">
      <div style="border-bottom:1px solid #1e293b; padding-bottom:16px; margin-bottom:20px;">
        <h1 style="color:#22d3ee; font-size:22px; font-weight:900; margin:0;">LomaX Digital Bank</h1>
        <p style="color:#64748b; font-size:12px; margin:4px 0 0;">Core Banking Notification System</p>
      </div>
      <h2 style="color:#f1f5f9; font-size:18px; font-weight:700;">${eventTitle}</h2>
      <p style="color:#94a3b8; line-height:1.7;">Dear <strong style="color:#e2e8f0;">${customerName}</strong>,</p>
      <div style="background:#0f172a; border:1px solid #1e293b; border-left:4px solid #22d3ee; border-radius:8px; padding:16px 20px; margin:20px 0;">
        <p style="margin:0; color:#cbd5e1; line-height:1.7;">${eventBody.replace(/\n/g, '<br>')}</p>
      </div>
      <p style="color:#475569; font-size:12px; margin-top:24px;">This is an automated security message from LomaX Core Banking. Please do not reply to this email.</p>
      <hr style="border:none; border-top:1px solid #1e293b; margin:20px 0;" />
      <p style="color:#334155; font-size:11px; text-align:center;">© ${new Date().getFullYear()} LomaX Digital Bank. All rights reserved.</p>
    </div>
  `;

  await sendEmail(to, subject, text, html);
};
