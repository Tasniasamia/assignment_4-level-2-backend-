/*
  Warnings:

  - Made the column `description` on table `ProviderProfiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProviderProfiles" ALTER COLUMN "description" SET NOT NULL;
