import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  // CREATE COURSE
  async create(dto: CreateCourseDto) {
    try {
      return await this.prisma.course.create({
        data: { ...dto },
      });
    } catch (err) {
      console.error('Create Course Error:', err);
      throw new InternalServerErrorException('Failed to create course');
    }
  }

  // GET ALL COURSES
  async findAll() {
    try {
      return await this.prisma.course.findMany({
        include: {
          trainer: true,
          User: true,
          modules: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      console.error('Find All Courses Error:', err);
      throw new InternalServerErrorException('Failed to fetch courses');
    }
  }

  // GET ONE COURSE
  async findOne(id: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          trainer: true,
          User: true,
          modules: {
            include: {
              lessons: {
                include: {
                  homeworks: true,
                },
              },
            },
          },
          tests: true,
          orders: true,
          payments: true,
          diplomas: true,
        },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      return course;
    } catch (err) {
      console.error('Find Course Error:', err);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to fetch course');
    }
  }

  // UPDATE COURSE
  async update(id: string, dto: UpdateCourseDto) {
    try {
      return await this.prisma.course.update({
        where: { id },
        data: dto,
      });
    } catch (err) {
      console.error('Update Course Error:', err);

      if (err.code === 'P2025') {
        throw new NotFoundException('Course not found');
      }

      throw new InternalServerErrorException('Failed to update course');
    }
  }

  // DELETE COURSE
  async remove(id: string) {
    try {
      return await this.prisma.course.delete({
        where: { id },
      });
    } catch (err) {
      console.error('Delete Course Error:', err);

      if (err.code === 'P2025') {
        throw new NotFoundException('Course not found');
      }

      throw new InternalServerErrorException('Failed to delete course');
    }
  }
}
