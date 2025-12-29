import { Module } from '@nestjs/common';
import { HomeworkSubmissionService } from './homework-submission.service';
import { HomeworkSubmissionController } from './homework-submission.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule,ConfigModule],
  controllers: [HomeworkSubmissionController],
  providers: [HomeworkSubmissionService],
})
export class HomeworkSubmissionModule {}
