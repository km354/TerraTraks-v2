# Comprehensive Testing Guide

This guide provides a systematic approach to testing TerraTraks before launch.

## Pre-Testing Setup

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in all required API keys

# Run database migrations
npm run db:push

# Seed preset itineraries (optional)
npm run db:seed-presets

# Start development server
npm run dev
```

### 2. Test Data Preparation
- Create test user accounts (free and premium)
- Prepare test destinations (various locations)
- Set up Stripe test mode keys

## Feature Testing Checklist

### 1. Itinerary Generation

#### Test Case 1.1: Basic Itinerary Creation
- [ ] Create itinerary with destination, dates, and interests
- [ ] Verify AI response is received
- [ ] Check that itinerary items are parsed correctly
- [ ] Verify itinerary is saved to database
- [ ] Confirm redirect to itinerary detail page

**Test Locations:**
- Yosemite National Park, CA
- Yellowstone National Park, WY
- Grand Canyon National Park, AZ
- Zion National Park, UT

#### Test Case 1.2: Itinerary with Budget
- [ ] Create itinerary with budget specified
- [ ] Verify budget is saved correctly
- [ ] Check budget appears on itinerary page
- [ ] Test budget editing functionality

#### Test Case 1.3: Itinerary without Budget
- [ ] Create itinerary without budget
- [ ] Verify itinerary still creates successfully
- [ ] Check budget field is optional

#### Test Case 1.4: Error Handling
- [ ] Test with invalid destination (empty string)
- [ ] Test with invalid dates (end before start)
- [ ] Test with missing required fields
- [ ] Test with API failure (disable OpenAI API key temporarily)
- [ ] Verify error messages are user-friendly
- [ ] Check that errors don't crash the app

#### Test Case 1.5: Free User Limits
- [ ] Create 3 itineraries as free user
- [ ] Attempt to create 4th itinerary
- [ ] Verify upgrade prompt appears
- [ ] Check redirect to pricing page

#### Test Case 1.6: Premium User
- [ ] Create multiple itineraries as premium user
- [ ] Verify no limit restrictions
- [ ] Check GPT-4 model is used (check API calls)

### 2. Google Maps Integration

#### Test Case 2.1: Basic Map Display
- [ ] Create itinerary with locations
- [ ] Verify map appears on itinerary page
- [ ] Check map shows correct destination
- [ ] Verify map image loads correctly

#### Test Case 2.2: Multiple Locations
- [ ] Create itinerary with 5-10 locations
- [ ] Verify all locations appear on map
- [ ] Check markers are visible
- [ ] Verify route path is drawn (if enabled)

#### Test Case 2.3: Edge Case - Too Many Markers
- [ ] Create itinerary with 25+ locations
- [ ] Verify map still loads (should limit to 20 markers)
- [ ] Check console for warning about marker limit
- [ ] Verify map doesn't break

#### Test Case 2.4: Edge Case - No Locations
- [ ] Create itinerary without location data
- [ ] Verify page doesn't crash
- [ ] Check map section is hidden gracefully

#### Test Case 2.5: Edge Case - Invalid Locations
- [ ] Create itinerary with invalid location strings
- [ ] Verify map generation fails gracefully
- [ ] Check fallback to destination-only map
- [ ] Verify error message or fallback UI

#### Test Case 2.6: API Failure Handling
- [ ] Disable Google Maps API key temporarily
- [ ] Create/view itinerary
- [ ] Verify page doesn't crash
- [ ] Check fallback message appears
- [ ] Verify "Open in Google Maps" link still works

#### Test Case 2.7: Map Image Loading Errors
- [ ] Test with invalid map URL
- [ ] Verify onError handler works
- [ ] Check fallback UI appears
- [ ] Verify page remains functional

### 3. Packing List Generator

#### Test Case 3.1: Basic Packing List
- [ ] Generate packing list for summer trip
- [ ] Verify items are relevant to season
- [ ] Check categories are correct
- [ ] Verify essential items are marked

#### Test Case 3.2: Weather Conditions - Summer
- [ ] Create itinerary for summer (June-August)
- [ ] Generate packing list
- [ ] Verify warm weather items (sunscreen, hat, etc.)
- [ ] Check no winter items appear

#### Test Case 3.3: Weather Conditions - Winter
- [ ] Create itinerary for winter (December-February)
- [ ] Generate packing list
- [ ] Verify cold weather items (jacket, warm layers, etc.)
- [ ] Check appropriate gear is suggested

#### Test Case 3.4: Weather Conditions - Spring/Fall
- [ ] Create itinerary for spring/fall
- [ ] Generate packing list
- [ ] Verify layered clothing suggestions
- [ ] Check for rain gear if applicable

#### Test Case 3.5: Activity-Specific Items
- [ ] Create itinerary with hiking activities
- [ ] Verify hiking boots, backpack, etc. appear
- [ ] Create itinerary with camping activities
- [ ] Verify camping gear appears
- [ ] Create itinerary with water activities
- [ ] Verify swimwear, water gear appears

#### Test Case 3.6: Error Handling
- [ ] Test with invalid destination
- [ ] Verify fallback packing list is generated
- [ ] Test with API failure
- [ ] Check error message is displayed
- [ ] Verify checklist still works

#### Test Case 3.7: Checkbox Persistence
- [ ] Check items in packing list
- [ ] Refresh page
- [ ] Verify checked items remain checked
- [ ] Test across different browsers

### 4. Crowd Level Predictions

#### Test Case 4.1: Basic Prediction
- [ ] Create itinerary with dates
- [ ] Verify crowd level badges appear
- [ ] Check predictions are reasonable
- [ ] Verify reasoning is displayed

#### Test Case 4.2: Different Dates
- [ ] Test summer dates (high crowds expected)
- [ ] Test winter dates (lower crowds expected)
- [ ] Test weekend dates (higher crowds)
- [ ] Test weekday dates (lower crowds)
- [ ] Test holiday dates (very high crowds)

#### Test Case 4.3: Different Locations
- [ ] Test national parks (summer = high)
- [ ] Test cities (weekends = high)
- [ ] Test beaches (summer = high)
- [ ] Test ski resorts (winter = high)

#### Test Case 4.4: Error Handling
- [ ] Test with API failure
- [ ] Verify heuristic fallback works
- [ ] Check predictions still appear
- [ ] Verify no errors in console

#### Test Case 4.5: API Rate Limits
- [ ] Create itinerary with 15+ items with dates
- [ ] Verify only 10 predictions are made (rate limit)
- [ ] Check predictions complete successfully
- [ ] Verify no API errors

### 5. Stripe Payment Flow

#### Test Case 5.1: Checkout Flow
- [ ] Click "Upgrade to Premium" button
- [ ] Verify Stripe Checkout opens
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] Check user subscription status is updated

#### Test Case 5.2: Subscription Status Update
- [ ] Verify user status changes to "active"
- [ ] Check premium features are unlocked
- [ ] Verify GPT-4 is used for new itineraries
- [ ] Check unlimited itinerary creation

#### Test Case 5.3: Webhook Handling
- [ ] Complete test payment
- [ ] Check webhook is received
- [ ] Verify database is updated
- [ ] Test webhook retry on failure

#### Test Case 5.4: Billing Portal
- [ ] Access billing portal
- [ ] Verify subscription details
- [ ] Test cancellation flow
- [ ] Verify status updates correctly

#### Test Case 5.5: Error Handling
- [ ] Test with invalid card
- [ ] Verify error message displays
- [ ] Test with canceled payment
- [ ] Verify user isn't charged
- [ ] Test webhook failure scenarios

### 6. Expense Tracking

#### Test Case 6.1: Add Expense
- [ ] Add expense to itinerary
- [ ] Verify expense is saved
- [ ] Check expense appears in list
- [ ] Verify category is correct

#### Test Case 6.2: Edit Expense
- [ ] Edit existing expense
- [ ] Verify changes are saved
- [ ] Check update appears immediately

#### Test Case 6.3: Delete Expense
- [ ] Delete expense
- [ ] Verify removal from list
- [ ] Check total updates correctly

#### Test Case 6.4: Budget Comparison
- [ ] Set budget for itinerary
- [ ] Add expenses
- [ ] Verify budget vs actual comparison
- [ ] Check progress bar updates
- [ ] Test over-budget scenario

#### Test Case 6.5: Categories
- [ ] Test all expense categories
- [ ] Verify grouping works
- [ ] Check category totals

### 7. Preset Itineraries

#### Test Case 7.1: Browse Presets
- [ ] View featured itineraries page
- [ ] Verify presets are displayed
- [ ] Check images load correctly
- [ ] Verify metadata is shown

#### Test Case 7.2: Copy Preset
- [ ] Copy preset itinerary
- [ ] Verify copy is created
- [ ] Check redirect to new itinerary
- [ ] Verify itinerary is customizable

#### Test Case 7.3: View Preset
- [ ] View preset itinerary details
- [ ] Verify all sections load
- [ ] Check budget/expense section is hidden
- [ ] Verify copy button appears

### 8. Responsive Design

#### Test Case 8.1: Mobile (320px - 768px)
- [ ] Test landing page on mobile
- [ ] Test dashboard on mobile
- [ ] Test itinerary creation form
- [ ] Test itinerary detail page
- [ ] Verify all buttons are accessible
- [ ] Check text is readable
- [ ] Verify navigation works

#### Test Case 8.2: Tablet (768px - 1024px)
- [ ] Test all pages on tablet
- [ ] Verify layouts adapt correctly
- [ ] Check touch interactions work
- [ ] Verify forms are usable

#### Test Case 8.3: Desktop (1024px+)
- [ ] Test all pages on desktop
- [ ] Verify optimal layouts
- [ ] Check hover states work
- [ ] Verify all features accessible

#### Test Case 8.4: Edge Cases
- [ ] Test very small screens (320px)
- [ ] Test very large screens (2560px+)
- [ ] Test landscape orientation
- [ ] Test portrait orientation

### 9. Performance Testing

#### Test Case 9.1: Lighthouse Audit
- [ ] Run Lighthouse on landing page
- [ ] Verify Performance > 90
- [ ] Verify Accessibility > 95
- [ ] Verify Best Practices > 95
- [ ] Verify SEO > 95

#### Test Case 9.2: Page Load Times
- [ ] Test landing page load time
- [ ] Test dashboard load time
- [ ] Test itinerary page load time
- [ ] Verify all < 3 seconds

#### Test Case 9.3: API Response Times
- [ ] Test itinerary generation time
- [ ] Test packing list generation
- [ ] Test crowd level prediction
- [ ] Verify reasonable response times

#### Test Case 9.4: Console Errors
- [ ] Open browser console
- [ ] Navigate through all pages
- [ ] Verify no JavaScript errors
- [ ] Check for warnings
- [ ] Verify no failed API calls

### 10. Error Handling

#### Test Case 10.1: Network Errors
- [ ] Disable network connection
- [ ] Attempt to create itinerary
- [ ] Verify error message appears
- [ ] Check page doesn't crash

#### Test Case 10.2: API Errors
- [ ] Test with invalid API keys
- [ ] Verify graceful error handling
- [ ] Check fallback behaviors
- [ ] Verify user-friendly messages

#### Test Case 10.3: Validation Errors
- [ ] Test form validation
- [ ] Verify error messages
- [ ] Check required fields
- [ ] Test date validation

#### Test Case 10.4: Database Errors
- [ ] Test with database connection issues
- [ ] Verify error handling
- [ ] Check user sees appropriate message

## Browser Testing

### Supported Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Test Each Browser
- [ ] Landing page loads
- [ ] Authentication works
- [ ] Itinerary creation works
- [ ] All features function
- [ ] No console errors
- [ ] Responsive design works

## Security Testing

### Test Case S1: Authentication
- [ ] Verify protected routes require auth
- [ ] Test session expiration
- [ ] Verify unauthorized access is blocked
- [ ] Check CSRF protection

### Test Case S2: Data Access
- [ ] Verify users can only access their data
- [ ] Test preset itinerary access (should be public)
- [ ] Verify expense privacy
- [ ] Check itinerary privacy settings

### Test Case S3: API Security
- [ ] Verify API routes require authentication
- [ ] Test input validation
- [ ] Check SQL injection protection
- [ ] Verify XSS protection

## Load Testing

### Test Case L1: Concurrent Users
- [ ] Test with multiple users
- [ ] Verify no race conditions
- [ ] Check database locks work
- [ ] Verify performance under load

### Test Case L2: Large Data
- [ ] Test with many itineraries
- [ ] Test with many expenses
- [ ] Verify pagination works
- [ ] Check performance

## Regression Testing

### Test Case R1: Existing Features
- [ ] Test all existing features still work
- [ ] Verify no breaking changes
- [ ] Check backward compatibility
- [ ] Verify database migrations

## Test Results Template

For each test case, document:
- **Test Case ID**: e.g., "1.1"
- **Test Date**: Date tested
- **Tester**: Tester name
- **Status**: Pass / Fail / Blocked
- **Notes**: Any issues found
- **Screenshots**: If applicable
- **Browser**: Browser used
- **Device**: Device used

## Common Issues and Fixes

### Issue: Map not loading
**Fix**: Check Google Maps API key, verify API is enabled, check quota limits

### Issue: Packing list not generating
**Fix**: Check OpenAI API key, verify weather API is working, check fallback

### Issue: Crowd level predictions failing
**Fix**: Check OpenAI API key, verify rate limits, check fallback to heuristics

### Issue: Payment not processing
**Fix**: Verify Stripe keys are in test mode, check webhook configuration

### Issue: Responsive layout broken
**Fix**: Check Tailwind classes, verify viewport meta tag, test on actual devices

## Automated Testing (Future)

Consider adding:
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical flows
- Visual regression tests
- Performance monitoring

## Launch Readiness Checklist

Before launching, ensure:
- [ ] All critical test cases pass
- [ ] No console errors
- [ ] Lighthouse scores meet targets
- [ ] All browsers tested
- [ ] Mobile devices tested
- [ ] Error handling works
- [ ] Security tested
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Backup and recovery tested

