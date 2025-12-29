import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiOperation({ summary: 'Создать филиал' })
  @ApiResponse({ status: 201, description: 'Филиал создан' })
  create(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все филиалы' })
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить филиал по ID' })
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить филиал' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить филиал' })
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
}
