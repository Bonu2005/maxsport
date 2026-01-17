// src/payments/click.service.ts
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Status } from "@prisma/client";
import { ClickDto } from "./dto/create-click.dto";
import { clickCheckToken } from "src/utils/click-utils";
import { randomUUID } from "crypto";


@Injectable()
export class ClickService {
  constructor(private prisma: PrismaService) { }

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

    const isValidSign = clickCheckToken(dto);

    if (!isValidSign) {
      console.warn("SIGN CHECK FAILED for", dto);
      return this.error(-1, "SIGN CHECK FAILED");
    }
    console.log(dto.action, typeof dto.action);
    
    if (dto.action !== 0) {
      return this.error(-3, "ACTION FAILED");
    }
    const order = await this.prisma.order.findUnique({
      where: { id: dto.merchant_trans_id },
    });
    if (!order) {
      return this.error(-6, "Order not found");
    }
    const course = await this.prisma.course.findUnique({
      where: { id: order.courseId }
    })
    if (!course) {
      return this.error(-8, "Course not found");
    }
    const user = await this.prisma.users.findUnique({
      where: { id: order.userId }
    })
    if (!user) {
      return this.error(-5, "User not found");
    }

    if (!this.isAmountEqual(course.price, dto.amount)) {
      return this.error(-2, "Incorrect amount");
    }

    const payment_ckeac = await this.prisma.payment.findUnique({ where: { merchantTransId: dto.merchant_trans_id } })
    // if (payment_ckeac) {
    //   return this.error(-4, "Этот трансакция уже заплочена");
    // }
    const prepareId = new Date().getTime()
    const payment = await this.prisma.payment.create({ data: { amount: course.price, clickTransId: dto.click_trans_id, merchantTransId: dto.merchant_trans_id, orderId: order.id, userId: order.userId, errorNote: dto.error_note, errorCode: dto.error, courseId: course.id ,prepare_id:prepareId} })
    if (payment.status == "INACTIVE") {
      return this.error(-9, "Этот трансакция была отменена");
    }
    // prepare НЕ меняет состояние в БД
    return {
      click_trans_id: dto.click_trans_id,
      merchant_trans_id: dto.merchant_trans_id,
      merchant_prepare_id:prepareId,
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
    const order = await this.prisma.order.findUnique({ where: { id: dto.merchant_trans_id } })
    if (!order) {
      return this.error(-6, "Заказ не найден");
    }

    const isValidSign = clickCheckToken(dto);

    if (!isValidSign) {
      console.warn("SIGN CHECK FAILED for", dto);
      return this.error(-1, "SIGN CHECK FAILED");
    }


    if (dto.action != 1) {
      return this.error(-3, "Действие не найдено");
    }

    if (!order.userId) {
      return this.error(-5, "Пользователь не найден");
    }
    const course = await this.prisma.course.findUnique({
      where: { id: order.courseId }
    })
    if (!course) {
      return this.error(-8, "Course not found");
    }
    const payment = await this.prisma.payment.findUnique({
      where: { merchantTransId: dto.merchant_trans_id },
    });
    console.log(payment);
    
    if (!payment) {
      return this.error(-5, "Payment not found");
    }

    if (payment.status == "ACTIVE" || payment.status == "COMPLETED") {
      return this.error(-4, "Транзакция подтверждена ");
    }

    if (payment.status == "INACTIVE") {
      return this.error(-9, "Транзакция не подтверждена ");
    }
    console.log(payment.prepare_id,dto.merchant_prepare_id);
    const l = `${dto.merchant_prepare_id}n`
    if (`${payment.prepare_id!}`== `${dto.merchant_prepare_id}n`) {
      return this.error(-6, "Транзакция не найдена ");
    }
    
    if (!this.isAmountEqual(course.price, dto.amount)) {
      return this.error(-2, "Incorrect amount");
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
            clickTransId: (dto.click_trans_id),
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
      merchant_trans_id: `merchant_${dto.merchant_trans_id}`,
       merchant_confirm_id: randomUUID(),
      error: 0,
      error_note: "Success",
    };
  }
}
