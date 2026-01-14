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
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const refreshToken =
      req.cookies?.refresh_token ||
      req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const user = this.jwt.verify(refreshToken, {
        secret: this.config.get('REFRESH_SECRET'),
      });

      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
