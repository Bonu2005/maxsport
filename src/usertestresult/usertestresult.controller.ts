import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubmitTestDto } from './dto/create-usertestresult.dto';
import { UserTestResultService } from './usertestresult.service';

@ApiTags('User Test Results')
@Controller('user-test-result')
export class UserTestResultController {
  constructor(private service: UserTestResultService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Сдать тест и получить результат' })
  submitTest(@Body() dto: SubmitTestDto) {
    return this.service.submitTest(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить результаты пользователя' })
  getResultsByUser(@Param('userId') userId: string) {
    return this.service.getResultsByUser(userId);
  }
}
