import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MyCourseService } from './mycourse.service';
import { GuardGuard } from 'src/guard/guard.guard';
import { UpdateMycourseDto } from './dto/update-mycourse.dto';

@ApiTags('MyCourse')
@Controller('mycourse')
export class MyCourseController {
  constructor(private readonly mycourseService: MyCourseService) {}

  /**
   * ADMIN — получить все курсы всех пользователей
   */
  @Get('all')
  @ApiOperation({ summary: 'ADMIN: все курсы всех пользователей' })
  findAll() {
    return this.mycourseService.findAll();
  }

  /**
   * USER — получить свои курсы
   */
  
  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Get('my')
  @ApiOperation({ summary: 'Показать только мои курсы' })
  findMy(@Req() req) {
    return this.mycourseService.findMy(req.user.id);
  }

  /**
   * USER — завершённые курсы
   */
  
  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Get('my/completed')
  @ApiOperation({ summary: 'Мои завершённые курсы' })
  findCompleted(@Req() req) {
    return this.mycourseService.findCompleted(req.user.id);
  }

  /**
   * Найти 1 MyCourse (admin или владелец курса)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mycourseService.findOne(id);
  }

  /**
   * Обновить статус
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить статус MyCourse' })
  update(@Param('id') id: string, @Body() dto: UpdateMycourseDto) {
    return this.mycourseService.update(id, dto);
  }

  /**
   * Удалить
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить MyCourse' })
  remove(@Param('id') id: string) {
    return this.mycourseService.remove(id);
  }
}
