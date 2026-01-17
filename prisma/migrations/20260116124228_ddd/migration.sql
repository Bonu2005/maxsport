/*
  Warnings:

  - A unique constraint covering the columns `[prepare_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "prepare_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_prepare_id_key" ON "Payment"("prepare_id");
