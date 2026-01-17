/*
  Warnings:

  - The `prepare_id` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "prepare_id",
ADD COLUMN     "prepare_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_prepare_id_key" ON "Payment"("prepare_id");
