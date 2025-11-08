/**
 * Seed Preset Itineraries
 * 
 * Creates example preset itineraries for featured display
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a system user for preset itineraries
const SYSTEM_USER_ID = 'preset-user-system';

async function main() {
  console.log('🌱 Seeding preset itineraries...');

  // Check if preset user exists, create if not
  let presetUser = await prisma.user.findUnique({
    where: { id: SYSTEM_USER_ID },
  });

  if (!presetUser) {
    presetUser = await prisma.user.create({
      data: {
        id: SYSTEM_USER_ID,
        email: 'preset@terratraks.com',
        name: 'TerraTraks Presets',
      },
    });
    console.log('✅ Created preset user');
  }

  // Preset itineraries data
  const presetItineraries = [
    {
      title: '3 Days in Yosemite for Beginners',
      destination: 'Yosemite National Park, CA',
      description:
        'Perfect introduction to Yosemite with iconic views, easy hikes, and must-see attractions. Ideal for first-time visitors who want to experience the park\'s highlights without too much strenuous activity.',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-03'),
      budget: 800,
      budgetCurrency: 'USD',
      isPreset: true,
      featured: true,
      presetImageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      items: [
        {
          title: 'Arrive at Yosemite Valley',
          description:
            'Check into your accommodation and get oriented. Visit the Yosemite Valley Visitor Center to pick up maps and learn about the park.',
          location: 'Yosemite Valley Visitor Center',
          date: new Date('2024-06-01'),
          category: 'activity',
          order: 1,
        },
        {
          title: 'Tunnel View & Valley View',
          description:
            'Visit these iconic viewpoints for stunning panoramas of El Capitan, Half Dome, and Bridalveil Fall.',
          location: 'Tunnel View, Yosemite Valley',
          date: new Date('2024-06-01'),
          category: 'activity',
          order: 2,
        },
        {
          title: 'Lower Yosemite Falls Trail',
          description:
            'Easy 1-mile loop trail to the base of Lower Yosemite Fall. Perfect for beginners with great views.',
          location: 'Yosemite Falls Trail',
          date: new Date('2024-06-01'),
          category: 'activity',
          order: 3,
        },
        {
          title: 'Mirror Lake Trail',
          description:
            'Easy 2-mile round trip to Mirror Lake with reflections of Half Dome. Great for morning photography.',
          location: 'Mirror Lake Trail',
          date: new Date('2024-06-02'),
          category: 'activity',
          order: 4,
        },
        {
          title: 'Glacier Point',
          description:
            'Drive to Glacier Point for breathtaking views of Yosemite Valley, Half Dome, and Yosemite Falls.',
          location: 'Glacier Point',
          date: new Date('2024-06-02'),
          category: 'activity',
          order: 5,
        },
        {
          title: 'Valley Floor Tour',
          description:
            'Take a guided tram tour or self-drive around the valley floor to see major landmarks.',
          location: 'Yosemite Valley',
          date: new Date('2024-06-02'),
          category: 'activity',
          order: 6,
        },
        {
          title: 'Bridalveil Fall',
          description:
            'Short walk to the base of Bridalveil Fall. One of the park\'s most accessible waterfalls.',
          location: 'Bridalveil Fall',
          date: new Date('2024-06-03'),
          category: 'activity',
          order: 7,
        },
        {
          title: 'El Capitan Viewing',
          description:
            'Observe climbers on El Capitan from the base. Bring binoculars for the best experience.',
          location: 'El Capitan Meadow',
          date: new Date('2024-06-03'),
          category: 'activity',
          order: 8,
        },
      ],
    },
    {
      title: '5-Day Utah National Parks Road Trip',
      destination: 'Utah National Parks, UT',
      description:
        'Epic road trip through Utah\'s "Mighty 5" national parks: Zion, Bryce Canyon, Capitol Reef, Arches, and Canyonlands. Experience the best of the American Southwest in one incredible journey.',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-05'),
      budget: 1200,
      budgetCurrency: 'USD',
      isPreset: true,
      featured: true,
      presetImageUrl:
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
      items: [
        {
          title: 'Zion National Park - Angels Landing',
          description:
            'Hike the famous Angels Landing trail for stunning views (permit required). Alternative: Observation Point or The Narrows.',
          location: 'Zion National Park',
          date: new Date('2024-05-01'),
          category: 'activity',
          order: 1,
        },
        {
          title: 'Bryce Canyon - Sunrise Point & Rim Trail',
          description:
            'Watch sunrise over the hoodoos, then hike the Rim Trail for panoramic views of the amphitheater.',
          location: 'Bryce Canyon National Park',
          date: new Date('2024-05-02'),
          category: 'activity',
          order: 2,
        },
        {
          title: 'Capitol Reef - Scenic Drive & Fruita',
          description:
            'Drive the scenic route through Capitol Reef and visit historic Fruita orchards.',
          location: 'Capitol Reef National Park',
          date: new Date('2024-05-03'),
          category: 'activity',
          order: 3,
        },
        {
          title: 'Arches - Delicate Arch & Windows',
          description:
            'Hike to Delicate Arch at sunset and visit the Windows section for multiple arches in one area.',
          location: 'Arches National Park',
          date: new Date('2024-05-04'),
          category: 'activity',
          order: 4,
        },
        {
          title: 'Canyonlands - Mesa Arch & Grand View Point',
          description:
            'Early morning hike to Mesa Arch for sunrise, then visit Grand View Point for panoramic canyon views.',
          location: 'Canyonlands National Park',
          date: new Date('2024-05-05'),
          category: 'activity',
          order: 5,
        },
      ],
    },
    {
      title: 'Weekend in Yellowstone',
      destination: 'Yellowstone National Park, WY',
      description:
        'Perfect weekend getaway to see Yellowstone\'s geysers, hot springs, and wildlife. Covers the park\'s most iconic features in a 2-day adventure.',
      startDate: new Date('2024-07-06'),
      endDate: new Date('2024-07-07'),
      budget: 600,
      budgetCurrency: 'USD',
      isPreset: true,
      featured: true,
      presetImageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      items: [
        {
          title: 'Old Faithful Geyser',
          description:
            'Watch Old Faithful erupt (eruptions occur every 90 minutes). Explore the Upper Geyser Basin.',
          location: 'Old Faithful, Yellowstone',
          date: new Date('2024-07-06'),
          category: 'activity',
          order: 1,
        },
        {
          title: 'Grand Prismatic Spring',
          description:
            'Visit the largest hot spring in the US. Best viewed from the boardwalk or overlook trail.',
          location: 'Midway Geyser Basin, Yellowstone',
          date: new Date('2024-07-06'),
          category: 'activity',
          order: 2,
        },
        {
          title: 'Mammoth Hot Springs',
          description:
            'Explore the terraced hot springs and see the unique travertine formations.',
          location: 'Mammoth Hot Springs, Yellowstone',
          date: new Date('2024-07-06'),
          category: 'activity',
          order: 3,
        },
        {
          title: 'Grand Canyon of Yellowstone',
          description:
            'See the stunning Lower and Upper Falls. Hike to Artist Point for the classic view.',
          location: 'Grand Canyon of Yellowstone',
          date: new Date('2024-07-07'),
          category: 'activity',
          order: 4,
        },
        {
          title: 'Lamar Valley Wildlife Viewing',
          description:
            'Early morning or evening drive through Lamar Valley to spot bison, elk, and possibly wolves.',
          location: 'Lamar Valley, Yellowstone',
          date: new Date('2024-07-07'),
          category: 'activity',
          order: 5,
        },
        {
          title: 'Norris Geyser Basin',
          description:
            'Explore the hottest and most changeable thermal area in Yellowstone.',
          location: 'Norris Geyser Basin, Yellowstone',
          date: new Date('2024-07-07'),
          category: 'activity',
          order: 6,
        },
      ],
    },
  ];

  // Create or update preset itineraries
  for (const preset of presetItineraries) {
    const { items, ...itineraryData } = preset;

    // Check if itinerary already exists
    const existing = await prisma.itinerary.findFirst({
      where: {
        userId: SYSTEM_USER_ID,
        title: preset.title,
        isPreset: true,
      },
    });

    if (existing) {
      // Update existing preset
      await prisma.itinerary.update({
        where: { id: existing.id },
        data: {
          ...itineraryData,
          items: {
            deleteMany: {},
            create: items,
          },
        },
      });
      console.log(`✅ Updated preset: ${preset.title}`);
    } else {
      // Create new preset
      await prisma.itinerary.create({
        data: {
          ...itineraryData,
          userId: SYSTEM_USER_ID,
          items: {
            create: items,
          },
        },
      });
      console.log(`✅ Created preset: ${preset.title}`);
    }
  }

  console.log('✨ Preset itineraries seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding preset itineraries:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

