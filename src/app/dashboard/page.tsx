import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BillingPortalButton } from '@/components/BillingPortalButton';
import { app } from '@/lib/env';

/**
 * Dashboard Page
 * 
 * For logged-in users to see their itineraries and profile
 */
interface DashboardPageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const params = await searchParams;
  const showSuccess = params.success === 'true';

  // Redirect to sign in if not authenticated
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const userId = session.user.id;

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      itineraries: {
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              items: true,
              expenses: true,
            },
          },
        },
      },
      _count: {
        select: {
          itineraries: true,
          expenses: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Calculate total expenses
  const totalExpenses = await prisma.expense.aggregate({
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  const subscriptionStatus = user.subscriptionStatus || 'free';
  const isPremium = subscriptionStatus === 'active';

  return (
    <main className="min-h-screen bg-offwhite py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-8 max-w-2xl mx-auto bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 mr-3 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold">🎉 Welcome to Premium!</p>
                  <p className="mt-1 text-sm">
                    Your subscription is now active. Enjoy unlimited itineraries and all premium features!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-forest mb-3">
              Hello, {user.name || user.email?.split('@')[0] || 'there'}! 👋
            </h1>
            <p className="text-xl text-forest/70">
              Welcome back! Here's an overview of your trips and account.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={user.name || 'User'}
                    className="h-20 w-20 rounded-full mr-6 border-2 border-sage/30"
                  />
                ) : (
                  <div className="h-20 w-20 bg-sage-light rounded-full flex items-center justify-center mr-6 border-2 border-sage/30">
                    <span className="text-3xl font-semibold text-forest">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-semibold text-forest">
                    {user.name || session.user.name || 'User'}
                  </h2>
                  <p className="text-forest/70 mt-1">{user.email}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${
                      isPremium
                        ? 'bg-forest text-offwhite'
                        : 'bg-sage-light text-forest'
                    }`}>
                      {isPremium ? '⭐ Premium' : 'Free Plan'}
                    </span>
                    {!isPremium && user._count.itineraries >= 3 && (
                      <span className="text-xs text-forest/60">
                        (Limit reached - upgrade for unlimited)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                {!isPremium ? (
                  <Link
                    href="/pricing"
                    className="px-6 py-3 border-2 border-forest text-forest rounded-lg hover:bg-forest hover:text-offwhite transition-all font-medium"
                  >
                    Upgrade to Premium
                  </Link>
                ) : (
                  <BillingPortalButton
                    className="px-6 py-3 border-2 border-forest text-forest rounded-lg hover:bg-forest hover:text-offwhite transition-all font-medium"
                    returnUrl={`${app.url}/dashboard`}
                  >
                    Manage Subscription
                  </BillingPortalButton>
                )}
                <button className="px-6 py-3 border-2 border-sage/50 text-forest rounded-lg hover:bg-sage/10 transition-colors font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-8 border-t border-sage/20 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-forest/60 mb-1">Total Itineraries</p>
                <p className="text-3xl font-bold text-forest">{user._count.itineraries}</p>
              </div>
              <div>
                <p className="text-sm text-forest/60 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-forest">
                  ${totalExpenses._sum.amount?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm text-forest/60 mb-1">Member Since</p>
                <p className="text-lg font-semibold text-forest">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
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

            <Link
              href="#expenses"
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-sage/30"
            >
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
                    ${totalExpenses._sum.amount?.toFixed(2) || '0.00'} total
                  </p>
                </div>
              </div>
            </Link>

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
              <div>
                <h2 className="text-3xl font-bold text-forest">
                  My Itineraries
                </h2>
                <p className="text-forest/60 mt-1">
                  {user._count.itineraries === 0
                    ? 'You haven\'t created any itineraries yet'
                    : `${user._count.itineraries} ${user._count.itineraries === 1 ? 'itinerary' : 'itineraries'}`}
                </p>
              </div>
              <Link
                href="/new-itinerary"
                className="px-6 py-3 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all shadow-md hover:shadow-lg font-semibold flex items-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
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
                New Itinerary
              </Link>
            </div>

            {/* Itineraries */}
            {user.itineraries.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-sage-light/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-12 w-12 text-sage"
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
                </div>
                <h3 className="text-2xl font-semibold text-forest mb-2">
                  No itineraries yet
                </h3>
                <p className="text-forest/70 mb-6 max-w-md mx-auto">
                  Start planning your first trip! Create an itinerary and let our AI help you plan the perfect adventure.
                </p>
                <Link
                  href="/new-itinerary"
                  className="inline-flex items-center px-8 py-3 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  <svg
                    className="h-5 w-5 mr-2"
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
                  Create Your First Itinerary
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.itineraries.map((itinerary) => {
                  const startDate = itinerary.startDate
                    ? new Date(itinerary.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : null;
                  const endDate = itinerary.endDate
                    ? new Date(itinerary.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : null;

                  return (
                    <Link
                      key={itinerary.id}
                      href={`/itinerary/${itinerary.id}`}
                      className="block p-6 border-2 border-sage/20 rounded-xl hover:border-sage hover:shadow-lg transition-all bg-sage-light/10 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-forest mb-2 group-hover:text-forest-light transition-colors">
                            {itinerary.title}
                          </h3>
                          <p className="text-sm text-forest/70 flex items-center mb-2">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {itinerary.destination}
                          </p>
                        </div>
                        {itinerary.isPublic && (
                          <span className="px-2 py-1 text-xs font-medium bg-sky-light text-forest rounded-full">
                            Public
                          </span>
                        )}
                      </div>

                      {itinerary.description && (
                        <p className="text-sm text-forest/60 mb-4 line-clamp-2">
                          {itinerary.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-sage/20">
                        <div className="flex items-center text-sm text-forest/60">
                          {startDate && endDate ? (
                            <>
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {startDate} - {endDate}
                            </>
                          ) : (
                            <span>No dates set</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-forest/50">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          {itinerary._count.items} {itinerary._count.items === 1 ? 'item' : 'items'}
                        </div>
                      </div>

                      {itinerary._count.expenses > 0 && (
                        <div className="mt-3 pt-3 border-t border-sage/20">
                          <div className="flex items-center text-sm text-forest/60">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {itinerary._count.expenses} {itinerary._count.expenses === 1 ? 'expense' : 'expenses'}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
