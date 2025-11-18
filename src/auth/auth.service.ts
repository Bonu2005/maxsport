import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, SignInDto, VerifyOtpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from "bcrypt"
import { totp } from 'otplib';
import * as jwt from 'jsonwebtoken';
import { Status } from '@prisma/client';
import { stringToHash } from 'src/common/hash';
import * as  DeviceDetector from 'device-detector-js';
import { MailerService } from 'src/mailer/mailer.service';
import { Request, Response } from 'express';
import { log } from 'console';
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
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone number already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        status: Status.PENDING,
      },
    });

    return {
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        status: user.status,
      },
    };
  }


  async sendOtp(to: string, subject: string) {
    if (!to) throw new BadRequestException('Email или телефон обязателен');

    const isEmail = to.includes('@');

    const user = await this.prisma.users.findFirst({
      where: isEmail ? { email: to } : { phoneNumber: to },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

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


    totp.options = { step: 60, digits: 6 };
    const secret = stringToHash(`${to}-${Date.now()}`);
    const otpCode = totp.generate(secret);
    const expiresAt = new Date(Date.now() + 180 * 1000);


    await this.prisma.email_verification.create({
      data: {
        userId: user.id,
        email: isEmail ? to : "",
        phoneNumber: isEmail ? "" : to,
        secret,
        expiresAt,
      },
    });

    if (isEmail) {
      const parameters = {
        digit: otpCode,
        expires_at: 180,
      };

      const result = await this.mailer.sendOtpMail(to, subject, otpCode);

      if (!result.success) {
        throw new InternalServerErrorException('Ошибка при отправке OTP на почту');
      }

      return {
        message: 'OTP отправлен на почту',
        expiresAt,
      };
    } else {

      const smsPayload = {
        mobile_phone: to.replace(/\D/g, ''),
        message: `Ваш OTP код: ${otpCode}. Действителен 3 минуты.`,
        from: '4546',
      };

      try {
        await this.http.post('/message/sms/send', smsPayload).toPromise();

        return {
          message: 'OTP отправлен по SMS',
          expiresAt,
        };
      } catch (error) {
        console.error('Eskiz error:', error.response?.data || error.message);
        throw new InternalServerErrorException('Не удалось отправить SMS через Eskiz');
      }
    }
  }
  async verifyOtp(dto: VerifyOtpDto) {
    const { otpCode, contact, type } = dto;

    if (!otpCode || !contact) {
      throw new BadRequestException('OTP code and contact are required');
    }

    let user;
    if (type === 'email') {
      user = await this.prisma.users.findUnique({ where: { email: contact } });
    } else if (type === 'sms') {
      user = await this.prisma.users.findUnique({ where: { phoneNumber: contact } });
    }

    if (!user) {
      throw new NotFoundException(`User with this ${type} not found`);
    }

    const otpRequest = await this.prisma.email_verification.findFirst({
      where: type === 'email'
        ? { email: contact, expiresAt: { gt: new Date() } }
        : { phoneNumber: contact, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });


    if (!otpRequest) {
      throw new BadRequestException('No active OTP found or OTP expired');
    }

    const isValid = totp.check(otpCode, otpRequest.secret);
    console.log(otpCode, otpRequest.secret);


    if (!isValid) {
      throw new BadRequestException('Invalid OTP code');
    }

    await this.prisma.users.update({
      where: { id: user.id },
      data: { status: Status.ACTIVE },
    });

    await this.prisma.email_verification.delete({
      where: { id: otpRequest.id },
    });

    return { message: 'Account successfully activated' };
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
    try {
      const userId = req['user']?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const filename = file.filename;

      await this.prisma.users.update({
        where: { id: userId },
        data: { img: filename },
      });

      return res.status(201).json({
        data: `http://localhost:3300/users/image/${filename}`,
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