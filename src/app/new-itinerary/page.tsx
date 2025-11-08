import { auth } from '@/auth';
import { redirect } from 'next/navigation';

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
          <div className="bg-white shadow-lg rounded-2xl p-10">
            <h1 className="text-4xl font-bold text-forest mb-2">
              Plan Your Trip
            </h1>
            <p className="text-forest/70 mb-8">Create a personalized itinerary for your next adventure</p>

            <form className="space-y-6">
              {/* Destination */}
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-semibold text-forest mb-2"
                >
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="e.g., Paris, France"
                  className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors"
                  required
                />
              </div>

              {/* Trip Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-semibold text-forest mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-semibold text-forest mb-2"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Trip Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-forest mb-2"
                >
                  Trip Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Summer Vacation in Paris"
                  className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-forest mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Tell us about your trip preferences, interests, and any specific activities you'd like to do..."
                  className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors resize-none"
                />
              </div>

              {/* Budget */}
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-semibold text-forest mb-2"
                >
                  Budget (optional)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  placeholder="e.g., 5000"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky text-forest placeholder-forest/40 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-8 py-3 border-2 border-sage/50 rounded-lg text-forest bg-white hover:bg-sage/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 border-2 border-transparent rounded-lg text-offwhite bg-forest hover:bg-forest-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Create Itinerary
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-sage-light/50 rounded-lg border border-sage/30">
              <p className="text-sm text-forest/80">
                <strong>Note:</strong> This is a placeholder form. The
                functionality to create and save itineraries will be implemented
                in future updates.
              </p>
            </div>
          </div>
        </div>
      </main>
  );
}

