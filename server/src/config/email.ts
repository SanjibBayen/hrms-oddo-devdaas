import { Resend } from 'resend';
import { logger } from './logger';

class EmailService {
  private static instance: EmailService;
  private resend: Resend | null = null;

  private constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
      logger.info('Resend email service configured');
    } else {
      logger.warn('RESEND_API_KEY not set - emails will be logged only');
    }
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourcompany.com';
    const fromName = process.env.RESEND_FROM_NAME || 'HRMS';

    if (!this.resend) {
      logger.info(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
      return false;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
      });

      if (error) {
        logger.error('Resend error:', error);
        return false;
      }

      logger.info(`Email sent to ${to} - ID: ${data?.id}`);
      return true;
    } catch (error) {
      logger.error('Email send failed:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = `${process.env.CORS_ORIGIN}/verify-email?token=${token}`;
    await this.send(
      email,
      'Verify your email - HRMS',
      `<h1>Welcome!</h1><p>Click <a href="${url}">here</a> to verify your email.</p>`
    );
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const url = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;
    await this.send(
      email,
      'Reset your password - HRMS',
      `<h1>Password Reset</h1><p>Click <a href="${url}">here</a> to reset your password.</p>`
    );
  }

  async sendLeaveStatusEmail(
    email: string,
    status: 'approved' | 'rejected',
    startDate: string,
    endDate: string
  ): Promise<void> {
    const subject =
      status === 'approved'
        ? 'Leave Approved - HRMS'
        : 'Leave Rejected - HRMS';

    await this.send(
      email,
      subject,
      `<h1>Leave ${status}</h1><p>Your leave from ${startDate} to ${endDate} has been ${status}.</p>`
    );
  }
}

export const emailService = EmailService.getInstance();
export default emailService;