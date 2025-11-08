/**
 * Packing List Generation API Route
 * 
 * Generates AI-powered packing lists based on weather and trip details
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generatePackingList } from '@/lib/packing-list';
import { getWeatherForecast } from '@/lib/weather';

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
    const {
      destination,
      startDate,
      endDate,
      duration,
      activities = [],
      interests = [],
      isPremium = false,
    } = body;

    if (!destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, startDate, endDate' },
        { status: 400 }
      );
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Get weather forecast
    const weatherSummary = await getWeatherForecast(
      destination,
      startDateObj,
      endDateObj
    );

    // Generate packing list
    const packingList = await generatePackingList(
      destination,
      duration || Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      startDateObj,
      endDateObj,
      weatherSummary,
      activities,
      interests,
      isPremium
    );

    if (!packingList) {
      return NextResponse.json(
        { error: 'Failed to generate packing list' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      packingList,
      weatherSummary: weatherSummary
        ? {
            averageHigh: weatherSummary.averageHigh,
            averageLow: weatherSummary.averageLow,
            conditions: weatherSummary.conditions,
          }
        : null,
    });
  } catch (error: any) {
    console.error('Error generating packing list:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate packing list' },
      { status: 500 }
    );
  }
}

