import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum LessonStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateLessonDto {
  @ApiProperty({ example: 'uuid-modul-id', description: 'ID модуля' })
  @IsString()
  modulId: string;

  @ApiProperty({ example: 'uuid-course-id', description: 'ID курса', required: false })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiProperty({ example: 'Введение в NestJS', description: 'Название урока' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Основы Dependency Injection', description: 'Тема урока' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://youtube.com/video',
    description: 'Ссылка на видео',
    required: false,
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({
    example: ['https://site.com/img1.png'],
    description: 'Изображения урока',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  img?: string[];

  @ApiProperty({
    example: 'Описание урока',
    description: 'Описание урока',
    required: false,
  })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({
    example: 45,
    description: 'Длительность урока в минутах',
    required: false,
  })
  @IsOptional()
  @IsInt()
  duration?: number;

  // 🔹 НОВОЕ
  @ApiProperty({
    example: '2025-01-10T10:00:00.000Z',
    description: 'Дата и время начала урока',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiProperty({
    example: LessonStatus.DRAFT,
    enum: LessonStatus,
    description: 'Статус урока',
    required: false,
  })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;
}
