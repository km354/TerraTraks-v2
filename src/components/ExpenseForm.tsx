'use client';

import { useState } from 'react';

interface ExpenseFormProps {
  itineraryId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  expense?: {
    id: string;
    title: string;
    description?: string | null;
    amount: number;
    currency: string;
    category?: string | null;
    date: Date;
  };
}

const EXPENSE_CATEGORIES = [
  'accommodation',
  'food',
  'transportation',
  'activity',
  'shopping',
  'other',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

export function ExpenseForm({ itineraryId, onSuccess, onCancel, expense }: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    description: expense?.description || '',
    amount: expense?.amount.toString() || '',
    currency: expense?.currency || 'USD',
    category: expense?.category || 'other',
    date: expense?.date
      ? new Date(expense.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = expense
        ? `/api/expenses/${expense.id}`
        : '/api/expenses';
      const method = expense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          itineraryId,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save expense');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-forest mb-1">
          Expense Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
          placeholder="e.g., Hotel Booking, Restaurant Dinner"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-forest mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
          rows={2}
          placeholder="Additional notes about this expense"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-forest mb-1">
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-forest mb-1">
            Currency *
          </label>
          <select
            id="currency"
            required
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-forest mb-1">
            Category *
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-forest mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-sage/50 text-forest rounded-lg hover:bg-sage/10 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

