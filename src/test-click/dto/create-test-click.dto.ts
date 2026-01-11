// src/payments/dto/prepare-payment.dto.ts
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PreparePaymentDto {
  @ApiProperty({ example: "course-uuid" })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  amount: number;
}

export class ClickDto {
  @ApiProperty({ example: 123456 })
  @IsNumber()
  click_trans_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  service_id: number;

  @ApiProperty({ example: "payment-uuid" })
  @IsString()
  merchant_trans_id: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 0, description: "0 = prepare, 1 = complete" })
  @IsNumber()
  action: number;

  @ApiProperty({ example: "2026-01-09 12:00:00" })
  @IsString()
  sign_time: string;

  @ApiProperty({ example: "test_sign" })
  @IsString()
  sign_string: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  error?: number;

  @ApiPropertyOptional({ example: "Success" })
  @IsOptional()
  @IsString()
  error_note?: string;
}