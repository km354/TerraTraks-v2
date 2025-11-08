import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PresetItineraryCard } from '@/components/PresetItineraryCard';

/**
 * Featured Itineraries Page
 * 
 * Displays preset/template itineraries that users can browse and copy
 */
export default async function FeaturedItinerariesPage() {
  const session = await auth();

  // Fetch featured preset itineraries
  const presetItineraries = await prisma.itinerary.findMany({
    where: {
      isPreset: true,
      featured: true,
    },
    include: {
      items: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Also fetch all preset itineraries (not just featured)
  const allPresetItineraries = await prisma.itinerary.findMany({
    where: {
      isPreset: true,
    },
    include: {
      items: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      featured: 'desc', // Featured first
      createdAt: 'desc',
    },
  });

  const featured = presetItineraries;
  const others = allPresetItineraries.filter(
    (it) => !it.featured
  );

  return (
    <main className="min-h-screen bg-offwhite">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest to-sage text-offwhite py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Itineraries
            </h1>
            <p className="text-xl text-offwhite/90 max-w-2xl mx-auto">
              Discover handcrafted travel plans for popular destinations. Copy
              any itinerary to your account and customize it to fit your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold text-forest">⭐ Featured</h2>
              <div className="flex-1 h-px bg-sage/30"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((itinerary) => {
                const duration =
                  itinerary.startDate && itinerary.endDate
                    ? Math.ceil(
                        (new Date(itinerary.endDate).getTime() -
                          new Date(itinerary.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    : null;

                return (
                  <PresetItineraryCard
                    key={itinerary.id}
                    id={itinerary.id}
                    title={itinerary.title}
                    destination={itinerary.destination}
                    description={itinerary.description}
                    imageUrl={itinerary.presetImageUrl}
                    duration={duration || undefined}
                    budget={
                      itinerary.budget ? Number(itinerary.budget) : null
                    }
                    budgetCurrency={itinerary.budgetCurrency || 'USD'}
                    itemsCount={itinerary.items.length}
                    featured={itinerary.featured}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* All Preset Itineraries */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold text-forest">
                All Itineraries
              </h2>
              <div className="flex-1 h-px bg-sage/30"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((itinerary) => {
                const duration =
                  itinerary.startDate && itinerary.endDate
                    ? Math.ceil(
                        (new Date(itinerary.endDate).getTime() -
                          new Date(itinerary.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    : null;

                return (
                  <PresetItineraryCard
                    key={itinerary.id}
                    id={itinerary.id}
                    title={itinerary.title}
                    destination={itinerary.destination}
                    description={itinerary.description}
                    imageUrl={itinerary.presetImageUrl}
                    duration={duration || undefined}
                    budget={
                      itinerary.budget ? Number(itinerary.budget) : null
                    }
                    budgetCurrency={itinerary.budgetCurrency || 'USD'}
                    itemsCount={itinerary.items.length}
                    featured={itinerary.featured}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allPresetItineraries.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-sage-light/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="h-10 w-10 text-sage"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-forest mb-2">
              No Preset Itineraries Available
            </h3>
            <p className="text-forest/60">
              Check back soon for featured travel itineraries!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

