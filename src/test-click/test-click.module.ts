import { Module } from '@nestjs/common';
import { ClickTestController } from './test-click.controller';
import { ClickTestService } from './test-click.service';


@Module({
  controllers: [ClickTestController],
  providers: [ClickTestService],
})
export class TestClickModule {}
