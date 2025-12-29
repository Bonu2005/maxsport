/*
  Warnings:

  - You are about to drop the `Branche` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Branche";

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mapLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);
