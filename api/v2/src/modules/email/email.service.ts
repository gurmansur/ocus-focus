import { Injectable, Logger } from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(options: EmailOptions) {
    this.logger.log(`Sending email to: ${options.to}`);
    this.logger.log(`Subject: ${options.subject}`);
    this.logger.log(`Template: ${options.template}`);
    this.logger.log(`Context: ${JSON.stringify(options.context)}`);

    // In a real implementation, you would send the email here
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.logger.log(`Email sent to: ${options.to}`);

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Sends a welcome email to a new user
   * @param to Email recipient
   * @param name User's name
   */
  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail({
      to,
      subject: 'Bem-vindo ao Ocus Focus',
      template: 'welcome',
      context: {
        name,
        appUrl: process.env.APP_URL || 'http://localhost:4200',
      },
    });
  }

  /**
   * Sends a password reset email
   * @param to Email recipient
   * @param name User's name
   * @param token Reset token
   */
  async sendPasswordResetEmail(to: string, name: string, token: string) {
    return this.sendEmail({
      to,
      subject: 'Redefinição de Senha - Ocus Focus',
      template: 'password-reset',
      context: {
        name,
        token,
        resetUrl: `${process.env.APP_URL || 'http://localhost:4200'}/reset-password?token=${token}`,
        expiresIn: '1 hora',
      },
    });
  }

  /**
   * Sends a notification email
   * @param to Email recipient
   * @param subject Email subject
   * @param message Email message
   */
  async sendNotification(to: string, subject: string, message: string) {
    return this.sendEmail({
      to,
      subject,
      template: 'notification',
      context: {
        message,
        appUrl: process.env.APP_URL || 'http://localhost:4200',
      },
    });
  }
}
