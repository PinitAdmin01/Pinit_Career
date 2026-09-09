-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "batch15_arch_test";

-- CreateTable
CREATE TABLE "prisma_lab_customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "balance_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prisma_lab_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_lab_orders" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "total_cents" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prisma_lab_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_lab_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit_cents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "prisma_lab_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prisma_lab_customers_email_key" ON "prisma_lab_customers"("email");

-- AddForeignKey
ALTER TABLE "prisma_lab_orders" ADD CONSTRAINT "prisma_lab_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "prisma_lab_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_lab_order_items" ADD CONSTRAINT "prisma_lab_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "prisma_lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
