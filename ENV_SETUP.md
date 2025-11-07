# Environment Variables Setup Guide

This guide explains how to set up all required API keys and environment variables for TerraTraks.

## 📋 Required API Keys

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
**Purpose**: Displaying map images

**How to get it**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps Static API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key
6. (Recommended) Restrict the key to Maps Static API only

**Cost**: Free tier available (28,000 requests/month)

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

### 5. Stripe API Keys
**Purpose**: Payment processing

**How to get them**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign in or create an account
3. Toggle to "Test mode" for development
4. Copy:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
5. For webhooks: Go to "Developers" → "Webhooks" → "Add endpoint"
   - Copy the webhook signing secret

**Cost**: 2.9% + $0.30 per successful charge

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

## 🚀 Local Development Setup

### Step 1: Create `.env.local` file

Copy the example file:
```bash
cp .env.example .env.local
```

### Step 2: Fill in your API keys

Open `.env.local` and replace all `your_*_api_key_here` placeholders with your actual keys.

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
| `STRIPE_WEBHOOK_SECRET` | Your Stripe Webhook Secret | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key | Production, Preview |
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

