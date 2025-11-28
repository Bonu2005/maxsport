// src/user-test-result/dto/create-user-test-result.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SubmitTestDto {
  @ApiProperty()
  testId: string;

  @ApiProperty()
  userId: string;

  answers: AnswerSubmitDto[];
}

export class AnswerSubmitDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  answerId: string;
}
