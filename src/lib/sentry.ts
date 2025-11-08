/**
 * Sentry Error Tracking
 * 
 * Configure Sentry for error tracking in production
 */

export function initSentry() {
  // Only initialize Sentry in production and if DSN is provided
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    // Sentry will be initialized by @sentry/nextjs automatically
    // This file can be used for custom Sentry configuration
    return true;
  }
  return false;
}

// Error boundary helper
export function captureException(error: Error, context?: any) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  }
  console.error('Error:', error, context);
}

// Capture message
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureMessage(message, level);
  }
}

