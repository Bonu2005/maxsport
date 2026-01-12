import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // 1️⃣ Берём refresh_token из cookies
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      // 2️⃣ Проверяем refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('refreshtoken'),
      });

      // 3️⃣ Кладём пользователя в request
      request['user'] = decoded;

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh token expired, please sign in again.',
        );
      }

      throw new UnauthorizedException('Refresh token invalid');
    }
  }
}
