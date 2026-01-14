import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiplomDto } from './dto/create-diplom.dto';
import { UpdateDiplomDto } from './dto/update-diplom.dto';

@Injectable()
export class DiplomService {
  constructor(private readonly prisma: PrismaService) {}
private async generateDiplomaCode(): Promise<string> {
  const year = new Date().getFullYear();

  // считаем сколько дипломов уже есть в этом году
  const count = await this.prisma.diplom.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });

  const nextNumber = String(count + 1).padStart(6, '0');

  return `DIP-${year}-${nextNumber}`;
}

  // CREATE
async create(dto: CreateDiplomDto) {
  await this.checkCourse(dto.courseId);
  await this.checkUser(dto.userId);

  if (dto.teacherId) {
    await this.checkTeacher(dto.teacherId);
  }

  for (let i = 0; i < 5; i++) {
    const codeDiplom = await this.generateDiplomaCode();

    try {
      return await this.prisma.diplom.create({
        data: {
          ...dto,
          codeDiplom,
        },
      });
    } catch (error) {
      if (error.code !== 'P2002') throw error;
    }
  }

  throw new Error('Failed to generate unique diploma code');
}


  // GET ALL
  async findAll() {
    return this.prisma.diplom.findMany({
      include: {
        course: true,
        user: true,
        teacher: true,
      },
    });
  }

  // GET ONE
  async findOne(id: string) {
    const diplom = await this.prisma.diplom.findUnique({
      where: { id },
      include: {
        course: true,
        user: true,
        teacher: true,
      },
    });

    if (!diplom) {
      throw new NotFoundException('Diploma not found');
    }

    return diplom;
  }

  // PATCH
  async update(id: string, dto: UpdateDiplomDto) {

    if (dto.courseId) {
      await this.checkCourse(dto.courseId);
    }

    if (dto.userId) {
      await this.checkUser(dto.userId);
    }

    if (dto.teacherId) {
      await this.checkTeacher(dto.teacherId);
    }

    return this.prisma.diplom.update({
      where: { id },
      data: dto,
    });
  }

  // ===== Helpers =====

  private async checkCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }
  }

  private async checkUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
  }

  private async checkTeacher(teacherId: string) {
    const teacher = await this.prisma.users.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }
  }
}
