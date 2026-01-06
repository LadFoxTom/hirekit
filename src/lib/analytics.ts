// @ts-nocheck
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface UserAction {
  action: string;
  target: string;
  timestamp: Date;
  duration?: number;
  success?: boolean;
  error?: string;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private userActions: UserAction[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
    this.trackPageLoad();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.trackPerformanceMetric('page_load_time', entry.duration, 'ms', {
            type: 'navigation',
            url: window.location.href
          });
        }
      }
    });

    try {
      navObserver.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported:', e);
    }

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          this.trackPerformanceMetric('resource_load_time', entry.duration, 'ms', {
            name: entry.name,
            type: entry.initiatorType
          });
        }
      }
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource PerformanceObserver not supported:', e);
    }
  }

  private trackPageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.trackPerformanceMetric('page_load_complete', loadTime, 'ms');
    });
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  trackEvent(name: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.events.push(event);

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(event);
    } else {
      console.log('Analytics Event:', event);
    }
  }

  trackPerformanceMetric(name: string, value: number, unit: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      metadata
    };

    this.performanceMetrics.push(metric);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric);
    }
    // Disabled console logging to reduce noise in development
  }

  trackUserAction(action: string, target: string, duration?: number, success?: boolean, error?: string): void {
    const userAction: UserAction = {
      action,
      target,
      timestamp: new Date(),
      duration,
      success,
      error
    };

    this.userActions.push(userAction);

    // Send to analytics service
    this.trackEvent('user_action', {
      action,
      target,
      duration,
      success,
      error
    });
  }

  // CV Builder specific tracking
  trackCVEvent(eventType: string, properties?: Record<string, any>): void {
    this.trackEvent(`cv_${eventType}`, {
      ...properties,
      timestamp: new Date().toISOString()
    });
  }

  trackPDFGeneration(duration: number, success: boolean, templateId?: string, error?: string): void {
    this.trackPerformanceMetric('pdf_generation_time', duration, 'ms', {
      success,
      templateId,
      error
    });

    this.trackCVEvent('pdf_generated', {
      duration,
      success,
      templateId,
      error
    });
  }

  trackTemplateChange(fromTemplate: string, toTemplate: string): void {
    this.trackCVEvent('template_changed', {
      fromTemplate,
      toTemplate
    });
  }

  trackContentUpdate(section: string, action: 'add' | 'edit' | 'delete', wordCount?: number): void {
    this.trackCVEvent('content_updated', {
      section,
      action,
      wordCount
    });
  }

  trackPreviewInteraction(interaction: 'zoom' | 'scroll' | 'resize', value?: number): void {
    this.trackCVEvent('preview_interaction', {
      interaction,
      value
    });
  }

  // Funnel tracking
  trackFunnelStep(step: string, properties?: Record<string, any>): void {
    this.trackEvent('funnel_step', {
      step,
      ...properties
    });
  }

  // A/B testing
  trackExperiment(experimentId: string, variant: string, action: string): void {
    this.trackEvent('experiment', {
      experimentId,
      variant,
      action
    });
  }

  // Error tracking
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  private async sendToAnalyticsService(event: AnalyticsEvent): Promise<void> {
    try {
      // In production, send to your analytics service
      // Example: Google Analytics, Mixpanel, Amplitude, etc.
      
      // For Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', event.name, event.properties);
      }

      // For custom analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private async sendToMonitoringService(metric: PerformanceMetric): Promise<void> {
    try {
      // Send to monitoring service like DataDog, New Relic, etc.
      // await fetch('/api/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric)
      // });
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  // Get analytics data
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  getUserActions(): UserAction[] {
    return [...this.userActions];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Clear data (useful for testing)
  clear(): void {
    this.events = [];
    this.performanceMetrics = [];
    this.userActions = [];
  }
}

// Global analytics instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackCVEvent: analytics.trackCVEvent.bind(analytics),
    trackPDFGeneration: analytics.trackPDFGeneration.bind(analytics),
    trackTemplateChange: analytics.trackTemplateChange.bind(analytics),
    trackContentUpdate: analytics.trackContentUpdate.bind(analytics),
    trackPreviewInteraction: analytics.trackPreviewInteraction.bind(analytics),
    trackFunnelStep: analytics.trackFunnelStep.bind(analytics),
    trackExperiment: analytics.trackExperiment.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformanceMetric: analytics.trackPerformanceMetric.bind(analytics),
    trackUserAction: analytics.trackUserAction.bind(analytics)
  };
}

// Performance timing utilities
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    analytics.trackPerformanceMetric(this.name, duration, 'ms');
    return duration;
  }
}

export function measurePerformance<T>(name: string, fn: () => T): T {
  const timer = new PerformanceTimer(name);
  try {
    const result = fn();
    timer.end();
    return result;
  } catch (error) {
    timer.end();
    throw error;
  }
}

export async function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const timer = new PerformanceTimer(name);
  try {
    const result = await fn();
    timer.end();
    return result;
  } catch (error) {
    timer.end();
    throw error;
  }
}

export type { AnalyticsEvent, PerformanceMetric, UserAction };