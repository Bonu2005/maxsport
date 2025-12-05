import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export enum MyCourseStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
}

export class CreateMyCourseDto {
  @ApiProperty({ example: 'course-uuid', description: 'ID курса' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'user-uuid', description: 'ID пользователя' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: MyCourseStatus, example: MyCourseStatus.ACTIVE, description: 'Статус курса', required: false })
  @IsEnum(MyCourseStatus)
  status: MyCourseStatus;
}


export class BuyCourseDto {
  @ApiProperty({ example: 'course-uuid', description: 'ID курса' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 149.99, description: 'Сумма оплаты курса' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'UZS', description: 'Валюта', required: false })
  @IsString()
  currency?: string = 'UZS';
}
