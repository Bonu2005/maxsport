import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeworkTaskService } from './homework.service';
import { CreateHomeworkTaskDto } from './dto/create-homework.dto';


@ApiTags('Homework Tasks (Teacher)')
@Controller('homework-tasks')
export class HomeworkTaskController {
  constructor(private service: HomeworkTaskService) {}

  @Post()
  create(@Body() dto: CreateHomeworkTaskDto) {
    return this.service.create(dto);
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.service.findByLesson(lessonId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }

    @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.service.findByCourseId(courseId);
  }
}
