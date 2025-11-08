import dynamic from 'next/dynamic';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * New Itinerary Page Metadata
 */
export const metadata: Metadata = {
  title: 'Create New Itinerary - Plan Your Trip | TerraTraks',
  description: 'Create a personalized travel itinerary with AI. Enter your destination, dates, interests, and let our AI plan your perfect trip.',
  robots: {
    index: false, // Form pages typically not indexed
    follow: true,
  },
};

// Dynamically import the form component to reduce initial bundle size
const ItineraryForm = dynamic(() => import('@/components/ItineraryForm').then(mod => ({ default: mod.ItineraryForm })), {
  loading: () => (
    <div className="min-h-screen bg-offwhite py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-sage-light/30 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-sage-light/20 rounded w-full mb-4"></div>
            <div className="h-4 bg-sage-light/20 rounded w-5/6 mb-4"></div>
            <div className="h-32 bg-sage-light/20 rounded mb-6"></div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false, // Form is client-side only
});

/**
 * New Itinerary Page
 * 
 * Form for creating a new trip itinerary
 */
export default async function NewItineraryPage() {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/new-itinerary');
  }

  return (
    <main className="min-h-screen bg-offwhite py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-forest/70 hover:text-forest flex items-center text-sm mb-4"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-forest mb-3">
                Plan Your Trip
              </h1>
              <p className="text-lg text-forest/70">
                Create a personalized itinerary for your next adventure. We'll guide you through each step.
              </p>
            </div>

            <ItineraryForm />
          </div>
        </div>
      </main>
  );
}
