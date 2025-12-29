        import { ApiPropertyOptional } from '@nestjs/swagger';
        import { IsOptional, IsString } from 'class-validator';

        export class UpdateUserDto {
        @ApiPropertyOptional({ example: 'John Doe' })
        @IsOptional()
        @IsString()
        name?: string;

        @ApiPropertyOptional({ example: '+998901234567' })
        @IsOptional()
        @IsString()
        phoneNumber?: string;

        @ApiPropertyOptional({ example: 'avatar.png' })
        @IsOptional()
        @IsString()
        img?: string;
        }
