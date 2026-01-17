// src/payments/click-test.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "./dto/create-test-click.dto";


@Injectable()
export class ClickTestService {
    constructor(private prisma: PrismaService) { }

    async redirect(dto: Redirect, userId: string) {
        try {
            let order = await this.prisma.order.findFirst({ where: { id: dto.orderId } })
            if (!order) {
                return { message: "Order not found" }
            }
            let course = await this.prisma.course.findFirst({ where: { id: order.courseId } })
            if (!course) {
                return { message: "Course not found" }
            }

            const url = `https://my.click.uz/services/pay?service_id=${process.env.CLICK_SERVICE_ID}&merchant_id=${process.env.CLICK_MERCHANT_ID}&amount=${course.price}&transaction_param=${dto.orderId}&return_url=${dto.redirect_url_front}`
            return url
        } catch (error) {
            return error
        }
    }


}
