import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateModuleDto {
    @ApiProperty({
        example: 'Основы JavaScript',
        description: 'Название модуля',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'd5af4c9e-5d2c-4f70-baec-fad1a105bd9c',
        description: 'ID курса, к которому относится модуль',
    })
    @IsString()
    courseId: string;


    @ApiProperty({
        example: 'nothing',
        description: 'title',
    })
    title: string;
    @ApiProperty({
        example: 'Этот модуль посвящён базовым понятиям JS',
        description: 'Описание модуля',
        required: false,
    })
    @IsOptional()
    @IsString()
    desc?: string;
}
