import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';


import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDiplomDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { DiplomService } from './certificate.service';

@ApiTags('Diploms')
@Controller('diploms')
export class DiplomController {
  constructor(private readonly diplomService: DiplomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new diplom' })
  @ApiResponse({ status: 201, description: 'Diplom successfully created.' })
  async create(@Body() dto: CreateDiplomDto) {
    return this.diplomService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all diploms' })
  async findAll() {
    return this.diplomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get diplom by id' })
  @ApiResponse({ status: 404, description: 'Diplom not found.' })
  async findOne(@Param('id') id: string) {
    return this.diplomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update diplom by id' })
  @ApiResponse({ status: 200, description: 'Diplom successfully updated.' })
  @ApiResponse({ status: 404, description: 'Diplom not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.diplomService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete diplom by id' })
  @ApiResponse({ status: 200, description: 'Diplom successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Diplom not found.' })
  async remove(@Param('id') id: string) {
    return this.diplomService.remove(id);
  }
}
