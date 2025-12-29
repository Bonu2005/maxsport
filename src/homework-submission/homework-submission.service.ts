import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeworkSubmissionDto, UpdateHomeworkSubmissionStatusDto } from './dto/create-homework-submission.dto';

@Injectable()
export class HomeworkSubmissionService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateHomeworkSubmissionDto) {
    try {
      const homework = await this.prisma.homeworkTask.findUnique({
        where: { id: dto.homeworkId },
      });

      if (!homework) {
        throw new NotFoundException('Домашнее задание не найдено');
      }

      if (homework.deadline && homework.deadline < new Date()) {
        throw new ForbiddenException('Дедлайн уже прошёл');
      }

      return await this.prisma.homeworkSubmission.create({
        data: {
          userId,
          homeworkId: dto.homeworkId,
          text: dto.text,
          files: dto.files ?? [],
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Ошибка при отправке домашнего задания',
      );
    }
  }

  async findByHomework(homeworkId: string) {
    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: { user: true },
    });
  }

  
  async updateStatus(
    submissionId: string,
    dto: UpdateHomeworkSubmissionStatusDto,
  ) {
    try {
      const submission = await this.prisma.homeworkSubmission.findUnique({
        where: { id: submissionId },
      });

      if (!submission) {
        throw new NotFoundException(
          'Отправка домашнего задания не найдена',
        );
      }

      return await this.prisma.homeworkSubmission.update({
        where: { id: submissionId },
        data: {
          status: dto.status,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'Ошибка при обновлении статуса домашнего задания',
      );
    }
  }

  async findByUser(userId: string) {
  return this.prisma.homeworkSubmission.findMany({
    where: {
      userId,
    },
    include: {
      homework: true, // если нужно видеть само задание
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}
