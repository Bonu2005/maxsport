import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-modul.dto';
import { UpdateModuleDto } from './dto/update-modul.dto';


@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateModuleDto) {
    try {
      return await this.prisma.modul.create({
        data: {
          name: dto.name,
          desc: dto.desc,
          title: dto.title,
          courseId: dto.courseId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании модуля');
    }
  }

  async findAllByCourse(courseId: string) {
    try {
      return await this.prisma.modul.findMany({
        where: { courseId },
        include: { lessons: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении модулей');
    }
  }

  async update(id: string, dto: UpdateModuleDto) {
    try {
      const module = await this.prisma.modul.update({
        where: { id },
        data: dto,
      });
      return module;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Модуль не найден');
      }
      throw new InternalServerErrorException('Ошибка при обновлении модуля');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.modul.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Модуль не найден');
      }
      throw new InternalServerErrorException('Ошибка при удалении модуля');
    }
  }
}
