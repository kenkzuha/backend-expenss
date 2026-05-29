import { Injectable } from '@nestjs/common';
import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class EmailService {
  private proxyAgent = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
    ? new HttpsProxyAgent((process.env.HTTPS_PROXY || process.env.HTTP_PROXY)!)
    : undefined;

  private readonly LOGO = `
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle; padding-right:10px;">
          <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="18" fill="#2563eb"/>
            <rect x="22" y="22" width="36" height="5" rx="2" fill="white"/>
            <rect x="22" y="37.5" width="26" height="5" rx="2" fill="white"/>
            <rect x="22" y="53" width="36" height="5" rx="2" fill="white"/>
          </svg>
        </td>
        <td style="vertical-align:middle;">
          <span style="font-family: Arial, sans-serif; font-size: 20px; font-weight: 700; color: #0d0d0d; letter-spacing: -0.5px;">
            Expen<em style="color:#2563eb;">ss</em>
          </span>
        </td>
      </tr>
    </table>
  `;

  private getVerificationTemplate(link: string, lang: string): { subject: string; html: string } {
    const templates: Record<string, { subject: string; heading: string; desc: string; expiry: string; button: string; ignore: string }> = {
      en: {
        subject: 'Verify your Expenss account',
        heading: 'Verify your email address',
        desc: 'Thanks for signing up. Click the button below to verify your email address and activate your account.',
        expiry: 'This link expires in <strong>15 minutes</strong>.',
        button: 'Verify Email',
        ignore: "If you didn't create an Expenss account, you can safely ignore this email.",
      },
      ja: {
        subject: 'Expenssアカウントのメールアドレスを確認してください',
        heading: 'メールアドレスを確認してください',
        desc: 'ご登録ありがとうございます。下のボタンをクリックしてメールアドレスを確認し、アカウントを有効化してください。',
        expiry: 'このリンクの有効期限は<strong>15分</strong>です。',
        button: 'メールアドレスを確認',
        ignore: 'Expenssのアカウントを作成していない場合は、このメールを無視してください。',
      },
      id: {
        subject: 'Verifikasi akun Expenss Anda',
        heading: 'Verifikasi alamat email Anda',
        desc: 'Terima kasih telah mendaftar. Klik tombol di bawah untuk memverifikasi alamat email dan mengaktifkan akun Anda.',
        expiry: 'Tautan ini kedaluwarsa dalam <strong>15 menit</strong>.',
        button: 'Verifikasi Email',
        ignore: 'Jika Anda tidak membuat akun Expenss, Anda dapat mengabaikan email ini.',
      },
    };

    const t = templates[lang] ?? templates['en'];

    return {
      subject: t.subject,
      html: `
<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f0f0f2; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f0f2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px; width:100%;">

          <!-- Logo header -->
          <tr>
            <td style="padding-bottom: 24px;">
              ${this.LOGO}
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#ffffff; border-radius:14px; border: 1px solid rgba(0,0,0,0.10); overflow:hidden;">

              <!-- Blue top bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#2563eb; height:4px; font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 40px 40px 32px;">

                    <!-- Heading -->
                    <h1 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#0d0d0d; letter-spacing:-0.5px;">
                      ${t.heading}
                    </h1>

                    <!-- Description -->
                    <p style="margin:0 0 12px; font-size:15px; color:#5a5a6a; line-height:1.6;">
                      ${t.desc}
                    </p>

                    <!-- Expiry notice -->
                    <p style="margin:0 0 28px; font-size:14px; color:#9898a8; line-height:1.6;">
                      ${t.expiry}
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#2563eb; border-radius:10px;">
                          <a href="${link}"
                             style="display:inline-block; padding:13px 32px; font-size:15px;
                                    font-weight:600; color:#ffffff; text-decoration:none;
                                    letter-spacing:-0.2px;">
                            ${t.button}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0;">
                      <tr>
                        <td style="border-top: 1px solid rgba(0,0,0,0.08); font-size:0;">&nbsp;</td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Footer inside card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#f7f7f8; padding: 20px 40px; border-top: 1px solid rgba(0,0,0,0.08);">
                    <p style="margin:0; font-size:12px; color:#9898a8; line-height:1.6;">
                      ${t.ignore}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Bottom caption -->
          <tr>
            <td style="padding-top: 20px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9898a8;">
                © ${new Date().getFullYear()} Expenss. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
      `,
    };
  }

  private getForgotPassTemplate(link: string, lang: string): { subject: string; html: string }{
    const templates: Record<string, { subject: string; heading: string; desc: string; expiry: string; button: string; ignore: string }> = {
      en: {
        subject: 'Expenss Account Password Reset',
        heading: 'Reset your password',
        desc: 'Click the button below to reset your password',
        expiry: 'This link expires in <strong>15 minutes</strong>.',
        button: 'Reset Password',
        ignore: "If you didn't request this, you can safely ignore this email.",
      },
      ja: {
        subject: 'Expenssアカウントのパスワード変更',
        heading: 'パスワードの変更',
        desc: '下のボタンをクリックしてアカウントのパスワードを変更してください',
        expiry: 'このリンクの有効期限は<strong>15分</strong>です。',
        button: '変更',
        ignore: 'Expenssのアカウントのパスワード変更をリクエストしない場合は、このメールを無視してください。',
      },
      id: {
        subject: 'Reset Password akun Expenss Anda',
        heading: 'Reset password akun anda',
        desc: 'Klik link dibawah ini untuk mengubah password akun anda',
        expiry: 'Tautan ini kedaluwarsa dalam <strong>15 menit</strong>.',
        button: 'Ubah password',
        ignore: 'Jika Anda tidak mengajukan permintaan ini, Anda dapat mengabaikan email ini.',
      },
    };

    const t = templates[lang] ?? templates['en'];

    return {
      subject: t.subject,
      html: `
      <!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f0f0f2; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f0f2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px; width:100%;">

          <!-- Logo header -->
          <tr>
            <td style="padding-bottom: 24px;">
              ${this.LOGO}
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#ffffff; border-radius:14px; border: 1px solid rgba(0,0,0,0.10); overflow:hidden;">

              <!-- Blue top bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#2563eb; height:4px; font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 40px 40px 32px;">

                    <!-- Heading -->
                    <h1 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#0d0d0d; letter-spacing:-0.5px;">
                      ${t.heading}
                    </h1>

                    <!-- Description -->
                    <p style="margin:0 0 12px; font-size:15px; color:#5a5a6a; line-height:1.6;">
                      ${t.desc}
                    </p>

                    <!-- Expiry notice -->
                    <p style="margin:0 0 28px; font-size:14px; color:#9898a8; line-height:1.6;">
                      ${t.expiry}
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#2563eb; border-radius:10px;">
                          <a href="${link}"
                             style="display:inline-block; padding:13px 32px; font-size:15px;
                                    font-weight:600; color:#ffffff; text-decoration:none;
                                    letter-spacing:-0.2px;">
                            ${t.button}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0;">
                      <tr>
                        <td style="border-top: 1px solid rgba(0,0,0,0.08); font-size:0;">&nbsp;</td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Footer inside card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#f7f7f8; padding: 20px 40px; border-top: 1px solid rgba(0,0,0,0.08);">
                    <p style="margin:0; font-size:12px; color:#9898a8; line-height:1.6;">
                      ${t.ignore}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Bottom caption -->
          <tr>
            <td style="padding-top: 20px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9898a8;">
                © ${new Date().getFullYear()} Expenss. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
      `,
    };
  }

  private sendResendRequest(payload: object): Promise<{ id: string }> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(payload);
      const options: https.RequestOptions = {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        ...(this.proxyAgent ? { agent: this.proxyAgent } : {}),
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const parsed = JSON.parse(data);
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Resend error ${res.statusCode}: ${parsed?.message ?? data}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.write(body);
      req.end();
    });
  }

  async sendVerificationEmail(email: string, link: string, lang: string = 'en') {
    const { subject, html } = this.getVerificationTemplate(link, lang);
    const result = await this.sendResendRequest({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject,
      html,
    });
    console.log('Email sent successfully, id:', result.id);
  }

  async sendForgotPass(email: string, link: string, lang: string = 'en'){
    const { subject, html } = this.getForgotPassTemplate(link, lang);
    const result = await this.sendResendRequest({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject,
      html,
    });
    console.log('Forgot pass Email sent, id: ', result.id);
  }
}
