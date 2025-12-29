import { ApiProperty } from '@nestjs/swagger';
import { HomeworkStatus } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateHomeworkSubmissionDto {
  @ApiProperty({ example: 'uuid-homework-task-id' })
  @IsString()
  homeworkId: string;

  @ApiProperty({ example: 'Моё решение задачи', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    example: ['solution.png'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  files?: string[];
}


export class UpdateHomeworkSubmissionStatusDto {
  @ApiProperty({
    enum: HomeworkStatus,
    example: HomeworkStatus.CHECKED,
    description: 'Статус домашнего задания',
  })
  @IsEnum(HomeworkStatus)
  status: HomeworkStatus;
}
