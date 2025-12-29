import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({ example: 'Обновлённое название', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Новая тема урока', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'https://youtube.com/new-video', required: false })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({ example: ['https://site.com/new-img.png'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  img?: string[];

  @ApiProperty({ example: 'Новое описание', required: false })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsInt()
  duration?: number;
}
