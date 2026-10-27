/*
  Warnings:

  - A unique constraint covering the columns `[liveUrl]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_liveUrl_key" ON "Project"("liveUrl");
