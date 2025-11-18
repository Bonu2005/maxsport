/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Email_verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `Email_verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email_verification" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Email_verification_phoneNumber_key" ON "Email_verification"("phoneNumber");
