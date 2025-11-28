// src/test/dto/create-test.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  courseId: string;
}

export class UpdateTestDto {
  @ApiProperty({ required: false })
  name?: string;
}
