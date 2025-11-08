'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

/**
 * Google Analytics Component
 * 
 * Loads Google Analytics and tracks page views
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Track page views on route change
  useEffect(() => {
    if (gaId && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams, gaId]);

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

