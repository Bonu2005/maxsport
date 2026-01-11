// src/payments/dto/click.dto.ts
import { IsNumber, IsString, IsOptional } from "class-validator";

export class ClickDto {
  @IsNumber()
  click_trans_id: number;

  @IsNumber()
  service_id: number;

  @IsString()
  merchant_trans_id: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  action: number; // 0 prepare, 1 complete

  @IsString()
  sign_time: string;

  @IsString()
  sign_string: string;

  @IsOptional()
  @IsNumber()
  error?: number;

  @IsOptional()
  @IsString()
  error_note?: string;
}
