'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface SubscriptionData {
  plan: 'free' | 'basic' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'past_due';
  features: {
    pdf_export: boolean;
    ai_requests: number;
    templates: 'basic' | 'all' | 'premium';
    job_tracking: boolean;
    analytics: boolean;
    priority_support: boolean;
    api_access: boolean;
    team_collaboration: boolean;
  };
  usageQuotas: {
    ai_requests: { used: number; limit: number };
    exports: { used: number; limit: number };
    storage: { used: number; limit: number };
    api_calls: { used: number; limit: number };
  };
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export function useSubscription() {
  const { data: session, status: sessionStatus } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    
    if (!session?.user?.id) {
      // No user, return free plan
      setSubscription({
        plan: 'free',
        status: 'active',
        features: {
          pdf_export: false,
          ai_requests: 3,
          templates: 'basic',
          job_tracking: false,
          analytics: false,
          priority_support: false,
          api_access: false,
          team_collaboration: false,
        },
        usageQuotas: {
          ai_requests: { used: 0, limit: 3 },
          exports: { used: 0, limit: 0 },
          storage: { used: 0, limit: 10 },
          api_calls: { used: 0, limit: 0 },
        },
        billingCycle: 'monthly',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
      setLoading(false);
      return;
    }

    // Fetch subscription
    fetch('/api/user/subscription')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          // Return free plan on error
          setSubscription({
            plan: 'free',
            status: 'active',
            features: {
              pdf_export: false,
              ai_requests: 3,
              templates: 'basic',
              job_tracking: false,
              analytics: false,
              priority_support: false,
              api_access: false,
              team_collaboration: false,
            },
            usageQuotas: {
              ai_requests: { used: 0, limit: 3 },
              exports: { used: 0, limit: 0 },
              storage: { used: 0, limit: 10 },
              api_calls: { used: 0, limit: 0 },
            },
            billingCycle: 'monthly',
            currentPeriodStart: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
          });
        } else {
          setSubscription(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch subscription:', err);
        setError(err.message);
        setLoading(false);
        // Return free plan on error
        setSubscription({
          plan: 'free',
          status: 'active',
          features: {
            pdf_export: false,
            ai_requests: 3,
            templates: 'basic',
            job_tracking: false,
            analytics: false,
            priority_support: false,
            api_access: false,
            team_collaboration: false,
          },
          usageQuotas: {
            ai_requests: { used: 0, limit: 3 },
            exports: { used: 0, limit: 0 },
            storage: { used: 0, limit: 10 },
            api_calls: { used: 0, limit: 0 },
          },
          billingCycle: 'monthly',
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        });
      });
  }, [session, sessionStatus]);

  const hasFeature = (feature: keyof SubscriptionData['features']): boolean => {
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    const featureValue = subscription.features[feature];
    
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    if (typeof featureValue === 'number') {
      // For numeric features like ai_requests, check quota
      const quota = subscription.usageQuotas.ai_requests;
      return quota.used < quota.limit;
    }
    
    return false;
  };

  const hasQuota = (quotaType: keyof SubscriptionData['usageQuotas']): boolean => {
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    const quota = subscription.usageQuotas[quotaType];
    return quota.used < quota.limit;
  };

  const isPlan = (plan: SubscriptionData['plan']): boolean => {
    return subscription?.plan === plan;
  };

  const isAtLeastPlan = (minPlan: SubscriptionData['plan']): boolean => {
    if (!subscription) return false;
    
    const planOrder = ['free', 'basic', 'pro', 'team'];
    const userPlanIndex = planOrder.indexOf(subscription.plan);
    const minPlanIndex = planOrder.indexOf(minPlan);
    
    return userPlanIndex >= minPlanIndex;
  };

  return {
    subscription,
    loading,
    error,
    hasFeature,
    hasQuota,
    isPlan,
    isAtLeastPlan,
    isActive: subscription?.status === 'active',
  };
}

