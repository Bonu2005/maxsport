// src/test/dto/create-answer.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  isRight: boolean;

  @ApiProperty()
  questionId: string;
}

export class UpdateAnswerDto {
  @ApiProperty({ required: false })
  text?: string;

  @ApiProperty({ required: false })
  isRight?: boolean;
}
