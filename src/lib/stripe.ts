/**
 * Stripe Client Configuration
 * 
 * Provides a configured Stripe client for handling payments and subscriptions
 */

import Stripe from 'stripe';
import { stripe as stripeConfig, app } from './env';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    if (!stripeConfig.secretKey) {
      throw new Error('Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
    }
    stripeClient = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }
  return stripeClient;
}

/**
 * Premium subscription price ID - should be set via environment variable
 * You can get this from Stripe Dashboard after creating the product and price
 */
export const PREMIUM_PRICE_ID = stripeConfig.premiumPriceId || '';

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  const stripe = getStripeClient();
  const prisma = (await import('./prisma')).prisma;

  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (user?.stripeCustomerId) {
    // Retrieve existing customer
    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (!customer.deleted) {
        return customer as Stripe.Customer;
      }
    } catch (error) {
      // Customer doesn't exist, create a new one
      console.log('Customer not found, creating new one');
    }
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  // Update user with customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer;
}

/**
 * Create a checkout session for premium subscription
 */
export async function createCheckoutSession(
  userId: string,
  customerId?: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();

  if (!PREMIUM_PRICE_ID) {
    throw new Error('STRIPE_PREMIUM_PRICE_ID is not configured. Please set it in your environment variables.');
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : undefined, // Will be set via metadata if needed
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: PREMIUM_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${app.url}/dashboard?success=true`,
    cancel_url: `${app.url}/pricing?canceled=true`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session;
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Create a payment intent
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Stripe API error:', error);
    throw error;
  }
}

/**
 * Retrieve a payment intent
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Stripe API error:', error);
    throw error;
  }
}

