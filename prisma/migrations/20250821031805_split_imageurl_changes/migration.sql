/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "imageUrl",
ADD COLUMN     "imageExternalUrl" TEXT,
ADD COLUMN     "imageKey" TEXT;
