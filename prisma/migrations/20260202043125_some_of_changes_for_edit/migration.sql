-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "customerId" DROP NOT NULL,
ALTER COLUMN "totalAmount" DROP NOT NULL,
ALTER COLUMN "deliveryAddress" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL;
