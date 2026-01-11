// src/payments/click.service.ts
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Status } from "@prisma/client";
import { ClickDto } from "./dto/create-click.dto";
import { checkClickSign } from "src/utils/click-utils";

@Injectable()
export class ClickService {
  constructor(private prisma: PrismaService) {}

  private error(code: number, note: string) {
    return { error: code, error_note: note };
  }

  private isAmountEqual(a: number, b: number) {
    const EPSILON = 0.01; // допустимая погрешность для float
    return Math.abs(a - b) < EPSILON;
  }

  // ================= PREPARE =================
  async prepare(dto: ClickDto) {
    if (!process.env.CLICK_SECRET_KEY) {
      console.error("CLICK_SECRET_KEY is not set");
      return this.error(-99, "Internal server error");
    }

    const isValidSign = checkClickSign(dto, process.env.CLICK_SECRET_KEY);

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

    // prepare НЕ меняет состояние в БД
    return {
      click_trans_id: dto.click_trans_id,
      merchant_trans_id: dto.merchant_trans_id,
      error: 0,
      error_note: "Success",
    };
  }

  // ================= COMPLETE =================
  async complete(dto: ClickDto) {
    if (!process.env.CLICK_SECRET_KEY) {
      console.error("CLICK_SECRET_KEY is not set");
      return this.error(-99, "Internal server error");
    }

    const isValidSign = checkClickSign(dto, process.env.CLICK_SECRET_KEY);

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

    if (!payment.userId || !payment.courseId) {
      return this.error(-6, "Invalid payment data");
    }

    // ❗ если CLICK вернул ошибку
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

    // ✅ успешная оплата
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

        const updated = await tx.myCourse.updateMany({
          where: {
            userId: payment.userId!,
            courseId: payment.courseId!,
          },
          data: { status: Status.ACTIVE },
        });

        if (updated.count === 0) {
          console.warn(
            `No myCourse records updated for userId=${payment.userId} courseId=${payment.courseId}`,
          );
        }
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
