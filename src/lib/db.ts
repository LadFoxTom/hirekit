// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import type { CVData } from '@/types/cv'
import type { LetterData } from '@/types/letter'
import crypto from 'crypto'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy-load Prisma client to prevent build-time database connection
function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

// CV Service
export class CVService {
  static async createCV(userId: string, title: string, content: CVData, template: string, chatHistory?: {
    messages: Array<{ role: 'user' | 'assistant', content: string }>
    questionIndex: number
    accountDataPreference?: 'yes' | 'no' | null
  }) {
    const prisma = getPrisma()
    
    // Validate content before saving
    const contentKeys = content ? Object.keys(content) : []
    console.log('[CVService.createCV] Creating CV:', { 
      userId, 
      title, 
      template, 
      contentKeys,
      hasFullName: !!content?.fullName,
      fullName: content?.fullName
    })
    
    if (!content || contentKeys.length === 0) {
      console.warn('[CVService.createCV] WARNING: Attempting to create CV with empty content!')
    }
    
    const cv = await (prisma as any).cV.create({
      data: {
        title,
        content: JSON.stringify(content), // Convert to JSON string for SQLite
        template,
        userId,
      },
    })

    console.log('[CVService.createCV] ✅ CV created successfully with ID:', cv.id)

    return cv
  }

  static async updateCV(cvId: string, userId: string, updates: Partial<CVData>, chatHistory?: {
    messages: Array<{ role: 'user' | 'assistant', content: string }>
    questionIndex: number
    accountDataPreference?: 'yes' | 'no' | null
  }) {
    const prisma = getPrisma()
    
    // Validate content before saving
    const contentKeys = updates ? Object.keys(updates) : []
    console.log('[CVService.updateCV] Updating CV:', { 
      cvId, 
      userId, 
      contentKeys,
      hasFullName: !!(updates as any)?.fullName,
      fullName: (updates as any)?.fullName
    })
    
    if (!updates || contentKeys.length === 0) {
      console.warn('[CVService.updateCV] WARNING: Attempting to update CV with empty content!')
    }
    
    const cv = await prisma.cV.update({
      where: {
        id: cvId,
        userId, // Ensure user owns the CV
      },
      data: {
        content: JSON.stringify(updates), // Convert to JSON string for SQLite
        updatedAt: new Date(),
      },
    })

    console.log('[CVService.updateCV] ✅ CV updated successfully:', cvId)

    return cv
  }

  static async getCV(cvId: string, userId: string) {
    const prisma = getPrisma()
    const cv = await prisma.cV.findFirst({
      where: {
        id: cvId,
        userId,
      },
    })
    
    if (cv && cv.content) {
      // Parse JSON string back to object
      const result = {
        ...cv,
        content: JSON.parse(cv.content as string)
      }
      
      return result
    }
    
    return cv
  }

  static async getUserCVs(userId: string) {
    const prisma = getPrisma()
    const cvs = await prisma.cV.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    // Parse JSON strings back to objects
    return cvs.map((cv) => ({
      ...cv,
      content: cv.content ? JSON.parse(cv.content as string) : {}
    }))
  }

  static async deleteCV(cvId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.cV.delete({
      where: {
        id: cvId,
        userId,
      },
    })
  }

  static async archiveCV(cvId: string, userId: string) {
    // Note: isArchived field doesn't exist in current schema
    // Delete the CV instead of archiving
    const prisma = getPrisma()
    return await prisma.cV.delete({
      where: {
        id: cvId,
        userId,
      },
    })
  }

  static async incrementViewCount(cvId: string) {
    // Note: viewCount field doesn't exist in current schema
    // This is a no-op for now
    console.log(`View count increment requested for CV ${cvId}`)
    return null
  }

  static async incrementDownloadCount(cvId: string) {
    // Note: downloadCount field doesn't exist in current schema
    // This is a no-op for now
    console.log(`Download count increment requested for CV ${cvId}`)
    return null
  }
}

// Letter Service
export class LetterService {
  static async createLetter(userId: string, title: string, content: LetterData, type: string = 'cover', cvText?: string) {
    const prisma = getPrisma()
    
    // Create letter using Prisma (schema has: id, userId, title, content, type, createdAt, updatedAt)
    return await prisma.letter.create({
      data: {
        title,
        content: JSON.stringify(content),
        type,
        userId,
      },
    })
  }

  static async updateLetter(letterId: string, userId: string, updates: Partial<LetterData>) {
    const prisma = getPrisma()
    return await prisma.letter.update({
      where: {
        id: letterId,
        userId,
      },
      data: {
        content: JSON.stringify(updates), // Convert to JSON string for SQLite
        updatedAt: new Date(),
      },
    })
  }

  static async getLetter(letterId: string, userId: string) {
    const prisma = getPrisma()
    const letter = await prisma.letter.findFirst({
      where: {
        id: letterId,
        userId,
      },
    })
    
    if (letter && letter.content) {
      // Parse JSON string back to object
      return {
        ...letter,
        content: JSON.parse(letter.content as string)
      }
    }
    
    return letter
  }

  static async getUserLetters(userId: string) {
    const prisma = getPrisma()
    const letters = await prisma.letter.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    // Parse JSON strings back to objects
    return letters.map(letter => ({
      ...letter,
      content: letter.content ? JSON.parse(letter.content as string) : {}
    }))
  }

  static async deleteLetter(letterId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.letter.delete({
      where: {
        id: letterId,
        userId,
      },
    })
  }

  static async archiveLetter(letterId: string, userId: string) {
    // Note: isArchived field doesn't exist in current schema
    // Delete the letter instead of archiving
    const prisma = getPrisma()
    return await prisma.letter.delete({
      where: {
        id: letterId,
        userId,
      },
    })
  }

  static async incrementViewCount(letterId: string) {
    // Note: viewCount field doesn't exist in current schema
    console.log(`View count increment requested for Letter ${letterId}`)
    return null
  }

  static async incrementDownloadCount(letterId: string) {
    // Note: downloadCount field doesn't exist in current schema
    console.log(`Download count increment requested for Letter ${letterId}`)
    return null
  }
}

// User Service
export class UserService {
  static async getUser(userId: string) {
    const prisma = getPrisma()
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        subscription: true,
      },
    })
  }

  static async getUserByStripeCustomerId(stripeCustomerId: string) {
    const prisma = getPrisma()
    return await prisma.user.findFirst({
      where: {
        subscription: {
          stripeCustomerId: stripeCustomerId
        }
      },
      include: {
        preferences: true,
        subscription: true,
      },
    })
  }

  static async createUserPreferences(userId: string) {
    const prisma = getPrisma()
    return await prisma.userPreferences.create({
      data: {
        userId,
      },
    })
  }

  static async updateUserPreferences(userId: string, preferences: any) {
    const prisma = getPrisma()
    return await prisma.userPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    })
  }

  static async getUserSubscription(userId: string) {
    const prisma = getPrisma()
    return await prisma.subscription.findUnique({
      where: { userId },
    })
  }

  static async createSubscription(userId: string, stripeCustomerId: string) {
    const prisma = getPrisma()
    return await (prisma as any).subscription.create({
      data: {
        userId,
        stripeCustomerId,
        features: {},
        usageQuotas: {},
      },
    })
  }

  static async updateSubscription(userId: string, updates: any) {
    const prisma = getPrisma()
    return await prisma.subscription.update({
      where: { userId },
      data: updates,
    })
  }

  static async incrementAIRequests(userId: string) {
    const prisma = getPrisma()
    return await prisma.subscription.update({
      where: { userId },
      data: {
        aiRequestsUsed: {
          increment: 1,
        },
      },
    })
  }

  static async canUseAI(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId)
    if (!subscription) return false
    
    // Free tier: 3 requests per week
    if (subscription.plan === 'free') {
      return subscription.aiRequestsUsed < subscription.aiRequestsLimit
    }
    
    // Pro/Team: unlimited
    return true
  }
}

// Template Service
export class TemplateService {
  static async getOfficialTemplates() {
    const prisma = getPrisma()
    return await prisma.template.findMany({
      where: {
        isOfficial: true,
      },
      orderBy: {
        usageCount: 'desc',
      },
    })
  }

  static async getPublicTemplates() {
    const prisma = getPrisma()
    return await prisma.template.findMany({
      where: {
        isPublic: true,
        isOfficial: false,
      },
      orderBy: {
        usageCount: 'desc',
      },
    })
  }

  static async getUserTemplates(userId: string) {
    const prisma = getPrisma()
    return await prisma.template.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async createTemplate(userId: string, templateData: any) {
    const prisma = getPrisma()
    return await prisma.template.create({
      data: {
        ...templateData,
        userId,
      },
    })
  }

  static async incrementTemplateUsage(templateId: string) {
    const prisma = getPrisma()
    return await prisma.template.update({
      where: { id: templateId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    })
  }
}

// Analytics Service
export class AnalyticsService {
  static async trackSession(userId: string, sessionId: string, page: string, action?: string, metadata?: any) {
    const prisma = getPrisma()
    return await prisma.sessionAnalytics.create({
      data: {
        userId,
        sessionId,
        page,
        action,
        metadata: metadata as any,
      },
    })
  }

  static async getCVStats(cvId: string) {
    const prisma = getPrisma()
    return await prisma.cV.findUnique({
      where: { id: cvId },
      select: {
        viewCount: true,
        downloadCount: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}

// File Upload Service
export class FileUploadService {
  static async createFileUpload(userId: string, filename: string, url: string, size: number, mimeType: string, cvId?: string) {
    const prisma = getPrisma()
    return await prisma.fileUpload.create({
      data: {
        userId,
        filename,
        url,
        size,
        mimeType,
        cvId,
      },
    })
  }

  static async getUserFiles(userId: string) {
    const prisma = getPrisma()
    return await prisma.fileUpload.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async deleteFileUpload(fileId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.fileUpload.delete({
      where: {
        id: fileId,
        userId,
      },
    })
  }
} 

// Job Posting Service
export class JobPostingService {
  static async createJobPosting(userId: string, data: {
    title: string
    company: string
    location?: string
    description?: string
    requirements?: string
    salary?: string
    jobType?: string
    remote?: boolean
    source?: string
    sourceUrl?: string
    jobId?: string
  }) {
    const prisma = getPrisma()
    return await prisma.jobPosting.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  static async updateJobPosting(jobPostingId: string, userId: string, updates: any) {
    const prisma = getPrisma()
    return await prisma.jobPosting.update({
      where: {
        id: jobPostingId,
        userId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })
  }

  static async getJobPosting(jobPostingId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.jobPosting.findFirst({
      where: {
        id: jobPostingId,
        userId,
      },
      include: {
        applications: true,
      },
    })
  }

  static async getUserJobPostings(userId: string) {
    const prisma = getPrisma()
    return await prisma.jobPosting.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        applications: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  }

  static async deleteJobPosting(jobPostingId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.jobPosting.delete({
      where: {
        id: jobPostingId,
        userId,
      },
    })
  }

  static async archiveJobPosting(jobPostingId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.jobPosting.update({
      where: {
        id: jobPostingId,
        userId,
      },
      data: {
        isArchived: true,
        updatedAt: new Date(),
      },
    })
  }
}

// Job Application Service
export class JobApplicationService {
  static async createJobApplication(userId: string, data: {
    title: string
    status?: string
    priority?: string
    appliedDate?: Date
    deadline?: Date
    salary?: string
    notes?: string
    contactName?: string
    contactEmail?: string
    contactPhone?: string
    followUpDate?: Date
    interviewDate?: Date
    offerDate?: Date
    rejectionDate?: Date
    jobPostingId?: string
  }) {
    const prisma = getPrisma()
    return await prisma.jobApplication.create({
      data: {
        ...data,
        userId,
      },
      include: {
        documents: {
          include: {
            cv: true,
            letter: true,
          },
        },
        jobPosting: true,
      },
    })
  }

  static async updateJobApplication(applicationId: string, userId: string, updates: any) {
    const prisma = getPrisma()
    return await prisma.jobApplication.update({
      where: {
        id: applicationId,
        userId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      include: {
        documents: {
          include: {
            cv: true,
            letter: true,
          },
        },
        jobPosting: true,
      },
    })
  }

  static async getJobApplication(applicationId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      include: {
        documents: {
          include: {
            cv: true,
            letter: true,
          },
        },
        jobPosting: true,
      },
    })
  }

  static async getUserJobApplications(userId: string) {
    const prisma = getPrisma()
    return await prisma.jobApplication.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        documents: {
          include: {
            cv: true,
            letter: true,
          },
        },
        jobPosting: true,
      },
    })
  }

  static async deleteJobApplication(applicationId: string, userId: string) {
    const prisma = getPrisma()
    return await prisma.jobApplication.delete({
      where: {
        id: applicationId,
        userId,
      },
    })
  }

  static async getApplicationsByStatus(userId: string, status: string) {
    const prisma = getPrisma()
    return await prisma.jobApplication.findMany({
      where: {
        userId,
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        documents: {
          include: {
            cv: true,
            letter: true,
          },
        },
        jobPosting: true,
      },
    })
  }

  static async getApplicationsByPriority(userId: string, priority: string) {
    const prisma = getPrisma()
    return await prisma.jobApplication.findMany({
      where: {
        userId,
        priority,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        documents: {
          include: {
            cv: true,
            letter: true,
          },
        },
        jobPosting: true,
      },
    })
  }
}

// Application Document Service
export class ApplicationDocumentService {
  static async createApplicationDocument(applicationId: string, data: {
    type: string
    title: string
    description?: string
    cvId?: string
    letterId?: string
    fileUrl?: string
    fileName?: string
    fileSize?: number
    mimeType?: string
  }) {
    const prisma = getPrisma()
    return await prisma.applicationDocument.create({
      data: {
        ...data,
        applicationId,
      },
      include: {
        cv: true,
        letter: true,
        application: {
          include: {
            jobPosting: true,
          },
        },
      },
    })
  }

  static async updateApplicationDocument(documentId: string, applicationId: string, updates: any) {
    const prisma = getPrisma()
    return await prisma.applicationDocument.update({
      where: {
        id: documentId,
        applicationId,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      include: {
        cv: true,
        letter: true,
        application: {
          include: {
            jobPosting: true,
          },
        },
      },
    })
  }

  static async getApplicationDocument(documentId: string, applicationId: string) {
    const prisma = getPrisma()
    return await prisma.applicationDocument.findFirst({
      where: {
        id: documentId,
        applicationId,
      },
      include: {
        cv: true,
        letter: true,
        application: {
          include: {
            jobPosting: true,
          },
        },
      },
    })
  }

  static async getApplicationDocuments(applicationId: string) {
    const prisma = getPrisma()
    return await prisma.applicationDocument.findMany({
      where: {
        applicationId,
      },
      include: {
        cv: true,
        letter: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async deleteApplicationDocument(documentId: string, applicationId: string) {
    const prisma = getPrisma()
    return await prisma.applicationDocument.delete({
      where: {
        id: documentId,
        applicationId,
      },
    })
  }

  static async getDocumentsByType(applicationId: string, type: string) {
    const prisma = getPrisma()
    return await prisma.applicationDocument.findMany({
      where: {
        applicationId,
        type,
      },
      include: {
        cv: true,
        letter: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
} 