import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmitTestDto } from './dto/create-usertestresult.dto';


@Injectable()
export class UserTestResultService {
  constructor(private prisma: PrismaService) {}

  async submitTest(dto: SubmitTestDto) {
    try {
      const test = await this.prisma.test.findUnique({
        where: { id: dto.testId },
        include: { questions: { include: { answers: true } } },
      });
      console.log(test);
      
      if (!test) throw new NotFoundException('Тест не найден');

      // Подсчёт правильных ответов
      let correctCount = 0;
      for (const userAnswer of dto.answers) {
        const question = test.questions.find(q => q.id === userAnswer.questionId);
        if (!question) continue;

        const answer = question.answers.find(a => a.id === userAnswer.answerId);
        if (answer && answer.isRight) correctCount++;
      }

      const score = (correctCount / test.questions.length) * 100;

      const result = await this.prisma.userTestResult.create({
        data: {
          testId: dto.testId,
          userId: dto.userId,
          score,
          status: 'COMPLETED',
        },
      });

      return { result, score };
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException('Ошибка при сдаче теста');
    }
  }

  async getResultsByUser(userId: string) {
    return this.prisma.userTestResult.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { date: 'desc' },
    });
  }
}
