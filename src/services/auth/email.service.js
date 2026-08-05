const nodemailer = require('nodemailer');
const config = require('../../config/environment');
const logger = require('../../logger/winston');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async getTransporter() {
    if (this.transporter) return this.transporter;

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: config.email.user && config.email.pass
        ? { user: config.email.user, pass: config.email.pass }
        : undefined,
      ignoreTLS: !config.email.user,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    return this.transporter;
  }

  async sendMail({ to, subject, html, text }) {
    if (!config.email.user) {
      logger.info('Email skipped (SMTP not configured)', { to, subject });
      return { messageId: 'skipped-no-smtp' };
    }

    try {
      const transporter = await this.getTransporter();
      const mailOptions = {
        from: `"${config.email.fromName}" <${config.email.from}>`,
        to,
        subject,
        ...(html && { html }),
        ...(text && { text }),
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', {
        to,
        subject,
        messageId: info.messageId,
      });
      return info;
    } catch (error) {
      logger.error('Failed to send email', {
        to,
        subject,
        error: error.message,
      });
    }
  }

  async sendVerificationOTP(email, otp) {
    const subject = 'Verify your Poshaarya email address';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 800;">P</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; text-align: center; color: #111827; margin-bottom: 8px;">Verify Your Email</h1>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 24px;">Enter this OTP to verify your email address and start your wellness journey.</p>
        <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; color: #22c55e; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This OTP expires in ${config.otp.expiryMinutes} minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return this.sendMail({ to: email, subject, html });
  }

  async sendPasswordResetOTP(email, otp) {
    const subject = 'Reset your Poshaarya password';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 800;">P</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; text-align: center; color: #111827; margin-bottom: 8px;">Reset Your Password</h1>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 24px;">Enter this OTP to reset your password. This code is valid for ${config.otp.expiryMinutes} minutes.</p>
        <div style="text-align: center; padding: 24px; background: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; color: #22c55e; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
      </div>
    `;

    return this.sendMail({ to: email, subject, html });
  }

  async sendWelcomeEmail(email, name) {
    const subject = 'Welcome to Poshaarya!';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 800;">P</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; text-align: center; color: #111827; margin-bottom: 8px;">Welcome to Poshaarya, ${name}!</h1>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 24px;">Your wellness journey starts now. Track meals, log workouts, and achieve your health goals.</p>
        <div style="text-align: center;">
          <a href="${config.app.url}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">Go to Dashboard</a>
        </div>
      </div>
    `;

    return this.sendMail({ to: email, subject, html });
  }
}

module.exports = new EmailService();
