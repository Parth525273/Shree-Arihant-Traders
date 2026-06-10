// ─────────────────────────────────────────────────────────
// utils/email.js — Nodemailer Email Sender
// Sends beautiful HTML emails via Gmail SMTP
// ─────────────────────────────────────────────────────────

const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars)
    },
  });
};

/**
 * Sends a password reset email with a beautiful HTML template
 * @param {string} toEmail - Recipient email
 * @param {string} toName  - Recipient name
 * @param {string} resetUrl - The full reset link URL
 */
const sendPasswordResetEmail = async (toEmail, toName, resetUrl) => {
  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f97316;border-radius:12px;padding:12px 16px;text-align:center;">
                    <span style="color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">
                      🛒 Shree Arihant Traders
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">

              <!-- Orange top bar -->
              <tr>
                <td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:4px 0;"></td>
              </tr>

              <!-- Card content -->
              <tr>
                <td style="padding:40px 40px 32px;">

                  <!-- Lock icon -->
                  <p style="text-align:center;margin:0 0 24px;font-size:48px;">🔐</p>

                  <h1 style="color:#f1f5f9;font-size:24px;font-weight:700;margin:0 0 12px;text-align:center;">
                    Reset Your Password
                  </h1>

                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 8px;text-align:center;">
                    Hello <strong style="color:#f1f5f9;">${toName}</strong>,
                  </p>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;text-align:center;">
                    We received a request to reset your password for your<br/>
                    <strong style="color:#f97316;">Shree Arihant Traders</strong> account.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom:32px;">
                        <a href="${resetUrl}"
                           style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:white;text-decoration:none;padding:16px 40px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(249,115,22,0.4);">
                          Reset My Password →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Warning box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="background:#1a2744;border:1px solid #334155;border-left:3px solid #f59e0b;border-radius:8px;padding:14px 16px;">
                        <p style="color:#fcd34d;font-size:13px;margin:0;font-weight:600;">
                          ⚠️ This link expires in <strong>1 hour</strong>
                        </p>
                        <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">
                          If you didn't request a password reset, you can safely ignore this email.
                          Your password will not change.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback link -->
                  <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;word-break:break-all;">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${resetUrl}" style="color:#f97316;text-decoration:none;">${resetUrl}</a>
                  </p>
                </td>
              </tr>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="color:#475569;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Shree Arihant Traders · B2B Wholesale Food Ordering
              </p>
              <p style="color:#334155;font-size:11px;margin:6px 0 0;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Shree Arihant Traders <tradersshreearihant@gmail.com>',
    to: toEmail,
    subject: '🔐 Reset Your Password — Shree Arihant Traders',
    html,
    // Plain text fallback for email clients that don't support HTML
    text: `
Password Reset — Shree Arihant Traders

Hello ${toName},

You requested a password reset. Click the link below to set a new password:

${resetUrl}

This link expires in 1 hour.

If you didn't request this, ignore this email.

— Shree Arihant Traders
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
