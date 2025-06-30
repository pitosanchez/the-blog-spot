// Analytics and engagement tracking utilities

export interface AnalyticsEvent {
  id?: string;
  userId?: string;
  sessionId: string;
  eventType: EventType;
  eventData: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  pageUrl?: string;
}

export type EventType = 
  | 'page_view'
  | 'publication_view'
  | 'publication_like'
  | 'publication_share'
  | 'publication_bookmark'
  | 'comment_create'
  | 'comment_like'
  | 'search_query'
  | 'cme_start'
  | 'cme_complete'
  | 'subscription_start'
  | 'subscription_cancel'
  | 'user_login'
  | 'user_logout'
  | 'profile_update'
  | 'medical_term_search'
  | 'dicom_view'
  | 'phi_detected'
  | 'auto_save_triggered'
  | 'content_export'
  | 'video_play'
  | 'video_pause'
  | 'video_complete';

export interface ContentMetrics {
  publicationId: string;
  views: number;
  uniqueViews: number;
  likes: number;
  shares: number;
  bookmarks: number;
  comments: number;
  avgTimeOnPage: number;
  bounceRate: number;
  cmeCompletions: number;
  rating: number;
  lastViewed: Date;
}

export interface UserEngagement {
  userId: string;
  totalSessions: number;
  totalTimeSpent: number;
  publicationsViewed: number;
  publicationsCreated: number;
  commentsPosted: number;
  likesGiven: number;
  sharesPerformed: number;
  cmeCreditsEarned: number;
  lastActiveDate: Date;
  avgSessionDuration: number;
  deviceTypes: Record<string, number>;
  topCategories: Array<{ category: string; count: number }>;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalPublications: number;
  totalViews: number;
  totalSubscriptions: number;
  revenue: {
    total: number;
    monthly: number;
    cme: number;
    subscriptions: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
  }>;
  userGrowth: Array<{
    date: string;
    newUsers: number;
    activeUsers: number;
  }>;
}

// Analytics tracking functions
export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public track(eventType: EventType, eventData: Record<string, any> = {}, userId?: string): void {
    const event: AnalyticsEvent = {
      userId,
      sessionId: this.sessionId,
      eventType,
      eventData,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.events.push(event);
    this.sendToServer(event);
  }

  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      // Send event to analytics API
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      // Store failed events for retry
      this.storeFailedEvent(event);
    }
  }

  private storeFailedEvent(event: AnalyticsEvent): void {
    if (typeof localStorage !== 'undefined') {
      const failedEvents = JSON.parse(localStorage.getItem('failed_analytics_events') || '[]');
      failedEvents.push(event);
      localStorage.setItem('failed_analytics_events', JSON.stringify(failedEvents));
    }
  }

  public retryFailedEvents(): void {
    if (typeof localStorage !== 'undefined') {
      const failedEvents = JSON.parse(localStorage.getItem('failed_analytics_events') || '[]');
      failedEvents.forEach((event: AnalyticsEvent) => {
        this.sendToServer(event);
      });
      localStorage.removeItem('failed_analytics_events');
    }
  }

  // Convenience methods for common events
  public trackPageView(pageUrl: string, userId?: string): void {
    this.track('page_view', { pageUrl }, userId);
  }

  public trackPublicationView(publicationId: string, userId?: string): void {
    this.track('publication_view', { publicationId }, userId);
  }

  public trackPublicationLike(publicationId: string, userId?: string): void {
    this.track('publication_like', { publicationId }, userId);
  }

  public trackSearch(query: string, resultsCount: number, userId?: string): void {
    this.track('search_query', { query, resultsCount }, userId);
  }

  public trackCMEComplete(publicationId: string, userId?: string): void {
    this.track('cme_complete', { publicationId }, userId);
  }

  public trackVideoInteraction(publicationId: string, action: 'play' | 'pause' | 'complete', currentTime: number, userId?: string): void {
    this.track(`video_${action}` as EventType, { publicationId, currentTime }, userId);
  }

  public trackMedicalTermSearch(term: string, category: string, userId?: string): void {
    this.track('medical_term_search', { term, category }, userId);
  }

  public trackPHIDetection(count: number, types: string[], userId?: string): void {
    this.track('phi_detected', { count, types }, userId);
  }
}

// Engagement scoring algorithm
export class EngagementScorer {
  public static calculateEngagementScore(metrics: Partial<ContentMetrics>): number {
    let score = 0;
    
    // Base scoring weights
    const weights = {
      views: 0.1,
      uniqueViews: 0.2,
      likes: 1.5,
      shares: 3.0,
      bookmarks: 2.0,
      comments: 2.5,
      cmeCompletions: 5.0,
      avgTimeOnPage: 0.001, // per second
      lowBounceRate: 2.0, // bonus for low bounce rate
    };

    // Calculate weighted score
    score += (metrics.views || 0) * weights.views;
    score += (metrics.uniqueViews || 0) * weights.uniqueViews;
    score += (metrics.likes || 0) * weights.likes;
    score += (metrics.shares || 0) * weights.shares;
    score += (metrics.bookmarks || 0) * weights.bookmarks;
    score += (metrics.comments || 0) * weights.comments;
    score += (metrics.cmeCompletions || 0) * weights.cmeCompletions;
    score += (metrics.avgTimeOnPage || 0) * weights.avgTimeOnPage;

    // Bonus for low bounce rate (high engagement)
    if (metrics.bounceRate && metrics.bounceRate < 0.3) {
      score += weights.lowBounceRate;
    }

    // Normalize score (0-100 scale)
    return Math.min(Math.round(score), 100);
  }

  public static getUserEngagementLevel(engagement: Partial<UserEngagement>): 'Low' | 'Medium' | 'High' | 'Expert' {
    const score = this.calculateUserEngagementScore(engagement);
    
    if (score >= 80) return 'Expert';
    if (score >= 60) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  }

  private static calculateUserEngagementScore(engagement: Partial<UserEngagement>): number {
    let score = 0;
    
    // User engagement weights
    const weights = {
      sessions: 0.5,
      timeSpent: 0.001, // per minute
      publicationsViewed: 0.2,
      publicationsCreated: 5.0,
      commentsPosted: 1.0,
      likesGiven: 0.1,
      sharesPerformed: 2.0,
      cmeCreditsEarned: 3.0,
    };

    score += (engagement.totalSessions || 0) * weights.sessions;
    score += ((engagement.totalTimeSpent || 0) / 60) * weights.timeSpent; // convert seconds to minutes
    score += (engagement.publicationsViewed || 0) * weights.publicationsViewed;
    score += (engagement.publicationsCreated || 0) * weights.publicationsCreated;
    score += (engagement.commentsPosted || 0) * weights.commentsPosted;
    score += (engagement.likesGiven || 0) * weights.likesGiven;
    score += (engagement.sharesPerformed || 0) * weights.sharesPerformed;
    score += (engagement.cmeCreditsEarned || 0) * weights.cmeCreditsEarned;

    return Math.min(Math.round(score), 100);
  }
}

// Time-based analytics helpers
export class TimeRangeHelper {
  public static getDateRange(range: '24h' | '7d' | '30d' | '90d' | '1y'): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  public static groupDataByPeriod<T extends { timestamp: Date }>(
    data: T[],
    period: 'hour' | 'day' | 'week' | 'month'
  ): Record<string, T[]> {
    return data.reduce((groups, item) => {
      const key = this.getTimePeriodKey(item.timestamp, period);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  private static getTimePeriodKey(date: Date, period: 'hour' | 'day' | 'week' | 'month'): string {
    switch (period) {
      case 'hour':
        return date.toISOString().slice(0, 13) + ':00:00';
      case 'day':
        return date.toISOString().slice(0, 10);
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().slice(0, 10);
      case 'month':
        return date.toISOString().slice(0, 7);
      default:
        return date.toISOString().slice(0, 10);
    }
  }
}

// Export singleton instance
export const analytics = AnalyticsTracker.getInstance();