// Analytics utility for The Blog Spot
// Supports Google Analytics 4, custom events, and performance monitoring

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp?: number;
}

interface UserProperties {
  user_id?: string;
  membership_tier?: "free" | "storyteller" | "creator";
  is_verified?: boolean;
  member_since?: string;
  stories_published?: number;
  total_reads?: number;
}

interface PerformanceMetrics {
  page_load_time?: number;
  first_contentful_paint?: number;
  largest_contentful_paint?: number;
  cumulative_layout_shift?: number;
  first_input_delay?: number;
  time_to_interactive?: number;
}

class Analytics {
  private isInitialized = false;
  private isDevelopment = import.meta.env.DEV;
  private events: AnalyticsEvent[] = [];
  private userProperties: UserProperties = {};

  constructor() {
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    if (this.isDevelopment) {
      console.log("📊 Analytics initialized in development mode");
      this.isInitialized = true;
      return;
    }

    // Initialize Google Analytics 4 in production
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_title: document.title,
        page_location: window.location.href,
      });
      this.isInitialized = true;
    }

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring() {
    if (typeof window === "undefined") return;

    // Monitor Core Web Vitals
    this.monitorWebVitals();

    // Monitor page load performance
    window.addEventListener("load", () => {
      this.trackPagePerformance();
    });
  }

  private monitorWebVitals() {
    // This would integrate with web-vitals library in production
    if (typeof window === "undefined") return;

    // Monitor LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.track("web_vital_lcp", {
        value: lastEntry.startTime,
        metric_type: "largest_contentful_paint",
      });
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // Monitor FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        this.track("web_vital_fid", {
          value: entry.processingStart - entry.startTime,
          metric_type: "first_input_delay",
        });
      });
    }).observe({ entryTypes: ["first-input"] });

    // Monitor CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.track("web_vital_cls", {
        value: clsValue,
        metric_type: "cumulative_layout_shift",
      });
    }).observe({ entryTypes: ["layout-shift"] });
  }

  private trackPagePerformance() {
    if (typeof window === "undefined" || !window.performance) return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics: PerformanceMetrics = {
        page_load_time: navigation.loadEventEnd - navigation.fetchStart,
        first_contentful_paint: this.getFirstContentfulPaint(),
        time_to_interactive: this.getTimeToInteractive(),
      };

      this.track("page_performance", metrics);
    }
  }

  private getFirstContentfulPaint(): number | undefined {
    const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
    return fcpEntry?.startTime;
  }

  private getTimeToInteractive(): number | undefined {
    // Simplified TTI calculation - in production, use a proper library
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return navigationEntry?.domInteractive - navigationEntry?.fetchStart;
  }

  // Public API methods

  /**
   * Track a custom event
   */
  track(eventName: string, parameters: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name: eventName,
      parameters: {
        ...parameters,
        timestamp: Date.now(),
        page_url: typeof window !== "undefined" ? window.location.href : "",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
      timestamp: Date.now(),
    };

    if (this.isDevelopment) {
      console.log("📊 Analytics Event:", event);
      this.events.push(event);
      return;
    }

    // Send to Google Analytics 4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, parameters);
    }

    // Store for batch sending
    this.events.push(event);

    // Send events in batches
    if (this.events.length >= 10) {
      this.flushEvents();
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties };

    if (this.isDevelopment) {
      console.log("📊 User Properties:", this.userProperties);
      return;
    }

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        custom_map: properties,
      });
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string, title?: string) {
    this.track("page_view", {
      page_title: title || document.title,
      page_location: typeof window !== "undefined" ? window.location.href : "",
      page_path: page,
    });
  }

  /**
   * Track story interactions
   */
  trackStoryInteraction(
    action: string,
    storyId: string,
    additionalData: Record<string, any> = {}
  ) {
    this.track("story_interaction", {
      action,
      story_id: storyId,
      ...additionalData,
    });
  }

  /**
   * Track user engagement
   */
  trackEngagement(type: string, data: Record<string, any> = {}) {
    this.track("user_engagement", {
      engagement_type: type,
      ...data,
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(type: string, value?: number, currency = "USD") {
    this.track("conversion", {
      conversion_type: type,
      value,
      currency,
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context: Record<string, any> = {}) {
    this.track("error", {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit = "ms") {
    this.track("performance_metric", {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit,
    });
  }

  /**
   * Track search queries
   */
  trackSearch(query: string, results: number, category?: string) {
    this.track("search", {
      search_term: query,
      search_results: results,
      search_category: category,
    });
  }

  /**
   * Track social sharing
   */
  trackShare(platform: string, contentType: string, contentId: string) {
    this.track("share", {
      platform,
      content_type: contentType,
      content_id: contentId,
    });
  }

  /**
   * Flush pending events
   */
  private flushEvents() {
    if (this.events.length === 0) return;

    if (this.isDevelopment) {
      console.log("📊 Flushing events:", this.events);
      this.events = [];
      return;
    }

    // In production, send events to analytics service
    // This could be Google Analytics, Mixpanel, or custom analytics
    this.events = [];
  }

  /**
   * Get analytics data for debugging
   */
  getDebugData() {
    return {
      isInitialized: this.isInitialized,
      isDevelopment: this.isDevelopment,
      events: this.events,
      userProperties: this.userProperties,
    };
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Convenience functions for common tracking
export const trackStoryView = (storyId: string, category: string) => {
  analytics.trackStoryInteraction("view", storyId, { category });
};

export const trackStoryLike = (storyId: string) => {
  analytics.trackStoryInteraction("like", storyId);
};

export const trackStoryShare = (storyId: string, platform: string) => {
  analytics.trackShare(platform, "story", storyId);
};

export const trackCommentAdd = (storyId: string, isReply: boolean) => {
  analytics.trackEngagement("comment", {
    story_id: storyId,
    is_reply: isReply,
  });
};

export const trackMembershipUpgrade = (
  fromTier: string,
  toTier: string,
  value: number
) => {
  analytics.trackConversion("membership_upgrade", value);
  analytics.track("membership_change", {
    from_tier: fromTier,
    to_tier: toTier,
  });
};

export const trackNewsletterSignup = (source: string) => {
  analytics.trackConversion("newsletter_signup");
  analytics.track("newsletter_signup", { source });
};

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
