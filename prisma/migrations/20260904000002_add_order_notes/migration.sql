-- AlterTable
ALTER TABLE "prisma_lab_orders" ADD COLUMN "notes" TEXT NOT NULL DEFAULT '', ADD COLUMN "discount_cents" INTEGER NOT NULL DEFAULT 0;
