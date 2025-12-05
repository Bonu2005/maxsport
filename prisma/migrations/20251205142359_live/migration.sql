/*
  Warnings:

  - Added the required column `Course_Benefits_Sheet` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Course_duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Number_of_lessons` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "Course_Benefits_Sheet" TEXT NOT NULL,
ADD COLUMN     "Course_duration" TEXT NOT NULL,
ADD COLUMN     "Number_of_lessons" TEXT NOT NULL,
ADD COLUMN     "Training_format" TEXT NOT NULL DEFAULT 'OFFLINE';
