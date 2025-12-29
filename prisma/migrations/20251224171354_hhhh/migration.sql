-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "startsAt" TIMESTAMP(3),
ADD COLUMN     "status" "LessonStatus" NOT NULL DEFAULT 'DRAFT';
