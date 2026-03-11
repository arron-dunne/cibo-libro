-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."RecipeType" ADD VALUE 'EXTERNAL_FULL';
ALTER TYPE "public"."RecipeType" ADD VALUE 'EXTERNAL_LINK';
