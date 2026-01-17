// src/payments/dto/click.dto.ts
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClickDto {
  @ApiProperty({
    example: 123456,
    description: 'Уникальный ID транзакции в системе CLICK',
  })
  @IsNumber()
  click_trans_id: number;

  @ApiProperty({
    example: 98765,
    description: 'ID сервиса, выданный CLICK',
  })
  @IsNumber()
  service_id: number;

  @ApiProperty({
    example: 'ORDER_12345',
    description: 'ID транзакции в системе мерчанта',
  })
  @IsString()
  merchant_trans_id: string;

  @ApiProperty({
    example: 150000,
    description: 'Сумма платежа',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 0,
    description: 'Действие: 0 — prepare, 1 — complete',
  })
  @IsNumber()
  action: number;

  @ApiProperty({
    example: '2026-01-16 23:15:00',
    description: 'Время подписи запроса',
  })
  @IsString()
  sign_time: string;

  @ApiProperty({
    example: 'a1b2c3d4e5f6',
    description: 'Подпись запроса (MD5 / SHA)',
  })
  @IsString()
  sign_string: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Код ошибки (если есть)',
  })
  @IsOptional()
  @IsNumber()
  error?: number;

  @ApiPropertyOptional({
    example: 'Success',
    description: 'Описание ошибки',
  })
  @IsOptional()
  @IsString()
  error_note?: string;

  @ApiPropertyOptional({
    example: 445566,
    description: 'ID транзакции prepare в системе мерчанта',
  })
  @IsOptional()
  @IsNumber()
  merchant_prepare_id?: bigint;
}
