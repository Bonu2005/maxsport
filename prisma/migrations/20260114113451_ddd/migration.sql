/*
  Warnings:

  - A unique constraint covering the columns `[merchantTransId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Diplom" ADD COLUMN     "courseFinishedAt" TIMESTAMP(3),
ADD COLUMN     "issuedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_merchantTransId_key" ON "Payment"("merchantTransId");
