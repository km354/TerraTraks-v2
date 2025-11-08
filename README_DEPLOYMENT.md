# TerraTraks 2.0 - Deployment Guide

This guide will help you deploy TerraTraks 2.0 to production on Vercel.

## Quick Start

1. **Push to GitHub**: Commit and push all changes to your GitHub repository
2. **Connect to Vercel**: Import your GitHub repository in Vercel
3. **Configure Environment Variables**: Add all required environment variables (see `VERCEL_ENV_SETUP.md`)
4. **Deploy**: Vercel will automatically deploy on every push to `main`

## Prerequisites

- GitHub repository with your code
- Vercel account (free tier works)
- All API keys and credentials ready
- Stripe account for payments
- Supabase/PostgreSQL database

## Step-by-Step Deployment

### 1. Prepare Your Code

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository
4. Vercel will detect Next.js automatically

### 3. Configure Build Settings

Vercel should auto-detect these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### 4. Add Environment Variables

Go to **Settings** → **Environment Variables** and add all variables from `VERCEL_ENV_SETUP.md`.

**Important**: Add variables for:
- Production
- Preview (optional, for pull requests)
- Development (optional, for local development)

### 5. Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to match your domain

### 6. Set Up Stripe Webhook

See `WEBHOOK_SETUP.md` for detailed instructions.

Quick steps:
1. In Stripe Dashboard, create webhook endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
2. Select required events
3. Copy webhook secret
4. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### 7. Deploy

1. Click **Deploy** in Vercel
2. Wait for build to complete
3. Check deployment logs for any errors
4. Visit your deployed site

## Post-Deployment

### Verify Deployment

1. **Homepage**: Should load without errors
2. **Authentication**: Test Google sign-in
3. **Features**: Test itinerary creation, maps, etc.
4. **Payments**: Test Stripe checkout (use test mode first)

### Set Up Monitoring

1. **Vercel Analytics**: Enable in Vercel dashboard (free)
2. **Google Analytics**: Add `NEXT_PUBLIC_GA_ID` if desired
3. **Sentry**: Set up for error tracking (optional)

### Monitor Logs

- **Vercel Logs**: Check function logs for errors
- **Stripe Logs**: Check webhook deliveries
- **Database Logs**: Check Supabase logs

## Environment Variables Checklist

Use `VERCEL_ENV_SETUP.md` as a reference. Key variables:

- ✅ `AUTH_SECRET`
- ✅ `DATABASE_URL`
- ✅ `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- ✅ `OPENAI_API_KEY`
- ✅ `OPENWEATHER_API_KEY`
- ✅ `GOOGLE_MAPS_STATIC_API_KEY`
- ✅ `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `STRIPE_PREMIUM_PRICE_ID`
- ✅ `NEXT_PUBLIC_APP_URL`

## Testing Checklist

After deployment, test:

- [ ] Homepage loads
- [ ] User can sign in
- [ ] Can create itinerary
- [ ] Maps load correctly
- [ ] Weather forecasts work
- [ ] Packing lists generate
- [ ] Stripe checkout works
- [ ] Webhooks receive events
- [ ] Premium features are gated
- [ ] Error tracking works (if configured)

## Troubleshooting

### Build Fails

1. Check build logs in Vercel
2. Verify all dependencies are in `package.json`
3. Check for TypeScript errors
4. Verify environment variables are set

### Runtime Errors

1. Check Vercel function logs
2. Check browser console for client-side errors
3. Verify API keys are correct
4. Check database connection

### Webhook Not Working

1. Verify webhook URL is correct
2. Check webhook secret is set
3. Check Stripe dashboard for delivery logs
4. Check Vercel logs for errors

### Database Issues

1. Verify `DATABASE_URL` is correct
2. Check Supabase connection
3. Verify database migrations ran
4. Check database logs

## Monitoring and Analytics

### Vercel Analytics (Built-in)

- Automatically enabled on Vercel
- View in Vercel Dashboard → Analytics
- Tracks page views, performance, and errors

### Google Analytics (Optional)

1. Create Google Analytics account
2. Get tracking ID
3. Add `NEXT_PUBLIC_GA_ID` to environment variables
4. Verify tracking in Google Analytics dashboard

### Sentry (Optional)

1. Create Sentry account
2. Install Sentry: `npm install @sentry/nextjs`
3. Run Sentry wizard: `npx @sentry/wizard@latest -i nextjs`
4. Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables
5. Redeploy

## Performance Optimization

- ✅ Images optimized with Next.js Image
- ✅ Code splitting with dynamic imports
- ✅ Static generation for static pages
- ✅ API response caching
- ✅ Font optimization

## Security

- ✅ HTTPS enabled (automatic on Vercel)
- ✅ Security headers configured (in `vercel.json`)
- ✅ Environment variables secured
- ✅ API keys not exposed to client
- ✅ Webhook signature verification

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs
- **Supabase Docs**: https://supabase.com/docs

## Next Steps

1. Monitor error logs for first 24 hours
2. Check analytics for user behavior
3. Monitor API usage and quotas
4. Set up alerts for critical errors
5. Plan for scaling if needed

## Congratulations! 🎉

Your TerraTraks 2.0 application is now live and ready for users!

