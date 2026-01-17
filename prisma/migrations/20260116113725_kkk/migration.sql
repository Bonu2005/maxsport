/*
  Warnings:

  - The `clickTransId` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "clickTransId",
ADD COLUMN     "clickTransId" INTEGER;
