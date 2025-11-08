# Preset Itineraries Setup Guide

This guide explains how to set up and manage preset itineraries in TerraTraks.

## Overview

Preset itineraries are template travel plans that users can browse and copy to their accounts. They help showcase the app's capabilities and provide inspiration for new users.

## Features

- **Browse Featured Itineraries**: View handcrafted travel plans on the Featured page
- **Copy to Account**: Copy any preset itinerary and customize it
- **Dashboard Integration**: Featured itineraries appear on the dashboard
- **Public Access**: Preset itineraries are viewable by all users

## Setup

### 1. Database Migration

First, apply the database schema changes:

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

This adds the following fields to the `Itinerary` model:
- `isPreset`: Boolean flag to mark preset itineraries
- `presetImageUrl`: Optional image URL for preset itineraries
- `featured`: Boolean flag to mark featured preset itineraries

### 2. Seed Preset Itineraries

Run the seed script to create example preset itineraries:

```bash
npm run db:seed-presets
```

This will create:
- **3 Days in Yosemite for Beginners**: Perfect introduction to Yosemite
- **5-Day Utah National Parks Road Trip**: Epic road trip through Utah's "Mighty 5"
- **Weekend in Yellowstone**: Perfect weekend getaway to see geysers and wildlife

### 3. Create Custom Preset Itineraries

You can create custom preset itineraries using the Prisma Client or by directly inserting into the database.

#### Example: Creating a Preset Itinerary

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a system user for preset itineraries
const presetUser = await prisma.user.upsert({
  where: { email: 'preset@terratraks.com' },
  update: {},
  create: {
    email: 'preset@terratraks.com',
    name: 'TerraTraks Presets',
  },
});

// Create a preset itinerary
const presetItinerary = await prisma.itinerary.create({
  data: {
    userId: presetUser.id,
    title: 'Your Itinerary Title',
    destination: 'Destination Name',
    description: 'Itinerary description',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-03'),
    budget: 800,
    budgetCurrency: 'USD',
    isPreset: true,
    featured: true,
    presetImageUrl: 'https://images.unsplash.com/photo-...',
    items: {
      create: [
        {
          title: 'Activity 1',
          description: 'Description',
          location: 'Location',
          date: new Date('2024-06-01'),
          category: 'activity',
          order: 1,
        },
        // ... more items
      ],
    },
  },
});
```

## Managing Preset Itineraries

### Mark as Featured

To feature a preset itinerary on the dashboard:

```typescript
await prisma.itinerary.update({
  where: { id: 'itinerary-id' },
  data: { featured: true },
});
```

### Update Preset Itinerary

```typescript
await prisma.itinerary.update({
  where: { id: 'itinerary-id' },
  data: {
    title: 'Updated Title',
    description: 'Updated description',
    // ... other fields
  },
});
```

### Delete Preset Itinerary

```typescript
await prisma.itinerary.delete({
  where: { id: 'itinerary-id' },
});
```

## Image URLs

Preset itineraries use Unsplash images. You can find free images at:
- [Unsplash](https://unsplash.com/)
- Use the format: `https://images.unsplash.com/photo-...?w=800&h=600&fit=crop`

## User Experience

### Viewing Preset Itineraries

1. **Dashboard**: Featured itineraries appear on the dashboard
2. **Featured Page**: Browse all preset itineraries at `/featured`
3. **Itinerary Detail**: View full details of any preset itinerary

### Copying Preset Itineraries

1. Click "Copy to My Trips" on any preset itinerary
2. The itinerary is copied to the user's account
3. Users can then customize dates, add expenses, and modify activities

## Best Practices

1. **Quality Over Quantity**: Focus on creating high-quality, detailed itineraries
2. **Clear Descriptions**: Provide helpful descriptions for each itinerary
3. **Realistic Budgets**: Set realistic budget estimates
4. **Complete Activities**: Include detailed activity descriptions
5. **Good Images**: Use high-quality, relevant images
6. **Regular Updates**: Keep preset itineraries up-to-date

## Troubleshooting

### Preset itineraries not showing

- Check that `isPreset: true` is set
- Verify the database migration was applied
- Check that preset itineraries exist in the database

### Images not loading

- Verify image URLs are correct
- Check Next.js image configuration in `next.config.js`
- Ensure Unsplash image URLs are properly formatted

### Copy functionality not working

- Check that the user is logged in
- Verify the API route is working
- Check browser console for errors

## Future Enhancements

Potential improvements:
- Admin interface for managing preset itineraries
- Categories/tags for preset itineraries
- Search and filter functionality
- User ratings and reviews
- Seasonal preset itineraries
- Regional preset itineraries

