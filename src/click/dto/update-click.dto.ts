import { PartialType } from '@nestjs/swagger';
import { ClickDto } from './create-click.dto';


export class UpdateClickDto extends PartialType(ClickDto) {}
