'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseForm } from './ExpenseForm';

interface Expense {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  currency: string;
  category?: string | null;
  date: Date;
}

interface ExpenseListProps {
  itineraryId: string;
  expenses: Expense[];
  budget?: number | null;
  budgetCurrency?: string | null;
  onRefresh: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  accommodation: '🏨',
  food: '🍽️',
  transportation: '🚗',
  activity: '🎯',
  shopping: '🛍️',
  other: '💰',
};

const CATEGORY_COLORS: Record<string, string> = {
  accommodation: 'bg-blue-100 text-blue-700',
  food: 'bg-orange-100 text-orange-700',
  transportation: 'bg-purple-100 text-purple-700',
  activity: 'bg-green-100 text-green-700',
  shopping: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
};

export function ExpenseList({
  itineraryId,
  expenses,
  budget,
  budgetCurrency = 'USD',
  onRefresh,
}: ExpenseListProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget ? budget - totalExpenses : null;
  const budgetPercentage = budget ? (totalExpenses / budget) * 100 : null;

  const groupedByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      router.refresh();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(null);
    router.refresh();
    if (onRefresh) onRefresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-forest">Budget & Expenses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-forest text-offwhite rounded-lg hover:bg-forest-light transition-all font-medium flex items-center gap-2"
          >
            <svg
              className="h-5 w-5"
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
            Add Expense
          </button>
        )}
      </div>

      {/* Budget Summary */}
      {budget && (
        <div className="mb-8 p-6 bg-sage-light/30 rounded-lg border border-sage/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-forest/60 mb-1">Budget</p>
              <p className="text-2xl font-bold text-forest">
                {budgetCurrency} {budget.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-forest/60 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-forest">
                {budgetCurrency} {totalExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-forest/60 mb-1">Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  remainingBudget && remainingBudget >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {budgetCurrency}{' '}
                {remainingBudget !== null ? remainingBudget.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-forest">
                Budget Usage
              </span>
              <span className="text-sm text-forest/60">
                {budgetPercentage?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-sage-light/30 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  budgetPercentage && budgetPercentage > 100
                    ? 'bg-red-500'
                    : budgetPercentage && budgetPercentage > 80
                    ? 'bg-orange-500'
                    : 'bg-sage'
                }`}
                style={{
                  width: `${Math.min(budgetPercentage || 0, 100)}%`,
                }}
              />
            </div>
            {budgetPercentage && budgetPercentage > 100 && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ Over budget by{' '}
                {budgetCurrency}{' '}
                {Math.abs(remainingBudget || 0).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Expense Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-sage-light/20 rounded-lg border border-sage/20">
          <h3 className="text-xl font-semibold text-forest mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <ExpenseForm
            itineraryId={itineraryId}
            expense={editingExpense || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* Expenses by Category */}
      {expenses.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([category, categoryExpenses]) => {
            const categoryTotal = categoryExpenses.reduce(
              (sum, exp) => sum + exp.amount,
              0
            );

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-forest flex items-center gap-2">
                    <span>{CATEGORY_ICONS[category] || '💰'}</span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <span className="text-sm font-medium text-forest/70">
                    {budgetCurrency} {categoryTotal.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  {categoryExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center p-4 bg-sage-light/20 rounded-lg border border-sage/20 hover:bg-sage-light/30 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-forest">
                            {expense.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other}`}
                          >
                            {category}
                          </span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-forest/70 mt-1">
                            {expense.description}
                          </p>
                        )}
                        <p className="text-xs text-forest/60 mt-1">
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-forest">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 text-sky hover:text-sky-dark transition-colors"
                            title="Edit"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            disabled={deletingId === expense.id}
                            className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === expense.id ? (
                              <svg
                                className="animate-spin h-4 w-4"
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
                            ) : (
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="border-t-2 border-forest/20 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-forest">Total Expenses</span>
              <span className="text-3xl font-bold text-forest">
                {budgetCurrency} {totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-forest/60 mb-3">No expenses yet</p>
          <p className="text-sm text-forest/50">
            Start tracking your trip expenses by adding your first expense.
          </p>
        </div>
      )}
    </div>
  );
}

