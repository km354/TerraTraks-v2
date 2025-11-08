/**
 * Stripe Checkout API Route
 * 
 * Creates a Stripe checkout session for premium subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const email = session.user.email;
    const name = session.user.name || undefined;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(userId, email, name);

    // Create checkout session
    const checkoutSession = await createCheckoutSession(userId, customer.id);

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

