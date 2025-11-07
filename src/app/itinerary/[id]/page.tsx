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
    <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Trip to Paris, France
                </h1>
                <p className="text-gray-600">
                  June 1, 2024 - June 7, 2024
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <p className="text-gray-700 mt-4">
              A wonderful trip to the City of Light with visits to iconic
              landmarks and delicious French cuisine.
            </p>
          </div>

          {/* Itinerary Items */}
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Itinerary
            </h2>

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Day 1 - June 1, 2024
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Visit Eiffel Tower
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          See the iconic Eiffel Tower
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          📍 Eiffel Tower, Paris
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Activity
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Lunch at Café de Flore
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Traditional French cuisine
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          📍 Café de Flore, Paris
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Food
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Day 2 - June 2, 2024
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Louvre Museum
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Visit the world-famous museum
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          📍 Louvre Museum, Paris
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Activity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Expenses
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Hotel Booking</h4>
                  <p className="text-sm text-gray-600">
                    Hotel stay for 6 nights
                  </p>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  $1,200.00
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Flight Tickets</h4>
                  <p className="text-sm text-gray-600">Round trip flight</p>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  $800.00
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    $2,000.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
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

