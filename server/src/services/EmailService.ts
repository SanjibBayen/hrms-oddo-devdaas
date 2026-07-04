import { Resend } from 'resend';
import { logger } from '../config/logger';

class EmailService {
    private static instance: EmailService;
    private resend: Resend | null = null;

    private constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey && apiKey !== 're_xxxxxxxx') {
            this.resend = new Resend(apiKey);
            logger.info('Email service configured with Resend');
        } else {
            logger.warn('Email service not configured - emails will be logged only');
        }
    }

    static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    async send(to: string, subject: string, html: string): Promise<boolean> {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@hrms.com';
        const fromName = process.env.RESEND_FROM_NAME || 'HRMS Enterprise';

        if (!this.resend) {
            logger.info(`[EMAIL] To: ${to} | Subject: ${subject}`);
            logger.info(`[EMAIL] Body: ${html.substring(0, 100)}...`);
            return true;
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: `${fromName} <${fromEmail}>`,
                to: [to],
                subject,
                html,
            });

            if (error) {
                logger.error('Email send failed:', error.message);
                return false;
            }

            logger.info(`Email sent to ${to} - ID: ${data?.id}`);
            return true;
        } catch (error: any) {
            logger.error('Email send error:', error.message);
            return false;
        }
    }

    async sendVerificationEmail(email: string, token: string): Promise<boolean> {
        const url = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/verify-email?token=${token}`;

        return this.send(
            email,
            'Verify Your Email - HRMS Enterprise',
            `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to HRMS Enterprise</h1>
        <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
        <a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
        <p>Or copy this link: <a href="${url}">${url}</a></p>
        <p>This link expires in 24 hours.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">If you did not create this account, please ignore this email.</p>
      </div>
      `
        );
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
        const url = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${token}`;

        return this.send(
            email,
            'Reset Your Password - HRMS Enterprise',
            `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p>Or copy this link: <a href="${url}">${url}</a></p>
        <p>This link expires in 1 hour.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
      `
        );
    }

    async sendLeaveStatusEmail(
        email: string,
        status: 'approved' | 'rejected',
        startDate: string,
        endDate: string,
        comments?: string
    ): Promise<boolean> {
        const subject = status === 'approved' ? 'Leave Approved' : 'Leave Rejected';
        const color = status === 'approved' ? '#22c55e' : '#ef4444';

        return this.send(
            email,
            `${subject} - HRMS Enterprise`,
            `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${color};">Leave ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
        <p>Your leave request for <strong>${startDate}</strong> to <strong>${endDate}</strong> has been <strong>${status}</strong>.</p>
        ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
        <hr />
        <p style="color: #666; font-size: 12px;">This is an automated message from HRMS Enterprise.</p>
      </div>
      `
        );
    }

    async sendWelcomeEmail(email: string, fullName: string): Promise<boolean> {
        return this.send(
            email,
            'Welcome to HRMS Enterprise',
            `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome, ${fullName}!</h1>
        <p>Your account has been created successfully. You can now log in and access the HRMS portal.</p>
        <p>If you have any questions, please contact your HR department.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">This is an automated message from HRMS Enterprise.</p>
      </div>
      `
        );
    }
}

export const emailService = EmailService.getInstance();
export default emailService;