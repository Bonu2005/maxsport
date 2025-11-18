import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { PaymentModule } from './payment/payment.module';
import { CertificateModule } from './certificate/certificate.module';
import { TrainerModule } from './trainer/trainer.module';
import { CourseEnrollmentModule } from './course-enrollment/course-enrollment.module';
import { ApplicationModule } from './application/application.module';
import { MailerService } from './mailer/mailer.service';



@Module({
  imports: [PrismaModule, AuthModule, BotModule, PaymentModule, CertificateModule, TrainerModule, CourseEnrollmentModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
