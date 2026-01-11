import { PartialType } from '@nestjs/swagger';
import { ClickDto } from './create-test-click.dto';


export class UpdateTestClickDto extends PartialType(ClickDto) {}
