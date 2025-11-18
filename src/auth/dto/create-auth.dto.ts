import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Status } from 'generated/prisma';

export class CreateAuthDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'MaxSportUser' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Электронная почта пользователя', example: 'user@example.com', required: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'Номер телефона пользователя', example: '+998901234567', required: true })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'StrongP@ssw0rd' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'OTP код, который был отправлен пользователю', example: '123456' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @ApiProperty({ description: 'Контакт, на который был отправлен OTP (email или телефон)', example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({ description: 'Тип отправки OTP', example: 'email', enum: ['email', 'sms'] })
  type: 'email' | 'sms';
}

export class SignInDto {
  @ApiProperty({ description: 'Email пользователя для входа', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'StrongP@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SendOtpDto {
  @ApiProperty({
    description: 'Email или номер телефона пользователя',
    example: 'user@example.com или +998901234567',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'Тема письма (опционально, используется при email-отправке)',
    example: 'Verification Code',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;
}


export class SendOtpDtoReset {
  @ApiProperty({ example: "test@gmail.com" })
  @IsEmail()
  to: string;

  @ApiProperty({ example: "Reset your password" })
  @IsNotEmpty()
  subject: string;
}

export class VerifyOtpDtoReset {
  @ApiProperty({ example: "test@gmail.com" })
  @IsEmail()
  contact: string;

  @ApiProperty({ example: "123456" })
  @IsNotEmpty()
  otpCode: string;
}


export class ResetPasswordDto {
  @ApiProperty({ example: "test@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Qwerty123!" })
  @IsString()
  @MinLength(6)
  newPassword: string;
}