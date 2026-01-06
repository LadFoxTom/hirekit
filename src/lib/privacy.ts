// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export class PrivacyService {
  /**
   * Anonymize user data for GDPR compliance
   */
  static async anonymizeUserData(userId: string) {
    const anonymizedData = {
      name: 'Anonymous User',
      firstName: 'Anonymous',
      lastName: 'User',
      email: `anonymous_${userId}@deleted.com`,
      phone: null,
      address: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
      avatarUrl: null,
      jobTitle: null,
      company: null,
      linkedinUrl: null,
      websiteUrl: null,
      bio: null,
      dateOfBirth: null,
      gender: null,
    };

    await prisma.user.update({
      where: { id: userId },
      data: anonymizedData,
    });

    // Anonymize CV content
    await this.anonymizeCVContent(userId);
    
    // Anonymize job applications
    await this.anonymizeJobApplications(userId);
    
    // Anonymize cover letters
    await this.anonymizeCoverLetters(userId);
  }

  /**
   * Anonymize CV content
   */
  private static async anonymizeCVContent(userId: string) {
    const cvs = await prisma.cV.findMany({
      where: { userId },
    });

    for (const cv of cvs) {
      const anonymizedContent = this.anonymizeJsonContent(cv.content);
      
      await prisma.cV.update({
        where: { id: cv.id },
        data: {
          title: 'Anonymized CV',
          content: anonymizedContent,
          tags: ['anonymized'],
          keywords: [],
        },
      });
    }
  }

  /**
   * Anonymize job applications
   */
  private static async anonymizeJobApplications(userId: string) {
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
    });

    for (const app of applications) {
      await prisma.jobApplication.update({
        where: { id: app.id },
        data: {
          title: 'Anonymized Application',
          contactName: null,
          contactEmail: null,
          contactPhone: null,
          notes: { message: 'Data anonymized for privacy' },
        },
      });
    }
  }

  /**
   * Anonymize cover letters
   */
  private static async anonymizeCoverLetters(userId: string) {
    const letters = await prisma.letter.findMany({
      where: { userId },
    });

    for (const letter of letters) {
      const anonymizedContent = this.anonymizeJsonContent(letter.content);
      
      await prisma.letter.update({
        where: { id: letter.id },
        data: {
          title: 'Anonymized Letter',
          content: anonymizedContent,
          cvText: null,
        },
      });
    }
  }

  /**
   * Anonymize JSON content recursively
   */
  private static anonymizeJsonContent(content: any): any {
    if (typeof content === 'string') {
      return this.anonymizeText(content);
    }
    
    if (Array.isArray(content)) {
      return content.map(item => this.anonymizeJsonContent(item));
    }
    
    if (typeof content === 'object' && content !== null) {
      const anonymized: any = {};
      for (const [key, value] of Object.entries(content)) {
        anonymized[key] = this.anonymizeJsonContent(value);
      }
      return anonymized;
    }
    
    return content;
  }

  /**
   * Anonymize text content
   */
  private static anonymizeText(text: string): string {
    // Replace personal information with placeholders
    return text
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
      .replace(/\b\d{1,3}\s+\w+\s+\w+\s+\w+\s+\w+\s+\w+\b/g, '[ADDRESS]')
      .replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME]')
      .replace(/\b[A-Z][a-z]+\s+Inc\.?\b/g, '[COMPANY]')
      .replace(/\b[A-Z][a-z]+\s+University\b/g, '[UNIVERSITY]');
  }

  /**
   * Export user data for GDPR portability
   */
  static async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cvs: true,
        letters: true,
        jobApplications: {
          include: {
            jobPosting: true,
            documents: true,
          },
        },
        jobPostings: true,
        subscription: true,
        preferences: true,
        auditLogs: true,
        changeLogs: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
        jobTitle: user.jobTitle,
        company: user.company,
        linkedinUrl: user.linkedinUrl,
        websiteUrl: user.websiteUrl,
        bio: user.bio,
        language: user.language,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      cvs: user.cvs,
      letters: user.letters,
      jobApplications: user.jobApplications,
      jobPostings: user.jobPostings,
      subscription: user.subscription,
      preferences: user.preferences,
      auditLogs: user.auditLogs,
      changeLogs: user.changeLogs,
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Check if user has sensitive data
   */
  static async hasSensitiveData(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        phone: true,
        address: true,
        dateOfBirth: true,
        jobApplications: {
          select: {
            contactEmail: true,
            contactPhone: true,
          },
        },
      },
    });

    if (!user) return false;

    return !!(
      user.phone ||
      user.address ||
      user.dateOfBirth ||
      user.jobApplications.some(app => app.contactEmail || app.contactPhone)
    );
  }

  /**
   * Get data retention summary
   */
  static async getDataRetentionSummary(userId: string) {
    const summary = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        cvs: {
          select: { createdAt: true, updatedAt: true },
        },
        letters: {
          select: { createdAt: true, updatedAt: true },
        },
        jobApplications: {
          select: { createdAt: true, updatedAt: true },
        },
        auditLogs: {
          select: { createdAt: true },
        },
      },
    });

    if (!summary) return null;

    return {
      accountCreated: summary.createdAt,
      oldestCV: summary.cvs.length > 0 ? Math.min(...summary.cvs.map(cv => cv.createdAt.getTime())) : null,
      newestCV: summary.cvs.length > 0 ? Math.max(...summary.cvs.map(cv => cv.updatedAt.getTime())) : null,
      oldestLetter: summary.letters.length > 0 ? Math.min(...summary.letters.map(letter => letter.createdAt.getTime())) : null,
      newestLetter: summary.letters.length > 0 ? Math.max(...summary.letters.map(letter => letter.updatedAt.getTime())) : null,
      oldestApplication: summary.jobApplications.length > 0 ? Math.min(...summary.jobApplications.map(app => app.createdAt.getTime())) : null,
      newestApplication: summary.jobApplications.length > 0 ? Math.max(...summary.jobApplications.map(app => app.updatedAt.getTime())) : null,
      totalAuditLogs: summary.auditLogs.length,
      oldestAuditLog: summary.auditLogs.length > 0 ? Math.min(...summary.auditLogs.map(log => log.createdAt.getTime())) : null,
    };
  }
} 