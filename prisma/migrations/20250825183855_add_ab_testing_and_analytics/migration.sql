/*
  Warnings:

  - You are about to drop the `ApplicationDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChangeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileUpload` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobPosting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `newValues` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `oldValues` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `downloadCount` on the `CV` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `CV` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `CV` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `CV` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `CV` table. All the data in the column will be lost.
  - You are about to drop the column `cvText` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `downloadCount` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `aiRequestsLimit` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `aiRequestsUsed` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `billingCycle` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `cancelAtPeriodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `usageQuotas` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `websiteUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `Letter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApplicationDocument_createdAt_idx";

-- DropIndex
DROP INDEX "ApplicationDocument_type_idx";

-- DropIndex
DROP INDEX "ApplicationDocument_applicationId_idx";

-- DropIndex
DROP INDEX "ChangeLog_createdAt_idx";

-- DropIndex
DROP INDEX "ChangeLog_version_idx";

-- DropIndex
DROP INDEX "ChangeLog_documentId_idx";

-- DropIndex
DROP INDEX "ChangeLog_documentType_idx";

-- DropIndex
DROP INDEX "ChatHistory_createdAt_idx";

-- DropIndex
DROP INDEX "ChatHistory_cvId_idx";

-- DropIndex
DROP INDEX "ChatHistory_cvId_key";

-- DropIndex
DROP INDEX "FileUpload_cvId_idx";

-- DropIndex
DROP INDEX "FileUpload_userId_idx";

-- DropIndex
DROP INDEX "JobApplication_createdAt_idx";

-- DropIndex
DROP INDEX "JobApplication_appliedDate_idx";

-- DropIndex
DROP INDEX "JobApplication_priority_idx";

-- DropIndex
DROP INDEX "JobApplication_status_idx";

-- DropIndex
DROP INDEX "JobApplication_userId_idx";

-- DropIndex
DROP INDEX "JobPosting_createdAt_idx";

-- DropIndex
DROP INDEX "JobPosting_isActive_idx";

-- DropIndex
DROP INDEX "JobPosting_company_idx";

-- DropIndex
DROP INDEX "JobPosting_userId_idx";

-- DropIndex
DROP INDEX "Organization_plan_idx";

-- DropIndex
DROP INDEX "Organization_slug_idx";

-- DropIndex
DROP INDEX "Organization_stripeCustomerId_key";

-- DropIndex
DROP INDEX "Organization_slug_key";

-- DropIndex
DROP INDEX "OrganizationUser_organizationId_userId_key";

-- DropIndex
DROP INDEX "OrganizationUser_role_idx";

-- DropIndex
DROP INDEX "OrganizationUser_userId_idx";

-- DropIndex
DROP INDEX "OrganizationUser_organizationId_idx";

-- DropIndex
DROP INDEX "SessionAnalytics_createdAt_idx";

-- DropIndex
DROP INDEX "SessionAnalytics_sessionId_idx";

-- DropIndex
DROP INDEX "SessionAnalytics_userId_idx";

-- DropIndex
DROP INDEX "Template_usageCount_idx";

-- DropIndex
DROP INDEX "Template_isPremium_idx";

-- DropIndex
DROP INDEX "Template_isPublic_idx";

-- DropIndex
DROP INDEX "UserPreferences_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApplicationDocument";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChangeLog";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChatHistory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FileUpload";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JobApplication";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JobPosting";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Organization";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrganizationUser";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SessionAnalytics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Template";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPreferences";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ABTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "configAId" TEXT NOT NULL,
    "configBId" TEXT NOT NULL,
    "trafficSplit" INTEGER NOT NULL DEFAULT 50,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metrics" JSONB,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ABTest_configAId_fkey" FOREIGN KEY ("configAId") REFERENCES "QuestionConfiguration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ABTest_configBId_fkey" FOREIGN KEY ("configBId") REFERENCES "QuestionConfiguration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ABTestParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "metrics" JSONB,
    CONSTRAINT "ABTestParticipant_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ABTest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConditionalQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "showIf" TEXT NOT NULL DEFAULT 'all',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConditionalQuestion_configId_fkey" FOREIGN KEY ("configId") REFERENCES "QuestionConfiguration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "dependsOn" JSONB NOT NULL,
    "requiredAnswers" JSONB,
    "skipIf" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuestionDependency_configId_fkey" FOREIGN KEY ("configId") REFERENCES "QuestionConfiguration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "skips" INTEGER NOT NULL DEFAULT 0,
    "avgTime" REAL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionAnalytics_configId_fkey" FOREIGN KEY ("configId") REFERENCES "QuestionConfiguration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PerformanceMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operation" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_AuditLog" ("action", "changes", "entityType", "id", "ipAddress", "userAgent", "userId") SELECT "action", "changes", "entityType", "id", "ipAddress", "userAgent", "userId" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");
CREATE TABLE "new_CV" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "template" TEXT,
    "content" JSONB NOT NULL,
    "tags" TEXT,
    "category" TEXT,
    "keywords" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CV" ("category", "content", "createdAt", "id", "isPublic", "keywords", "tags", "template", "title", "updatedAt", "userId") SELECT "category", "content", "createdAt", "id", "isPublic", "keywords", "tags", "template", "title", "updatedAt", "userId" FROM "CV";
DROP TABLE "CV";
ALTER TABLE "new_CV" RENAME TO "CV";
CREATE TABLE "new_Letter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'cover',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Letter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Letter" ("content", "createdAt", "id", "title", "updatedAt", "userId", "type") SELECT "content", "createdAt", "id", "title", "updatedAt", "userId", 'cover' FROM "Letter";
DROP TABLE "Letter";
ALTER TABLE "new_Letter" RENAME TO "Letter";
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" DATETIME,
    "billingHistory" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Subscription" ("billingHistory", "createdAt", "id", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "updatedAt", "userId") SELECT "billingHistory", "createdAt", "id", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "image", "name", "updatedAt") SELECT "createdAt", "email", "id", "image", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ABTest_isActive_idx" ON "ABTest"("isActive");

-- CreateIndex
CREATE INDEX "ABTest_startDate_idx" ON "ABTest"("startDate");

-- CreateIndex
CREATE INDEX "ABTest_endDate_idx" ON "ABTest"("endDate");

-- CreateIndex
CREATE INDEX "ABTestParticipant_testId_idx" ON "ABTestParticipant"("testId");

-- CreateIndex
CREATE INDEX "ABTestParticipant_userId_idx" ON "ABTestParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ABTestParticipant_testId_userId_key" ON "ABTestParticipant"("testId", "userId");

-- CreateIndex
CREATE INDEX "ConditionalQuestion_configId_idx" ON "ConditionalQuestion"("configId");

-- CreateIndex
CREATE INDEX "ConditionalQuestion_questionId_idx" ON "ConditionalQuestion"("questionId");

-- CreateIndex
CREATE INDEX "ConditionalQuestion_isActive_idx" ON "ConditionalQuestion"("isActive");

-- CreateIndex
CREATE INDEX "QuestionDependency_configId_idx" ON "QuestionDependency"("configId");

-- CreateIndex
CREATE INDEX "QuestionDependency_questionId_idx" ON "QuestionDependency"("questionId");

-- CreateIndex
CREATE INDEX "QuestionDependency_isActive_idx" ON "QuestionDependency"("isActive");

-- CreateIndex
CREATE INDEX "QuestionAnalytics_configId_idx" ON "QuestionAnalytics"("configId");

-- CreateIndex
CREATE INDEX "QuestionAnalytics_questionId_idx" ON "QuestionAnalytics"("questionId");

-- CreateIndex
CREATE INDEX "QuestionAnalytics_date_idx" ON "QuestionAnalytics"("date");

-- CreateIndex
CREATE INDEX "PerformanceMetric_operation_idx" ON "PerformanceMetric"("operation");

-- CreateIndex
CREATE INDEX "PerformanceMetric_timestamp_idx" ON "PerformanceMetric"("timestamp");
