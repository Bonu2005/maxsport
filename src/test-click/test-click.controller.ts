// src/payments/click-test.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ClickDto } from './dto/create-test-click.dto';
import { ClickTestService } from './test-click.service';


@Controller('payments/test-click')
export class ClickTestController {
  constructor(private readonly clickService: ClickTestService) {}

  // ================= PREPARE =================
  @Post('prepare')
  async prepare(@Body() dto: ClickDto) {
    return this.clickService.prepare(dto);
  }

  // ================= COMPLETE =================
  @Post('complete')
  async complete(@Body() dto: ClickDto) {
    return this.clickService.complete(dto);
  }
}
