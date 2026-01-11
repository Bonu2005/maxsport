import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePhotoDto {
    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;
}
