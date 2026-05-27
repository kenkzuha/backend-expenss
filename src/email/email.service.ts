import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    connectionTimeout: 10000, // 10s timeout
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendVerificationEmail(email: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'Verify your Expenss account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px;">
          <h2 style="color: #6366f1;">Welcome to Expenss!</h2>
          <p>Thanks for signing up. Click the button below to verify your email address.</p>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <a href="${link}"
             style="display:inline-block; background:#6366f1; color:white; padding:12px 28px;
                    border-radius:6px; text-decoration:none; font-weight:bold; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color:#999; font-size:12px; margin-top:24px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  }
}
