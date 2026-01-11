// src/payments/click-test.service.ts
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import { checkClickSign } from "src/utils/click-utils";
import { Status } from "@prisma/client";
import { ClickDto } from "./dto/create-test-click.dto";

@Injectable()
export class ClickTestService {
  constructor(private prisma: PrismaService) {}

  private error(code: number, note: string) {
    return { error: code, error_note: note };
  }

  private isAmountEqual(a: number, b: number) {
    const EPSILON = 0.01;
    return Math.abs(a - b) < EPSILON;
  }

  // ================= PREPARE =================
  async prepare(dto: ClickDto) {
    // для теста можно просто игнорировать секретный ключ
    const isValidSign = checkClickSign(dto, process.env.CLICK_SECRET_KEY || "test_key");

    if (!isValidSign) {
      console.warn("SIGN CHECK FAILED for", dto);
      return this.error(-1, "SIGN CHECK FAILED");
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.merchant_trans_id },
    });

    if (!payment) {
      return this.error(-5, "Payment not found");
    }

    if (!this.isAmountEqual(payment.amount, dto.amount)) {
      return this.error(-2, "Incorrect amount");
    }

    return {
      click_trans_id: dto.click_trans_id,
      merchant_trans_id: dto.merchant_trans_id,
      error: 0,
      error_note: "Success",
    };
  }

  // ================= COMPLETE =================
  async complete(dto: ClickDto) {
    const isValidSign = checkClickSign(dto, process.env.CLICK_SECRET_KEY || "test_key");

    if (!isValidSign) {
      return this.error(-1, "SIGN CHECK FAILED");
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.merchant_trans_id },
    });

    if (!payment) {
      return this.error(-5, "Payment not found");
    }

    if (!payment.userId || !payment.courseId) {
      return this.error(-6, "Invalid payment data");
    }

    // если Click вернул ошибку
    if (dto.error && dto.error !== 0) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: Status.INACTIVE },
      });

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: Status.INACTIVE },
      });

      return this.error(dto.error, dto.error_note || "Unknown error");
    }

    // успешная оплата
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: Status.COMPLETED,
            clickTransId: String(dto.click_trans_id),
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: Status.COMPLETED },
        });

        await tx.myCourse.updateMany({
          where: {
            userId: payment.userId!,
            courseId: payment.courseId!,
          },
          data: { status: Status.ACTIVE },
        });
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      return this.error(-99, "Internal server error");
    }

    return {
      click_trans_id: dto.click_trans_id,
      merchant_trans_id: dto.merchant_trans_id,
      error: 0,
      error_note: "Success",
    };
  }
}
