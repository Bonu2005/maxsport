// src/payments/click.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { ClickService } from "./click.service";
import { ClickDto } from "./dto/create-click.dto";


@Controller("payments/click")
export class ClickController {
  constructor(private clickService: ClickService) {}

  @Post("prepare")
  prepare(@Body() dto: ClickDto) {
    return this.clickService.prepare(dto);
  }

  @Post("complete")
  complete(@Body() dto: ClickDto) {
    return this.clickService.complete(dto);
  }
}
