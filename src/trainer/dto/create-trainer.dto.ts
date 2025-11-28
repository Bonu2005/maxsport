import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsInt, MinLength } from 'class-validator';

export class CreateTrainerDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  name: string;

  @ApiProperty({ example: "trainer@mail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: "secret123" })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "trainer.png", required: false })
  @IsOptional()
  img?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsInt()
  experience?: number;
}
