import { Controller, Post, Body, Get, Param, Req, UseGuards, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HomeworkSubmissionService } from './homework-submission.service';
import { CreateHomeworkSubmissionDto, UpdateHomeworkSubmissionStatusDto } from './dto/create-homework-submission.dto';
import { GuardGuard } from 'src/guard/guard.guard';

@ApiTags('Homework Submissions (Student)')
@Controller('homework-submissions')
export class HomeworkSubmissionController {
  constructor(private service: HomeworkSubmissionService) { }
  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateHomeworkSubmissionDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get('homework/:homeworkId')
  findByHomework(@Param('homeworkId') homeworkId: string) {
    return this.service.findByHomework(homeworkId);
  }
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateHomeworkSubmissionStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Get('my')
  @ApiOperation({
    summary: 'Получить все мои домашние задания',
  })
  @ApiResponse({
    status: 200,
    description: 'Список домашних заданий пользователя',
  })
  findMySubmissions(@Req() req) {
    const userId = req.user.id;
    return this.service.findByUser(userId);
  }
}
