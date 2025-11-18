import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter:any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'hamidovabonu32@gmail.com',
        pass: 'zxqq jyhn tfty qswk', // ⚠️ лучше вынеси это в .env
      },
    });
  }

  async sendOtpMail(to: string, subject: string, otpCode: string) {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px;">
              <h2 style="color: #333; text-align: center;">Ваш OTP код</h2>
              <p style="font-size: 18px; color: #555;">Для завершения процесса, используйте следующий одноразовый пароль:</p>
              <div style="text-align: center; font-size: 24px; font-weight: bold; padding: 15px; background-color: #007bff; color: white; border-radius: 5px; width: 100px; margin: 20px auto;">
                  ${otpCode}
              </div>
              <p style="color: #777; text-align: center;">Этот код действителен в течение 10 минут.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const result = await this.transporter.sendMail({
        from: '"MaxSport" <booonu@icloud.com>',
        to,
        subject,
        html,
      });

      return {
        success: result.rejected.length === 0,
        rejected: result.rejected,
      };
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      throw new InternalServerErrorException('Не удалось отправить письмо');
    }
  }
}
