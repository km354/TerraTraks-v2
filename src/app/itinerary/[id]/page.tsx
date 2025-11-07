import Link from 'next/link';

/**
 * Itinerary Detail Page
 * 
 * Displays a saved itinerary with details
 */
export default function ItineraryPage({
  params,
}: {
  params: { id: string };
}) {
  // This is a placeholder - in the future, this will fetch the itinerary from the database
  const itineraryId = params.id;

  return (
    <main className="min-h-screen bg-offwhite py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-forest mb-2">
                  Trip to Paris, France
                </h1>
                <p className="text-forest/70 text-lg">
                  June 1, 2024 - June 7, 2024
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-sky hover:text-sky-dark text-sm font-medium flex items-center"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <p className="text-forest/80 mt-4 text-lg leading-relaxed">
              A wonderful trip to the City of Light with visits to iconic
              landmarks and delicious French cuisine.
            </p>
          </div>

          {/* Itinerary Items */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-forest mb-8">
              Itinerary
            </h2>

            <div className="space-y-8">
              {/* Day 1 */}
              <div className="border-l-4 border-sage pl-6">
                <h3 className="text-xl font-semibold text-forest mb-4">
                  Day 1 - June 1, 2024
                </h3>
                <div className="space-y-4">
                  <div className="bg-sage-light/30 p-5 rounded-lg border border-sage/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-forest text-lg">
                          Visit Eiffel Tower
                        </h4>
                        <p className="text-forest/70 mt-2">
                          See the iconic Eiffel Tower
                        </p>
                        <p className="text-forest/60 mt-2 text-sm">
                          📍 Eiffel Tower, Paris
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-sky-light text-forest rounded-full">
                        Activity
                      </span>
                    </div>
                  </div>
                  <div className="bg-sage-light/30 p-5 rounded-lg border border-sage/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-forest text-lg">
                          Lunch at Café de Flore
                        </h4>
                        <p className="text-forest/70 mt-2">
                          Traditional French cuisine
                        </p>
                        <p className="text-forest/60 mt-2 text-sm">
                          📍 Café de Flore, Paris
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-sand text-forest rounded-full">
                        Food
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="border-l-4 border-sage pl-6">
                <h3 className="text-xl font-semibold text-forest mb-4">
                  Day 2 - June 2, 2024
                </h3>
                <div className="space-y-4">
                  <div className="bg-sage-light/30 p-5 rounded-lg border border-sage/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-forest text-lg">
                          Louvre Museum
                        </h4>
                        <p className="text-forest/70 mt-2">
                          Visit the world-famous museum
                        </p>
                        <p className="text-forest/60 mt-2 text-sm">
                          📍 Louvre Museum, Paris
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-sky-light text-forest rounded-full">
                        Activity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-forest mb-8">
              Expenses
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-sage-light/20 rounded-lg border border-sage/20">
                <div>
                  <h4 className="font-semibold text-forest">Hotel Booking</h4>
                  <p className="text-sm text-forest/70 mt-1">
                    Hotel stay for 6 nights
                  </p>
                </div>
                <span className="text-xl font-bold text-forest">
                  $1,200.00
                </span>
              </div>
              <div className="flex justify-between items-center p-5 bg-sage-light/20 rounded-lg border border-sage/20">
                <div>
                  <h4 className="font-semibold text-forest">Flight Tickets</h4>
                  <p className="text-sm text-forest/70 mt-1">Round trip flight</p>
                </div>
                <span className="text-xl font-bold text-forest">
                  $800.00
                </span>
              </div>
              <div className="border-t-2 border-sage/30 pt-5 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-forest">Total</span>
                  <span className="text-3xl font-bold text-forest">
                    $2,000.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-sage-light/50 rounded-lg border border-sage/30">
            <p className="text-sm text-forest/80">
              <strong>Note:</strong> This is a placeholder page showing sample
              itinerary data. The functionality to fetch and display actual
              itineraries from the database will be implemented in future
              updates.
            </p>
          </div>
        </div>
      </main>
  );
}
