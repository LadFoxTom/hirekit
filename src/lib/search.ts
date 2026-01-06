// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchFilters {
  userId?: string;
  template?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  isArchived?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchResult<T> {
  item: T;
  relevance: number;
  highlights: string[];
}

export class SearchService {
  /**
   * Search CVs with full-text search
   */
  static async searchCVs(
    query: string,
    filters: SearchFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<SearchResult<any>[]> {
    const whereClause: any = {};
    
    // Apply filters
    if (filters.userId) whereClause.userId = filters.userId;
    if (filters.template) whereClause.template = filters.template;
    if (filters.category) whereClause.category = filters.category;
    if (filters.isPublic !== undefined) whereClause.isPublic = filters.isPublic;
    if (filters.isArchived !== undefined) whereClause.isArchived = filters.isArchived;
    if (filters.dateFrom || filters.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) whereClause.createdAt.lte = filters.dateTo;
    }

    // Full-text search using PostgreSQL
    if (query.trim()) {
      whereClause.OR = [
        {
          title: {
            search: query,
          },
        },
        {
          content: {
            path: ['$'],
            string_contains: query,
          },
        },
        {
          tags: {
            hasSome: query.split(' ').filter(word => word.length > 2),
          },
        },
        {
          keywords: {
            hasSome: query.split(' ').filter(word => word.length > 2),
          },
        },
      ];
    }

    const cvs = await prisma.cV.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Calculate relevance and highlights
    return cvs.map(cv => ({
      item: cv,
      relevance: this.calculateRelevance(cv, query),
      highlights: this.extractHighlights(cv, query),
    }));
  }

  /**
   * Search letters with full-text search
   */
  static async searchLetters(
    query: string,
    filters: SearchFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<SearchResult<any>[]> {
    const whereClause: any = {};
    
    // Apply filters
    if (filters.userId) whereClause.userId = filters.userId;
    if (filters.template) whereClause.template = filters.template;
    if (filters.isPublic !== undefined) whereClause.isPublic = filters.isPublic;
    if (filters.isArchived !== undefined) whereClause.isArchived = filters.isArchived;

    // Full-text search
    if (query.trim()) {
      whereClause.OR = [
        {
          title: {
            search: query,
          },
        },
        {
          content: {
            path: ['$'],
            string_contains: query,
          },
        },
        {
          cvText: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ];
    }

    const letters = await prisma.letter.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return letters.map(letter => ({
      item: letter,
      relevance: this.calculateRelevance(letter, query),
      highlights: this.extractHighlights(letter, query),
    }));
  }

  /**
   * Search job postings
   */
  static async searchJobPostings(
    query: string,
    filters: any = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<SearchResult<any>[]> {
    const whereClause: any = {};
    
    if (filters.userId) whereClause.userId = filters.userId;
    if (filters.company) whereClause.company = { contains: filters.company, mode: 'insensitive' };
    if (filters.jobType) whereClause.jobType = filters.jobType;
    if (filters.remote !== undefined) whereClause.remote = filters.remote;
    if (filters.isActive !== undefined) whereClause.isActive = filters.isActive;

    if (query.trim()) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        {
          description: {
            path: ['$'],
            string_contains: query,
          },
        },
      ];
    }

    const jobPostings = await prisma.jobPosting.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return jobPostings.map(posting => ({
      item: posting,
      relevance: this.calculateRelevance(posting, query),
      highlights: this.extractHighlights(posting, query),
    }));
  }

  /**
   * Update search vector for a CV
   */
  static async updateCVSearchVector(cvId: string) {
    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
      select: { title: true, content: true, tags: true, keywords: true },
    });

    if (!cv) return;

    // Extract text content from JSON
    const contentText = this.extractTextFromJson(cv.content);
    const tagsText = cv.tags?.join(' ') || '';
    const keywordsText = cv.keywords?.join(' ') || '';

    // Combine all searchable text
    const searchText = `${cv.title} ${contentText} ${tagsText} ${keywordsText}`;

    // Update search vector using raw SQL
    await prisma.$executeRaw`
      UPDATE "CV" 
      SET "searchVector" = to_tsvector('english', ${searchText})
      WHERE id = ${cvId}
    `;
  }

  /**
   * Extract text content from JSON
   */
  private static extractTextFromJson(json: any): string {
    if (!json) return '';
    
    const extractText = (obj: any): string => {
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'number') return obj.toString();
      if (Array.isArray(obj)) return obj.map(extractText).join(' ');
      if (typeof obj === 'object') {
        return Object.values(obj).map(extractText).join(' ');
      }
      return '';
    };

    return extractText(json);
  }

  /**
   * Calculate relevance score
   */
  private static calculateRelevance(item: any, query: string): number {
    if (!query.trim()) return 1.0;

    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    let score = 0;

    // Title matches (highest weight)
    if (item.title) {
      const titleWords = item.title.toLowerCase().split(' ');
      queryWords.forEach(word => {
        if (titleWords.some((titleWord: string) => titleWord.includes(word))) {
          score += 10;
        }
      });
    }

    // Tag matches (high weight)
    if (item.tags) {
      queryWords.forEach(word => {
        if (item.tags.some((tag: string) => tag.toLowerCase().includes(word))) {
          score += 5;
        }
      });
    }

    // Content matches (medium weight)
    if (item.content) {
      const contentText = this.extractTextFromJson(item.content);
      queryWords.forEach(word => {
        if (contentText.toLowerCase().includes(word)) {
          score += 2;
        }
      });
    }

    return Math.min(score / 10, 1.0); // Normalize to 0-1
  }

  /**
   * Extract highlights from content
   */
  private static extractHighlights(item: any, query: string): string[] {
    if (!query.trim()) return [];

    const highlights: string[] = [];
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);

    // Extract from title
    if (item.title) {
      queryWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        const matches = item.title.match(regex);
        if (matches) {
          highlights.push(...matches);
        }
      });
    }

    // Extract from content
    if (item.content) {
      const contentText = this.extractTextFromJson(item.content);
      queryWords.forEach(word => {
        const regex = new RegExp(`([^.]*${word}[^.]*)`, 'gi');
        const matches = contentText.match(regex);
        if (matches) {
          highlights.push(...matches.slice(0, 3)); // Limit to 3 matches
        }
      });
    }

    return Array.from(new Set(highlights)); // Remove duplicates
  }

  /**
   * Get search suggestions
   */
  static async getSearchSuggestions(query: string, userId?: string): Promise<string[]> {
    const suggestions: string[] = [];

    // Get CV titles
    const cvTitles = await prisma.cV.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
        ...(userId && { userId }),
      },
      select: { title: true },
      take: 5,
    });

    suggestions.push(...cvTitles.map(cv => cv.title));

    // Get tags
    const cvsWithTags = await prisma.cV.findMany({
      where: {
        tags: { hasSome: [query] },
        ...(userId && { userId }),
      },
      select: { tags: true },
      take: 10,
    });

    const tags = cvsWithTags.flatMap(cv => cv.tags || []);
    suggestions.push(...tags);

    return Array.from(new Set(suggestions)).slice(0, 10);
  }
} 