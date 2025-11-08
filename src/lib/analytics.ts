/**
 * Analytics and Monitoring
 * 
 * Centralized analytics tracking for Google Analytics and Vercel Analytics
 */

// Google Analytics tracking
export function trackEvent(category: string, action: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }
}

// Track errors
export function trackError(error: Error, errorInfo?: any) {
  if (typeof window !== 'undefined') {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', error, errorInfo);
    }

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    // Send to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          error: errorInfo,
        },
      });
    }
  }
}

// Track user actions
export const Analytics = {
  // Itinerary actions
  itineraryCreated: (destination: string) => {
    trackEvent('Itinerary', 'Created', destination);
  },
  itineraryViewed: (itineraryId: string) => {
    trackEvent('Itinerary', 'Viewed', itineraryId);
  },
  itineraryShared: (itineraryId: string) => {
    trackEvent('Itinerary', 'Shared', itineraryId);
  },

  // User actions
  userSignedUp: () => {
    trackEvent('User', 'Signed Up');
  },
  userSignedIn: () => {
    trackEvent('User', 'Signed In');
  },

  // Payment actions
  checkoutStarted: () => {
    trackEvent('Payment', 'Checkout Started');
  },
  checkoutCompleted: (amount: number) => {
    trackEvent('Payment', 'Checkout Completed', undefined, amount);
  },
  checkoutCanceled: () => {
    trackEvent('Payment', 'Checkout Canceled');
  },

  // Feature usage
  packingListGenerated: (destination: string) => {
    trackEvent('Feature', 'Packing List Generated', destination);
  },
  crowdLevelViewed: (location: string) => {
    trackEvent('Feature', 'Crowd Level Viewed', location);
  },
  mapViewed: (destination: string) => {
    trackEvent('Feature', 'Map Viewed', destination);
  },
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: any
    ) => void;
    dataLayer?: any[];
  }
}

