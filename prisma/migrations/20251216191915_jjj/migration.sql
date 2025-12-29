/*
  Warnings:

  - Added the required column `name` to the `HomeWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HomeWork" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "title" TEXT NOT NULL;
