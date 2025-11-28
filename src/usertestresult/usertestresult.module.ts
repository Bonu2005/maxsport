import { Module } from '@nestjs/common';
import { UserTestResultController } from './usertestresult.controller';
import { UserTestResultService } from './usertestresult.service';


@Module({
  controllers: [UserTestResultController],
  providers: [UserTestResultService],
})
export class UsertestresultModule {}
