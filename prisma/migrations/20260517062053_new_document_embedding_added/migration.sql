-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "documentEmbeddingAdmin" (
    "id" TEXT NOT NULL,
    "chunkey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector(2048) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentEmbeddingAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentEmbeddingProvider" (
    "id" TEXT NOT NULL,
    "chunkey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector(2048) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentEmbeddingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentEmbeddingCustomer" (
    "id" TEXT NOT NULL,
    "chunkey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector(2048) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentEmbeddingCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documentEmbeddingAdmin_chunkey_key" ON "documentEmbeddingAdmin"("chunkey");

-- CreateIndex
CREATE INDEX "idx_admin_sourceType" ON "documentEmbeddingAdmin"("sourceType");

-- CreateIndex
CREATE INDEX "idx_admin_sourceId" ON "documentEmbeddingAdmin"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "documentEmbeddingProvider_chunkey_key" ON "documentEmbeddingProvider"("chunkey");

-- CreateIndex
CREATE INDEX "idx_provider_sourceType" ON "documentEmbeddingProvider"("sourceType");

-- CreateIndex
CREATE INDEX "idx_provider_sourceId" ON "documentEmbeddingProvider"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "documentEmbeddingCustomer_chunkey_key" ON "documentEmbeddingCustomer"("chunkey");

-- CreateIndex
CREATE INDEX "idx_customer_sourceType" ON "documentEmbeddingCustomer"("sourceType");

-- CreateIndex
CREATE INDEX "idx_customer_sourceId" ON "documentEmbeddingCustomer"("sourceId");
