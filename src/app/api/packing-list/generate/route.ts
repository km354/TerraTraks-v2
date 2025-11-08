/**
 * Packing List Generation API Route
 * 
 * Generates AI-powered packing lists based on weather and trip details
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generatePackingList, generateFallbackPackingList } from '@/lib/packing-list';
import { getWeatherForecast } from '@/lib/weather-forecast';

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

    // Calculate duration if not provided
    const calculatedDuration = duration || Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Validate duration
    if (calculatedDuration < 1 || calculatedDuration > 365) {
      return NextResponse.json(
        { error: 'Trip duration must be between 1 and 365 days' },
        { status: 400 }
      );
    }

    // Get weather forecast (optional - can fail gracefully)
    let weatherSummary = null;
    try {
      weatherSummary = await getWeatherForecast(
        destination,
        startDateObj,
        endDateObj
      );
    } catch (weatherError) {
      console.warn('Weather forecast failed, continuing without weather data:', weatherError);
      // Continue without weather - packing list generation can still work
    }

    // Generate packing list with error handling
    let packingList;
    try {
      packingList = await generatePackingList(
        destination,
        calculatedDuration,
        startDateObj,
        endDateObj,
        weatherSummary,
        activities,
        interests,
        isPremium
      );
    } catch (packingError: any) {
      console.error('AI packing list generation failed, using fallback:', packingError);
      // Generate fallback packing list
      packingList = generateFallbackPackingList(weatherSummary, calculatedDuration);
    }

    // If AI generation returned null, use fallback
    if (!packingList || !packingList.items || packingList.items.length === 0) {
      console.warn('AI packing list generation returned empty, using fallback');
      packingList = generateFallbackPackingList(weatherSummary, calculatedDuration);
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
    console.error('Error in packing list API route:', error);
    
    // Always return a fallback list, even on error
    let calculatedDuration = 7; // Default
    try {
      const body = await request.json().catch(() => ({}));
      calculatedDuration = body.duration || Math.ceil(
        (new Date(body.endDate || Date.now()).getTime() - 
         new Date(body.startDate || Date.now()).getTime()) / 
        (1000 * 60 * 60 * 24)
      ) + 1;
      if (calculatedDuration < 1 || calculatedDuration > 365) {
        calculatedDuration = 7;
      }
    } catch {
      // Use default duration
    }

    const fallbackList = generateFallbackPackingList(null, calculatedDuration);
    return NextResponse.json({ packingList: fallbackList });
  }
}

