import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('users')
  @ApiOperation({ summary: 'Получить список пользователей' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Patch('user/:id')
  @ApiOperation({
    summary: 'Обновить пользователя (ТОЛЬКО имя, номер и изображение)',
  })


  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

}
