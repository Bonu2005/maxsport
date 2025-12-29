-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FINISHED');

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'DRAFT';
