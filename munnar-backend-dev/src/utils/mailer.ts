import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Reusable transporter (created once)
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
} as SMTPTransport.Options);

/**
 * EMAIL VERIFICATION OTP
 */
export const sendVerificationEmail = async (to: string, otp: string) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
        }
        .container {
          max-width: 520px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .header {
          background: linear-gradient(135deg, #0f766e, #14b8a6);
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .otp-box {
          margin: 30px 0;
          text-align: center;
        }
        .otp {
          display: inline-block;
          font-size: 32px;
          letter-spacing: 8px;
          font-weight: bold;
          color: #0f766e;
          background: #ecfeff;
          padding: 14px 24px;
          border-radius: 8px;
        }
        .note {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        .footer {
          background: #f9fafb;
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Exploring Munnar</h1>
        </div>
        <div class="content">
          <h2>Verify your email address</h2>
          <p>
            Thanks for signing up with <strong>Exploring Munnar</strong>.
            Please use the OTP below to verify your email address.
          </p>

          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>

          <p class="note">
            ⏰ This OTP is valid for <strong>10 minutes</strong>.<br />
            🔒 Do not share this code with anyone.
          </p>

          <p class="note">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Exploring Munnar. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Exploring Munnar" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Verify your email | Exploring Munnar",
    html,
  });
};

/**
 * PASSWORD RESET EMAIL
 */
export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
        }
        .container {
          max-width: 520px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .header {
          background: linear-gradient(135deg, #0f766e, #14b8a6);
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #333333;
          text-align: center;
        }
        .btn {
          display: inline-block;
          margin: 30px 0;
          padding: 14px 26px;
          background: #0f766e;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
        }
        .note {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        .footer {
          background: #f9fafb;
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Exploring Munnar</h1>
        </div>

        <div class="content">
          <h2>Reset your password</h2>
          <p>
            We received a request to reset your password for
            <strong>Exploring Munnar</strong>.
          </p>

          <a href="${resetLink}" class="btn">
            Reset Password
          </a>

          <p class="note">
            ⏰ This link is valid for <strong>15 minutes</strong>.<br />
            🔒 If you didn’t request this, please ignore this email.
          </p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Exploring Munnar. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Exploring Munnar" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔑 Reset your password | Exploring Munnar",
    html,
  });
};
