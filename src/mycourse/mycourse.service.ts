import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyCourseStatus } from '@prisma/client';
import { UpdateMycourseDto } from './dto/update-mycourse.dto';

@Injectable()
export class MyCourseService {
  constructor(private prisma: PrismaService) {}

  /**
   * ADMIN — получить все MyCourse
   */
  async findAll() {
    try {
      return await this.prisma.myCourse.findMany({
        include: { course: true, user: true },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * USER — получить только свои MyCourse
   */
  async findMy(userId: string) {
    try {
      return await this.prisma.myCourse.findMany({
        where: { userId },
        include: { course: true },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * USER — получить завершённые курсы
   */
  async findCompleted(userId: string) {
    try {
      return await this.prisma.myCourse.findMany({
        where: { userId, status: MyCourseStatus.COMPLETED },
        include: { course: true },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const myCourse = await this.prisma.myCourse.findUnique({
        where: { id },
        include: { course: true, user: true },
      });

      if (!myCourse)
        throw new NotFoundException(`Course с id ${id} не найден`);

      return myCourse;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, dto: UpdateMycourseDto) {
    await this.findOne(id);

    try {
      return await this.prisma.myCourse.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.myCourse.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
