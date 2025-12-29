import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBranchDto) {
    try {
      return await this.prisma.branch.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании филиала');
    }
  }

  async findAll() {
    try {
      return await this.prisma.branch.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении филиалов');
    }
  }

  async findOne(id: string) {
    try {
      const branch = await this.prisma.branch.findUnique({
        where: { id },
      });

      if (!branch) {
        throw new NotFoundException('Филиал не найден');
      }

      return branch;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateBranchDto) {
    try {
      await this.findOne(id);

      return await this.prisma.branch.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.branch.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
