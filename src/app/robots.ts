import { MetadataRoute } from 'next';
import { app } from '@/lib/env';

/**
 * Robots.txt
 * 
 * Controls search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = app.url || 'https://terratraks.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/new-itinerary',
          '/auth/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

