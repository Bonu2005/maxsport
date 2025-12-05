import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';

@Injectable()
export class TrainerService {
  constructor(private prisma: PrismaService) {}

  // ---------------------------
  // CREATE TRAINER
  // ---------------------------
  async create(dto: CreateTrainerDto) {
    try {
      // email check
      const emailExists = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) throw new BadRequestException('Email already exists');

      // phone check
      const phoneExists = await this.prisma.users.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      });
      if (phoneExists) throw new BadRequestException('Phone number already exists');

      const hash = await bcrypt.hash(dto.password, 10);

      return await this.prisma.users.create({
        data: {
          name: dto.name,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          password: hash,
          img: dto.img,
          experience: dto.experience,
          role: Role.TEACHER,
          status: Status.ACTIVE,
        },
      });
    } catch (error) {
      console.error('Create Trainer Error:', error);
      throw new InternalServerErrorException(`Failed to create trainer: ${error.message}`);
    }
  }

  // ---------------------------
  // GET ALL TRAINERS
  // ---------------------------
  async findAll() {
    try {
      return await this.prisma.users.findMany({
        where: { role: Role.TEACHER },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('FindAll Trainers Error:', error);
      throw new InternalServerErrorException('Failed to fetch trainers');
    }
  }

  // ---------------------------
  // GET ONE TRAINER
  // ---------------------------
  async findOne(id: string) {
    try {
      const trainer = await this.prisma.users.findFirst({
        where: { id, role: Role.TEACHER },
      });

      if (!trainer) throw new NotFoundException('Trainer not found');

      return trainer;
    } catch (error) {
      console.error('FindOne Trainer Error:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to fetch trainer');
    }
  }

  // ---------------------------
  // UPDATE TRAINER
  // ---------------------------
  async update(id: string, dto: UpdateTrainerDto) {
    try {
      await this.findOne(id); // проверяем существование

      let hash: string | undefined;
      if (dto.password) hash = await bcrypt.hash(dto.password, 10);

      return await this.prisma.users.update({
        where: { id },
        data: {
          ...dto,
          password: hash || undefined,
        },
      });
    } catch (error) {
      console.error('Update Trainer Error:', error);
      throw new InternalServerErrorException(`Failed to update trainer: ${error.message}`);
    }
  }

  // ---------------------------
  // DELETE TRAINER
  // ---------------------------
  async remove(id: string) {
    try {
      await this.findOne(id); // проверяем существование

      return await this.prisma.users.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Delete Trainer Error:', error);
      throw new InternalServerErrorException('Failed to delete trainer');
    }
  }
}
