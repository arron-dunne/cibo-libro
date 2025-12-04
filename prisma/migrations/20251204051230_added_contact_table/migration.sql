-- CreateEnum
CREATE TYPE "UserContactType" AS ENUM ('FEEDBACK', 'BUG', 'DMCA', 'REPORT', 'GENERAL');

-- CreateTable
CREATE TABLE "UserContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "contactType" "UserContactType" NOT NULL DEFAULT 'GENERAL',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserContact_contactType_idx" ON "UserContact"("contactType");

-- CreateIndex
CREATE INDEX "UserContact_userId_idx" ON "UserContact"("userId");

-- AddForeignKey
ALTER TABLE "UserContact" ADD CONSTRAINT "UserContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
