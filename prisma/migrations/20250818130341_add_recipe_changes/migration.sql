-- CreateEnum
CREATE TYPE "public"."RecipeStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "public"."Recipe" ADD COLUMN     "cookMins" INTEGER,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "prepMins" INTEGER,
ADD COLUMN     "servings" INTEGER,
ADD COLUMN     "status" "public"."RecipeStatus" NOT NULL DEFAULT 'PUBLISHED';
