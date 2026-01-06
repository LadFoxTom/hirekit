export interface TokenUsage {
  userId?: string;
  tokensUsed: number;
  lastUsed: Date;
  plan: 'free' | 'basic' | 'pro' | 'development';
}

export interface TokenLimits {
  free: number;
  basic: number;
  pro: number;
  development: number;
}

const TOKEN_LIMITS: TokenLimits = {
  free: 1,
  basic: 50,
  pro: 500,
  development: Infinity
};

class TokenManager {
  private usage: Map<string, TokenUsage> = new Map();

  constructor() {
    // Load existing usage from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ai_token_usage');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.usage = new Map(Object.entries(parsed));
        }
      } catch (error) {
        console.error('Failed to load token usage:', error);
      }
    }
  }

  private saveUsage() {
    if (typeof window !== 'undefined') {
      try {
        const usageObj = Object.fromEntries(this.usage);
        localStorage.setItem('ai_token_usage', JSON.stringify(usageObj));
      } catch (error) {
        console.error('Failed to save token usage:', error);
      }
    }
  }

  getUserUsage(userId: string = 'anonymous'): TokenUsage {
    if (!this.usage.has(userId)) {
      this.usage.set(userId, {
        userId,
        tokensUsed: 0,
        lastUsed: new Date(),
        plan: 'development' // Default to development for now
      });
      this.saveUsage();
    }
    return this.usage.get(userId)!;
  }

  canUseTokens(userId: string = 'anonymous', tokens: number = 1): boolean {
    const usage = this.getUserUsage(userId);
    const limit = TOKEN_LIMITS[usage.plan];
    return usage.tokensUsed + tokens <= limit;
  }

  useTokens(userId: string = 'anonymous', tokens: number = 1): boolean {
    const usage = this.getUserUsage(userId);
    
    if (!this.canUseTokens(userId, tokens)) {
      return false;
    }

    usage.tokensUsed += tokens;
    usage.lastUsed = new Date();
    this.saveUsage();
    return true;
  }

  getRemainingTokens(userId: string = 'anonymous'): number {
    const usage = this.getUserUsage(userId);
    const limit = TOKEN_LIMITS[usage.plan];
    return Math.max(0, limit - usage.tokensUsed);
  }

  resetUsage(userId: string = 'anonymous'): void {
    this.usage.delete(userId);
    this.saveUsage();
  }

  setPlan(userId: string, plan: 'free' | 'basic' | 'pro' | 'development'): void {
    const usage = this.getUserUsage(userId);
    usage.plan = plan;
    this.saveUsage();
  }
}

export const tokenManager = new TokenManager(); 