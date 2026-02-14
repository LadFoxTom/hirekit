// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FeatureAccess {
  pdf_export: boolean;
  ai_requests: number;
  templates: string; // 'basic', 'all', 'premium'
  job_tracking: boolean;
  analytics: boolean;
  priority_support: boolean;
  api_access: boolean;
  team_collaboration: boolean;
}

export interface UsageQuota {
  ai_requests: { used: number; limit: number };
  exports: { used: number; limit: number };
  storage: { used: number; limit: number }; // in MB
  api_calls: { used: number; limit: number };
}

export interface BillingEvent {
  event: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  metadata?: any;
}

export class SubscriptionService {
  // Default feature access for each plan
  private static readonly PLAN_FEATURES: Record<string, FeatureAccess> = {
    free: {
      pdf_export: false,
      ai_requests: 3,
      templates: 'basic',
      job_tracking: false,
      analytics: false,
      priority_support: false,
      api_access: false,
      team_collaboration: false,
    },
    basic: {
      pdf_export: true,
      ai_requests: 100,
      templates: 'all',
      job_tracking: true,
      analytics: false,
      priority_support: false,
      api_access: false,
      team_collaboration: false,
    },
    pro: {
      pdf_export: true,
      ai_requests: 1000,
      templates: 'all',
      job_tracking: true,
      analytics: true,
      priority_support: true,
      api_access: true,
      team_collaboration: false,
    },
    team: {
      pdf_export: true,
      ai_requests: 5000,
      templates: 'all',
      job_tracking: true,
      analytics: true,
      priority_support: true,
      api_access: true,
      team_collaboration: true,
    },
  };

  // Default usage quotas for each plan
  private static readonly PLAN_QUOTAS: Record<string, UsageQuota> = {
    free: {
      ai_requests: { used: 0, limit: 3 },
      exports: { used: 0, limit: 0 },
      storage: { used: 0, limit: 10 }, // 10MB
      api_calls: { used: 0, limit: 0 },
    },
    basic: {
      ai_requests: { used: 0, limit: 100 },
      exports: { used: 0, limit: 50 },
      storage: { used: 0, limit: 100 }, // 100MB
      api_calls: { used: 0, limit: 0 },
    },
    pro: {
      ai_requests: { used: 0, limit: 1000 },
      exports: { used: 0, limit: 500 },
      storage: { used: 0, limit: 1000 }, // 1GB
      api_calls: { used: 0, limit: 1000 },
    },
    team: {
      ai_requests: { used: 0, limit: 5000 },
      exports: { used: 0, limit: 2000 },
      storage: { used: 0, limit: 10000 }, // 10GB
      api_calls: { used: 0, limit: 10000 },
    },
  };

  /**
   * Get user's subscription with enhanced features
   */
  static async getUserSubscription(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      // Return default free plan
      return {
        plan: 'free',
        status: 'active',
        features: this.PLAN_FEATURES.free as any,
        usageQuotas: this.PLAN_QUOTAS.free as any,
        billingCycle: 'monthly',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    // Get plan from subscription (default to 'free' if not set)
    const plan = (subscription.plan as string) || 'free';
    const status = (subscription.status as string) || 'active';

    // Merge with plan defaults
    const features = {
      ...this.PLAN_FEATURES[plan] || this.PLAN_FEATURES.free,
      ...(subscription.features as any as FeatureAccess || {}),
    };

    const usageQuotas = {
      ...this.PLAN_QUOTAS[plan] || this.PLAN_QUOTAS.free,
      ...(subscription.usageQuotas as any as UsageQuota || {}),
    };

    return {
      id: subscription.id,
      userId: subscription.userId,
      plan: plan,
      status: status,
      billingCycle: (subscription.billingCycle as string) || 'monthly',
      currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || subscription.stripeCurrentPeriodEnd?.toISOString() || null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripePriceId: subscription.stripePriceId,
      features,
      usageQuotas,
      user: subscription.user,
    };
  }

  /**
   * Check if user has access to a specific feature
   */
  static async hasFeatureAccess(userId: string, feature: keyof FeatureAccess): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    
    if (subscription.status !== 'active') {
      return false;
    }

    const featureValue = subscription.features[feature];
    
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    if (typeof featureValue === 'number') {
      // Check if user has remaining quota
      const quota = subscription.usageQuotas.ai_requests;
      return quota.used < quota.limit;
    }
    
    return false;
  }

  /**
   * Check if user has remaining quota for a feature
   */
  static async hasQuota(userId: string, quotaType: keyof UsageQuota): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    
    if (subscription.status !== 'active') {
      return false;
    }

    const quota = subscription.usageQuotas[quotaType];
    return quota.used < quota.limit;
  }

  /**
   * Increment usage for a specific quota
   */
  static async incrementUsage(userId: string, quotaType: keyof UsageQuota, amount: number = 1) {
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      // Create free subscription if none exists
      await prisma.subscription.create({
        data: {
          userId,
          plan: 'free',
          status: 'active',
          features: this.PLAN_FEATURES.free as any,
          usageQuotas: this.PLAN_QUOTAS.free as any,
          billingCycle: 'monthly',
        },
      });
      // Re-fetch after creation
      const newSubscription = await prisma.subscription.findUnique({
        where: { userId },
      });
      if (!newSubscription) {
        throw new Error('Failed to create subscription');
      }
      subscription = newSubscription;
    }

    // Update usage quota
    const currentQuotas = subscription?.usageQuotas as any as UsageQuota || this.PLAN_QUOTAS.free;
    const updatedQuotas = {
      ...currentQuotas,
      [quotaType]: {
        ...currentQuotas[quotaType],
        used: currentQuotas[quotaType].used + amount,
      },
    };

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        usageQuotas: updatedQuotas,
      },
      create: {
        userId,
        plan: 'free',
        status: 'active',
        features: this.PLAN_FEATURES.free as any,
        usageQuotas: updatedQuotas,
        billingCycle: 'monthly',
      },
    });
  }

  /**
   * Add billing event to subscription
   */
  static async addBillingEvent(userId: string, event: BillingEvent) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const billingHistory = (subscription.billingHistory as any as BillingEvent[]) || [];
    billingHistory.push(event);

    await prisma.subscription.update({
      where: { userId },
      data: {
        billingHistory: billingHistory as any,
      },
    });
  }

  /**
   * Get billing history for a user
   */
  static async getBillingHistory(userId: string): Promise<BillingEvent[]> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { billingHistory: true },
    });

    return (subscription?.billingHistory as any as BillingEvent[]) || [];
  }

  /**
   * Update subscription plan
   */
  static async updatePlan(userId: string, plan: string, billingCycle: string = 'monthly') {
    const features = (this.PLAN_FEATURES[plan] || this.PLAN_FEATURES.free) as any;
    const usageQuotas = (this.PLAN_QUOTAS[plan] || this.PLAN_QUOTAS.free) as any;

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: plan as any,
        billingCycle: billingCycle as any,
        features: features as any,
        usageQuotas: usageQuotas as any,
        status: 'active',
      },
      create: {
        userId,
        plan: plan as any,
        billingCycle: billingCycle as any,
        features: features as any,
        usageQuotas: usageQuotas as any,
        status: 'active',
      },
    });
  }

  /**
   * Get usage statistics for a user
   */
  static async getUsageStats(userId: string) {
    const subscription = await this.getUserSubscription(userId);
    
    return {
      plan: subscription.plan,
      status: subscription.status,
      usageQuotas: subscription.usageQuotas,
      features: subscription.features,
      billingCycle: subscription.billingCycle,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  }

  /**
   * Reset usage quotas (called monthly/yearly)
   */
  static async resetUsageQuotas(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) return;

    const plan = subscription.plan;
    const defaultQuotas = this.PLAN_QUOTAS[plan] || this.PLAN_QUOTAS.free;
    
    // Reset used counts to 0, keep limits
    const resetQuotas = Object.keys(defaultQuotas).reduce((acc, key) => {
      (acc as any)[key] = { used: 0, limit: (defaultQuotas as any)[key].limit };
      return acc;
    }, {} as UsageQuota);

    await prisma.subscription.update({
      where: { userId },
      data: {
        usageQuotas: resetQuotas as any,
      },
    });
  }

  /**
   * Get subscription analytics
   */
  static async getSubscriptionAnalytics() {
    const subscriptions = await prisma.subscription.findMany({
      select: {
        plan: true,
        status: true,
        billingCycle: true,
        createdAt: true,
        usageQuotas: true,
      },
    });

    const analytics = {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      planDistribution: {} as Record<string, number>,
      billingCycleDistribution: {} as Record<string, number>,
      averageUsage: {
        ai_requests: 0,
        exports: 0,
        storage: 0,
      },
    };

    // Calculate plan distribution
    subscriptions.forEach(sub => {
      analytics.planDistribution[sub.plan] = (analytics.planDistribution[sub.plan] || 0) + 1;
      analytics.billingCycleDistribution[sub.billingCycle] = (analytics.billingCycleDistribution[sub.billingCycle] || 0) + 1;
    });

    // Calculate average usage
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    if (activeSubs.length > 0) {
      const totalUsage = activeSubs.reduce((acc, sub) => {
        const quotas = sub.usageQuotas as any as UsageQuota;
        acc.ai_requests += quotas.ai_requests.used;
        acc.exports += quotas.exports.used;
        acc.storage += quotas.storage.used;
        return acc;
      }, { ai_requests: 0, exports: 0, storage: 0 });

      analytics.averageUsage = {
        ai_requests: Math.round(totalUsage.ai_requests / activeSubs.length),
        exports: Math.round(totalUsage.exports / activeSubs.length),
        storage: Math.round(totalUsage.storage / activeSubs.length),
      };
    }

    return analytics;
  }
} 