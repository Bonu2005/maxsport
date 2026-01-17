// // src/payments/click-test.controller.ts
// import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
// import { ClickDto, PreparePaymentDto } from './dto/create-test-click.dto';
// import { ClickTestService } from './test-click.service';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { GuardGuard } from 'src/guard/guard.guard';


// @Controller('payments/test-click')
// export class ClickTestController {
//   constructor(private readonly clickService: ClickTestService) { }

//   // ================= PREPARE =================
//   @ApiBearerAuth('access-token')
//   @UseGuards(GuardGuard)
//   @Post('prepare')
//   async prepare(@Body() dto: PreparePaymentDto,@Req() req) {
//     return this.clickService.prepare(dto,req.user.id);
//   }

//   // ================= COMPLETE =================
//   @Post('complete')
//   async complete(@Body() dto: ClickDto) {
//     return this.clickService.complete(dto);
//   }
// }
