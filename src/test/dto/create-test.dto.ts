// src/test/dto/create-test.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt } from 'class-validator';
export enum TestStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}
export class CreateTestDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  courseId: string;

   @ApiProperty({ example: 60, description: 'Длительность теста в минутах' })
  @IsInt()
  duration: number;

  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ enum: TestStatus, default: TestStatus.DRAFT })
  @IsEnum(TestStatus)
  status: TestStatus;
}

export class UpdateTestDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  duration?: number;

  @ApiProperty({ required: false })
  startDate?: string;

  @ApiProperty({ enum: TestStatus, required: false })
  status?: TestStatus;
}

