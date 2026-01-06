// @ts-nocheck
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();
  private configs = new Map<string, RateLimitConfig>();

  constructor() {
    // Default configurations for different endpoints
    this.configs.set('pdf_generation', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10, // 10 PDF generations per 15 minutes
      skipSuccessfulRequests: false,
      skipFailedRequests: true
    });

    this.configs.set('ai_requests', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 AI requests per minute
      skipSuccessfulRequests: false,
      skipFailedRequests: true
    });

    this.configs.set('api_general', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per 15 minutes
      skipSuccessfulRequests: false,
      skipFailedRequests: true
    });

    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async check(identifier: string, endpoint: string = 'api_general'): Promise<RateLimitResult> {
    const config = this.configs.get(endpoint);
    if (!config) {
      return { success: true, remaining: Infinity, resetTime: Date.now() };
    }

    const key = `${endpoint}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create entry
    let entry = this.store.get(key);
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }

    // Check if request is within window
    if (entry.resetTime > now) {
      entry.count++;
      this.store.set(key, entry);

      if (entry.count > config.maxRequests) {
        return {
          success: false,
          remaining: 0,
          resetTime: entry.resetTime,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        };
      }

      return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime
      };
    }

    // Reset window
    entry = {
      count: 1,
      resetTime: now + config.windowMs
    };
    this.store.set(key, entry);

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime
    };
  }

  async increment(identifier: string, endpoint: string = 'api_general'): Promise<void> {
    const key = `${endpoint}:${identifier}`;
    const now = Date.now();
    
    let entry = this.store.get(key);
    if (!entry || entry.resetTime < now) {
      const config = this.configs.get(endpoint);
      if (!config) return;

      entry = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }

    entry.count++;
    this.store.set(key, entry);
  }

  async reset(identifier: string, endpoint: string = 'api_general'): Promise<void> {
    const key = `${endpoint}:${identifier}`;
    this.store.delete(key);
  }

  getStats(identifier?: string): any {
    if (identifier) {
      const stats: any = {};
      for (const [endpoint] of this.configs) {
        const key = `${endpoint}:${identifier}`;
        const entry = this.store.get(key);
        if (entry) {
          stats[endpoint] = {
            count: entry.count,
            resetTime: entry.resetTime,
            remaining: this.configs.get(endpoint)!.maxRequests - entry.count
          };
        }
      }
      return stats;
    }

    return {
      totalEntries: this.store.size,
      configs: Array.from(this.configs.entries()).map(([name, config]) => ({
        name,
        windowMs: config.windowMs,
        maxRequests: config.maxRequests
      }))
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  // Add custom rate limit configuration
  addConfig(endpoint: string, config: RateLimitConfig): void {
    this.configs.set(endpoint, config);
  }

  // Remove rate limit configuration
  removeConfig(endpoint: string): void {
    this.configs.delete(endpoint);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Usage tracking for premium users
interface UserQuota {
  pdfGenerations: number;
  maxPdfPerDay: number;
  aiRequests: number;
  maxAiPerDay: number;
  lastReset: Date;
}

class UserQuotaManager {
  private quotas = new Map<string, UserQuota>();

  getUserQuota(userId: string, isPremium: boolean = false): UserQuota {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let quota = this.quotas.get(userId);
    
    // Reset daily quotas
    if (!quota || quota.lastReset < today) {
      quota = {
        pdfGenerations: 0,
        maxPdfPerDay: isPremium ? 100 : 10,
        aiRequests: 0,
        maxAiPerDay: isPremium ? 1000 : 50,
        lastReset: today
      };
      this.quotas.set(userId, quota);
    }
    
    return quota;
  }

  canGeneratePDF(userId: string, isPremium: boolean = false): boolean {
    const quota = this.getUserQuota(userId, isPremium);
    return quota.pdfGenerations < quota.maxPdfPerDay;
  }

  canMakeAIRequest(userId: string, isPremium: boolean = false): boolean {
    const quota = this.getUserQuota(userId, isPremium);
    return quota.aiRequests < quota.maxAiPerDay;
  }

  recordPDFGeneration(userId: string): void {
    const quota = this.quotas.get(userId);
    if (quota) {
      quota.pdfGenerations++;
    }
  }

  recordAIRequest(userId: string): void {
    const quota = this.quotas.get(userId);
    if (quota) {
      quota.aiRequests++;
    }
  }

  getQuotaStats(userId: string, isPremium: boolean = false): UserQuota {
    return this.getUserQuota(userId, isPremium);
  }
}

export const userQuotaManager = new UserQuotaManager();

export type { RateLimitConfig, RateLimitResult, UserQuota };
