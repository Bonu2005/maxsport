import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsInt } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Frontend Bootcamp',
    description: 'Название курса',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 149.99,
    description: 'Цена курса',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Полный курс по изучению frontend разработки',
    description: 'Описание курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2025-01-01T12:00:00.000Z',
    description: 'Дата начала курса',
    required: false,
  })
  @IsOptional()
  date?: Date;

  @ApiProperty({
    example: ['img1.png', 'img2.png'],
    description: 'Список изображений к курсу',
    type: [String],
  })
  @IsArray()
  image: string[];

  @ApiProperty({
    example: 1,
    description: 'Уровень сложности курса (1 — начинающий, 2 — средний, 3 — продвинутый)',
  })
  @IsInt()
  level: number;

  @ApiProperty({
    enum: Status,
    example: Status.ACTIVE,
    description: 'Статус курса',
    required: false,
  })
  @IsOptional()
  status?: Status;

  @ApiProperty({
    example: '9f16baf6-5b3b-478c-a931-ed7d44c137f0',
    description: 'ID тренера курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  trainerId?: string;
}
