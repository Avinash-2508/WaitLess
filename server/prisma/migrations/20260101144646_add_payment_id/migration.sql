-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "paymentId" TEXT;

-- CreateIndex
CREATE INDEX "Token_shopId_status_paymentId_idx" ON "Token"("shopId", "status", "paymentId");
