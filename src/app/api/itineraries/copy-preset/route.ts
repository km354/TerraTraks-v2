/**
 * Copy Preset Itinerary API Route
 * 
 * Allows users to copy a preset itinerary to their account
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { presetId } = body;

    if (!presetId) {
      return NextResponse.json(
        { error: 'Preset itinerary ID is required' },
        { status: 400 }
      );
    }

    // Fetch the preset itinerary
    const presetItinerary = await prisma.itinerary.findUnique({
      where: { id: presetId },
      include: {
        items: true,
      },
    });

    if (!presetItinerary) {
      return NextResponse.json(
        { error: 'Preset itinerary not found' },
        { status: 404 }
      );
    }

    if (!presetItinerary.isPreset) {
      return NextResponse.json(
        { error: 'This itinerary is not a preset' },
        { status: 400 }
      );
    }

    // Create a copy for the user
    const newItinerary = await prisma.itinerary.create({
      data: {
        userId: session.user.id,
        title: `${presetItinerary.title} (Copy)`,
        destination: presetItinerary.destination,
        description: presetItinerary.description,
        startDate: presetItinerary.startDate,
        endDate: presetItinerary.endDate,
        budget: presetItinerary.budget,
        budgetCurrency: presetItinerary.budgetCurrency,
        isPublic: false,
        isPreset: false,
        items: {
          create: presetItinerary.items.map((item) => ({
            title: item.title,
            description: item.description,
            location: item.location,
            startTime: item.startTime,
            endTime: item.endTime,
            date: item.date,
            category: item.category,
            order: item.order,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      itineraryId: newItinerary.id,
      message: 'Itinerary copied successfully',
    });
  } catch (error: any) {
    console.error('Error copying preset itinerary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to copy itinerary' },
      { status: 500 }
    );
  }
}

