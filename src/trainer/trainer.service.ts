import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';

@Injectable()
export class TrainerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTrainerDto) {
    // проверка email
    const emailExists = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new BadRequestException('User with this email already exists');
    }

    // проверка телефона
    const phoneExists = await this.prisma.users.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (phoneExists) {
      throw new BadRequestException('User with this phone number already exists');
    }

    // хешируем пароль
    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hash,
        img: dto.img,
        experience: dto.experience,
        role: Role.TEACHER,
        status: Status.ACTIVE, // 👈 всегда актив
      },
    });
  }
}
