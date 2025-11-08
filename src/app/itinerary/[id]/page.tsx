import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ActivityIcon } from '@/components/ActivityIcon';
import { generateItineraryMap, generateLocationMap } from '@/lib/google-maps';
import { predictCrowdLevel } from '@/lib/crowd-level';
import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { PackingList } from '@/components/PackingList';
import { ExpenseList } from '@/components/ExpenseList';
import { BudgetEditor } from '@/components/BudgetEditor';

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
          subscriptionStatus: true,
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

  // Calculate trip duration
  let tripDuration = 0;
  if (itinerary.startDate && itinerary.endDate) {
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    tripDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  }

  // Group items by date and calculate day numbers
  const itemsByDate: Array<{
    dayNumber: number;
    date: string;
    dateObj: Date | null;
    items: typeof itinerary.items;
  }> = [];

  const dateMap = new Map<string, typeof itinerary.items>();

  // First, group items by their actual date
  itinerary.items.forEach((item) => {
    if (item.date) {
      const dateKey = new Date(item.date).toISOString().split('T')[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(item);
    }
  });

  // Sort dates and assign day numbers
  const sortedDates = Array.from(dateMap.keys()).sort();
  let dayNumber = 1;

  sortedDates.forEach((dateKey) => {
    const dateObj = new Date(dateKey);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    itemsByDate.push({
      dayNumber: dayNumber++,
      date: formattedDate,
      dateObj,
      items: dateMap.get(dateKey)!,
    });
  });

  // Add unscheduled items if any
  const unscheduledItems = itinerary.items.filter((item) => !item.date);
  if (unscheduledItems.length > 0) {
    itemsByDate.push({
      dayNumber: 0,
      date: 'Unscheduled',
      dateObj: null,
      items: unscheduledItems,
    });
  }

  // Calculate total expenses
  const totalExpenses = itinerary.expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  // Collect unique locations for map
  const locations = itinerary.items
    .filter((item) => item.location)
    .map((item) => ({
      location: item.location!,
      title: item.title,
    }));

  // Generate map URL
  const mapUrl = await generateItineraryMap(itinerary.destination, locations, {
    size: '800x500',
    showRoute: locations.length > 1,
  });

  // Generate per-day maps
  const dayMaps = await Promise.all(
    itemsByDate
      .filter((day) => day.dayNumber > 0)
      .map(async (day) => {
        const dayLocations = day.items
          .filter((item) => item.location)
          .map((item) => ({
            location: item.location!,
            title: item.title,
          }));

        if (dayLocations.length === 0) return null;

        const dayMapUrl = await generateItineraryMap(
          itinerary.destination,
          dayLocations,
          {
            size: '600x400',
            zoom: 12,
            showRoute: dayLocations.length > 1,
          }
        );

        return {
          dayNumber: day.dayNumber,
          mapUrl: dayMapUrl,
        };
      })
  );

  // Predict crowd levels for items with locations and dates
  const isPremium = itinerary.user.subscriptionStatus === 'active';
  const crowdLevels = await Promise.all(
    itinerary.items
      .filter((item) => item.location && item.date)
      .map(async (item) => {
        const date = new Date(item.date!);
        const prediction = await predictCrowdLevel(
          item.location!,
          date,
          isPremium // Premium users get AI predictions
        );
        return {
          itemId: item.id,
          prediction,
        };
      })
  );

  // Create a map of item ID to crowd level prediction
  const crowdLevelMap = new Map(
    crowdLevels.map((cl) => [cl.itemId, cl.prediction])
  );

  // Calculate overall trip crowd level (average of all predictions)
  const overallCrowdLevel: 'low' | 'moderate' | 'high' | 'very_high' | null = crowdLevels.length > 0
    ? (() => {
        const levelValues: Record<'low' | 'moderate' | 'high' | 'very_high', number> = { 
          low: 1, 
          moderate: 2, 
          high: 3, 
          very_high: 4 
        };
        const averageLevel =
          crowdLevels.reduce((sum, cl) => sum + levelValues[cl.prediction.level], 0) /
          crowdLevels.length;
        
        if (averageLevel >= 3.5) return 'very_high' as const;
        if (averageLevel >= 2.5) return 'high' as const;
        if (averageLevel >= 1.5) return 'moderate' as const;
        return 'low' as const;
      })()
    : null;

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-forest mb-3">
                  {itinerary.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-forest/70">
                  <p className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-sage"
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
                    <p className="flex items-center">
                      <svg
                        className="h-5 w-5 mr-2 text-sage"
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
                  {tripDuration > 0 && (
                    <p className="flex items-center">
                      <svg
                        className="h-5 w-5 mr-2 text-sage"
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
                      {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href="/dashboard"
                className="text-sky hover:text-sky-dark text-sm font-medium flex items-center whitespace-nowrap ml-4"
              >
                ← Back to Dashboard
              </Link>
            </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-sage-light/30 rounded-lg p-4 border border-sage/20">
                    <div className="flex items-center mb-2">
                      <div className="bg-sage-light rounded-full p-2 mr-3">
                        <svg className="h-5 w-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-forest/60">Activities</p>
                        <p className="text-xl font-bold text-forest">{itinerary.items.length}</p>
                      </div>
                    </div>
                  </div>


                  <div className="bg-sand/30 rounded-lg p-4 border border-sand/20">
                    <div className="flex items-center mb-2">
                      <div className="bg-sand rounded-full p-2 mr-3">
                        <svg className="h-5 w-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-forest/60">Duration</p>
                        <p className="text-xl font-bold text-forest">
                          {tripDuration > 0 ? `${tripDuration} ${tripDuration === 1 ? 'day' : 'days'}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {overallCrowdLevel && (
                    <div className="bg-sage-light/30 rounded-lg p-4 border border-sage/20">
                      <div className="flex items-center mb-2">
                        <div className="bg-sage-light rounded-full p-2 mr-3">
                          <svg className="h-5 w-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-forest/60">Expected Crowds</p>
                          <div className="mt-1">
                            <CrowdLevelBadge
                              level={overallCrowdLevel}
                              size="sm"
                              showIcon={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

            {itinerary.description && (
              <div className="mt-4 p-4 bg-sage-light/30 rounded-lg border border-sage/20">
                <p className="text-forest/80 leading-relaxed whitespace-pre-wrap">
                  {itinerary.description}
                </p>
              </div>
            )}

            {/* Overview Map */}
            {mapUrl && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-forest">
                    Trip Overview Map
                  </h3>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itinerary.destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky hover:text-sky-dark flex items-center"
                  >
                    Open in Google Maps
                    <svg
                      className="h-4 w-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
                <div className="rounded-lg overflow-hidden border-2 border-sage/20 shadow-md">
                  <img
                    src={mapUrl}
                    alt={`Map of ${itinerary.destination} showing itinerary locations`}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-forest/60 mt-2">
                  Map showing key locations from your itinerary. Click "Open in Google Maps" for an interactive view.
                </p>
              </div>
            )}
          </div>

          {/* Itinerary Items */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-forest">
                Daily Itinerary
              </h2>
              {itemsByDate.length > 0 && (
                <span className="text-sm text-forest/60 bg-sage-light/30 px-4 py-2 rounded-full">
                  {itemsByDate.filter(d => d.dayNumber > 0).length} {itemsByDate.filter(d => d.dayNumber > 0).length === 1 ? 'day' : 'days'}
                </span>
              )}
            </div>

            {itemsByDate.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-sage-light/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-sage"
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
                <p className="text-forest/60">No itinerary items yet.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {itemsByDate.map((dayData) => (
                  <div key={dayData.date} className="relative">
                    {/* Day Header */}
                    <div className="flex items-center mb-6">
                      <div className="bg-forest text-offwhite rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
                        {dayData.dayNumber > 0 ? dayData.dayNumber : '?'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-forest">
                          {dayData.dayNumber > 0 ? `Day ${dayData.dayNumber}` : 'Unscheduled Activities'}
                        </h3>
                        <p className="text-forest/70 mt-1">
                          {dayData.date}
                          {dayData.dateObj && (
                            <span className="ml-2 text-sm text-forest/60">
                              ({dayData.dateObj.toLocaleDateString('en-US', { weekday: 'long' })})
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-sm text-forest/60 bg-sage-light/30 px-3 py-1 rounded-full">
                        {dayData.items.length} {dayData.items.length === 1 ? 'activity' : 'activities'}
                      </div>
                    </div>

                    {/* Day Map */}
                    {dayData.dayNumber > 0 && (() => {
                      const dayMap = dayMaps.find((m) => m?.dayNumber === dayData.dayNumber);
                      const dayLocations = dayData.items.filter((item) => item.location);
                      
                      if (dayMap?.mapUrl && dayLocations.length > 0) {
                        // Get first location for Google Maps link
                        const firstLocation = dayLocations[0]?.location || itinerary.destination;
                        
                        return (
                          <div className="mb-6 ml-16">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-forest/80">
                                Day {dayData.dayNumber} Locations
                              </h4>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(firstLocation)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-sky hover:text-sky-dark flex items-center"
                              >
                                Open in Maps
                                <svg
                                  className="h-3 w-3 ml-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            </div>
                            <div className="rounded-lg overflow-hidden border-2 border-sage/20 shadow-md">
                              <img
                                src={dayMap.mapUrl}
                                alt={`Map for Day ${dayData.dayNumber}`}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Activities */}
                    <div className="ml-16 space-y-4">
                      {dayData.items.map((item, index) => {
                        return (
                          <div
                            key={item.id}
                            className="bg-sage-light/20 rounded-xl p-6 border-2 border-transparent hover:border-sage/30 transition-all group"
                          >
                            <div className="flex items-start gap-4">
                              {/* Activity Icon */}
                              <div className="flex-shrink-0 mt-1">
                                <div className={`rounded-lg p-3 ${getCategoryColor(item.category)}`}>
                                  <ActivityIcon
                                    category={item.category}
                                    title={item.title}
                                    className="h-6 w-6 text-forest"
                                  />
                                </div>
                              </div>

                              {/* Activity Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <h4 className="font-semibold text-forest text-lg group-hover:text-forest-light transition-colors">
                                    {item.title}
                                  </h4>
                                  {item.category && (
                                    <span
                                      className={`px-3 py-1 text-xs font-medium ${getCategoryColor(
                                        item.category
                                      )} text-forest rounded-full flex-shrink-0 capitalize`}
                                    >
                                      {item.category}
                                    </span>
                                  )}
                                </div>

                              {item.description && (
                                <p className="text-forest/70 mt-2 leading-relaxed whitespace-pre-wrap">
                                  {item.description}
                                </p>
                              )}

                              {/* Crowd Level Prediction */}
                              {item.location && item.date && crowdLevelMap.has(item.id) && (
                                <div className="mt-3">
                                  <CrowdLevelBadge
                                    level={crowdLevelMap.get(item.id)!.level}
                                    reasoning={crowdLevelMap.get(item.id)!.reasoning}
                                    size="sm"
                                  />
                                </div>
                              )}

                              {/* Metadata */}
                              <div className="flex flex-wrap gap-4 mt-4 text-sm text-forest/60">
                                  {item.location && (
                                    <div className="flex items-center gap-2">
                                      <svg
                                        className="h-4 w-4"
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
                                      <span className="font-medium">{item.location}</span>
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky hover:text-sky-dark text-xs flex items-center"
                                        title="Open in Google Maps"
                                      >
                                        <svg
                                          className="h-3 w-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                          />
                                        </svg>
                                      </a>
                                    </div>
                                  )}
                                  {item.startTime && (
                                    <div className="flex items-center">
                                      <svg
                                        className="h-4 w-4 mr-1.5"
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
                                      <span className="font-medium">
                                        {new Date(item.startTime).toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                        })}
                                        {item.endTime &&
                                          ` - ${new Date(item.endTime).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                          })}`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Day Separator */}
                    {itemsByDate.indexOf(dayData) < itemsByDate.length - 1 && dayData.dayNumber > 0 && (
                      <div className="ml-16 mt-8 pt-8 border-t border-sage/20"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Packing List */}
          {itinerary.startDate && itinerary.endDate && (
            <div className="mb-6">
              <PackingList
                itineraryId={itinerary.id}
                destination={itinerary.destination}
                startDate={new Date(itinerary.startDate)}
                endDate={new Date(itinerary.endDate)}
                duration={tripDuration}
                activities={itinerary.items
                  .map((item) => item.title)
                  .filter((title, index, self) => self.indexOf(title) === index)
                  .slice(0, 10)} // Limit to 10 unique activities
                interests={[]} // Could be extracted from itinerary description or form data
                isPremium={itinerary.user.subscriptionStatus === 'active'}
              />
            </div>
          )}

          {/* Budget & Expenses */}
          <ExpenseList
            itineraryId={itinerary.id}
            expenses={itinerary.expenses.map((exp) => ({
              id: exp.id,
              title: exp.title,
              description: exp.description,
              amount: Number(exp.amount),
              currency: exp.currency,
              category: exp.category,
              date: exp.date,
            }))}
            budget={itinerary.budget ? Number(itinerary.budget) : null}
            budgetCurrency={itinerary.budgetCurrency || 'USD'}
            onRefresh={() => {
              // Refresh handled by component
            }}
          />
        </div>
      </main>
  );
}
