-- DropIndex
DROP INDEX "Buyer_phone_key";

-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'password';
