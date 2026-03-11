/*
  Warnings:

  - A unique constraint covering the columns `[imageKey]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipe_imageKey_key" ON "public"."Recipe"("imageKey");
