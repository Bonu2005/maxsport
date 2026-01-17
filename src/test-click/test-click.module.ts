import { Module } from '@nestjs/common';
import { ClickTestController } from './test-click.controller';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClickTestService } from './test-click.service';


@Module({
  imports:[JwtModule,ConfigModule],
  controllers: [ClickTestController],
  providers:[ClickTestService]

})
export class TestClickModule {}
