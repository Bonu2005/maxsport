import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[JwtModule,ConfigModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
