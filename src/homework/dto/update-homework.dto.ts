import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateHomeworkDto {
  @ApiProperty({ example: 'Обновлённое название', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Новый текст решения', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ example: ['https://site.com/new-img.png'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  img?: string[];

  @ApiProperty({ example: ['https://site.com/new-video.mp4'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  video?: string[];

  @ApiProperty({ example: '2025-12-26T23:59:00Z', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({ enum: Status, required: false })
  @IsOptional()
  status?: Status;
}
