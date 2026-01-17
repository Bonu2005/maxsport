// src/payments/dto/prepare-payment.dto.ts
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Redirect {
  @ApiProperty({ example: 'order-uuid', description: 'ID ordera' })
  @IsString()
  orderId: string;
  @ApiProperty({ example: 'redirect_url_front', description: 'redirect_url_front ' })
  @IsString()
  redirect_url_front: string;
}