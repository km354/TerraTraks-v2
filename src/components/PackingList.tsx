'use client';

import { useState, useEffect } from 'react';
import { PackingItem, PackingList as PackingListType } from '@/lib/packing-list';

interface PackingListProps {
  itineraryId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  activities?: string[];
  interests?: string[];
  isPremium: boolean;
}

export function PackingList({
  itineraryId,
  destination,
  startDate,
  endDate,
  duration,
  activities = [],
  interests = [],
  isPremium,
}: PackingListProps) {
  const [packingList, setPackingList] = useState<PackingListType | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedItems, setGroupedItems] = useState<Record<string, PackingItem[]>>({});

  // Load checked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`packing-list-${itineraryId}`);
    if (saved) {
      try {
        setCheckedItems(new Set(JSON.parse(saved)));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [itineraryId]);

  // Generate packing list
  useEffect(() => {
    async function fetchPackingList() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/packing-list/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            duration,
            activities,
            interests,
            isPremium,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate packing list');
        }

        const data = await response.json();
        setPackingList(data.packingList);

        // Group items by category
        const grouped: Record<string, PackingItem[]> = {};
        data.packingList.items.forEach((item: PackingItem) => {
          if (!grouped[item.category]) {
            grouped[item.category] = [];
          }
          grouped[item.category].push(item);
        });
        setGroupedItems(grouped);
      } catch (err: any) {
        console.error('Error fetching packing list:', err);
        setError(err.message || 'Failed to load packing list');
      } finally {
        setLoading(false);
      }
    }

    fetchPackingList();
  }, [destination, startDate, endDate, duration, activities, interests, isPremium]);

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
    
    // Save to localStorage
    localStorage.setItem(`packing-list-${itineraryId}`, JSON.stringify(Array.from(newChecked)));
  };

  const categoryOrder = [
    'Documents',
    'Clothing',
    'Footwear',
    'Toiletries',
    'Electronics',
    'Gear/Equipment',
    'Medications',
    'Food/Snacks',
    'Other',
  ];

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-forest mb-6">Packing List</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-forest mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-forest/70">Generating your personalized packing list...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-forest mb-6">Packing List</h2>
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error loading packing list</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!packingList) {
    return null;
  }

  const totalItems = packingList.items.length;
  const checkedCount = checkedItems.size;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-forest">Packing List</h2>
        <div className="text-sm text-forest/60">
          {checkedCount} of {totalItems} packed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-sage-light/30 rounded-full h-3 mb-2">
          <div
            className="bg-sage h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Summary */}
      {packingList.summary && (
        <div className="mb-6 p-4 bg-sage-light/30 rounded-lg border border-sage/20">
          <p className="text-forest/80 leading-relaxed">{packingList.summary}</p>
        </div>
      )}

      {/* Packing Items by Category */}
      <div className="space-y-6">
        {categoryOrder
          .filter((category) => groupedItems[category] && groupedItems[category].length > 0)
          .map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-forest mb-3 flex items-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {category}
              </h3>
              <div className="space-y-2">
                {groupedItems[category].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      checkedItems.has(item.id)
                        ? 'bg-sage-light/30 border-sage/30'
                        : 'bg-sage-light/10 border-sage/10 hover:border-sage/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 h-5 w-5 text-sage border-sage/30 rounded focus:ring-sage focus:ring-2"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            checkedItems.has(item.id)
                              ? 'line-through text-forest/50'
                              : 'text-forest'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.essential && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Essential
                          </span>
                        )}
                      </div>
                      {item.quantity && (
                        <p className="text-sm text-forest/60 mt-1">Quantity: {item.quantity}</p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-forest/70 mt-1 italic">{item.notes}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Tips */}
      {packingList.tips && packingList.tips.length > 0 && (
        <div className="mt-8 pt-6 border-t border-sage/20">
          <h3 className="text-lg font-semibold text-forest mb-4 flex items-center">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Packing Tips
          </h3>
          <ul className="space-y-2">
            {packingList.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-forest/80">
                <span className="text-sage mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

