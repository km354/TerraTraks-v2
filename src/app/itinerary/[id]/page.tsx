import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

/**
 * Itinerary Detail Page
 * 
 * Displays a saved itinerary with details
 */
export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user?.id) {
    const { id } = await params;
    redirect(`/auth/signin?callbackUrl=/itinerary/${id}`);
  }

  const { id } = await params;
  const userId = session.user.id;

  // Fetch itinerary from database
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: [
          { date: 'asc' },
          { order: 'asc' },
        ],
      },
      expenses: {
        orderBy: { date: 'desc' },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Check if itinerary exists
  if (!itinerary) {
    notFound();
  }

  // Check if user has access to this itinerary
  if (itinerary.userId !== userId && !itinerary.isPublic) {
    redirect('/dashboard');
  }

  // Format dates
  const startDate = itinerary.startDate
    ? new Date(itinerary.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  const endDate = itinerary.endDate
    ? new Date(itinerary.endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Group items by date
  const itemsByDate = itinerary.items.reduce((acc, item) => {
    const dateKey = item.date
      ? new Date(item.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Unscheduled';
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, typeof itinerary.items>);

  // Calculate total expenses
  const totalExpenses = itinerary.expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  // Category color mapping
  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return 'bg-sand';
      case 'accommodation':
        return 'bg-sage-light';
      case 'transportation':
        return 'bg-sky-light';
      case 'activity':
      default:
        return 'bg-sky-light';
    }
  };

  return (
    <main className="min-h-screen bg-offwhite py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-forest mb-2">
                  {itinerary.title}
                </h1>
                <p className="text-forest/70 text-lg flex items-center mb-2">
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
                {startDate && endDate && (
                  <p className="text-forest/70 text-lg flex items-center">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {startDate} - {endDate}
                  </p>
                )}
              </div>
              <Link
                href="/dashboard"
                className="text-sky hover:text-sky-dark text-sm font-medium flex items-center"
              >
                ← Back to Dashboard
              </Link>
            </div>
            {itinerary.description && (
              <div className="mt-4 p-4 bg-sage-light/30 rounded-lg border border-sage/20">
                <p className="text-forest/80 leading-relaxed whitespace-pre-wrap">
                  {itinerary.description}
                </p>
              </div>
            )}
          </div>

          {/* Itinerary Items */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-forest mb-8">
              Itinerary
            </h2>

            {Object.keys(itemsByDate).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-forest/60">No itinerary items yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(itemsByDate).map(([date, items], dayIndex) => (
                  <div key={date} className="border-l-4 border-sage pl-6">
                    <h3 className="text-xl font-semibold text-forest mb-4">
                      {date === 'Unscheduled' ? 'Unscheduled Activities' : date}
                    </h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-sage-light/30 p-5 rounded-lg border border-sage/20"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-forest text-lg">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-forest/70 mt-2 whitespace-pre-wrap">
                                  {item.description}
                                </p>
                              )}
                              {item.location && (
                                <p className="text-forest/60 mt-2 text-sm flex items-center">
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
                                  {item.location}
                                </p>
                              )}
                              {item.startTime && (
                                <p className="text-forest/60 mt-2 text-sm flex items-center">
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
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {new Date(item.startTime).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                  {item.endTime &&
                                    ` - ${new Date(item.endTime).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                    })}`}
                                </p>
                              )}
                            </div>
                            {item.category && (
                              <span
                                className={`px-3 py-1 text-xs font-medium ${getCategoryColor(
                                  item.category
                                )} text-forest rounded-full ml-4 capitalize`}
                              >
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses */}
          {itinerary.expenses.length > 0 && (
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-forest mb-8">
                Expenses
              </h2>
              <div className="space-y-4">
                {itinerary.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center p-5 bg-sage-light/20 rounded-lg border border-sage/20"
                  >
                    <div>
                      <h4 className="font-semibold text-forest">
                        {expense.title}
                      </h4>
                      {expense.description && (
                        <p className="text-sm text-forest/70 mt-1">
                          {expense.description}
                        </p>
                      )}
                      {expense.category && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-sage-light text-forest rounded-full">
                          {expense.category}
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-bold text-forest">
                      ${Number(expense.amount).toFixed(2)} {expense.currency}
                    </span>
                  </div>
                ))}
                <div className="border-t-2 border-sage/30 pt-5 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-forest">Total</span>
                    <span className="text-3xl font-bold text-forest">
                      ${totalExpenses.toFixed(2)} {itinerary.expenses[0]?.currency || 'USD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
  );
}
