import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';
export class CreateOrderDto {
  @ApiProperty({ example: 'course-uuid', description: 'ID курса' })
  @IsString()
  courseId: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: Status,
    description: 'Новый статус заказа',
    example: Status.INACTIVE,
  })
  @IsEnum(Status, { message: 'Статус должен быть одним из доступных значений Status enum' })
  status: Status;
}