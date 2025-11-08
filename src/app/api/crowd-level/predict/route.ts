/**
 * Crowd Level Prediction API Route
 * 
 * Predicts crowd levels for locations on specific dates
 */

import { NextRequest, NextResponse } from 'next/server';
import { predictCrowdLevel } from '@/lib/crowd-level';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const dateStr = searchParams.get('date');
    const useAI = searchParams.get('useAI') !== 'false'; // Default to true

    if (!location || !dateStr) {
      return NextResponse.json(
        { error: 'Location and date parameters are required' },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const prediction = await predictCrowdLevel(location, date, useAI);

    return NextResponse.json(prediction);
  } catch (error: any) {
    console.error('Error predicting crowd level:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to predict crowd level' },
      { status: 500 }
    );
  }
}

