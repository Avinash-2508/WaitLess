-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "avgServiceTime" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "pauseState" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "counterId" TEXT;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "counterId" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Counter_shopId_idx" ON "Counter"("shopId");

-- CreateIndex
CREATE INDEX "Counter_shopId_isActive_idx" ON "Counter"("shopId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Counter_shopId_number_key" ON "Counter"("shopId", "number");

-- CreateIndex
CREATE INDEX "Staff_counterId_idx" ON "Staff"("counterId");

-- CreateIndex
CREATE INDEX "Token_counterId_idx" ON "Token"("counterId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_counterId_fkey" FOREIGN KEY ("counterId") REFERENCES "Counter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_counterId_fkey" FOREIGN KEY ("counterId") REFERENCES "Counter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
