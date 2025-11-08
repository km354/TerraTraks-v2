# Vercel Environment Variables Setup

This guide shows you exactly how to add environment variables to your Vercel project for production deployment.

## 🚀 Quick Setup Steps

### Step 1: Navigate to Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **TerraTraks-v2** project
3. Click on **Settings** (top navigation)
4. Click on **Environment Variables** (left sidebar)

### Step 2: Add Each Environment Variable

For each variable below, click **Add New** and fill in:

#### Required Variables (add to Production, Preview, and Development):

1. **OPENAI_API_KEY**
   - Value: Your OpenAI API key
   - Environments: ☑ Production ☑ Preview ☑ Development

2. **OPENWEATHER_API_KEY**
   - Value: Your OpenWeatherMap API key
   - Environments: ☑ Production ☑ Preview ☑ Development

3. **GOOGLE_MAPS_STATIC_API_KEY**
   - Value: Your Google Maps Static API key
   - Environments: ☑ Production ☑ Preview ☑ Development

4. **GOOGLE_CLIENT_ID**
   - Value: Your Google OAuth Client ID
   - Environments: ☑ Production ☑ Preview ☑ Development

5. **GOOGLE_CLIENT_SECRET**
   - Value: Your Google OAuth Client Secret
   - Environments: ☑ Production ☑ Preview ☑ Development

6. **GOOGLE_REDIRECT_URI**
   - Value (Production): `https://yourdomain.vercel.app/api/auth/callback/google`
   - Value (Preview/Development): `http://localhost:3000/api/auth/callback/google`
   - Environments: ☑ Production ☑ Preview

7. **STRIPE_SECRET_KEY**
   - Value: Your Stripe Secret Key (use `sk_live_` for production, `sk_test_` for preview/dev)
   - Environments: ☑ Production ☑ Preview ☑ Development

8. **STRIPE_PUBLISHABLE_KEY**
   - Value: Your Stripe Publishable Key (use `pk_live_` for production, `pk_test_` for preview/dev)
   - Environments: ☑ Production ☑ Preview ☑ Development

9. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Value: Same as STRIPE_PUBLISHABLE_KEY (this is exposed to the client)
   - Environments: ☑ Production ☑ Preview ☑ Development

10. **STRIPE_PREMIUM_PRICE_ID**
    - Value: Your Stripe Price ID (starts with `price_`) - Get this from Stripe Dashboard after creating the premium product
    - Environments: ☑ Production ☑ Preview ☑ Development

11. **STRIPE_WEBHOOK_SECRET**
    - Value: Your Stripe Webhook Signing Secret (starts with `whsec_`)
    - Environments: ☑ Production ☑ Preview ☑ Development

12. **NEXT_PUBLIC_SUPABASE_URL**
    - Value: Your Supabase Project URL
    - Environments: ☑ Production ☑ Preview ☑ Development

13. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
    - Value: Your Supabase Anon Key
    - Environments: ☑ Production ☑ Preview ☑ Development

14. **SUPABASE_SERVICE_ROLE_KEY**
    - Value: Your Supabase Service Role Key (optional, for admin operations)
    - Environments: ☑ Production ☑ Preview

15. **DATABASE_URL**
    - Value: Your Supabase Database Connection String (postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres)
    - Environments: ☑ Production ☑ Preview ☑ Development

16. **AUTH_SECRET**
    - Value: Generated auth secret (use the same one from .env.local or generate new: `openssl rand -base64 32`)
    - Environments: ☑ Production ☑ Preview ☑ Development

17. **NEXT_PUBLIC_APP_URL**
    - Value (Production): `https://yourdomain.vercel.app`
    - Value (Preview): `https://your-preview-url.vercel.app`
    - Value (Development): `http://localhost:3000`
    - Environments: ☑ Production ☑ Preview ☑ Development

18. **NODE_ENV**
    - Value (Production): `production`
    - Value (Preview/Development): `development`
    - Environments: ☑ Production ☑ Preview ☑ Development

### Step 3: Save and Redeploy

1. After adding all variables, click **Save** (if there's a save button)
2. Go to the **Deployments** tab
3. Click the **⋯** (three dots) on your latest deployment
4. Click **Redeploy**
5. Or simply push a new commit to trigger automatic deployment

## 📋 Copy-Paste Checklist

Use this checklist to ensure you've added everything:

```
☐ OPENAI_API_KEY
☐ OPENWEATHER_API_KEY
☐ GOOGLE_MAPS_STATIC_API_KEY
☐ GOOGLE_CLIENT_ID
☐ GOOGLE_CLIENT_SECRET
☐ GOOGLE_REDIRECT_URI (different for prod/preview)
☐ STRIPE_SECRET_KEY
☐ STRIPE_PUBLISHABLE_KEY
☐ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
☐ STRIPE_PREMIUM_PRICE_ID
☐ STRIPE_WEBHOOK_SECRET
☐ NEXT_PUBLIC_SUPABASE_URL
☐ NEXT_PUBLIC_SUPABASE_ANON_KEY
☐ SUPABASE_SERVICE_ROLE_KEY (optional)
☐ DATABASE_URL
☐ AUTH_SECRET
☐ NEXT_PUBLIC_APP_URL (different for prod/preview/dev)
☐ NODE_ENV (different for prod/preview)
```

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for different environments** when possible
3. **Restrict API keys** in their respective dashboards (Google Cloud, Stripe, etc.)
4. **Rotate keys** if they're ever exposed or compromised
5. **Use environment-specific values** - Production should use production keys, preview/dev can use test keys

## 🧪 Testing After Setup

1. Deploy your application
2. Check the deployment logs for any environment variable warnings
3. Test each feature that requires an API key:
   - OpenAI API calls
   - Weather data fetching
   - Google Maps display
   - Google OAuth login
   - Stripe payment processing

## ❓ Troubleshooting

### Variables not working in production?
- Make sure you selected the correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Check that variable names match exactly (case-sensitive)
- Verify no trailing spaces in variable names or values

### Getting "Missing environment variable" errors?
- Double-check all required variables are added
- Ensure variable names match exactly what's in the code
- Redeploy the application after adding variables

### Google OAuth not working?
- Verify `GOOGLE_REDIRECT_URI` matches exactly (including protocol and path)
- Check that the redirect URI is added in Google Cloud Console
- Ensure Client ID and Secret are correct

### Stripe not working?
- Verify you're using the correct keys for the environment (test vs live)
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set (needed for client-side)
- Ensure `STRIPE_PREMIUM_PRICE_ID` is set correctly (should start with `price_`)
- Ensure webhook secret matches your Stripe webhook configuration
- Verify webhook endpoint URL in Stripe Dashboard matches your production URL: `https://yourdomain.com/api/stripe/webhook`

## 📚 Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

