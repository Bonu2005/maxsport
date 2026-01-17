import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { Status, MyCourseStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) throw new NotFoundException("Курс не найден");

    return await this.prisma.$transaction(async (tx) => {
      // 1) Создаем Order
      const order = await tx.order.create({
        data: {
          userId,
          courseId: dto.courseId,
          status: Status.PENDING,
        },
      });

      // 3) MyCourse создаём, но не активируем
      await tx.myCourse.create({
        data: {
          userId,
          courseId: dto.courseId,
          status: Status.INACTIVE, // ❗ меняем
        },
      });

      return order;
    });
  }

  async findAll(userId: string) {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
        include: {
          course: true,
          payments: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

 async updateStatus(id: string, dto: UpdateOrderStatusDto) {
  try {
    return await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

async All() {
  try {
    return await this.prisma.order.findMany({
      include: {
        user: true,
        course: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

}
