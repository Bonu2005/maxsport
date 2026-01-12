// src/payments/click-test.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { generateClickSign, checkClickSign } from "src/utils/click-utils";
import { ClickDto, PreparePaymentDto } from "./dto/create-test-click.dto";

@Injectable()
export class ClickTestService {
  constructor(private prisma: PrismaService) { }

  private error(code: number, note: string) {
    return { error: code, error_note: note };
  }

  // ================= PREPARE =================
  async prepare(dto: PreparePaymentDto, userId: string) {
    try {

      const merchant_trans_id = uuidv4();
      const order = await this.prisma.order.create({
        data: {
          userId,
          courseId: dto.courseId,
          status: Status.PENDING,
        },
      });
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          courseId: dto.courseId,
          amount: dto.amount,
          status: Status.PENDING,
          merchantTransId: merchant_trans_id,
          orderId: order.id,
        },
      });

      // 3. Генерируем подпись Click
      const sign = generateClickSign(
        {
          merchant_trans_id,
          amount: dto.amount,
          service_id: 1, // твой service_id
        },
        process.env.CLICK_SECRET_KEY!
      );

      // 4. Формируем ссылку на оплату
      const paymentUrl = `https://my.click.uz/services/pay?merchant_id=${process.env.CLICK_MERCHANT_ID}&merchant_trans_id=${merchant_trans_id}&amount=${dto.amount}&service_id=1&sign=${sign}`;

      return { paymentUrl };
    } catch (error) {
      console.error(error);
      return this.error(-99, "Internal server error");
    }
  }

  // ================= COMPLETE =================
  async complete(dto: ClickDto) {
    try {
      // 1. Проверяем подпись Click
      const isValidSign = checkClickSign(dto, process.env.CLICK_SECRET_KEY!);
      if (!isValidSign) return this.error(-1, "SIGN CHECK FAILED");

      // 2. Находим payment по merchant_trans_id
      const payment = await this.prisma.payment.findFirst({
        where: { merchantTransId: dto.merchant_trans_id },
      });
      if (!payment) return this.error(-5, "Payment not found");

      // 3. Проверяем сумму

      if (payment.amount !== dto.amount) return this.error(-2, "Incorrect amount");

      // 4. Если Click вернул ошибку
      if (dto.error && dto.error !== 0) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: Status.INACTIVE },
        });
        return this.error(dto.error, dto.error_note || "Unknown error");
      }

      // 5. Успешная оплата — обновляем payment, order, myCourse
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: Status.COMPLETED, clickTransId: String(dto.click_trans_id) },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: Status.COMPLETED },
        });

        await tx.myCourse.updateMany({
          where: { userId: payment.userId!, courseId: payment.courseId! },
          data: { status: Status.ACTIVE },
        });
      });

      return { click_trans_id: dto.click_trans_id, merchant_trans_id: dto.merchant_trans_id, error: 0, error_note: "Success" };
    } catch (error) {
      console.error(error);
      return this.error(-99, "Internal server error");
    }
  }
}
