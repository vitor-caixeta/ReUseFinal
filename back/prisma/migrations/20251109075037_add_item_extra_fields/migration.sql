-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "openToTrade" BOOLEAN,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "usageTime" TEXT;
