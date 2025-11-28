// src/test/test.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestDto, UpdateTestDto } from './dto/create-test.dto';
import { CreateQuestionDto, UpdateQuestionDto } from 'src/question/dto/create-question.dto';
import { CreateAnswerDto } from 'src/answer/dto/create-answer.dto';
import { UpdateAnswerDto } from 'src/answer/dto/update-answer.dto';


@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  // --------------------- TEST ---------------------
  async createTest(dto: CreateTestDto) {
    try {
      const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
      if (!course) throw new NotFoundException('Курс не найден');
      return await this.prisma.test.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании теста');
    }
  }

  async getAllTests() {
    try {
      return await this.prisma.test.findMany({ include: { questions: { include: { answers: true } } } });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении тестов');
    }
  }

  async getTestById(id: string) {
    try {
      const test = await this.prisma.test.findUnique({
        where: { id },
        include: { questions: { include: { answers: true } } },
      });
      if (!test) throw new NotFoundException('Тест не найден');
      return test;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении теста');
    }
  }

  async updateTest(id: string, dto: UpdateTestDto) {
    try {
      return await this.prisma.test.update({ where: { id }, data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при обновлении теста');
    }
  }

  async deleteTest(id: string) {
    try {
      return await this.prisma.test.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при удалении теста');
    }
  }

  // --------------------- QUESTION ---------------------
  async createQuestion(dto: CreateQuestionDto) {
    try {
      const test = await this.prisma.test.findUnique({ where: { id: dto.testId } });
      if (!test) throw new NotFoundException('Тест не найден');
      return await this.prisma.question.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании вопроса');
    }
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    try {
      return await this.prisma.question.update({ where: { id }, data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при обновлении вопроса');
    }
  }

  async deleteQuestion(id: string) {
    try {
      return await this.prisma.question.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при удалении вопроса');
    }
  }

  // --------------------- ANSWER ---------------------
  async createAnswer(dto: CreateAnswerDto) {
    try {
      const question = await this.prisma.question.findUnique({ where: { id: dto.questionId } });
      if (!question) throw new NotFoundException('Вопрос не найден');
      return await this.prisma.answer.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании ответа');
    }
  }

  async updateAnswer(id: string, dto: UpdateAnswerDto) {

    try {
      return await this.prisma.answer.update({ where: { id }, data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при обновлении ответа');
    }
  }

  async deleteAnswer(id: string) {
    try {
      return await this.prisma.answer.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при удалении ответа');
    }
  }
}
