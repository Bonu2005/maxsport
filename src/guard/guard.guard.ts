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

        const request:Request= context.switchToHttp().getRequest<Request>();
        console.log(request.headers);

        const authHeader = request.headers['authorization'] || request.headers['Authorization'];
        console.log(authHeader);
        console.log('SECRET:', this.configService.get<string>('accessSecret'));


        if (!authHeader) {
            console.log('Authorization header missing');
            throw new UnauthorizedException('Token missing');
        }
        let token = request.headers.authorization?.split(" ")[1]
        console.log(token, "1");

        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            let user = this.jwt.verify(token, { secret: "secret_access" })
            request["user"] = user
            console.log(user);

        } catch (error) {
            throw new UnauthorizedException()
        }
        return true;
    }
}