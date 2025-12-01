-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProcareSyncStatus" AS ENUM ('NOT_SENT', 'PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteKey" TEXT NOT NULL,
    "status" "AppStatus" NOT NULL DEFAULT 'DRAFT',
    "procareSyncStatus" "ProcareSyncStatus" NOT NULL DEFAULT 'NOT_SENT',
    "childData" JSONB NOT NULL,
    "guardiansData" JSONB NOT NULL,
    "otherData" JSONB,
    "hasPaid" BOOLEAN NOT NULL DEFAULT false,
    "stripePaymentId" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
