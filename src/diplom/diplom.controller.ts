import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiplomService } from './diplom.service';
import { CreateDiplomDto } from './dto/create-diplom.dto';
import { UpdateDiplomDto } from './dto/update-diplom.dto';

@ApiTags('Diploms')
@Controller('diploms')
export class DiplomController {
  constructor(private readonly diplomService: DiplomService) {}

  @Post()
  create(@Body() dto: CreateDiplomDto) {
    return this.diplomService.create(dto);
  }

  @Get()
  findAll() {
    return this.diplomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diplomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDiplomDto,
  ) {
    return this.diplomService.update(id, dto);
  }
}
