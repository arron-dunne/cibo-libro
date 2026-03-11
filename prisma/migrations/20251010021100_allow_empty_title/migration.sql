/*
  Warnings:

  - Made the column `note` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Recipe" ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "note" SET NOT NULL,
ALTER COLUMN "note" SET DEFAULT '';
