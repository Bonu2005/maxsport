import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiplomDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiplomService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDiplomDto) {
    try {
      return await this.prisma.diplom.create({ data: dto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Конкретные ошибки Prisma, например дубликат ключа
        if (error.code === 'P2002') {
          throw new BadRequestException(`Дубликат значения: ${error.meta?.target}`);
        }
      }
      // Остальные ошибки
      throw new BadRequestException(error.message);
    }
  }

async findAll() {
  try {
    return await this.prisma.diplom.findMany({
      include: {
        course: true,   // включаем полный объект курса
        teacher: true,  // включаем полный объект преподавателя (если есть)
        user: true,     // включаем полный объект пользователя
      },
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

async findOne(id: string) {
  const diplom = await this.prisma.diplom.findUnique({
    where: { id },
    include: {
      course: true,
      teacher: true,
      user: true,
    },
  });
  if (!diplom) throw new NotFoundException(`Diplom с id ${id} не найден`);
  return diplom;
}


  async update(id: string, dto: UpdateCertificateDto) {
    await this.findOne(id);
    try {
      return await this.prisma.diplom.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      return await this.prisma.diplom.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
