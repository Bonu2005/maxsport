import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeworkTaskDto } from './dto/create-homework.dto';

@Injectable()
export class HomeworkTaskService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHomeworkTaskDto) {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: dto.lessonId },
      });

      if (!lesson) {
        throw new NotFoundException('Урок не найден');
      }

      return await this.prisma.homeworkTask.create({
        data: {
          ...dto,
          files: dto.files ?? [],
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Ошибка при создании домашнего задания',
      );
    }
  }

  async findByLesson(lessonId: string) {
    return this.prisma.homeworkTask.findMany({
      where: { lessonId },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.homeworkTask.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Домашнее задание не найдено');
      }
      throw new InternalServerErrorException('Ошибка при удалении задания');
    }
  }

   async findAll() {
    try {
      return await this.prisma.homeworkTask.findMany({
        include: {
          lesson: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Ошибка при получении домашних заданий',
      );
    }
  }
}
