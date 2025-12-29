import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, SignInDto, VerifyOtpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from "bcrypt"
import { totp } from 'otplib';
import * as jwt from 'jsonwebtoken';

import { stringToHash } from 'src/common/hash';
import * as  DeviceDetector from 'device-detector-js';
import { MailerService } from 'src/mailer/mailer.service';
import { Request, Response } from 'express';
import { log } from 'console';
import { Status } from '@prisma/client';
@Injectable()
export class AuthService {
  private readonly deviceDetector: DeviceDetector;
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private mailer: MailerService,
  ) {
    this.deviceDetector = new DeviceDetector();
  }
  async signup(dto: CreateAuthDto) {
    const { name, email, phoneNumber, password } = dto;

    try {
      // Проверка существующих email и phone
      let existingEmail, existingPhone;
      try {
        existingEmail = email ? await this.prisma.users.findUnique({ where: { email } }) : null;
      } catch (err) {
        return { error: 'Ошибка при проверке email', details: err instanceof Error ? err.message : err };
      }

      try {
        existingPhone = phoneNumber ? await this.prisma.users.findUnique({ where: { phoneNumber } }) : null;
      } catch (err) {
        return { error: 'Ошибка при проверке phone', details: err instanceof Error ? err.message : err };
      }

      if (existingEmail) throw new ConflictException('Email уже используется');
      if (existingPhone) throw new ConflictException('Телефон уже используется');

      // Хеширование пароля
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (err) {
        return { error: 'Ошибка при хешировании пароля', details: err instanceof Error ? err.message : err };
      }

      // Создание пользователя со статусом PENDING
      let user;
      try {
        user = await this.prisma.users.create({
          data: {
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            status: 'PENDING',
          },
        });
      } catch (err) {
        return { error: 'Ошибка при создании пользователя', details: err instanceof Error ? err.message : err };
      }

      // Отправка OTP
      const contact = email || phoneNumber;
      if (contact) {
        try {
          await this.sendOtp(contact, 'Подтверждение регистрации');
        } catch (err) {
          return { error: 'Ошибка при отправке OTP', details: err instanceof Error ? err.message : err };
        }
      }

      return {
        message: 'User создан успешно. OTP отправлен.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          status: user.status,
        },
      };
    } catch (error) {
      return { error: 'Ошибка регистрации', details: error instanceof Error ? error.message : error };
    }
  }


  async sendOtp(to: string, subject: string) {
    if (!to) throw new BadRequestException('Email или телефон обязателен');

    const isEmail = to.includes('@');

    let user;
    try {
      user = await this.prisma.users.findFirst({
        where: isEmail ? { email: to } : { phoneNumber: to },
      });
      if (!user) throw new NotFoundException('Пользователь не найден');
    } catch (err) {
      return { error: 'Ошибка поиска пользователя', details: err instanceof Error ? err.message : err };
    }

    try {
      const existingOtp = await this.prisma.email_verification.findFirst({
        where: isEmail ? { email: to } : { phoneNumber: to },
        orderBy: { createdAt: 'desc' },
      });

      if (existingOtp && existingOtp.expiresAt > new Date()) {
        throw new ConflictException('OTP уже был отправлен, подожди немного');
      }

      await this.prisma.email_verification.deleteMany({
        where: isEmail ? { email: to } : { phoneNumber: to },
      });
    } catch (err) {
      return { error: 'Ошибка обработки старого OTP', details: err instanceof Error ? err.message : err };
    }

    // Генерация OTP
    let otpCode, secret, expiresAt;
    try {
      totp.options = { step: 180, digits: 6 };
      secret = stringToHash(`${to}-${Date.now()}`);
      otpCode = totp.generate(secret);
      expiresAt = new Date(Date.now() + 180 * 1000);

      await this.prisma.email_verification.create({
        data: {
          userId: user.id,
          email: isEmail ? to : null,
          phoneNumber: isEmail ? null : to,
          secret,
          expiresAt,
        },
      });

    } catch (err) {
      return { error: 'Ошибка генерации OTP', details: err instanceof Error ? err.message : err };
    }

    // Отправка
    try {
      if (isEmail) {
        const result = await this.mailer.sendOtpMail(to, subject, otpCode);
        if (!result.success) throw new Error('Почта не отправлена');
        return { message: 'OTP отправлен на почту', expiresAt };
      } else {
        const smsPayload = {
          mobile_phone: to.replace(/\D/g, ''),
          message: `Ваш OTP код: ${otpCode}. Действителен 3 минуты.`,
          from: '4546',
        };
        await this.http.post('/message/sms/send', smsPayload).toPromise();
        return { message: 'OTP отправлен по SMS', expiresAt };
      }
    } catch (err) {
      return { error: 'Ошибка отправки OTP', details: err instanceof Error ? err.message : err };
    }
  }




  async verifyOtp(dto: VerifyOtpDto) {
    const { otpCode, contact, type } = dto;

    if (!otpCode || !contact) {
      return { error: 'OTP code и контакт обязателен' };
    }

    let user;
    try {
      if (type === 'email') {
        user = await this.prisma.users.findUnique({ where: { email: contact } });
      } else if (type === 'sms') {
        user = await this.prisma.users.findUnique({ where: { phoneNumber: contact } });
      }

      if (!user) return { error: `Пользователь с таким ${type} не найден` };
    } catch (err) {
      return { error: 'Ошибка поиска пользователя', details: err instanceof Error ? err.message : err };
    }

    let otpRequest;
    try {
      otpRequest = await this.prisma.email_verification.findFirst({
        where: type === 'email'
          ? { email: contact, expiresAt: { gt: new Date() } }
          : { phoneNumber: contact, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRequest) return { error: 'Нет активного OTP или OTP истек' };
    } catch (err) {
      return { error: 'Ошибка поиска OTP', details: err instanceof Error ? err.message : err };
    }

    let isValid;
    try {
      isValid = totp.check(otpCode, otpRequest.secret);
    } catch (err) {
      return { error: 'Ошибка проверки OTP', details: err instanceof Error ? err.message : err };
    }

    if (!isValid) return { error: 'Неверный OTP код' };

    try {
      await this.prisma.users.update({
        where: { id: user.id },
        data: { status: Status.ACTIVE },
      });
    } catch (err) {
      return { error: 'Ошибка активации пользователя', details: err instanceof Error ? err.message : err };
    }

    try {
      await this.prisma.email_verification.delete({
        where: { id: otpRequest.id },
      });
    } catch (err) {
      return { error: 'Ошибка удаления OTP', details: err instanceof Error ? err.message : err };
    }

    return { message: 'Аккаунт успешно активирован' };
  }

  async signin(dto: SignInDto, ip: string, userAgent: string) {
    const { email, password } = dto;

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new NotFoundException('User with this email not found or not active');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const device = this.deviceDetector.parse(userAgent);
    const deviceType = device.device?.type || 'Unknown device';
    const deviceShort = `${device.device?.type || 'Unknown device'}, ${device.device?.brand || 'Unknown brand'}, ${device.os?.name || 'Unknown OS'}, ${device.client?.name || 'Unknown browser'}`;
    const deviceDescription = `${deviceShort}, logged: ${new Date().toLocaleString()}`;
    const deviceGroup = ""

    let session = await this.prisma.sessions.findFirst({
      where: { userId: user.id, ip },
    });

    if (!session || !session.info.startsWith(deviceShort)) {
      session = await this.prisma.sessions.create({
        data: {
          ip,
          userId: user.id,
          location: null,
          info: deviceDescription,
          deviceType: device.device?.type || 'Unknown device',
          deviceGroup,
          browser: device.client?.name || 'Unknown browser',
        },
      });
    }

    const payload = {
      id: user.id,
      status: user.status,
      role: user.role,
      sessionId: session.id,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      message: 'Successfully login!',
      accessToken,
      refreshToken,
    };
  }

  async logout(req: Request, res: Response) {
    try {
      const sessionId = req['sessionId']; // если ты где-то ставишь его в middleware

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      await this.prisma.sessions
        .delete({
          where: { id: sessionId },
        })
        .catch((err) => {
          if (err.code !== 'P2025') throw err;
        });

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      throw new InternalServerErrorException('Logout failed. Try again later.');
    }
  }



  async uploadFile(req: Request, res: Response, file: Express.Multer.File) {
    console.log(req['user']);

    try {
      const userId = req['user']?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const filename = file.filename;

      await this.prisma.users.update({
        where: { id: userId },
        data: { img: `http://localhost:3000/uploads/users/${filename}` },
      });

      return res.status(201).json({
        data: `http://localhost:3000/uploads/users/${filename}`,
      });
    } catch (error) {
      console.error('Error Upload File:', error);
      throw new InternalServerErrorException(
        'Unexpected error. Please try again later.',
      );
    }
  }


  private generateAccessToken(payload: any): string {
    return jwt.sign(
      {
        id: payload.id,
        role: payload.role,
        status: payload.status,
        sessionId: payload.sessionId,
      },
      process.env.ACCESSTOKEN || 'secret_access',
      { expiresIn: '15m' },
    );
  }

  private generateRefreshToken(payload: any): string {
    return jwt.sign(
      {
        id: payload.id,
        role: payload.role,
        sessionId: payload.sessionId,
      },
      process.env.REFRESHTOKEN || 'secret_refresh',
      { expiresIn: '7d' },
    );
  }


  async getMyData(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId, status: 'ACTIVE' },
      include: {
        Sessions: true,
        Email_verification: true,
      },
    });

    if (!user) throw new ForbiddenException('Not authorized');

    return user;
  }


  async sendOtpReset(dto: { to: string, subject: string }) {
    const { to, subject } = dto;
    if (!to) throw new BadRequestException('Email или телефон обязателен');

    const isEmail = to.includes('@');

    // Находим пользователя
    const user = await this.prisma.users.findFirst({
      where: isEmail ? { email: to } : { phoneNumber: to },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    // Проверяем предыдущие OTP
    const existingOtp = await this.prisma.reset_Password.findFirst({
      where: isEmail ? { email: to } : { phone: to },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    if (existingOtp && existingOtp.expiresAt > now) {
      throw new BadRequestException('OTP уже отправлен. Подождите до истечения.');
    }

    // Удаляем старые OTP
    await this.prisma.reset_Password.deleteMany({
      where: isEmail ? { email: to } : { phone: to },
    });

    // Генерация OTP
    totp.options = { step: 300, window: [1, 0], digits: 6 };
    const normalized = to.trim().toLowerCase();
    const secret = stringToHash(normalized + Date.now());
    const otpCode = totp.generate(secret);
    const expiresAt = new Date(Date.now() + 300 * 1000);

    // Сохраняем в БД
    await this.prisma.reset_Password.create({
      data: {
        userId: user.id,
        email: isEmail ? normalized : '',
        phone: isEmail ? '' : normalized,
        secret,
        expiresAt,
        otpVerified: false,
      },
    });

    if (isEmail) {
      const result = await this.mailer.sendOtpMail(normalized, subject, otpCode);
      if (!result.success) throw new InternalServerErrorException('Ошибка при отправке OTP на почту');

      return { message: 'OTP отправлен на почту', expiresAt };
    }

    // SMS
    const smsPayload = {
      mobile_phone: normalized.replace(/\D/g, ''),
      message: `Ваш OTP код: ${otpCode}. Действителен 5 минут.`,
      from: '4546',
    };
    try {
      await this.http.post('/message/sms/send', smsPayload).toPromise();
      return { message: 'OTP отправлен по SMS', expiresAt };
    } catch (error) {
      console.error('Eskiz error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Не удалось отправить SMS через Eskiz');
    }
  }


  async verifyOtpReset(dto: { contact: string, otpCode: string }) {

    const { contact, otpCode } = dto;
    console.log(dto);

    const normalized = contact.trim().toLowerCase();
    console.log(normalized);

    // Находим пользователя
    const user = await this.prisma.users.findFirst({
      where: { email: normalized, status: 'ACTIVE' },
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    // Находим OTP
    const request = await this.prisma.reset_Password.findFirst({
      where: { email: normalized },
      orderBy: { createdAt: 'desc' },
    });

    if (!request || new Date() > request.expiresAt)
      throw new BadRequestException('OTP истёк, запросите новый');

    if (request.otpVerified)
      throw new BadRequestException('OTP уже подтверждён');

    // Настройки totp должны совпадать с генерацией
    totp.options = { step: 300, window: [1, 0], digits: 6 };
    const isValid = totp.check(otpCode, request.secret);
    console.log(otpCode)
    if (!isValid) throw new BadRequestException('Неправильный OTP код');

    // Подтверждаем OTP
    await this.prisma.reset_Password.update({
      where: { email: normalized },
      data: { otpVerified: true },
    });

    return { message: 'OTP подтверждён. Можете сбросить пароль.' };
  }




  async resetPassword(dto: any) {
    const { email, newPassword } = dto;

    const user = await this.prisma.users.findUnique({ where: { email, status: 'ACTIVE' } });
    if (!user) throw new NotFoundException('User not found');

    const req = await this.prisma.reset_Password.findUnique({ where: { email } });
    console.log(req);

    if (!req || !req.otpVerified || new Date() > req.expiresAt)
      throw new ForbiddenException('OTP not verified or expired');

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { email },
      data: { password: hashed },
    });

    await this.prisma.reset_Password.delete({ where: { email } });

    return { message: 'Password successfully reset' };
  }

}