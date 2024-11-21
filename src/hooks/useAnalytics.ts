import { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export type EventCategory = 
  | 'page_view'
  | 'interaction'
  | 'learning'
  | 'assessment'
  | 'engagement'
  | 'error'
  | 'performance'
  | 'user'
  | 'content'
  | 'system'
  | 'virtual_classroom'
  | 'whiteboard'
  | 'poll'
  | 'chat'
  | 'participant';

export type EventAction =
  | 'view'
  | 'click'
  | 'submit'
  | 'start'
  | 'complete'
  | 'pause'
  | 'resume'
  | 'skip'
  | 'search'
  | 'filter'
  | 'sort'
  | 'download'
  | 'upload'
  | 'share'
  | 'error'
  | 'success'
  | 'custom'
  | 'connect'
  | 'disconnect'
  | 'send_message'
  | 'toggle_audio'
  | 'toggle_video'
  | 'share_screen'
  | 'recording'
  | 'poll'
  | 'whiteboard'
  | 'participant'
  | 'permission';

export interface AnalyticsEvent {
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp?: number;
}

export interface PageViewEvent {
  path: string;
  title?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export interface ErrorEvent {
  error: Error;
  componentStack?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceEvent {
  metric: string;
  value: number;
  unit?: string;
  metadata?: Record<string, any>;
}

export interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (event: PageViewEvent) => void;
  trackError: (event: ErrorEvent) => void;
  trackPerformance: (event: PerformanceEvent) => void;
  startTracking: (id: string) => void;
  stopTracking: (id: string) => void;
  getSessionDuration: () => number;
  clearTracking: () => void;
}

const useAnalytics = (): UseAnalyticsReturn => {
  const authContext = useContext(AuthContext);
  const user = authContext?.state.user;

  // Track session duration
  const sessionStart = new Date().getTime();
  const trackingSessions = new Map<string, number>();

  const enrichEventData = useCallback((data: Record<string, any>) => {
    return {
      ...data,
      timestamp: new Date().getTime(),
      userId: user?.id,
      userRole: user?.role,
      sessionId: sessionStart,
      environment: import.meta.env.MODE,
      platform: 'web',
      // Add any other global properties here
    };
  }, [user]);

  const sendToAnalyticsService = useCallback(async (eventType: string, data: Record<string, any>) => {
    try {
      // Implement your analytics service integration here
      // For example:
      // await analyticsService.track(eventType, enrichEventData(data));
      
      // For development, log to console
      if (import.meta.env.DEV) {
        console.log(`[Analytics - ${eventType}]`, enrichEventData(data));
      }
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }, [enrichEventData]);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    sendToAnalyticsService('event', {
      ...event,
      metadata: {
        ...event.metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    });
  }, [sendToAnalyticsService]);

  const trackPageView = useCallback((event: PageViewEvent) => {
    sendToAnalyticsService('pageview', {
      ...event,
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    });
  }, [sendToAnalyticsService]);

  const trackError = useCallback((event: ErrorEvent) => {
    sendToAnalyticsService('error', {
      name: event.error.name,
      message: event.error.message,
      stack: event.error.stack,
      componentStack: event.componentStack,
      metadata: {
        ...event.metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    });
  }, [sendToAnalyticsService]);

  const trackPerformance = useCallback((event: PerformanceEvent) => {
    sendToAnalyticsService('performance', {
      ...event,
      metadata: {
        ...event.metadata,
        url: window.location.href,
        userAgent: navigator.userAgent,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        connectionType: (navigator as any).connection?.effectiveType,
      },
    });
  }, [sendToAnalyticsService]);

  const startTracking = useCallback((id: string) => {
    trackingSessions.set(id, new Date().getTime());
  }, []);

  const stopTracking = useCallback((id: string) => {
    const startTime = trackingSessions.get(id);
    if (startTime) {
      const duration = new Date().getTime() - startTime;
      trackingSessions.delete(id);
      return duration;
    }
    return 0;
  }, []);

  const getSessionDuration = useCallback(() => {
    return new Date().getTime() - sessionStart;
  }, []);

  const clearTracking = useCallback(() => {
    trackingSessions.clear();
  }, []);

  // Track initial page load
  useEffect(() => {
    trackPageView({
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }, [trackPageView]);

  // Track performance metrics
  useEffect(() => {
    if ('performance' in window) {
      // Track navigation timing
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        trackPerformance({
          metric: 'page_load',
          value: navigationTiming.loadEventEnd - navigationTiming.startTime,
          unit: 'ms',
        });
      }

      // Track largest contentful paint
      const observeLCP = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        trackPerformance({
          metric: 'largest_contentful_paint',
          value: lastEntry.startTime,
          unit: 'ms',
        });
      });
      observeLCP.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track first input delay
      const observeFID = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          trackPerformance({
            metric: 'first_input_delay',
            value: entry.duration,
            unit: 'ms',
          });
        });
      });
      observeFID.observe({ entryTypes: ['first-input'] });

      return () => {
        observeLCP.disconnect();
        observeFID.disconnect();
      };
    }
  }, [trackPerformance]);

  return {
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    startTracking,
    stopTracking,
    getSessionDuration,
    clearTracking,
  };
};

export default useAnalytics;
