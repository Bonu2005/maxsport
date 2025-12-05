import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateDiplomDto {
  @ApiProperty({ example: 'DIP-12345', description: 'Код диплома' })
  @IsString()
  codeDiplom: string;

  @ApiProperty({ example: 'course-uuid', description: 'ID курса' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'teacher-uuid', description: 'ID преподавателя', required: false })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ example: 'user-uuid', description: 'ID пользователя' })
  @IsString()
  userId: string;

  @ApiProperty({ example: ['img1.png', 'img2.png'], description: 'Список изображений диплома' })
  @IsArray()
  @IsString({ each: true })
  img: string[];
}
