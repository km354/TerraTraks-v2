import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * Landing Page
 * 
 * Marketing homepage for TerraTraks - AI-powered trip planning
 * Optimized for performance and conversion
 * Statically generated for maximum performance
 */
export const metadata: Metadata = {
  title: 'TerraTraks - Plan Your National Park Adventure with AI',
  description: 'Create personalized travel itineraries, predict crowd levels, generate packing lists, and track expenses. AI-powered trip planning for national parks and outdoor adventures.',
  keywords: ['travel planning', 'AI itinerary', 'national parks', 'trip planner', 'travel app', 'adventure planning', 'itinerary generator'],
  openGraph: {
    title: 'TerraTraks - AI-Powered National Park Trip Planning',
    description: 'Plan your perfect national park adventure with AI-powered itineraries, crowd predictions, and smart packing lists.',
    type: 'website',
    siteName: 'TerraTraks',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TerraTraks - AI-Powered Trip Planning',
    description: 'Plan your perfect national park adventure with AI-powered itineraries.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-offwhite">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-forest via-forest-light to-sage text-offwhite overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-8 bg-offwhite/10 backdrop-blur-sm rounded-full border border-offwhite/20">
              <span className="text-sm font-medium text-offwhite">🌲 AI-Powered National Park Planning</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Plan Your National Park
              <span className="block text-sky-light mt-2">Adventure with AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-sage-light max-w-3xl mx-auto leading-relaxed">
              Create personalized itineraries, predict crowd levels, generate packing lists, and track expenses—all powered by artificial intelligence. Your perfect trip starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/new-itinerary"
                className="inline-flex items-center justify-center px-8 py-4 bg-offwhite text-forest rounded-lg font-semibold text-lg hover:bg-sage-light transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                Get Started – It's Free!
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-offwhite text-offwhite rounded-lg font-semibold text-lg hover:bg-offwhite/10 transition-all backdrop-blur-sm"
              >
                View Pricing
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-sage-light">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 md:py-32 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-forest mb-4">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="text-xl text-forest/70 max-w-2xl mx-auto">
              TerraTraks combines AI intelligence with practical tools to make trip planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: AI Itinerary Generation */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-sage/10">
              <div className="bg-gradient-to-br from-sage-light to-sage rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">
                AI-Powered Itineraries
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Tell us your destination, dates, and interests. Our AI creates a detailed, day-by-day itinerary tailored to your preferences and budget.
              </p>
            </div>

            {/* Feature 2: Crowd Level Prediction */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-sage/10">
              <div className="bg-gradient-to-br from-sky-light to-sky rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">
                Crowd Level Predictions
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Know what to expect. Get AI-powered crowd level predictions for each attraction so you can plan around peak times.
              </p>
            </div>

            {/* Feature 3: Packing List Generator */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-sage/10">
              <div className="bg-gradient-to-br from-sand to-sage-light rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">
                Smart Packing Lists
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Weather-aware packing lists generated by AI. Get personalized recommendations based on your destination, dates, and activities.
              </p>
            </div>

            {/* Feature 4: Budget & Expense Tracking */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-sage/10">
              <div className="bg-gradient-to-br from-sky to-sky-light rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">
                Budget & Expense Tracking
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Set a budget and track expenses by category. Stay on top of your spending with real-time budget comparisons and alerts.
              </p>
            </div>

            {/* Feature 5: Interactive Maps */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-sage/10">
              <div className="bg-gradient-to-br from-sage to-forest rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-offwhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">
                Route Visualization
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Visualize your trip with interactive maps showing all stops and routes. See your entire journey at a glance.
              </p>
            </div>

            {/* Feature 6: Preset Itineraries */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-sage/10">
              <div className="bg-gradient-to-br from-forest to-sage rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-offwhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-forest mb-3">
                Featured Itineraries
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Browse handcrafted itineraries for popular destinations. Copy and customize them to fit your travel style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-20 bg-sage-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-forest mb-6">
                See Your Trip Come to Life
              </h2>
              <p className="text-lg text-forest/70 mb-6 leading-relaxed">
                Every itinerary includes detailed day-by-day plans, interactive maps, crowd predictions, and personalized recommendations.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-forest/80">Day-by-day activity breakdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-forest/80">Interactive route maps with markers</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-forest/80">Real-time crowd level predictions</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-forest/80">Weather-aware packing lists</span>
                </li>
              </ul>
              <Link
                href="/new-itinerary"
                className="inline-flex items-center px-6 py-3 bg-forest text-offwhite rounded-lg font-semibold hover:bg-forest-light transition-all"
              >
                Try It Now
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-br from-sage-light to-sky-light flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="h-24 w-24 text-forest mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-forest/60 font-medium">Itinerary Preview</p>
                    <p className="text-sm text-forest/50 mt-2">Interactive map with route visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-forest mb-4">
              Loved by Travelers
            </h2>
            <p className="text-xl text-forest/70">
              See what users are saying about TerraTraks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-sage-light/30 rounded-2xl p-8 border border-sage/20">
              <div className="flex items-center mb-4">
                <div className="flex text-sage">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-forest/80 mb-6 leading-relaxed italic">
                "TerraTraks made planning our Yosemite trip so easy! The AI-generated itinerary was perfect, and the crowd predictions helped us avoid the busiest times. The packing list feature saved us from forgetting important gear."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center mr-4">
                  <span className="text-offwhite font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-forest">Sarah M.</p>
                  <p className="text-sm text-forest/60">National Park Enthusiast</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-sky-light/30 rounded-2xl p-8 border border-sky/20">
              <div className="flex items-center mb-4">
                <div className="flex text-sage">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-forest/80 mb-6 leading-relaxed italic">
                "The budget tracking feature is a game-changer! I was able to stay within my budget for our 5-day Utah road trip. The preset itineraries gave us great ideas we wouldn't have thought of ourselves."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-sky rounded-full flex items-center justify-center mr-4">
                  <span className="text-offwhite font-semibold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-forest">James D.</p>
                  <p className="text-sm text-forest/60">Road Trip Planner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-sand/30 rounded-2xl p-8 border border-sand/20">
              <div className="flex items-center mb-4">
                <div className="flex text-sage">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-forest/80 mb-6 leading-relaxed italic">
                "As a first-time visitor to Yellowstone, I had no idea where to start. TerraTraks created a perfect weekend itinerary that covered all the highlights. The AI really understood what I was looking for!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center mr-4">
                  <span className="text-offwhite font-semibold">EK</span>
                </div>
                <div>
                  <p className="font-semibold text-forest">Emily K.</p>
                  <p className="text-sm text-forest/60">First-Time Visitor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-forest to-sage text-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Plan Your Adventure?
          </h2>
          <p className="text-xl text-sage-light mb-10 max-w-2xl mx-auto">
            Join thousands of travelers using AI to plan their perfect trips. Get started in minutes—it's free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/new-itinerary"
              className="inline-flex items-center justify-center px-10 py-4 bg-offwhite text-forest rounded-lg font-semibold text-lg hover:bg-sage-light transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Get Started – It's Free!
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-offwhite text-offwhite rounded-lg font-semibold text-lg hover:bg-offwhite/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
