import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.users.findMany({
        where:{role:Role.USER},
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
          img: true,
          createdAt: true,
        },
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при получении пользователей');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // 🔒 ЖЁСТКАЯ ПРОВЕРКА
      const forbiddenFields = [
        'role',
        'status',
        'email',
        'password',
        'experience',
        'description',
        'individualId',
      ];

      for (const field of forbiddenFields) {
        if ((dto as any)[field] !== undefined) {
          throw new BadRequestException(
            `Поле "${field}" запрещено к изменению`,
          );
        }
      }

      return await this.prisma.users.update({
        where: { id },
        data: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          img: dto.img,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
