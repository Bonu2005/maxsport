// src/payments/click-test.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';

import { ClickTestService } from './test-click.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GuardGuard } from 'src/guard/guard.guard';
import { Redirect } from './dto/create-test-click.dto';


@Controller('payments')
export class ClickTestController {
  constructor(private readonly clickService: ClickTestService) { }
  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Post('redirect')
  async prepare(@Body() dto: Redirect,@Req() req) {
    return this.clickService.redirect(dto,req.user.id);
  }


}
