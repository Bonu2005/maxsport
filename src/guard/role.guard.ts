import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class GuardGuard implements CanActivate {
  constructor(private jwt: JwtService, private configService: ConfigService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let request: Request = context.switchToHttp().getRequest()  
    let token = request.headers.authorization?.split(" ")[1]
    console.log(token);
    
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      let user = this.jwt.verify(token, { secret: "secret_access" })
      request["user"] = user
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true;
  }
}