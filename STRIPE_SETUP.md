# Stripe Payment Setup Guide

This guide explains how to set up Stripe for TerraTraks premium subscriptions.

## 🎯 Overview

TerraTraks uses Stripe for handling premium subscription payments. The integration includes:
- **Checkout Sessions**: Secure payment flow for new subscriptions
- **Billing Portal**: Customer self-service for managing subscriptions
- **Webhooks**: Real-time subscription status updates
- **Database Integration**: Automatic user subscription status updates

## 📋 Prerequisites

1. A Stripe account ([Sign up here](https://dashboard.stripe.com/register))
2. Stripe API keys (test mode for development, live mode for production)
3. A Stripe product and price for TerraTraks Premium

## 🚀 Setup Steps

### Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Toggle to **Test mode** for development
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### Step 2: Create Premium Product and Price

1. In Stripe Dashboard, go to **Products** → **Add product**
2. Fill in product details:
   - **Name**: TerraTraks Premium
   - **Description**: Premium subscription with unlimited itineraries and advanced features
3. Add a price:
   - **Pricing model**: Standard pricing
   - **Price**: $7.99 USD (or your desired amount, $6-8 range as requested)
   - **Billing period**: Monthly (recurring)
   - **Currency**: USD
4. Click **Save product**
5. **Important**: Copy the **Price ID** (starts with `price_`) - this is `STRIPE_PREMIUM_PRICE_ID`

### Step 3: Enable Customer Portal (Billing Portal)

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable **Customer portal**
3. Configure portal settings:
   - Allow customers to cancel subscriptions
   - Allow customers to update payment methods
   - Allow customers to update billing information
4. Save changes

### Step 4: Set Up Webhooks

#### For Production:

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Click **Add endpoint**
5. Copy the **Signing secret** (starts with `whsec_`) - this is `STRIPE_WEBHOOK_SECRET`

#### For Development (Using Stripe CLI):

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. This will output a webhook signing secret - use this for `STRIPE_WEBHOOK_SECRET` in development

### Step 5: Configure Environment Variables

Add these to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

For production, add these to Vercel environment variables (see [VERCEL_SETUP.md](./VERCEL_SETUP.md)).

## 🔄 How It Works

### Checkout Flow

1. User clicks "Upgrade to Premium" on pricing page
2. Frontend calls `/api/stripe/checkout` API route
3. Backend creates Stripe checkout session
4. User is redirected to Stripe Checkout
5. User completes payment
6. Stripe sends `checkout.session.completed` webhook
7. Backend updates user subscription status in database
8. User is redirected back to dashboard with success message

### Subscription Management

1. Premium users can click "Manage Subscription" on dashboard
2. Frontend calls `/api/stripe/billing-portal` API route
3. Backend creates Stripe billing portal session
4. User is redirected to Stripe Billing Portal
5. User can update payment method, cancel subscription, etc.
6. Stripe sends webhooks for subscription changes
7. Backend updates user subscription status in database

### Webhook Events

The webhook handler (`/api/stripe/webhook`) processes these events:

- **checkout.session.completed**: Subscription activated
- **customer.subscription.created**: Subscription created
- **customer.subscription.updated**: Subscription status changed
- **customer.subscription.deleted**: Subscription cancelled
- **invoice.payment_succeeded**: Payment successful
- **invoice.payment_failed**: Payment failed

## 🧪 Testing

### Test Cards

Stripe provides test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing Webhooks Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In another terminal, start Stripe CLI webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.created
   ```

## 🐛 Troubleshooting

### Checkout not working

- Verify `STRIPE_PREMIUM_PRICE_ID` is set correctly
- Check Stripe API keys are correct (test vs live)
- Ensure user is authenticated before checkout
- Check browser console for errors

### Webhooks not received

- Verify webhook endpoint URL is correct
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- For development, ensure Stripe CLI is running
- Check webhook logs in Stripe Dashboard

### Subscription status not updating

- Check webhook events are being received
- Verify database connection is working
- Check server logs for webhook processing errors
- Ensure user ID is included in webhook metadata

### Billing portal not working

- Verify customer has a Stripe customer ID in database
- Check billing portal is enabled in Stripe Dashboard
- Ensure user is authenticated before accessing portal

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Billing Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)

## 🔒 Security Notes

1. **Never expose secret keys** - Keep `STRIPE_SECRET_KEY` server-side only
2. **Use webhook signatures** - Always verify webhook signatures
3. **Use different keys** - Use test keys for development, live keys for production
4. **Rotate keys regularly** - Rotate API keys if compromised
5. **Restrict webhook endpoints** - Only accept webhooks from Stripe IPs (handled automatically by Next.js)

## 💰 Pricing

- **Stripe Fees**: 2.9% + $0.30 per successful charge
- **Premium Price**: $7.99/month (configurable via Stripe Dashboard)
- **Currency**: USD (can be changed in Stripe Dashboard)

## 📝 Next Steps

After setting up Stripe:

1. Test the checkout flow with test cards
2. Verify webhooks are working correctly
3. Test subscription cancellation and updates
4. Switch to live mode when ready for production
5. Update webhook endpoint URL to production URL
6. Update environment variables in Vercel

