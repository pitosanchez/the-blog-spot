// Analytics utility for The Blog Spot Creator Platform
// Supports Google Analytics 4, custom events, and performance monitoring

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp?: number;
}

interface UserProperties {
  user_id?: string;
  creator_type?: string;
  is_verified?: boolean;
  member_since?: string;
  total_earnings?: number;
  subscriber_count?: number;
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
  }

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
   * Track creator signup
   */
  trackCreatorSignup(creatorType: string, source?: string) {
    this.track("creator_signup", {
      creator_type: creatorType,
      signup_source: source,
    });
  }

  /**
   * Track creator earnings
   */
  trackCreatorEarnings(amount: number, type: string) {
    this.track("creator_earnings", {
      amount,
      earnings_type: type,
      currency: "USD",
    });
  }

  /**
   * Track subscription events
   */
  trackSubscription(action: string, subscriberId?: string, amount?: number) {
    this.track("subscription_event", {
      action,
      subscriber_id: subscriberId,
      amount,
      currency: "USD",
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

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
