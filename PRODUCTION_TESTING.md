# Production Testing Guide

After deploying TerraTraks 2.0 to production, use this guide to thoroughly test all features.

## Pre-Testing Setup

1. **Clear Browser Cache**: Use incognito/private mode
2. **Use Test Mode**: Set up Stripe test mode for payments
3. **Have Test Accounts Ready**: Google account for authentication
4. **Check Environment**: Verify all API keys are set correctly

## Testing Checklist

### 1. Authentication ✅

- [ ] **Sign In with Google**
  - Click "Sign In" button
  - Complete Google OAuth flow
  - Verify redirect back to app
  - Check user appears in dashboard

- [ ] **Sign Out**
  - Click user menu → Sign Out
  - Verify redirect to homepage
  - Verify session is cleared

- [ ] **Protected Routes**
  - Try accessing `/dashboard` without signing in
  - Verify redirect to sign-in page
  - After signing in, verify redirect back to dashboard

### 2. Dashboard ✅

- [ ] **Dashboard Loads**
  - Verify user info displays correctly
  - Check subscription status shows
  - Verify itinerary count is correct

- [ ] **Create New Trip Button**
  - Click "Create New Trip"
  - Verify redirect to `/new-itinerary`

- [ ] **Itinerary List**
  - Verify user's itineraries display
  - Check empty state if no itineraries
  - Verify click on itinerary opens detail page

### 3. Itinerary Creation ✅

- [ ] **Form Steps**
  - Step 1: Enter destination
  - Step 2: Select dates
  - Step 3: Select interests and difficulty
  - Step 4: Enter title and description
  - Step 5: Set budget and group details
  - Verify form validation works

- [ ] **Submit Form**
  - Click "Generate Itinerary"
  - Verify loading state appears
  - Wait for AI generation
  - Verify redirect to itinerary page
  - Check itinerary is saved to database

- [ ] **Free Plan Limit**
  - Create 3 itineraries (free plan limit)
  - Try to create 4th itinerary
  - Verify upgrade prompt appears
  - Verify redirect to pricing page

### 4. Itinerary View ✅

- [ ] **Itinerary Details**
  - Verify title, destination, dates display
  - Check trip duration calculation
  - Verify activities list displays
  - Check day-by-day breakdown

- [ ] **Maps**
  - Verify overview map loads
  - Check day-specific maps load
  - Verify map markers display correctly
  - Test "Open in Google Maps" links

- [ ] **Crowd Level Predictions**
  - Verify crowd level badges display
  - Check reasoning text appears
  - Verify different levels show correctly

- [ ] **Packing List**
  - Verify packing list generates
  - Check items are categorized
  - Test checking/unchecking items
  - Verify progress bar updates
  - Check affiliate links appear for gear

- [ ] **Budget & Expenses**
  - Set a budget
  - Add expenses
  - Verify expense categories work
  - Check budget comparison displays
  - Verify total calculations

### 5. Premium Features ✅

- [ ] **Upgrade to Premium**
  - Go to pricing page
  - Click "Upgrade to Premium"
  - Complete Stripe checkout (test mode)
  - Verify redirect after payment
  - Check success message displays

- [ ] **Premium Subscription**
  - Verify subscription status updates to "active"
  - Check premium badge appears
  - Verify unlimited itineraries
  - Test GPT-4 AI features (if different from GPT-3.5)

- [ ] **Billing Portal**
  - Click "Manage Billing"
  - Verify Stripe billing portal opens
  - Test canceling subscription
  - Verify subscription status updates

### 6. Preset Itineraries ✅

- [ ] **Featured Page**
  - Navigate to `/featured`
  - Verify preset itineraries display
  - Check featured section shows
  - Verify images load correctly

- [ ] **View Preset**
  - Click on a preset itinerary
  - Verify itinerary details display
  - Check "Copy to My Trips" button

- [ ] **Copy Preset**
  - Click "Copy to My Trips"
  - Verify itinerary copies to account
  - Check redirect to user's itinerary
  - Verify can edit copied itinerary

### 7. API Integrations ✅

- [ ] **OpenAI API**
  - Create new itinerary
  - Verify AI generates content
  - Check response is structured
  - Verify fallback if API fails

- [ ] **Google Maps API**
  - Verify map images load
  - Check geocoding works
  - Verify markers display
  - Test with multiple locations

- [ ] **OpenWeatherMap API**
  - Verify weather forecast loads
  - Check packing list uses weather data
  - Verify fallback if API fails

- [ ] **Stripe API**
  - Test checkout flow
  - Verify webhook receives events
  - Check subscription updates
  - Test payment failures

### 8. Error Handling ✅

- [ ] **API Errors**
  - Test with invalid API keys
  - Verify graceful error messages
  - Check fallback functionality

- [ ] **Network Errors**
  - Test with slow connection
  - Verify loading states
  - Check timeout handling

- [ ] **Invalid Data**
  - Test form with invalid inputs
  - Verify validation messages
  - Check error boundaries

### 9. Performance ✅

- [ ] **Page Load Times**
  - Check homepage loads quickly
  - Verify dashboard loads fast
  - Test itinerary page performance

- [ ] **Image Loading**
  - Verify images load efficiently
  - Check lazy loading works
  - Verify proper image sizes

- [ ] **Code Splitting**
  - Check initial bundle size
  - Verify dynamic imports work
  - Test loading states

### 10. Mobile Responsiveness ✅

- [ ] **Mobile Navigation**
  - Test hamburger menu
  - Verify mobile links work
  - Check user menu on mobile

- [ ] **Mobile Forms**
  - Test itinerary form on mobile
  - Verify inputs are accessible
  - Check date pickers work

- [ ] **Mobile Layouts**
  - Verify dashboard on mobile
  - Check itinerary view on mobile
  - Test pricing page on mobile

### 11. SEO & Analytics ✅

- [ ] **SEO**
  - Check meta tags
  - Verify Open Graph tags
  - Test robots.txt
  - Check sitemap.xml

- [ ] **Analytics**
  - Verify Google Analytics tracks (if enabled)
  - Check page views are tracked
  - Test event tracking
  - Verify Vercel Analytics (if enabled)

### 12. Security ✅

- [ ] **Authentication**
  - Verify sessions are secure
  - Check CSRF protection
  - Test authorization checks

- [ ] **API Security**
  - Verify API keys are not exposed
  - Check webhook signature verification
  - Test rate limiting (if implemented)

## Monitoring Checklist

### Vercel Logs
- [ ] Check function logs for errors
- [ ] Monitor API response times
- [ ] Check for failed requests

### Stripe Dashboard
- [ ] Verify webhook deliveries
- [ ] Check payment success rate
- [ ] Monitor subscription events

### Database
- [ ] Check database connection
- [ ] Monitor query performance
- [ ] Verify data integrity

### Analytics
- [ ] Check user sign-ups
- [ ] Monitor itinerary creation
- [ ] Track feature usage
- [ ] Monitor error rates

## Common Issues & Solutions

### Issue: Webhook not receiving events
**Solution**: 
1. Check webhook URL is correct
2. Verify webhook secret is set
3. Check Stripe dashboard for delivery logs
4. Verify Vercel function logs

### Issue: Maps not loading
**Solution**:
1. Check Google Maps API key
2. Verify API key has correct restrictions
3. Check API quota
4. Verify domain is allowed

### Issue: AI generation fails
**Solution**:
1. Check OpenAI API key
2. Verify API quota
3. Check error logs
4. Verify fallback works

### Issue: Payment not processing
**Solution**:
1. Check Stripe keys are correct
2. Verify test mode vs production mode
3. Check Stripe dashboard for errors
4. Verify webhook is receiving events

## Post-Testing

After completing all tests:

1. **Document Issues**: Note any bugs or issues
2. **Fix Critical Issues**: Address blocking issues immediately
3. **Monitor**: Watch logs and analytics for first 24 hours
4. **Gather Feedback**: Collect user feedback
5. **Iterate**: Make improvements based on testing

## Success Criteria

✅ All core features work correctly
✅ No critical errors in production
✅ Performance is acceptable
✅ Security measures are in place
✅ Monitoring is set up
✅ Analytics are tracking

## Next Steps

1. Monitor error logs daily
2. Check analytics weekly
3. Review user feedback
4. Plan improvements
5. Scale as needed

