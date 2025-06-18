import { analytics } from "./analytics";

interface ErrorReport {
  id: string;
  timestamp: number;
  type: "javascript" | "react" | "network" | "performance" | "user";
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  metadata: Record<string, any>;
  severity: "low" | "medium" | "high" | "critical";
}

interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  responseTime: number;
}

interface PerformanceIssue {
  metric: string;
  value: number;
  threshold: number;
  url: string;
}

class ErrorTracker {
  private sessionId: string;
  private userId?: string;
  private errors: ErrorReport[] = [];
  private isDevelopment = import.meta.env.DEV;
  private maxErrors = 50; // Prevent memory leaks

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeErrorTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeErrorTracking() {
    if (typeof window === "undefined") return;

    // Global error handler
    window.addEventListener("error", (event) => {
      this.trackJavaScriptError(event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.trackJavaScriptError(new Error(event.reason));
    });

    // Network error monitoring
    this.monitorNetworkErrors();

    // Performance monitoring
    this.monitorPerformanceIssues();
  }

  private monitorNetworkErrors() {
    if (typeof window === "undefined") return;

    // Monkey patch fetch for error monitoring
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        if (!response.ok) {
          this.trackNetworkError({
            url: args[0] as string,
            method: (args[1]?.method as string) || "GET",
            status: response.status,
            statusText: response.statusText,
            responseTime,
          });
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        this.trackNetworkError({
          url: args[0] as string,
          method: (args[1]?.method as string) || "GET",
          status: 0,
          statusText: "Network Error",
          responseTime,
        });

        throw error;
      }
    };
  }

  private monitorPerformanceIssues() {
    if (typeof window === "undefined") return;

    // Monitor slow page loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;

          if (loadTime > 3000) {
            // 3 seconds threshold
            this.trackPerformanceIssue({
              metric: "page_load_time",
              value: loadTime,
              threshold: 3000,
              url: window.location.href,
            });
          }
        }
      }, 0);
    });

    // Monitor memory usage (if available)
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) {
          // 50MB threshold
          this.trackPerformanceIssue({
            metric: "memory_usage",
            value: memory.usedJSHeapSize,
            threshold: 50 * 1024 * 1024,
            url: window.location.href,
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private createErrorReport(
    type: ErrorReport["type"],
    message: string,
    severity: ErrorReport["severity"],
    metadata: Record<string, any> = {},
    stack?: string
  ): ErrorReport {
    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      message,
      stack,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      userId: this.userId,
      sessionId: this.sessionId,
      metadata,
      severity,
    };
  }

  private reportError(errorReport: ErrorReport) {
    // Add to local storage for debugging
    this.errors.push(errorReport);

    // Prevent memory leaks
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log in development
    if (this.isDevelopment) {
      console.error("🚨 Error Tracked:", errorReport);
    }

    // Send to analytics
    analytics.trackError(new Error(errorReport.message), {
      error_id: errorReport.id,
      error_type: errorReport.type,
      error_severity: errorReport.severity,
      session_id: errorReport.sessionId,
      user_id: errorReport.userId,
      ...errorReport.metadata,
    });

    // Send to external error tracking service (Sentry, Bugsnag, etc.)
    this.sendToErrorService(errorReport);
  }

  private sendToErrorService(errorReport: ErrorReport) {
    if (this.isDevelopment) return;

    // In production, send to error tracking service
    try {
      // Example: Sentry integration
      // Sentry.captureException(new Error(errorReport.message), {
      //   extra: errorReport.metadata,
      //   tags: {
      //     type: errorReport.type,
      //     severity: errorReport.severity,
      //   },
      // });

      // Use errorReport to avoid TypeScript warning
      console.log("Error service integration ready for:", errorReport.id);
    } catch (error) {
      console.error("Failed to send error to tracking service:", error);
    }
  }

  // Public API methods

  /**
   * Set the current user ID for error tracking
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Track a JavaScript error
   */
  trackJavaScriptError(error: Error) {
    const errorReport = this.createErrorReport(
      "javascript",
      error.message,
      "high",
      {},
      error.stack
    );
    this.reportError(errorReport);
  }

  /**
   * Track a React component error
   */
  trackReactError(error: Error, errorInfo: React.ErrorInfo) {
    const errorReport = this.createErrorReport(
      "react",
      error.message,
      "high",
      {
        component_stack: errorInfo.componentStack,
      },
      error.stack
    );
    this.reportError(errorReport);
  }

  /**
   * Track a network error
   */
  trackNetworkError(networkError: NetworkError) {
    const severity = networkError.status >= 500 ? "high" : "medium";
    const errorReport = this.createErrorReport(
      "network",
      `Network error: ${networkError.status} ${networkError.statusText}`,
      severity,
      {
        url: networkError.url,
        method: networkError.method,
        status: networkError.status,
        status_text: networkError.statusText,
        response_time: networkError.responseTime,
      }
    );
    this.reportError(errorReport);
  }

  /**
   * Track a performance issue
   */
  trackPerformanceIssue(issue: PerformanceIssue) {
    const errorReport = this.createErrorReport(
      "performance",
      `Performance issue: ${issue.metric} (${issue.value}ms) exceeds threshold (${issue.threshold}ms)`,
      "medium",
      {
        metric: issue.metric,
        value: issue.value,
        threshold: issue.threshold,
        url: issue.url,
      }
    );
    this.reportError(errorReport);
  }

  /**
   * Track a user-reported issue
   */
  trackUserReportedIssue(
    description: string,
    category: string,
    metadata: Record<string, any> = {}
  ) {
    const errorReport = this.createErrorReport(
      "user",
      `User reported: ${description}`,
      "low",
      {
        category,
        user_description: description,
        ...metadata,
      }
    );
    this.reportError(errorReport);
  }

  /**
   * Get error statistics for debugging
   */
  getErrorStats() {
    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errors.length,
      byType: errorsByType,
      bySeverity: errorsBySeverity,
      recent: this.errors.slice(-5),
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  /**
   * Clear all tracked errors (for testing)
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Get all errors for debugging
   */
  getAllErrors() {
    return [...this.errors];
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Convenience functions
export const trackError = (error: Error) => {
  errorTracker.trackJavaScriptError(error);
};

export const trackNetworkError = (
  url: string,
  status: number,
  method = "GET"
) => {
  errorTracker.trackNetworkError({
    url,
    method,
    status,
    statusText: `HTTP ${status}`,
    responseTime: 0,
  });
};

export const trackUserIssue = (description: string, category: string) => {
  errorTracker.trackUserReportedIssue(description, category);
};

export default errorTracker;
