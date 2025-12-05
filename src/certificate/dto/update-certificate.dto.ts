import { PartialType } from '@nestjs/mapped-types';
import { CreateDiplomDto } from './create-certificate.dto';

export class UpdateCertificateDto extends PartialType(CreateDiplomDto) {}
