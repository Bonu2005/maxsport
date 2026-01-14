import { Module } from '@nestjs/common';
import { DiplomService } from './diplom.service';
import { DiplomController } from './diplom.controller';

@Module({
  controllers: [DiplomController],
  providers: [DiplomService],
})
export class DiplomModule {}
