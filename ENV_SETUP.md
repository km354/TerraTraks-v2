# Environment Variables Setup Guide

This guide explains how to set up all required API keys and environment variables for TerraTraks.

## 📋 Required API Keys

> **Note**: Affiliate program IDs are optional but recommended for monetization. See section 6 below.

### 1. OpenAI API Key
**Purpose**: GPT-4/GPT-3.5 API calls for AI features

**How to get it**:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't see it again)

**Cost**: Pay-as-you-go pricing

---

### 2. OpenWeatherMap API Key
**Purpose**: Weather data for tracking locations

**How to get it**:
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your default API key
5. (Optional) Subscribe to a paid plan for more requests

**Cost**: Free tier available (60 calls/minute)

---

### 3. Google Maps Static API Key
**Purpose**: Displaying map images and geocoding locations

**How to get it**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps Static API** (required for map images)
   - **Geocoding API** (required for route visualization - optional but recommended)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key
6. (Recommended) Restrict the key to:
   - Maps Static API
   - Geocoding API (if enabled)

**Note**: Geocoding API is optional but recommended for better route visualization. If not enabled, maps will still work but won't show route paths between locations.

**Cost**: 
- Maps Static API: Free tier available (28,000 requests/month)
- Geocoding API: Free tier available (40,000 requests/month)

---

### 4. Google OAuth Credentials
**Purpose**: User authentication/sign-in

**How to get them**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click "Create Credentials" → "OAuth client ID"
4. Configure OAuth consent screen (if not done)
5. Application type: "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

**Cost**: Free

---

### 5. Stripe API Keys and Product Setup
**Purpose**: Payment processing for premium subscriptions

**How to get them**:

#### Step 1: Get API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign in or create an account
3. Toggle to "Test mode" for development
4. Copy:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

#### Step 2: Create Premium Product and Price
1. In Stripe Dashboard, go to "Products" → "Add product"
2. Fill in product details:
   - **Name**: TerraTraks Premium
   - **Description**: Premium subscription with unlimited itineraries and advanced features
3. Add a price:
   - **Pricing model**: Standard pricing
   - **Price**: $7.99 USD (or your desired amount)
   - **Billing period**: Monthly (recurring)
   - **Currency**: USD
4. Click "Save product"
5. **Important**: Copy the **Price ID** (starts with `price_`) - you'll need this for `STRIPE_PREMIUM_PRICE_ID`

#### Step 3: Set Up Webhooks
1. Go to "Developers" → "Webhooks" → "Add endpoint"
2. Endpoint URL:
   - **Development**: Use Stripe CLI (see below) or `http://localhost:3000/api/stripe/webhook`
   - **Production**: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Click "Add endpoint"
5. Copy the **Signing secret** (starts with `whsec_`) - you'll need this for `STRIPE_WEBHOOK_SECRET`

#### Step 4: Enable Billing Portal (Optional but Recommended)
1. Go to "Settings" → "Billing" → "Customer portal"
2. Enable "Customer portal"
3. Configure portal settings (allow customers to cancel, update payment methods, etc.)
4. Save changes

**Cost**: 2.9% + $0.30 per successful charge

**Testing with Stripe CLI** (Development):
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# This will output a webhook signing secret - use this for STRIPE_WEBHOOK_SECRET in development
```

---

### 6. Supabase Credentials
**Purpose**: Database and backend services

**How to get them**:
1. Go to [Supabase](https://supabase.com)
2. Sign up or sign in
3. Create a new project
4. Go to Project Settings → API
5. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (optional, for admin operations - keep this secret!)

**Cost**: Free tier available (500MB database, 2GB bandwidth)

---

### 7. Auth Secret
**Purpose**: Encryption key for NextAuth session tokens

**How to generate it**:
1. Run this command in your terminal:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the generated string
3. Add it to your `.env.local` as `AUTH_SECRET`

**Alternative**: You can use any random string, but the OpenSSL method is recommended for security.

---

### 8. Database URL (Prisma)
**Purpose**: PostgreSQL database connection for Prisma

**How to get it**:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Select **URI** tab
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password
   - Find/reset password in **Settings** → **Database** → **Database password**

Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

**Cost**: Included with Supabase free tier

For detailed database setup, see [DATABASE_SETUP.md](./DATABASE_SETUP.md).

---

## 🚀 Local Development Setup

### Step 1: Create `.env.local` file

Copy the example file:
```bash
cp .env.example .env.local
```

### Step 2: Fill in your API keys

Open `.env.local` and replace all `your_*_api_key_here` placeholders with your actual keys.

### 6. Affiliate Program IDs (Optional)
**Purpose**: Monetization through affiliate links

**How to get them**:

#### Booking.com Affiliate Program
1. Go to [Booking.com Affiliate Partner Central](https://www.booking.com/affiliate-program/v2/index.html)
2. Sign up for the affiliate program
3. Get your affiliate ID (usually starts with a number)
4. Add to `.env.local`: `BOOKING_COM_AFFILIATE_ID=your_affiliate_id`

#### REI Affiliate Program
1. Go to [REI Affiliate Program](https://www.rei.com/affiliate)
2. Sign up for the affiliate program
3. Get your affiliate tracking ID
4. Add to `.env.local`: `REI_AFFILIATE_ID=your_affiliate_id`

#### GetYourGuide Affiliate Program
1. Go to [GetYourGuide Partner Program](https://partner.getyourguide.com/)
2. Sign up for the partner program
3. Get your partner ID
4. Add to `.env.local`: `GET_YOUR_GUIDE_AFFILIATE_ID=your_partner_id`

#### Viator Affiliate Program
1. Go to [Viator Affiliate Program](https://www.viator.com/affiliates)
2. Sign up for the affiliate program
3. Get your affiliate ID
4. Add to `.env.local`: `VIATOR_AFFILIATE_ID=your_affiliate_id`

**Note**: Affiliate links are optional. If not configured, the app will work normally without affiliate links.

**Cost**: Free to join, earn commissions on bookings/purchases

---

### Step 3: Verify setup

The application will validate environment variables on startup. Missing variables will show warnings.

---

## ☁️ Vercel Production Setup

### Step 1: Go to Vercel Dashboard

1. Navigate to your project on [Vercel](https://vercel.com/dashboard)
2. Click on your project → "Settings" → "Environment Variables"

### Step 2: Add all environment variables

Add each variable with its corresponding value:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `OPENAI_API_KEY` | Your OpenAI key | Production, Preview, Development |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap key | Production, Preview, Development |
| `GOOGLE_MAPS_STATIC_API_KEY` | Your Google Maps key | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret | Production, Preview, Development |
| `GOOGLE_REDIRECT_URI` | `https://yourdomain.com/api/auth/callback/google` | Production, Preview |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key | Production, Preview, Development |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe Publishable Key | Production, Preview, Development |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe Publishable Key | Production, Preview, Development |
| `STRIPE_PREMIUM_PRICE_ID` | Your Stripe Price ID (starts with `price_`) | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe Webhook Signing Secret | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key | Production, Preview |
| `DATABASE_URL` | Your Supabase Database Connection String | Production, Preview, Development |
| `AUTH_SECRET` | Generated auth secret | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` | Production |
| `NODE_ENV` | `production` | Production |

### Step 3: Update Google OAuth Redirect URI

Make sure your Google OAuth redirect URI in Google Cloud Console matches your production domain:
- Production: `https://yourdomain.com/api/auth/callback/google`

### Step 4: Redeploy

After adding environment variables, redeploy your application:
- Go to "Deployments" tab
- Click "Redeploy" on the latest deployment
- Or push a new commit to trigger automatic deployment

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for development and production**
3. **Restrict API keys** when possible (especially Google Maps)
4. **Rotate keys regularly** if compromised
5. **Use environment-specific keys** in Vercel (separate for dev/preview/production)
6. **Enable rate limiting** on API keys when available

---

## 🧪 Testing Your Setup

After setting up environment variables, you can test them:

```typescript
import { validateEnv } from '@/lib/env';

// This will warn about missing variables
validateEnv();
```

---

## ❓ Troubleshooting

### "Missing required environment variable" error
- Make sure `.env.local` exists in the project root
- Verify all keys are filled in (no `your_*_here` placeholders)
- Restart your development server after adding variables

### API calls failing in production
- Check Vercel environment variables are set correctly
- Verify the environment is selected (Production/Preview/Development)
- Redeploy after adding new variables

### Google OAuth not working
- Verify redirect URI matches exactly (including protocol and path)
- Check Client ID and Secret are correct
- Ensure OAuth consent screen is configured

### Stripe webhooks not working
- Verify webhook endpoint URL in Stripe dashboard
- Check webhook secret is correct
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [Stripe API Documentation](https://stripe.com/docs/api)

