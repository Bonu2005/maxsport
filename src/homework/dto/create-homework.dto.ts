import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateHomeworkTaskDto {
  @ApiProperty({ example: 'uuid-lesson-id' })
  @IsString()
  lessonId: string;

  @ApiProperty({ example: 'Домашнее задание №1' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Решить задачи 1–5', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['file1.pdf'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  files?: string[];

  @ApiProperty({
    example: '2025-01-20T18:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
