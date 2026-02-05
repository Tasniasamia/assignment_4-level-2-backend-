/*
  Warnings:

  - You are about to drop the column `isReviewed` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "isReviewed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "isReviewed";
