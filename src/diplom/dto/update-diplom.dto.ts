import { PartialType } from '@nestjs/swagger';
import { CreateDiplomDto } from './create-diplom.dto';

export class UpdateDiplomDto extends PartialType(CreateDiplomDto) {}
