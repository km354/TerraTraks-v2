import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ItineraryForm } from '@/components/ItineraryForm';
import Link from 'next/link';

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

