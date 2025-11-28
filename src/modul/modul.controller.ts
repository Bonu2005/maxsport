import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { ModulesService } from './modul.service';
import { CreateModuleDto } from './dto/create-modul.dto';
import { UpdateModuleDto } from './dto/update-modul.dto';


@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findAllByCourse(courseId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
