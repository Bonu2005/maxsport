import { PartialType } from '@nestjs/swagger';
import { CreateSocialNetworkDto } from './create-social-network.dto';

export class UpdateSocialNetworkDto extends PartialType(CreateSocialNetworkDto) {}
