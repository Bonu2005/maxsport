import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaService) {}

  // ➕ создать фото
  async create(dto: CreatePhotoDto) {
    try {
      return await this.prisma.photo.create({
        data: {
          imageUrl: dto.imageUrl,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании фото');
    }
  }

  // 📸 получить все фото
  async findAll() {
    try {
      return await this.prisma.photo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при получении фото');
    }
  }

  // 🔍 получить фото по id
  async findById(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException('Фото не найдено');
    }

    return photo;
  }
}
