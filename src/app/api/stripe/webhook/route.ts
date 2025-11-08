/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for subscription status changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { stripe as stripeConfig } from '@/lib/env';

const stripe = getStripeClient();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  if (!stripeConfig.webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Update user with subscription information
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'active',
    },
  });

  console.log(`Subscription activated for user ${userId}`);
}

/**
 * Handle subscription created/updated
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  if (!userId) {
    // Try to find user by customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      console.error('User not found for subscription update');
      return;
    }
    await updateUserSubscription(user.id, subscriptionId, status);
  } else {
    await updateUserSubscription(userId, subscriptionId, status);
  }
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;

  let userIdToUpdate = userId;

  if (!userIdToUpdate) {
    // Try to find user by customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      console.error('User not found for subscription deletion');
      return;
    }
    userIdToUpdate = user.id;
  }

  // Update user subscription status
  await prisma.user.update({
    where: { id: userIdToUpdate },
    data: {
      subscriptionStatus: 'cancelled',
      subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`Subscription cancelled for user ${userIdToUpdate}`);
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;

  let userIdToUpdate = userId;

  if (!userIdToUpdate) {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) return;
    userIdToUpdate = user.id;
  }

  // Update subscription status to active
  await updateUserSubscription(
    userIdToUpdate,
    subscriptionId,
    subscription.status
  );
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;

  let userIdToUpdate = userId;

  if (!userIdToUpdate) {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) return;
    userIdToUpdate = user.id;
  }

  // Update subscription status based on subscription status
  await updateUserSubscription(
    userIdToUpdate,
    subscriptionId,
    subscription.status
  );
}

/**
 * Update user subscription in database
 */
async function updateUserSubscription(
  userId: string,
  subscriptionId: string,
  status: string
) {
  // Map Stripe status to our status
  let subscriptionStatus = 'free';
  if (status === 'active' || status === 'trialing') {
    subscriptionStatus = 'active';
  } else if (status === 'past_due' || status === 'unpaid') {
    subscriptionStatus = 'past_due';
  } else if (status === 'canceled' || status === 'incomplete_expired') {
    subscriptionStatus = 'cancelled';
  }

  // Get subscription to get period end
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus,
      subscriptionEndsAt:
        subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
    },
  });
}

