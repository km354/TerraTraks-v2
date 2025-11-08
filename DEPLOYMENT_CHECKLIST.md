# TerraTraks 2.0 Deployment Checklist

This checklist ensures a smooth deployment to production on Vercel.

## Pre-Deployment

### Code Review
- [ ] All features are tested and working
- [ ] No console errors or warnings
- [ ] Code is committed to GitHub
- [ ] All environment variables are documented

### Environment Variables
- [ ] All required environment variables are set in Vercel (see `VERCEL_ENV_SETUP.md`)
- [ ] Stripe webhook secret is configured
- [ ] API keys are valid and have proper quotas
- [ ] `NEXT_PUBLIC_APP_URL` matches production domain

### Database
- [ ] Database migrations are up to date
- [ ] Database connection string is correct
- [ ] Test database connection works

### External Services
- [ ] Stripe webhook endpoint is configured in Stripe Dashboard
- [ ] Google OAuth redirect URLs include production domain
- [ ] Google Maps API key has production domain restrictions (if needed)
- [ ] All API keys have sufficient quotas

## Deployment

### Vercel Setup
- [ ] Project is connected to GitHub repository
- [ ] Production branch is set (usually `main`)
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next` (default)
- [ ] Install command: `npm install`

### Build Configuration
- [ ] `vercel.json` is committed
- [ ] Next.js configuration is correct
- [ ] Environment variables are set for Production, Preview, and Development

## Post-Deployment

### Testing
- [ ] Homepage loads correctly
- [ ] User can sign in with Google
- [ ] Dashboard loads and shows user data
- [ ] Can create a new itinerary
- [ ] Itinerary generation works (OpenAI API)
- [ ] Maps load correctly (Google Maps API)
- [ ] Weather forecasts work (OpenWeatherMap API)
- [ ] Packing list generation works
- [ ] Crowd level predictions work
- [ ] Stripe checkout works
- [ ] Stripe webhook receives events (check Vercel logs)
- [ ] Premium features are gated correctly
- [ ] Affiliate links work (if configured)

### Monitoring
- [ ] Vercel Analytics is enabled
- [ ] Google Analytics is tracking (if configured)
- [ ] Sentry error tracking is working (if configured)
- [ ] Error logs are being captured
- [ ] Performance metrics are being tracked

### Security
- [ ] HTTPS is enabled
- [ ] Security headers are configured (in `vercel.json`)
- [ ] Environment variables are marked as sensitive
- [ ] API keys are not exposed in client-side code

## Monitoring Setup

### Vercel Analytics
1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Vercel Analytics (free tier available)
3. Enable Speed Insights for performance monitoring

### Google Analytics
1. Create a Google Analytics account
2. Create a new property for your website
3. Get your tracking ID (format: `G-XXXXXXXXXX`)
4. Add `NEXT_PUBLIC_GA_ID` to Vercel environment variables
5. Verify tracking is working by checking real-time reports

### Sentry (Optional but Recommended)
1. Create a Sentry account at https://sentry.io
2. Create a new project (Next.js)
3. Install Sentry: `npm install @sentry/nextjs`
4. Run Sentry wizard: `npx @sentry/wizard@latest -i nextjs`
5. Add `NEXT_PUBLIC_SENTRY_DSN` to Vercel environment variables
6. Configure error tracking in `sentry.client.config.ts` and `sentry.server.config.ts`

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add to `STRIPE_WEBHOOK_SECRET` in Vercel
7. Test webhook by making a test purchase

## Performance Testing

### Lighthouse Audit
- [ ] Run Lighthouse audit on homepage
- [ ] Performance score: 90+
- [ ] Accessibility score: 90+
- [ ] Best Practices score: 90+
- [ ] SEO score: 90+

### Load Testing
- [ ] Test with multiple concurrent users
- [ ] Verify API rate limits are sufficient
- [ ] Check database connection pooling
- [ ] Monitor response times

## User Acceptance Testing

### Test as End User
- [ ] Sign up with Google
- [ ] Create an itinerary
- [ ] View itinerary details
- [ ] Generate packing list
- [ ] View maps
- [ ] Check crowd predictions
- [ ] Upgrade to Premium
- [ ] Test premium features
- [ ] Add expenses
- [ ] Copy a preset itinerary

## Documentation

- [ ] README.md is up to date
- [ ] Environment variables are documented
- [ ] API documentation is available (if needed)
- [ ] Deployment process is documented

## Go Live

Once all items are checked:
1. Announce the launch
2. Monitor error logs for first 24 hours
3. Check analytics for user behavior
4. Monitor API usage and quotas
5. Be ready to fix any critical issues quickly

## Emergency Contacts

- Vercel Support: https://vercel.com/support
- Stripe Support: https://support.stripe.com
- Database Issues: Check Supabase dashboard
- API Issues: Check respective API dashboards

