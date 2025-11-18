import { Module } from '@nestjs/common';
import { CourseEnrollmentService } from './course-enrollment.service';
import { CourseEnrollmentController } from './course-enrollment.controller';

@Module({
  controllers: [CourseEnrollmentController],
  providers: [CourseEnrollmentService],
})
export class CourseEnrollmentModule {}
