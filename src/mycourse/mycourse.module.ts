import { Module } from '@nestjs/common';
import { MyCourseController } from './mycourse.controller';
import { MyCourseService } from './mycourse.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports:[JwtModule,ConfigModule],
  controllers: [MyCourseController],
  providers: [MyCourseService],
})
export class MycourseModule {}
