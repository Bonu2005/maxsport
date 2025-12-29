import { Module } from '@nestjs/common';
import { HomeworkTaskController } from './homework.controller';
import { HomeworkTaskService } from './homework.service';


@Module({
  controllers: [HomeworkTaskController],
  providers: [HomeworkTaskService],
})
export class HomeworkModule {}




