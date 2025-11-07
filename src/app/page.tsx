import Link from 'next/link';

/**
 * Landing Page
 * 
 * Marketing homepage describing TerraTraks
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-offwhite">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-forest via-forest-light to-forest-dark text-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Plan Your Perfect Trip
                <span className="block text-sky-light mt-2">with AI</span>
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-sage-light max-w-3xl mx-auto leading-relaxed">
                TerraTraks uses AI to create personalized travel itineraries
                tailored to your preferences, budget, and travel style
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/new-itinerary"
                  className="inline-flex items-center justify-center px-10 py-4 border-2 border-transparent text-base font-semibold rounded-lg text-forest bg-offwhite hover:bg-sage-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-all shadow-lg hover:shadow-xl"
                >
                  Start Planning
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-10 py-4 border-2 border-sage-light text-base font-semibold rounded-lg text-offwhite bg-transparent hover:bg-sage/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-forest mb-6">
                Why Choose TerraTraks?
              </h2>
              <p className="text-xl text-forest/70 max-w-2xl mx-auto">
                Everything you need to plan your perfect trip
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-sage-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-10 w-10 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-forest mb-4">
                  AI-Powered Planning
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Our AI creates personalized itineraries based on your
                  preferences, budget, and travel style
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-sky-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-10 w-10 text-forest"
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
                <h3 className="text-2xl font-semibold text-forest mb-4">
                  Expense Tracking
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Keep track of your travel expenses and stay within your
                  budget
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-sand rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-10 w-10 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-forest mb-4">
                  Save & Access Anywhere
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Save your itineraries and access them from any device, anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-sand py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-forest mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-xl text-forest/70 mb-10 max-w-2xl mx-auto">
              Create your first itinerary in minutes
            </p>
            <Link
              href="/new-itinerary"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-transparent text-base font-semibold rounded-lg text-offwhite bg-forest hover:bg-forest-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>
  );
}
