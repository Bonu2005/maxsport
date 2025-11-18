/*
  Warnings:

  - The `image` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `img` column on the `Diplom` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `img` column on the `HomeWork` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `video` column on the `HomeWork` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `img` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `img` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- AlterTable
ALTER TABLE "Diplom" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];

-- AlterTable
ALTER TABLE "HomeWork" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[],
DROP COLUMN "video",
ADD COLUMN     "video" TEXT[];

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "img" TEXT[];

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];
