'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BudgetEditorProps {
  itineraryId: string;
  currentBudget?: number | null;
  currentCurrency?: string | null;
  onSuccess?: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

export function BudgetEditor({
  itineraryId,
  currentBudget,
  currentCurrency = 'USD',
  onSuccess,
}: BudgetEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!currentBudget);
  const [budget, setBudget] = useState(
    currentBudget?.toString() || ''
  );
  const [currency, setCurrency] = useState(currentCurrency || 'USD');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget: budget ? parseFloat(budget) : null,
          budgetCurrency: currency,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update budget');
      }

      setShowForm(false);
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update budget');
      setLoading(false);
    }
  };

  if (!showForm && currentBudget) {
    return (
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-forest/60">Budget</p>
          <p className="text-lg font-bold text-forest">
            {currency} {currentBudget.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-sky hover:text-sky-dark transition-colors"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-forest mb-1">
            Budget Amount
          </label>
          <input
            type="number"
            id="budget"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-forest mb-1">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </button>
        {currentBudget && (
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setBudget(currentBudget.toString());
              setCurrency(currentCurrency || 'USD');
            }}
            className="px-6 py-2 border-2 border-sage/50 text-forest rounded-lg hover:bg-sage/10 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

