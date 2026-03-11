/*
  Warnings:

  - The values [EXTERNAL] on the enum `RecipeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RecipeType_new" AS ENUM ('OWNED', 'EXTERNAL_FULL', 'EXTERNAL_LINK');
ALTER TABLE "public"."Recipe" ALTER COLUMN "type" TYPE "public"."RecipeType_new" USING ("type"::text::"public"."RecipeType_new");
ALTER TYPE "public"."RecipeType" RENAME TO "RecipeType_old";
ALTER TYPE "public"."RecipeType_new" RENAME TO "RecipeType";
DROP TYPE "public"."RecipeType_old";
COMMIT;
