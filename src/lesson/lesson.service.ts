import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    try {
      const modul = await this.prisma.modul.findUnique({
        where: { id: dto.modulId },
      });
      if (!modul) throw new NotFoundException('Модуль не найден');

      return await this.prisma.lesson.create({ data: dto });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Ошибка при создании урока');
    }
  }

  async findAllByModule(modulId: string) {
    try {
      return await this.prisma.lesson.findMany({
        where: { modulId },
        include: { homeworks: true },
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при получении уроков');
    }
  }

  async findOne(id: string) {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id },
        include: { homeworks: true },
      });
      if (!lesson) throw new NotFoundException('Урок не найден');
      return lesson;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Ошибка при получении урока');
    }
  }

  async update(id: string, dto: UpdateLessonDto) {
    try {
      return await this.prisma.lesson.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Урок не найден');
      }
      throw new InternalServerErrorException('Ошибка при обновлении урока');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.lesson.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Урок не найден');
      }
      throw new InternalServerErrorException('Ошибка при удалении урока');
    }
  }


  async findAll() {
  try {
    return await this.prisma.lesson.findMany({
      include: {
        homeworks: true, // HomeworkTask[]
        modul: true,     // если нужно знать модуль
        Course: true,    // если нужно знать курс
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    throw new InternalServerErrorException(
      'Ошибка при получении списка уроков',
    );
  }
}

}
