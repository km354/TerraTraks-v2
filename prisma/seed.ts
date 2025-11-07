/**
 * Prisma Seed Script
 * 
 * This file seeds the database with initial data for development and testing.
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@terratraks.com' },
    update: {},
    create: {
      email: 'demo@terratraks.com',
      name: 'Demo User',
      subscriptionStatus: 'free',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create a sample itinerary
  const itinerary = await prisma.itinerary.create({
    data: {
      userId: user.id,
      title: 'Sample Trip to Paris',
      destination: 'Paris, France',
      description: 'A wonderful trip to the City of Light',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-07'),
      isPublic: false,
      items: {
        create: [
          {
            title: 'Visit Eiffel Tower',
            description: 'See the iconic Eiffel Tower',
            location: 'Eiffel Tower, Paris',
            category: 'activity',
            date: new Date('2024-06-01'),
            order: 0,
          },
          {
            title: 'Lunch at Café de Flore',
            description: 'Traditional French cuisine',
            location: 'Café de Flore, Paris',
            category: 'food',
            date: new Date('2024-06-01'),
            order: 1,
          },
          {
            title: 'Louvre Museum',
            description: 'Visit the world-famous museum',
            location: 'Louvre Museum, Paris',
            category: 'activity',
            date: new Date('2024-06-02'),
            order: 0,
          },
        ],
      },
      expenses: {
        create: [
          {
            userId: user.id,
            title: 'Hotel Booking',
            description: 'Hotel stay for 6 nights',
            amount: 1200.00,
            currency: 'USD',
            category: 'accommodation',
            date: new Date('2024-06-01'),
          },
          {
            userId: user.id,
            title: 'Flight Tickets',
            description: 'Round trip flight',
            amount: 800.00,
            currency: 'USD',
            category: 'transportation',
            date: new Date('2024-05-25'),
          },
        ],
      },
    },
  });

  console.log('✅ Created itinerary:', itinerary.title);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

