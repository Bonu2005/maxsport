import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { PaymentModule } from './payment/payment.module';
import { CertificateModule } from './certificate/certificate.module';
import { TrainerModule } from './trainer/trainer.module';
import { MailerService } from './mailer/mailer.service';
import { CourseModule } from './course/course.module';
import { ModulModule } from './modul/modul.module';
import { LessonModule } from './lesson/lesson.module';
import { HomeworkModule } from './homework/homework.module';
import { TestModule } from './test/test.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { UsertestresultModule } from './usertestresult/usertestresult.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MycourseModule } from './mycourse/mycourse.module';
import { OrderModule } from './order/order.module';
import { BranchModule } from './branch/branch.module';
import { UserModule } from './user/user.module';
import { HomeworkSubmissionModule } from './homework-submission/homework-submission.module';



@Module({
  imports: [PrismaModule, AuthModule, BotModule, PaymentModule, CertificateModule, TrainerModule, CourseModule, ModulModule, LessonModule, HomeworkModule, TestModule, QuestionModule, AnswerModule, UsertestresultModule, ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // указываем папку с файлами
      serveRoot: '/uploads', // путь в URL
    }), MycourseModule, OrderModule, BranchModule, UserModule, HomeworkSubmissionModule,],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
