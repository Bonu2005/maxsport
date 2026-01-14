/*
  Warnings:

  - A unique constraint covering the columns `[codeDiplom]` on the table `Diplom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Diplom_codeDiplom_key" ON "Diplom"("codeDiplom");
