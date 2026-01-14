import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateSocialNetworkDto {
  @ApiProperty({ example: 'Instagram' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://instagram.com/username' })
  @IsUrl()
  url: string;
}
