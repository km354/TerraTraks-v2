# Stripe Webhook Setup Guide

This guide explains how to set up Stripe webhooks for TerraTraks on Vercel.

## Why Webhooks?

Stripe webhooks allow your application to receive real-time notifications about events in Stripe, such as:
- Successful payments
- Subscription creations/updates/cancellations
- Failed payments
- Invoice events

## Setup Steps

### 1. Get Your Production URL

Once deployed on Vercel, note your production URL:
- Example: `https://terratraks.vercel.app`

### 2. Configure Webhook in Stripe Dashboard

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your endpoint URL:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```
5. Select the following events to listen to:
   - `checkout.session.completed` - When a checkout is completed
   - `customer.subscription.created` - When a subscription is created
   - `customer.subscription.updated` - When a subscription is updated
   - `customer.subscription.deleted` - When a subscription is canceled
   - `invoice.payment_succeeded` - When an invoice payment succeeds
   - `invoice.payment_failed` - When an invoice payment fails
6. Click **Add endpoint**

### 3. Get Webhook Signing Secret

1. After creating the webhook, click on it
2. In the **Signing secret** section, click **Reveal**
3. Copy the secret (starts with `whsec_`)

### 4. Add to Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add a new variable:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: The webhook signing secret you copied
   - **Environment**: Production (and Preview if you want to test)
3. Save the variable

### 5. Redeploy (if needed)

If you added the environment variable after deployment:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the three dots on the latest deployment
3. Click **Redeploy**

## Testing Webhooks

### Local Testing with Stripe CLI

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret from the CLI output and add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Testing in Production

1. Make a test purchase on your production site
2. Check Vercel logs:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Click **Functions** tab
   - Check for webhook logs

3. Check Stripe Dashboard:
   - Go to **Developers** → **Webhooks**
   - Click on your webhook
   - Check the **Recent deliveries** section
   - Green checkmark = successful
   - Red X = failed (check error message)

## Webhook Events Handled

### `checkout.session.completed`
- Updates user subscription status to `active`
- Links Stripe customer ID to user

### `customer.subscription.created`
- Ensures subscription is tracked in database

### `customer.subscription.updated`
- Updates subscription status based on Stripe status
- Handles plan changes

### `customer.subscription.deleted`
- Sets user subscription status to `free`
- Preserves subscription history

### `invoice.payment_succeeded`
- Confirms subscription is active
- Updates subscription renewal date

### `invoice.payment_failed`
- Marks subscription as `past_due`
- Sends notification to user (if implemented)

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook URL**: Ensure it's correct and accessible
2. **Check Vercel deployment**: Make sure the API route is deployed
3. **Check Stripe dashboard**: Look for failed deliveries
4. **Check Vercel logs**: Look for errors in function logs

### Webhook Signature Verification Failed

1. **Check webhook secret**: Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
2. **Check secret format**: Should start with `whsec_`
3. **Redeploy**: Environment variables require a redeploy to take effect

### Webhook Returns 500 Error

1. **Check Vercel logs**: Look for detailed error messages
2. **Check database connection**: Ensure database is accessible
3. **Check API route code**: Look for unhandled errors

### Testing Webhooks

1. Use Stripe Dashboard → Webhooks → Send test webhook
2. Use Stripe CLI for local testing
3. Make actual test purchases (use Stripe test mode)

## Security Best Practices

1. **Always verify webhook signatures**: The code already does this
2. **Use HTTPS**: Vercel provides this automatically
3. **Keep webhook secret secure**: Never commit it to git
4. **Monitor webhook deliveries**: Check for failures regularly
5. **Handle idempotency**: Stripe may send duplicate events

## Monitoring

### Vercel Logs
- Check function logs for webhook processing
- Look for errors or warnings
- Monitor response times

### Stripe Dashboard
- Check webhook delivery success rate
- Review failed deliveries
- Monitor event volume

### Application Logs
- Log webhook events (without sensitive data)
- Track subscription state changes
- Monitor error rates

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check Stripe webhook logs
3. Review the webhook endpoint code: `src/app/api/webhooks/stripe/route.ts`
4. Contact Stripe support if needed

