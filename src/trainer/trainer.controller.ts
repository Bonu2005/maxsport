import { Controller, Get, Param, Patch, Delete, Body, Post } from '@nestjs/common';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainerService } from './trainer.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  create(@Body() dto: CreateTrainerDto) {
    return this.trainerService.create(dto);
  }

  @Get()
  findAll() {
    return this.trainerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainerService.findOne(id);
  }

 @Patch(':id')
  @ApiOperation({ summary: 'Update trainer by id' })
  @ApiResponse({ status: 200, description: 'Trainer successfully updated.' })
  @ApiResponse({ status: 404, description: 'Trainer not found.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrainerDto,
  ) {
    return this.trainerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainerService.remove(id);
  }
}
