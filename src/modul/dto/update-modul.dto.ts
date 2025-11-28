import { PartialType } from '@nestjs/swagger';
import { CreateModuleDto } from './create-modul.dto';


export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
