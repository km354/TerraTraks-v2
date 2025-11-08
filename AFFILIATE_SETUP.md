# Affiliate Program Setup Guide

This guide explains how to set up affiliate programs for monetization in TerraTraks.

## Overview

TerraTraks integrates affiliate links to help users find hotels, gear, and tours while generating revenue. Affiliate links are:
- **Transparent**: Clearly labeled as affiliate links
- **Contextual**: Only shown when relevant (hotels for accommodations, gear for packing lists, etc.)
- **Optional**: App works perfectly fine without affiliate IDs configured
- **User-friendly**: Links provide value by helping users find what they need

## Supported Affiliate Programs

### 1. Booking.com (Hotels & Accommodations)
- **Commission**: Up to 25% of Booking.com's commission
- **Use Case**: Hotel bookings for accommodation items in itineraries
- **Sign Up**: [Booking.com Affiliate Partner Central](https://www.booking.com/affiliate-program/v2/index.html)

**Setup Steps**:
1. Sign up for Booking.com affiliate program
2. Get your affiliate ID (usually a numeric code)
3. Add to `.env.local`: `BOOKING_COM_AFFILIATE_ID=your_affiliate_id`

**Link Format**: Links appear on accommodation items in itineraries with dates pre-filled.

---

### 2. REI (Outdoor Gear)
- **Commission**: Varies by product
- **Use Case**: Outdoor gear items in packing lists (tents, hiking boots, etc.)
- **Sign Up**: [REI Affiliate Program](https://www.rei.com/affiliate)

**Setup Steps**:
1. Sign up for REI affiliate program
2. Get your affiliate tracking ID
3. Add to `.env.local`: `REI_AFFILIATE_ID=your_affiliate_id`

**Link Format**: Links appear on gear items in packing lists (Gear/Equipment, Footwear, Electronics categories).

**Note**: REI's affiliate program structure may vary. You may need to adjust the link format in `src/lib/affiliates.ts` based on their actual requirements.

---

### 3. GetYourGuide (Tours & Activities)
- **Commission**: Varies by booking
- **Use Case**: Tours and activities in itineraries
- **Sign Up**: [GetYourGuide Partner Program](https://partner.getyourguide.com/)

**Setup Steps**:
1. Sign up for GetYourGuide partner program
2. Get your partner ID
3. Add to `.env.local`: `GET_YOUR_GUIDE_AFFILIATE_ID=your_partner_id`

**Link Format**: Links appear on activity items in itineraries.

---

### 4. Viator (Tours & Activities)
- **Commission**: Varies by booking
- **Use Case**: Alternative to GetYourGuide for tours and activities
- **Sign Up**: [Viator Affiliate Program](https://www.viator.com/affiliates)

**Setup Steps**:
1. Sign up for Viator affiliate program
2. Get your affiliate ID
3. Add to `.env.local`: `VIATOR_AFFILIATE_ID=your_affiliate_id`

**Link Format**: Links appear on activity items if GetYourGuide is not configured.

---

## Environment Variables

Add these to your `.env.local` file:

```bash
# Booking.com Affiliate (Hotels)
BOOKING_COM_AFFILIATE_ID=your_booking_com_id

# REI Affiliate (Outdoor Gear)
REI_AFFILIATE_ID=your_rei_id

# GetYourGuide Affiliate (Tours)
GET_YOUR_GUIDE_AFFILIATE_ID=your_getyourguide_id

# Viator Affiliate (Tours - alternative)
VIATOR_AFFILIATE_ID=your_viator_id
```

## How It Works

### Accommodation Links
- **When**: Appears on itinerary items with category "accommodation"
- **What**: "Find Hotels on Booking.com" link
- **Features**: Pre-fills destination and dates from itinerary

### Gear Links
- **When**: Appears on packing list items in Gear/Equipment, Footwear, or Electronics categories
- **What**: "Shop [Item Name] at REI" link
- **Features**: Searches REI for the specific item

### Activity Links
- **When**: Appears on itinerary items with category "activity"
- **What**: "Book [Activity] on GetYourGuide" or "Book [Activity] on Viator" link
- **Features**: Searches for tours matching the activity and destination

## User Experience

Affiliate links are:
- **Clearly labeled**: Users know they're affiliate links
- **Contextual**: Only shown when relevant
- **Helpful**: Provide value by helping users find what they need
- **Non-intrusive**: Badge-style links that don't disrupt the experience

## Legal & Compliance

- Affiliate links are marked with `rel="sponsored"` for transparency
- Links are clearly labeled with provider names
- Users can easily identify affiliate links
- Follows best practices for affiliate disclosure

## Testing

1. **Without Affiliate IDs**: Links still work but don't include affiliate tracking
2. **With Affiliate IDs**: Links include tracking parameters
3. **Test Links**: Click links to verify they work correctly
4. **Check Tracking**: Verify affiliate IDs are included in URLs

## Revenue Potential

- **Booking.com**: Up to 25% commission on hotel bookings
- **REI**: Varies by product, typically 5-10% commission
- **GetYourGuide/Viator**: Varies by booking, typically 5-15% commission

**Note**: Actual earnings depend on:
- Number of users clicking links
- Conversion rate (bookings/purchases)
- Commission rates (which vary by program and product)

## Best Practices

1. **Don't overdo it**: Only show affiliate links when they add value
2. **Be transparent**: Always label affiliate links clearly
3. **Test regularly**: Verify links work and tracking is correct
4. **Monitor performance**: Track which links perform best
5. **User first**: Prioritize user experience over monetization

## Troubleshooting

### Links not appearing
- Check that affiliate IDs are set in environment variables
- Verify the item category matches (accommodation, activity, gear)
- Check browser console for errors

### Links not tracking
- Verify affiliate IDs are correct
- Check affiliate program dashboard for tracking
- Some programs require approval before tracking starts

### Wrong link format
- Each affiliate program may have different URL structures
- Check affiliate program documentation
- Update link generation in `src/lib/affiliates.ts` if needed

## Future Enhancements

Potential improvements:
- Analytics dashboard for affiliate link performance
- A/B testing different link placements
- Custom affiliate link text
- Multiple affiliate options per category
- Revenue reporting

