'use client';

import { useState } from 'react';

interface BillingPortalButtonProps {
  className?: string;
  children: React.ReactNode;
  returnUrl?: string;
}

/**
 * Billing Portal Button Component
 * 
 * Handles Stripe billing portal session creation and redirects to Stripe billing portal
 */
export function BillingPortalButton({
  className,
  children,
  returnUrl,
}: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBillingPortal = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: returnUrl || window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create billing portal session');
      }

      // Redirect to Stripe billing portal
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No billing portal URL returned');
      }
    } catch (error: any) {
      console.error('Billing portal error:', error);
      alert(error.message || 'Failed to open billing portal. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBillingPortal}
      disabled={loading}
      className={className}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

