import { Module } from '@nestjs/common';
import { DiplomService } from './certificate.service';
import { DiplomController } from './certificate.controller';


@Module({
  controllers: [DiplomController],
  providers: [DiplomService],
})
export class CertificateModule {}
