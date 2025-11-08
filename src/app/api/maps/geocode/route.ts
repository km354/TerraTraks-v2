/**
 * Geocoding API Route
 * 
 * Server-side geocoding endpoint to get coordinates for locations
 */

import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation } from '@/lib/google-maps';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const coordinates = await geocodeLocation(location);

    if (!coordinates) {
      return NextResponse.json(
        { error: 'Could not geocode location' },
        { status: 404 }
      );
    }

    return NextResponse.json(coordinates);
  } catch (error: any) {
    console.error('Error geocoding location:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to geocode location' },
      { status: 500 }
    );
  }
}

