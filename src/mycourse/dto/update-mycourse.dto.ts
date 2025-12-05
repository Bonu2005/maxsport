import { PartialType } from '@nestjs/swagger';
import { CreateMyCourseDto } from './create-mycourse.dto';


export class UpdateMycourseDto extends PartialType(CreateMyCourseDto) {}
