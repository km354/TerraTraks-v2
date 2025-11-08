import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Pricing Page
 * 
 * Shows free vs premium plan details
 */
interface PricingPageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const session = await auth();
  const params = await searchParams;
  const showSuccess = params.success === 'true';
  const showCanceled = params.canceled === 'true';

  return (
    <main className="min-h-screen bg-offwhite py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success/Error Messages */}
          {showSuccess && (
            <div className="mb-8 max-w-2xl mx-auto bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
              <p className="font-semibold">🎉 Welcome to Premium!</p>
              <p className="mt-1">Your subscription is now active. Enjoy unlimited itineraries and premium features!</p>
            </div>
          )}
          {showCanceled && (
            <div className="mb-8 max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
              <p className="font-semibold">Checkout Canceled</p>
              <p className="mt-1">No worries! You can try again anytime. Your account hasn't been charged.</p>
            </div>
          )}

          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold text-forest mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-forest/70 max-w-2xl mx-auto">
              Select the plan that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-forest mb-4">
                  Free Plan
                </h2>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-forest">$0</span>
                  <span className="text-forest/70 text-xl">/month</span>
                </div>
                <ul className="space-y-5 mb-10 text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sage mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-forest/80">
                      Up to 3 itineraries
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sage mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-forest/80">
                      Basic AI itinerary generation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sage mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-forest/80">
                      Expense tracking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sage mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-forest/80">
                      Access from any device
                    </span>
                  </li>
                </ul>
                <Link
                  href="/new-itinerary"
                  className="block w-full px-8 py-4 border-2 border-forest text-forest rounded-lg text-center font-semibold hover:bg-forest hover:text-offwhite transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-forest to-forest-light rounded-2xl shadow-xl p-10 text-offwhite relative transform scale-105">
              <div className="absolute top-0 right-0 bg-sky text-forest px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-sm font-bold">
                Popular
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Premium Plan</h2>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$7.99</span>
                  <span className="text-sage-light text-xl">/month</span>
                </div>
                <ul className="space-y-5 mb-10 text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sky-light mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Unlimited itineraries</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sky-light mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Advanced AI itinerary generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sky-light mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Detailed expense tracking & budgets</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sky-light mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Weather integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sky-light mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Map integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-sky-light mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                {session?.user ? (
                  <CheckoutButton className="block w-full px-8 py-4 bg-offwhite text-forest rounded-lg text-center font-semibold hover:bg-sage-light transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    Upgrade to Premium
                  </CheckoutButton>
                ) : (
                  <Link
                    href="/auth/signin?callbackUrl=/pricing"
                    className="block w-full px-8 py-4 bg-offwhite text-forest rounded-lg text-center font-semibold hover:bg-sage-light transition-all shadow-lg"
                  >
                    Sign In to Subscribe
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-forest text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Yes, you can cancel your Premium subscription at any time. You
                  will continue to have access to Premium features until the end
                  of your billing period.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  We accept all major credit cards and PayPal through our secure
                  payment processor, Stripe.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  Is my data secure?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Yes, we use industry-standard encryption and security measures
                  to protect your data. Your itineraries and personal
                  information are safe with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
