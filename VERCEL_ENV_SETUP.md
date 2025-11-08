# Vercel Environment Variables Setup

This document lists all environment variables that need to be configured in Vercel for TerraTraks to work correctly.

## Required Environment Variables

### Authentication (NextAuth.js)
- `AUTH_SECRET` - Secret key for NextAuth.js (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://terratraks.com`)

### Database (Supabase/PostgreSQL)
- `DATABASE_URL` - PostgreSQL connection string from Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side operations)

### Google OAuth
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### OpenAI API
- `OPENAI_API_KEY` - OpenAI API key for itinerary generation and AI features

### OpenWeatherMap API
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key for weather forecasts

### Google Maps API
- `GOOGLE_MAPS_STATIC_API_KEY` - Google Maps Static API key for map images

### Stripe (Payment Processing)
- `STRIPE_SECRET_KEY` - Stripe secret key (starts with `sk_`)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (starts with `pk_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (same as above, for client-side)
- `STRIPE_PREMIUM_PRICE_ID` - Stripe price ID for Premium subscription
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (get from Stripe dashboard after setting up webhook)

### Affiliate Programs (Optional)
- `BOOKING_COM_AFFILIATE_ID` - Booking.com affiliate ID (optional)
- `REI_AFFILIATE_ID` - REI affiliate ID (optional)
- `GET_YOUR_GUIDE_AFFILIATE_ID` - GetYourGuide affiliate ID (optional)
- `VIATOR_AFFILIATE_ID` - Viator affiliate ID (optional)

### Monitoring (Optional but Recommended)
- `SENTRY_DSN` - Sentry DSN for error tracking (optional)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for client-side (optional)
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID (optional)

## Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above for **Production**, **Preview**, and **Development** environments
4. Make sure to mark sensitive variables (API keys, secrets) as **Sensitive**

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to `STRIPE_WEBHOOK_SECRET` in Vercel

## Verification Checklist

- [ ] All required environment variables are set in Vercel
- [ ] Stripe webhook is configured and secret is set
- [ ] Database connection is working
- [ ] Google OAuth is configured with correct redirect URLs
- [ ] All API keys are valid and have proper quotas
- [ ] `NEXT_PUBLIC_APP_URL` matches your production domain

## Testing Production Deployment

After deploying, test the following:
1. User authentication (sign in with Google)
2. Create a new itinerary
3. View an itinerary
4. Upgrade to Premium (Stripe checkout)
5. Stripe webhook receives events (check Vercel logs)
6. Google Maps images load correctly
7. Weather forecast API works
8. OpenAI API generates itineraries

