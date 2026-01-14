import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Injectable()
export class SocialNetworkService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSocialNetworkDto) {
    return this.prisma.socialNetwork.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.socialNetwork.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const social = await this.prisma.socialNetwork.findUnique({
      where: { id },
    });

    if (!social) {
      throw new NotFoundException('Social network not found');
    }

    return social;
  }

  async update(id: string, dto: UpdateSocialNetworkDto) {
    await this.findOne(id);

    return this.prisma.socialNetwork.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.socialNetwork.delete({
      where: { id },
    });
  }
}
