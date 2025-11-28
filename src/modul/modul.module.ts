import { Module } from '@nestjs/common';
import { ModulesController } from './modul.controller';
import { ModulesService } from './modul.service';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulModule {}
