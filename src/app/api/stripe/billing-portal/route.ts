/**
 * Stripe Billing Portal API Route
 * 
 * Creates a Stripe billing portal session for managing subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createBillingPortalSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { app } from '@/lib/env';

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

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe first.' },
        { status: 400 }
      );
    }

    // Get return URL from request body or use default
    const body = await request.json().catch(() => ({}));
    const returnUrl = body.returnUrl || `${app.url}/dashboard`;

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      user.stripeCustomerId,
      returnUrl
    );

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error: any) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}

