import Link from 'next/link';

/**
 * Dashboard Page
 * 
 * For logged-in users to see their itineraries and profile
 */
export default function DashboardPage() {
  // This is a placeholder - in the future, this will fetch user data and itineraries from the database

  return (
    <main className="min-h-screen bg-offwhite py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-forest mb-3">
              Dashboard
            </h1>
            <p className="text-xl text-forest/70">
              Manage your itineraries and account settings
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center">
                <div className="h-20 w-20 bg-sage-light rounded-full flex items-center justify-center">
                  <span className="text-3xl font-semibold text-forest">
                    JD
                  </span>
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-semibold text-forest">
                    John Doe
                  </h2>
                  <p className="text-forest/70 mt-1">demo@terratraks.com</p>
                  <span className="inline-block mt-3 px-4 py-1.5 text-sm font-medium bg-sage-light text-forest rounded-full">
                    Free Plan
                  </span>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/pricing"
                  className="px-6 py-3 border-2 border-forest text-forest rounded-lg hover:bg-forest hover:text-offwhite transition-all font-medium"
                >
                  Upgrade to Premium
                </Link>
                <button className="px-6 py-3 border-2 border-sage/50 text-forest rounded-lg hover:bg-sage/10 transition-colors font-medium">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link
              href="/new-itinerary"
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-sage/30"
            >
              <div className="flex items-center">
                <div className="bg-sage-light rounded-full p-4">
                  <svg
                    className="h-7 w-7 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-forest">
                    Create New Trip
                  </h3>
                  <p className="text-sm text-forest/70 mt-1">
                    Plan your next adventure
                  </p>
                </div>
              </div>
            </Link>

            <div className="bg-white shadow-md rounded-xl p-6 border-2 border-transparent">
              <div className="flex items-center">
                <div className="bg-sky-light rounded-full p-4">
                  <svg
                    className="h-7 w-7 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-forest">
                    View Expenses
                  </h3>
                  <p className="text-sm text-forest/70 mt-1">
                    Track your spending
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border-2 border-transparent">
              <div className="flex items-center">
                <div className="bg-sand rounded-full p-4">
                  <svg
                    className="h-7 w-7 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-forest">
                    Settings
                  </h3>
                  <p className="text-sm text-forest/70 mt-1">
                    Manage account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Itineraries List */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-forest">
                My Itineraries
              </h2>
              <Link
                href="/new-itinerary"
                className="px-6 py-3 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all shadow-md hover:shadow-lg font-semibold"
              >
                + New Itinerary
              </Link>
            </div>

            {/* Placeholder Itineraries */}
            <div className="space-y-4">
              <Link
                href="/itinerary/1"
                className="block p-6 border-2 border-sage/20 rounded-xl hover:border-sage hover:shadow-md transition-all bg-sage-light/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-forest">
                      Trip to Paris, France
                    </h3>
                    <p className="text-forest/70 mt-2">
                      June 1, 2024 - June 7, 2024
                    </p>
                    <p className="text-forest/60 mt-1">
                      A wonderful trip to the City of Light
                    </p>
                  </div>
                  <svg
                    className="h-6 w-6 text-forest/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>

              <div className="p-12 text-center text-forest/60">
                <svg
                  className="h-16 w-16 mx-auto mb-4 text-sage"
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
                <p className="text-forest/70 mb-3 text-lg">No more itineraries yet</p>
                <Link
                  href="/new-itinerary"
                  className="text-sky hover:text-sky-dark font-semibold text-lg"
                >
                  Create your first itinerary →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 p-5 bg-sage-light/50 rounded-lg border border-sage/30">
            <p className="text-sm text-forest/80">
              <strong>Note:</strong> This is a placeholder dashboard showing
              sample data. The functionality to fetch and display actual user
              data and itineraries from the database will be implemented in
              future updates.
            </p>
          </div>
        </div>
      </main>
  );
}
