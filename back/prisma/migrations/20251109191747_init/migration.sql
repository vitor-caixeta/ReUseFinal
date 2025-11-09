-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
