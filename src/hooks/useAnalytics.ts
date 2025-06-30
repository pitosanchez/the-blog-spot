"use client";

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { analytics, type EventType } from '@/lib/analytics';

export function useAnalytics() {
  const { data: session } = useSession();

  // Track page views automatically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      analytics.trackPageView(window.location.href, session?.user?.id);
      
      // Retry any failed events on session load
      analytics.retryFailedEvents();
    }
  }, [session?.user?.id]);

  // General event tracking function
  const trackEvent = useCallback((eventType: EventType, eventData: Record<string, any> = {}) => {
    analytics.track(eventType, eventData, session?.user?.id);
  }, [session?.user?.id]);

  // Specific tracking functions
  const trackPublicationView = useCallback((publicationId: string, timeSpent?: number) => {
    analytics.trackPublicationView(publicationId, session?.user?.id);
    
    if (timeSpent) {
      analytics.track('page_view', { 
        publicationId, 
        timeSpent,
        pageType: 'publication'
      }, session?.user?.id);
    }
  }, [session?.user?.id]);

  const trackPublicationLike = useCallback((publicationId: string) => {
    analytics.trackPublicationLike(publicationId, session?.user?.id);
  }, [session?.user?.id]);

  const trackPublicationShare = useCallback((publicationId: string, shareMethod: string) => {
    analytics.track('publication_share', { 
      publicationId, 
      shareMethod 
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackPublicationBookmark = useCallback((publicationId: string) => {
    analytics.track('publication_bookmark', { 
      publicationId 
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackCommentCreate = useCallback((publicationId: string, commentLength: number) => {
    analytics.track('comment_create', { 
      publicationId, 
      commentLength 
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackSearch = useCallback((query: string, resultsCount: number, category?: string) => {
    analytics.trackSearch(query, resultsCount, session?.user?.id);
    
    if (category) {
      analytics.track('search_query', { 
        query, 
        resultsCount, 
        category 
      }, session?.user?.id);
    }
  }, [session?.user?.id]);

  const trackCMEStart = useCallback((publicationId: string) => {
    analytics.track('cme_start', { 
      publicationId,
      startTime: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackCMEComplete = useCallback((publicationId: string, duration: number, score?: number) => {
    analytics.trackCMEComplete(publicationId, session?.user?.id);
    analytics.track('cme_complete', { 
      publicationId, 
      duration,
      score,
      completedAt: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackVideoInteraction = useCallback((
    publicationId: string, 
    action: 'play' | 'pause' | 'complete',
    currentTime: number,
    duration?: number
  ) => {
    analytics.trackVideoInteraction(publicationId, action, currentTime, session?.user?.id);
    
    if (duration && action === 'complete') {
      analytics.track('video_complete', { 
        publicationId, 
        currentTime,
        duration,
        watchPercentage: (currentTime / duration) * 100
      }, session?.user?.id);
    }
  }, [session?.user?.id]);

  const trackMedicalTermSearch = useCallback((term: string, category: string, source: string = 'editor') => {
    analytics.trackMedicalTermSearch(term, category, session?.user?.id);
    analytics.track('medical_term_search', { 
      term, 
      category,
      source,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackDicomView = useCallback((imageId: string, viewDuration: number) => {
    analytics.track('dicom_view', { 
      imageId,
      viewDuration,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackPHIDetection = useCallback((detectionCount: number, types: string[], publicationId?: string) => {
    analytics.trackPHIDetection(detectionCount, types, session?.user?.id);
    analytics.track('phi_detected', { 
      detectionCount,
      types,
      publicationId,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackAutoSave = useCallback((publicationId: string, contentLength: number) => {
    analytics.track('auto_save_triggered', { 
      publicationId,
      contentLength,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackContentExport = useCallback((publicationId: string, exportFormat: string) => {
    analytics.track('content_export', { 
      publicationId,
      exportFormat,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackSubscriptionAction = useCallback((action: 'start' | 'cancel' | 'upgrade' | 'downgrade', tier?: string) => {
    analytics.track(`subscription_${action}` as EventType, { 
      tier,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackUserLogin = useCallback(() => {
    analytics.track('user_login', { 
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackUserLogout = useCallback(() => {
    analytics.track('user_logout', { 
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  const trackProfileUpdate = useCallback((updatedFields: string[]) => {
    analytics.track('profile_update', { 
      updatedFields,
      timestamp: new Date().toISOString()
    }, session?.user?.id);
  }, [session?.user?.id]);

  return {
    trackEvent,
    trackPublicationView,
    trackPublicationLike,
    trackPublicationShare,
    trackPublicationBookmark,
    trackCommentCreate,
    trackSearch,
    trackCMEStart,
    trackCMEComplete,
    trackVideoInteraction,
    trackMedicalTermSearch,
    trackDicomView,
    trackPHIDetection,
    trackAutoSave,
    trackContentExport,
    trackSubscriptionAction,
    trackUserLogin,
    trackUserLogout,
    trackProfileUpdate,
  };
}

// Hook for tracking time spent on page
export function usePageTimeTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      trackEvent('page_view', { 
        timeSpent: Math.round(timeSpent / 1000), // Convert to seconds
        pageUrl: window.location.href
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackEvent]);
}

// Hook for tracking scroll depth
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 100]) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const trackedThresholds = new Set<number>();
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      thresholds.forEach(threshold => {
        if (scrollPercentage >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackEvent('page_view', { 
            scrollDepth: threshold,
            pageUrl: window.location.href
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackEvent, thresholds]);
}

// Hook for tracking video engagement
export function useVideoTracking(videoElement: HTMLVideoElement | null, publicationId: string) {
  const { trackVideoInteraction } = useAnalytics();

  useEffect(() => {
    if (!videoElement) return;

    const handlePlay = () => {
      trackVideoInteraction(publicationId, 'play', videoElement.currentTime, videoElement.duration);
    };

    const handlePause = () => {
      trackVideoInteraction(publicationId, 'pause', videoElement.currentTime, videoElement.duration);
    };

    const handleEnded = () => {
      trackVideoInteraction(publicationId, 'complete', videoElement.currentTime, videoElement.duration);
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [videoElement, publicationId, trackVideoInteraction]);
}