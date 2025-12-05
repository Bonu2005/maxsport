/*
  Warnings:

  - The `status` column on the `MyCourse` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MyCourseStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- AlterTable
ALTER TABLE "MyCourse" DROP COLUMN "status",
ADD COLUMN     "status" "MyCourseStatus" NOT NULL DEFAULT 'ACTIVE';
