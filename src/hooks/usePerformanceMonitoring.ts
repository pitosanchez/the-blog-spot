import { useEffect, useRef, useState } from "react";
import { analytics } from "../utils/analytics";

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  memoryUsage?: number;
}

interface UsePerformanceMonitoringOptions {
  componentName: string;
  trackRenders?: boolean;
  trackMemory?: boolean;
  slowRenderThreshold?: number;
  enabled?: boolean;
}

export const usePerformanceMonitoring = ({
  componentName,
  trackRenders = true,
  trackMemory = false,
  slowRenderThreshold = 16, // 16ms for 60fps
  enabled = process.env.NODE_ENV === "development",
}: UsePerformanceMonitoringOptions) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
  });

  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const updateCountRef = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  // Start timing on each render
  if (enabled && trackRenders) {
    renderStartRef.current = performance.now();
  }

  useEffect(() => {
    if (!enabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartRef.current;

    if (isFirstRender.current) {
      // First render is mount time
      mountTimeRef.current = renderTime;
      isFirstRender.current = false;

      // Track component mount
      analytics.track("component_mount", {
        component_name: componentName,
        mount_time: renderTime,
      });
    } else {
      // Subsequent renders are updates
      updateCountRef.current += 1;

      // Track slow renders
      if (renderTime > slowRenderThreshold) {
        analytics.track("slow_render", {
          component_name: componentName,
          render_time: renderTime,
          threshold: slowRenderThreshold,
          update_count: updateCountRef.current,
        });
      }
    }

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      renderTime,
      mountTime: mountTimeRef.current,
      updateCount: updateCountRef.current,
      memoryUsage: trackMemory ? getMemoryUsage() : undefined,
    }));
  }, [componentName, enabled, trackMemory, slowRenderThreshold]);

  // Cleanup on unmount
  useEffect(() => {
    if (!enabled) return;

    return () => {
      analytics.track("component_unmount", {
        component_name: componentName,
        total_updates: updateCountRef.current,
        mount_time: mountTimeRef.current,
      });
    };
  }, [componentName, enabled]);

  return {
    metrics,
    trackCustomMetric: (metricName: string, value: number) => {
      if (!enabled) return;

      analytics.track("custom_performance_metric", {
        component_name: componentName,
        metric_name: metricName,
        metric_value: value,
      });
    },
  };
};

function getMemoryUsage(): number | undefined {
  if (typeof window !== "undefined" && "memory" in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return undefined;
}

// Hook for monitoring page load performance
export const usePagePerformance = (pageName: string) => {
  const [pageMetrics, setPageMetrics] = useState<{
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
  } | null>(null);

  useEffect(() => {
    const measurePagePerformance = () => {
      if (typeof window === "undefined" || !window.performance) return;

      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics = {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstContentfulPaint: getFirstContentfulPaint() || 0,
        };

        setPageMetrics(metrics);

        // Track page performance
        analytics.track("page_performance", {
          page_name: pageName,
          ...metrics,
        });
      }
    };

    // Wait for page load to complete
    if (document.readyState === "complete") {
      measurePagePerformance();
    } else {
      window.addEventListener("load", measurePagePerformance);
      return () => window.removeEventListener("load", measurePagePerformance);
    }
  }, [pageName]);

  return pageMetrics;
};

function getFirstContentfulPaint(): number | undefined {
  const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
  return fcpEntry?.startTime;
}
