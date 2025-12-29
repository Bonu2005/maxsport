import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsUrl } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Ташкент' })
  @IsString()
  city: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'branch@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ул. Амира Темура, 10' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'https://maps.google.com/?q=...' })
  @IsUrl()
  mapLink: string;
}
