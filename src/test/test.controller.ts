// src/test/test.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto, UpdateTestDto } from './dto/create-test.dto';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { UpdateQuestionDto } from 'src/question/dto/update-question.dto';
import { CreateAnswerDto } from 'src/answer/dto/create-answer.dto';
import { UpdateAnswerDto } from 'src/answer/dto/update-answer.dto';

@ApiTags('Tests')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  // --------------------- TEST ---------------------
  @Post()
  @ApiOperation({ summary: 'Создать тест' })
  createTest(@Body() dto: CreateTestDto) {
    return this.testService.createTest(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список тестов' })
  getAllTests() {
    return this.testService.getAllTests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детали теста с вопросами и ответами' })
  getTest(@Param('id') id: string) {
    return this.testService.getTestById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить тест' })
  updateTest(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testService.updateTest(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить тест' })
  deleteTest(@Param('id') id: string) {
    return this.testService.deleteTest(id);
  }

  // --------------------- QUESTION ---------------------
  @Post('question')
  @ApiOperation({ summary: 'Создать вопрос' })
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.testService.createQuestion(dto);
  }

  @Patch('question/:id')
  @ApiOperation({ summary: 'Обновить вопрос' })
  updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.testService.updateQuestion(id, dto);
  }

  @Delete('question/:id')
  @ApiOperation({ summary: 'Удалить вопрос' })
  deleteQuestion(@Param('id') id: string) {
    return this.testService.deleteQuestion(id);
  }

  // --------------------- ANSWER ---------------------
  @Post('answer')
  @ApiOperation({ summary: 'Создать ответ' })
  createAnswer(@Body() dto: CreateAnswerDto) {
    return this.testService.createAnswer(dto);
  }

  @Patch('answer/:id')
  @ApiOperation({ summary: 'Обновить ответ' })
  updateAnswer(@Param('id') id: string, @Body() dto: UpdateAnswerDto) {
    return this.testService.updateAnswer(id, dto);
  }

  @Delete('answer/:id')
  @ApiOperation({ summary: 'Удалить ответ' })
  deleteAnswer(@Param('id') id: string) {
    return this.testService.deleteAnswer(id);
  }
}
