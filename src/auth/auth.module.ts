import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule,ConfigModule,PrismaModule,MailerModule,
    HttpModule.register({
      baseURL: 'https://notify.eskiz.uz/api',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDExNTMzMjAsImlhdCI6MTczODU2MTMyMCwicm9sZSI6InRlc3QiLCJzaWduIjoiYjZiNmZjZjdmNGRmMmJhNzU5ZTJlNGNhMThjYWI2MjkwOGRiODBlNjQ3OWQ5NzM2NTY2YTUwNWQ3MmVlNTM2NCIsInN1YiI6Ijk3MzEifQ.KC9HsMOxmJJEF_-bdvJ3qijJeSHTblI7PjGBc4FN-EY',
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
