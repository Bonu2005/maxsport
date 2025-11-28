// src/test/dto/create-question.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty()
  questionNumber: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  testId: string;

  @ApiProperty({ type: [String], required: false })
  img?: string[];
}

export class UpdateQuestionDto {
  @ApiProperty({ required: false })
  questionNumber?: number;

  @ApiProperty({ required: false })
  question?: string;

  @ApiProperty({ type: [String], required: false })
  img?: string[];
}
