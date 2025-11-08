'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface PresetItineraryCardProps {
  id: string;
  title: string;
  destination: string;
  description?: string | null;
  imageUrl?: string | null;
  duration?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  budget?: number | null;
  budgetCurrency?: string | null;
  itemsCount?: number;
  featured?: boolean;
}

export function PresetItineraryCard({
  id,
  title,
  destination,
  description,
  imageUrl,
  duration,
  budget,
  budgetCurrency = 'USD',
  itemsCount = 0,
  featured = false,
}: PresetItineraryCardProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCopying(true);
    try {
      const response = await fetch('/api/itineraries/copy-preset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ presetId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to copy itinerary');
      }

      const data = await response.json();
      setCopied(true);
      
      // Redirect to the new itinerary
      window.location.href = `/itinerary/${data.itineraryId}`;
    } catch (error) {
      console.error('Error copying itinerary:', error);
      alert('Failed to copy itinerary. Please try again.');
      setIsCopying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-sage/20 group">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-sage-light">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-light to-sky-light">
            <svg
              className="h-16 w-16 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        )}
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-forest text-offwhite text-xs font-semibold rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-forest mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sage text-sm font-medium mb-3 flex items-center">
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
          {destination}
        </p>

        {description && (
          <p className="text-forest/70 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-forest/60">
          {duration && (
            <div className="flex items-center gap-1">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
            </div>
          )}
          {itemsCount > 0 && (
            <div className="flex items-center gap-1">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>{itemsCount} activities</span>
            </div>
          )}
          {budget && (
            <div className="flex items-center gap-1">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {budgetCurrency} {budget.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/itinerary/${id}`}
            className="flex-1 px-4 py-2 text-center text-forest border-2 border-sage/50 rounded-lg hover:bg-sage/10 transition-colors font-medium text-sm"
          >
            View Details
          </Link>
          <button
            onClick={handleCopy}
            disabled={isCopying || copied}
            className="flex-1 px-4 py-2 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCopying ? 'Copying...' : copied ? 'Copied!' : 'Copy to My Trips'}
          </button>
        </div>
      </div>
    </div>
  );
}

