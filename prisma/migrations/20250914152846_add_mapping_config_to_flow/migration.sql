-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB NOT NULL,
    "mappingConfig" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "flowType" TEXT,
    "targetUrl" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Flow_createdBy_idx" ON "Flow"("createdBy");

-- CreateIndex
CREATE INDEX "Flow_isActive_idx" ON "Flow"("isActive");

-- CreateIndex
CREATE INDEX "Flow_flowType_idx" ON "Flow"("flowType");

-- CreateIndex
CREATE INDEX "Flow_targetUrl_idx" ON "Flow"("targetUrl");

-- CreateIndex
CREATE INDEX "Flow_isLive_idx" ON "Flow"("isLive");
