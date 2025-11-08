import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { app } from '@/lib/env';

/**
 * Sitemap
 * 
 * Generates sitemap for SEO
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = app.url || 'https://terratraks.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/featured`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Get public preset itineraries
  try {
    const presetItineraries = await prisma.itinerary.findMany({
      where: {
        isPreset: true,
        isPublic: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 1000, // Limit to prevent timeout
    });

    const itineraryPages: MetadataRoute.Sitemap = presetItineraries.map(
      (itinerary) => ({
        url: `${baseUrl}/itinerary/${itinerary.id}`,
        lastModified: itinerary.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    );

    return [...staticPages, ...itineraryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if database query fails
    return staticPages;
  }
}

