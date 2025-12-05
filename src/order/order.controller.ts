import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { Status } from '@prisma/client';
import { GuardGuard } from 'src/guard/guard.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @ApiOperation({
    summary: 'Создать заказ + MyCourse + Payment автоматически',
  })
  @Post()
  async create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.id, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Все заказы текущего пользователя' })
  @Get()
  async findAll(@Req() req) {
    return this.orderService.findAll(req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }


  @ApiOperation({ summary: 'Получить все заказы' })
  @Get('allOrders')
  All() {
    return this.orderService.All();
  }


}
