/*
  Warnings:

  - You are about to alter the column `content` on the `CV` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `messages` on the `ChatHistory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `notes` on the `JobApplication` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `description` on the `JobPosting` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `requirements` on the `JobPosting` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `content` on the `Letter` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `metadata` on the `SessionAnalytics` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `styles` on the `Template` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `features` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usageQuotas` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentType" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "changes" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChangeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "settings" JSONB NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "stripeCustomerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrganizationUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "permissions" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrganizationUser_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuestionConfigVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "configId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "questions" JSONB NOT NULL,
    "changes" JSONB,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionConfigVersion_configId_fkey" FOREIGN KEY ("configId") REFERENCES "QuestionConfiguration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CV" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "template" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    "category" TEXT,
    "keywords" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CV" ("content", "createdAt", "downloadCount", "id", "isArchived", "isPublic", "parentId", "template", "title", "updatedAt", "userId", "version", "viewCount") SELECT "content", "createdAt", "downloadCount", "id", "isArchived", "isPublic", "parentId", "template", "title", "updatedAt", "userId", "version", "viewCount" FROM "CV";
DROP TABLE "CV";
ALTER TABLE "new_CV" RENAME TO "CV";
CREATE INDEX "CV_userId_idx" ON "CV"("userId");
CREATE INDEX "CV_template_idx" ON "CV"("template");
CREATE INDEX "CV_createdAt_idx" ON "CV"("createdAt");
CREATE TABLE "new_ChatHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messages" JSONB NOT NULL,
    "questionIndex" INTEGER NOT NULL DEFAULT 0,
    "accountDataPreference" TEXT,
    "cvId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatHistory_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatHistory" ("accountDataPreference", "createdAt", "cvId", "id", "messages", "questionIndex", "updatedAt") SELECT "accountDataPreference", "createdAt", "cvId", "id", "messages", "questionIndex", "updatedAt" FROM "ChatHistory";
DROP TABLE "ChatHistory";
ALTER TABLE "new_ChatHistory" RENAME TO "ChatHistory";
CREATE UNIQUE INDEX "ChatHistory_cvId_key" ON "ChatHistory"("cvId");
CREATE INDEX "ChatHistory_cvId_idx" ON "ChatHistory"("cvId");
CREATE INDEX "ChatHistory_createdAt_idx" ON "ChatHistory"("createdAt");
CREATE TABLE "new_JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "appliedDate" DATETIME,
    "deadline" DATETIME,
    "salary" TEXT,
    "notes" JSONB,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "followUpDate" DATETIME,
    "interviewDate" DATETIME,
    "offerDate" DATETIME,
    "rejectionDate" DATETIME,
    "userId" TEXT NOT NULL,
    "jobPostingId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JobApplication_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JobApplication" ("appliedDate", "contactEmail", "contactName", "contactPhone", "createdAt", "deadline", "followUpDate", "id", "interviewDate", "jobPostingId", "notes", "offerDate", "priority", "rejectionDate", "salary", "status", "title", "updatedAt", "userId") SELECT "appliedDate", "contactEmail", "contactName", "contactPhone", "createdAt", "deadline", "followUpDate", "id", "interviewDate", "jobPostingId", "notes", "offerDate", "priority", "rejectionDate", "salary", "status", "title", "updatedAt", "userId" FROM "JobApplication";
DROP TABLE "JobApplication";
ALTER TABLE "new_JobApplication" RENAME TO "JobApplication";
CREATE INDEX "JobApplication_userId_idx" ON "JobApplication"("userId");
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");
CREATE INDEX "JobApplication_priority_idx" ON "JobApplication"("priority");
CREATE INDEX "JobApplication_appliedDate_idx" ON "JobApplication"("appliedDate");
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");
CREATE TABLE "new_JobPosting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "description" JSONB,
    "requirements" JSONB,
    "salary" TEXT,
    "jobType" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "sourceUrl" TEXT,
    "jobId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobPosting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JobPosting" ("company", "createdAt", "description", "id", "isActive", "isArchived", "jobId", "jobType", "location", "remote", "requirements", "salary", "source", "sourceUrl", "title", "updatedAt", "userId") SELECT "company", "createdAt", "description", "id", "isActive", "isArchived", "jobId", "jobType", "location", "remote", "requirements", "salary", "source", "sourceUrl", "title", "updatedAt", "userId" FROM "JobPosting";
DROP TABLE "JobPosting";
ALTER TABLE "new_JobPosting" RENAME TO "JobPosting";
CREATE INDEX "JobPosting_userId_idx" ON "JobPosting"("userId");
CREATE INDEX "JobPosting_company_idx" ON "JobPosting"("company");
CREATE INDEX "JobPosting_isActive_idx" ON "JobPosting"("isActive");
CREATE INDEX "JobPosting_createdAt_idx" ON "JobPosting"("createdAt");
CREATE TABLE "new_Letter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "cvText" TEXT,
    "template" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Letter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Letter" ("content", "createdAt", "cvText", "downloadCount", "id", "isArchived", "isPublic", "parentId", "template", "title", "updatedAt", "userId", "version", "viewCount") SELECT "content", "createdAt", "cvText", "downloadCount", "id", "isArchived", "isPublic", "parentId", "template", "title", "updatedAt", "userId", "version", "viewCount" FROM "Letter";
DROP TABLE "Letter";
ALTER TABLE "new_Letter" RENAME TO "Letter";
CREATE INDEX "Letter_userId_idx" ON "Letter"("userId");
CREATE INDEX "Letter_template_idx" ON "Letter"("template");
CREATE INDEX "Letter_createdAt_idx" ON "Letter"("createdAt");
CREATE TABLE "new_SessionAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "action" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SessionAnalytics" ("action", "createdAt", "id", "metadata", "page", "sessionId", "userId") SELECT "action", "createdAt", "id", "metadata", "page", "sessionId", "userId" FROM "SessionAnalytics";
DROP TABLE "SessionAnalytics";
ALTER TABLE "new_SessionAnalytics" RENAME TO "SessionAnalytics";
CREATE INDEX "SessionAnalytics_userId_idx" ON "SessionAnalytics"("userId");
CREATE INDEX "SessionAnalytics_sessionId_idx" ON "SessionAnalytics"("sessionId");
CREATE INDEX "SessionAnalytics_createdAt_idx" ON "SessionAnalytics"("createdAt");
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "plan" TEXT NOT NULL DEFAULT 'free',
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "features" JSONB NOT NULL,
    "usageQuotas" JSONB NOT NULL,
    "billingHistory" JSONB,
    "aiRequestsUsed" INTEGER NOT NULL DEFAULT 0,
    "aiRequestsLimit" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("aiRequestsLimit", "aiRequestsUsed", "cancelAtPeriodEnd", "createdAt", "currentPeriodEnd", "currentPeriodStart", "id", "plan", "status", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "updatedAt", "userId") SELECT "aiRequestsLimit", "aiRequestsUsed", "cancelAtPeriodEnd", "createdAt", "currentPeriodEnd", "currentPeriodStart", "id", "plan", "status", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "preview" TEXT,
    "styles" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("createdAt", "description", "id", "isOfficial", "isPremium", "isPublic", "name", "preview", "rating", "styles", "updatedAt", "usageCount", "userId") SELECT "createdAt", "description", "id", "isOfficial", "isPremium", "isPublic", "name", "preview", "rating", "styles", "updatedAt", "usageCount", "userId" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE INDEX "Template_isPublic_idx" ON "Template"("isPublic");
CREATE INDEX "Template_isPremium_idx" ON "Template"("isPremium");
CREATE INDEX "Template_usageCount_idx" ON "Template"("usageCount");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "ChangeLog_documentType_idx" ON "ChangeLog"("documentType");

-- CreateIndex
CREATE INDEX "ChangeLog_documentId_idx" ON "ChangeLog"("documentId");

-- CreateIndex
CREATE INDEX "ChangeLog_version_idx" ON "ChangeLog"("version");

-- CreateIndex
CREATE INDEX "ChangeLog_createdAt_idx" ON "ChangeLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeCustomerId_key" ON "Organization"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_plan_idx" ON "Organization"("plan");

-- CreateIndex
CREATE INDEX "OrganizationUser_organizationId_idx" ON "OrganizationUser"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationUser_userId_idx" ON "OrganizationUser"("userId");

-- CreateIndex
CREATE INDEX "OrganizationUser_role_idx" ON "OrganizationUser"("role");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_organizationId_userId_key" ON "OrganizationUser"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionConfiguration_name_key" ON "QuestionConfiguration"("name");

-- CreateIndex
CREATE INDEX "QuestionConfiguration_type_idx" ON "QuestionConfiguration"("type");

-- CreateIndex
CREATE INDEX "QuestionConfiguration_isActive_idx" ON "QuestionConfiguration"("isActive");

-- CreateIndex
CREATE INDEX "QuestionConfiguration_isDefault_idx" ON "QuestionConfiguration"("isDefault");

-- CreateIndex
CREATE INDEX "QuestionConfigVersion_configId_idx" ON "QuestionConfigVersion"("configId");

-- CreateIndex
CREATE INDEX "QuestionConfigVersion_createdAt_idx" ON "QuestionConfigVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionConfigVersion_configId_version_key" ON "QuestionConfigVersion"("configId", "version");
