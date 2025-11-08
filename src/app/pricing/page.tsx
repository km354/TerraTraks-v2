import Link from 'next/link';
import dynamic from 'next/dynamic';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

// Dynamically import checkout button to reduce initial bundle
const CheckoutButton = dynamic(() => import('@/components/CheckoutButton').then(mod => ({ default: mod.CheckoutButton })), {
  loading: () => (
    <button disabled className="px-10 py-4 bg-forest text-offwhite rounded-lg opacity-50">
      Loading...
    </button>
  ),
});

/**
 * Pricing Page Metadata
 */
export const metadata: Metadata = {
  title: 'Pricing - Free & Premium Plans | TerraTraks',
  description: 'Choose the perfect plan for your travel planning needs. Free plan includes 3 itineraries. Upgrade to Premium for unlimited itineraries, GPT-4 AI, and advanced features.',
  keywords: ['pricing', 'premium', 'subscription', 'travel planning', 'trip planner'],
  openGraph: {
    title: 'TerraTraks Pricing - Free & Premium Plans',
    description: 'Start free with 3 itineraries or upgrade to Premium for unlimited trips and advanced AI features.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'TerraTraks Pricing',
    description: 'Choose the perfect plan for your travel planning needs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

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

          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-forest mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-forest/70 max-w-2xl mx-auto mb-4">
              Choose the plan that fits your travel planning needs
            </p>
            <p className="text-forest/60 max-w-xl mx-auto">
              Start free, upgrade anytime. Cancel anytime. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-xl transition-all border-2 border-transparent hover:border-sage/30">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-forest mb-2">
                  Free
                </h2>
                <p className="text-forest/60 mb-6">Perfect for occasional travelers</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-forest">$0</span>
                  <span className="text-forest/70 text-xl">/month</span>
                </div>
                <ul className="space-y-4 mb-10 text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sage mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="text-forest/90 font-medium">Up to 3 itineraries</span>
                      <p className="text-sm text-forest/60">Create and save up to 3 trip plans</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sage mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="text-forest/90 font-medium">Basic AI itinerary generation</span>
                      <p className="text-sm text-forest/60">AI-powered trip suggestions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sage mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="text-forest/90 font-medium">Expense tracking</span>
                      <p className="text-sm text-forest/60">Track your travel expenses</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sage mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="text-forest/90 font-medium">Cross-device access</span>
                      <p className="text-sm text-forest/60">Access from any device</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-forest/40 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <div>
                      <span className="text-forest/50 font-medium line-through">Weather integration</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-forest/40 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <div>
                      <span className="text-forest/50 font-medium line-through">Advanced AI features</span>
                    </div>
                  </li>
                </ul>
                <Link
                  href={session?.user ? "/new-itinerary" : "/auth/signin?callbackUrl=/pricing"}
                  className="block w-full px-8 py-4 border-2 border-forest text-forest rounded-lg text-center font-semibold hover:bg-forest hover:text-offwhite transition-all"
                >
                  {session?.user ? 'Get Started Free' : 'Sign Up Free'}
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-forest to-forest-light rounded-2xl shadow-xl p-10 text-offwhite relative border-2 border-forest/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky text-forest px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ⭐ Most Popular
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Premium</h2>
                <p className="text-sage-light mb-6">For serious travelers</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$7.99</span>
                  <span className="text-sage-light text-xl">/month</span>
                  <p className="text-sm text-sage-light/80 mt-2">Cancel anytime</p>
                </div>
                <ul className="space-y-4 mb-10 text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sky-light mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="font-medium">Unlimited itineraries</span>
                      <p className="text-sm text-sage-light/80">Create as many trip plans as you want</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sky-light mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="font-medium">Advanced AI itinerary generation</span>
                      <p className="text-sm text-sage-light/80">GPT-4 powered personalized recommendations</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sky-light mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="font-medium">Advanced expense tracking & budgets</span>
                      <p className="text-sm text-sage-light/80">Set budgets and get spending insights</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sky-light mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="font-medium">Real-time weather integration</span>
                      <p className="text-sm text-sage-light/80">Weather forecasts for your destinations</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sky-light mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="font-medium">Interactive map integration</span>
                      <p className="text-sm text-sage-light/80">Visual maps with route planning</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-sky-light mr-3 mt-0.5 flex-shrink-0"
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
                    <div>
                      <span className="font-medium">Priority support</span>
                      <p className="text-sm text-sage-light/80">Get help when you need it most</p>
                    </div>
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

          {/* Feature Comparison Table */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-forest text-center mb-10">
              Compare Plans
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-sage-light/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-forest font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-forest font-semibold">Free</th>
                    <th className="px-6 py-4 text-center text-forest font-semibold bg-forest/5">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/20">
                  <tr>
                    <td className="px-6 py-4 text-forest/80">Number of Itineraries</td>
                    <td className="px-6 py-4 text-center text-forest/60">Up to 3</td>
                    <td className="px-6 py-4 text-center text-forest font-semibold bg-forest/5">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-forest/80">AI Itinerary Generation</td>
                    <td className="px-6 py-4 text-center text-forest/60">Basic</td>
                    <td className="px-6 py-4 text-center text-forest font-semibold bg-forest/5">Advanced (GPT-4)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-forest/80">Expense Tracking</td>
                    <td className="px-6 py-4 text-center text-sage">✓</td>
                    <td className="px-6 py-4 text-center text-sage bg-forest/5">✓ Advanced + Budgets</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-forest/80">Weather Integration</td>
                    <td className="px-6 py-4 text-center text-forest/40">—</td>
                    <td className="px-6 py-4 text-center text-sage bg-forest/5">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-forest/80">Map Integration</td>
                    <td className="px-6 py-4 text-center text-forest/40">—</td>
                    <td className="px-6 py-4 text-center text-sage bg-forest/5">✓ Interactive Maps</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-forest/80">Support</td>
                    <td className="px-6 py-4 text-center text-forest/60">Community</td>
                    <td className="px-6 py-4 text-center text-forest font-semibold bg-forest/5">Priority</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-forest/80">Cross-device Access</td>
                    <td className="px-6 py-4 text-center text-sage">✓</td>
                    <td className="px-6 py-4 text-center text-sage bg-forest/5">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-forest text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Yes! You can cancel your Premium subscription at any time with just one click. You'll
                  continue to have access to Premium features until the end of your current billing period.
                  No questions asked, no hassle.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  We accept all major credit cards (Visa, Mastercard, American Express) and debit cards
                  through our secure payment processor, Stripe. All payments are processed securely and
                  encrypted.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  Is my data secure?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Absolutely. We use industry-standard encryption and security measures to protect your data.
                  Your itineraries, personal information, and payment details are all secured. We never share
                  your data with third parties.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  Can I upgrade from Free to Premium later?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  Yes! You can upgrade to Premium at any time. Your existing itineraries will be preserved,
                  and you'll immediately get access to all Premium features. You can also downgrade back to
                  Free anytime (though you'll lose access to Premium features after your billing period ends).
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  What happens if I reach the Free plan limit?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  If you're on the Free plan and reach the 3 itinerary limit, you'll be prompted to upgrade
                  to Premium to create more itineraries. Your existing 3 itineraries will remain accessible.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-forest mb-3">
                  Do you offer refunds?
                </h3>
                <p className="text-forest/70 leading-relaxed">
                  We offer a 30-day money-back guarantee. If you're not satisfied with Premium, contact us
                  within 30 days of your subscription and we'll provide a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
