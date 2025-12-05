// src/order/dto/update-order-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: Status, example: Status.COMPLETED })
  @IsEnum(Status)
  status: Status;
}
