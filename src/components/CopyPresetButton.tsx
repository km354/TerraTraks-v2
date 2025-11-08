'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CopyPresetButtonProps {
  presetId: string;
}

export function CopyPresetButton({ presetId }: CopyPresetButtonProps) {
  const router = useRouter();
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    setIsCopying(true);
    setError(null);

    try {
      const response = await fetch('/api/itineraries/copy-preset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ presetId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to copy itinerary');
      }

      const data = await response.json();
      router.push(`/itinerary/${data.itineraryId}`);
    } catch (err: any) {
      console.error('Error copying itinerary:', err);
      setError(err.message || 'Failed to copy itinerary');
      setIsCopying(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCopy}
        disabled={isCopying}
        className="inline-flex items-center px-8 py-4 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all font-medium text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCopying ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2"
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
            Copying...
          </>
        ) : (
          <>
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy to My Trips
          </>
        )}
      </button>
      {error && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}

