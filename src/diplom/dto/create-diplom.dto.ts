import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDiplomDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  issuedAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  courseFinishedAt?: Date;

  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  img: string[];
}
