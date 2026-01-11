-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "clickTransId" TEXT,
ADD COLUMN     "errorCode" INTEGER,
ADD COLUMN     "errorNote" TEXT,
ADD COLUMN     "merchantTransId" TEXT;
