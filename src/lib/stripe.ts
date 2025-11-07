/**
 * Stripe Client Configuration
 * 
 * Provides a configured Stripe client for handling payments
 */

import Stripe from 'stripe';
import { stripe as stripeConfig } from './env';

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

