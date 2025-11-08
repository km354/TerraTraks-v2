/**
 * Google Maps Utility Functions
 * 
 * Provides helpers for Google Maps Static API and Geocoding API
 */

import { googleMaps } from './env';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarker {
  location: string;
  label?: string;
  color?: string;
}

/**
 * Geocode a location string to get coordinates
 * Note: Requires Geocoding API to be enabled in Google Cloud Console
 */
export async function geocodeLocation(
  location: string
): Promise<Coordinates | null> {
  if (!googleMaps.staticApiKey) {
    console.warn('Google Maps API key not configured');
    return null;
  }

  try {
    // Use Geocoding API to get coordinates
    const encodedLocation = encodeURIComponent(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${googleMaps.staticApiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Silently fail - geocoding is optional, Static Maps can use addresses directly
      return null;
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const locationData = data.results[0].geometry.location;
      return {
        lat: locationData.lat,
        lng: locationData.lng,
      };
    }

    // Handle various error statuses gracefully
    if (data.status === 'ZERO_RESULTS' || data.status === 'NOT_FOUND') {
      // Location not found - that's okay, we'll use the address string directly
      return null;
    }

    return null;
  } catch (error) {
    // Silently fail - geocoding is optional
    return null;
  }
}

/**
 * Generate a Google Maps Static API URL with markers
 */
export function generateStaticMapUrl(
  markers: MapMarker[],
  options: {
    size?: string; // e.g., "600x400"
    zoom?: number;
    center?: Coordinates | string;
    maptype?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
    path?: Coordinates[]; // Optional path to draw route
  } = {}
): string | null {
  if (!googleMaps.staticApiKey) {
    console.warn('Google Maps API key not configured');
    return null;
  }

  const {
    size = '600x400',
    zoom = 10,
    center,
    maptype = 'roadmap',
    path,
  } = options;

  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const params: string[] = [];

  // Map size
  params.push(`size=${size}`);

  // Map type
  params.push(`maptype=${maptype}`);

  // Zoom level
  params.push(`zoom=${zoom}`);

  // Center point (use first marker if not specified)
  if (center) {
    if (typeof center === 'string') {
      params.push(`center=${encodeURIComponent(center)}`);
    } else {
      params.push(`center=${center.lat},${center.lng}`);
    }
  } else if (markers.length > 0) {
    // Use first marker's location as center
    params.push(`center=${encodeURIComponent(markers[0].location)}`);
  }

  // Add markers (limit to 50 as per Google Static Maps API limits)
  // We further limit to 20 for performance and URL length concerns
  const maxMarkersForUrl = 20;
  const markersToUse = markers.slice(0, maxMarkersForUrl);
  
  markersToUse.forEach((marker) => {
    let markerParam = `markers=`;
    
    if (marker.color) {
      markerParam += `color:${marker.color}|`;
    }
    
    if (marker.label) {
      markerParam += `label:${marker.label}|`;
    }
    
    markerParam += encodeURIComponent(marker.location);
    params.push(markerParam);
  });
  
  // Warn if markers were truncated
  if (markers.length > maxMarkersForUrl) {
    console.warn(`Too many markers (${markers.length}). Limiting to ${maxMarkersForUrl} for map URL.`);
  }

  // Add path if provided (for route visualization)
  if (path && path.length > 1) {
    // Limit path points to avoid URL length issues (Static Maps has URL length limits)
    const maxPathPoints = 100;
    const pathPoints = path.length > maxPathPoints 
      ? path.filter((_, i) => i % Math.ceil(path.length / maxPathPoints) === 0)
      : path;
    
    const pathStr = pathPoints.map((coord) => `${coord.lat},${coord.lng}`).join('|');
    params.push(`path=color:0x1D3B2A|weight:5|${pathStr}`);
  }

  // API key
  params.push(`key=${googleMaps.staticApiKey}`);

  return `${baseUrl}?${params.join('&')}`;
}

/**
 * Generate static map URL for an itinerary
 * Attempts to geocode locations and create a map with markers
 */
export async function generateItineraryMap(
  destination: string,
  locations: Array<{ location: string | null; title: string }>,
  options: {
    size?: string;
    zoom?: number;
    showRoute?: boolean;
  } = {}
): Promise<string | null> {
  if (!googleMaps.staticApiKey) {
    return null;
  }

  const { size = '800x500', zoom, showRoute = false } = options;

  // Filter out locations without location data
  const validLocations = locations.filter((loc) => loc.location);

  if (validLocations.length === 0) {
    // Fallback to destination only
    return generateStaticMapUrl(
      [{ location: destination, label: 'A', color: 'red' }],
      { size, zoom: zoom || 12, center: destination }
    );
  }

  // Limit markers to avoid URL length issues (Google Static Maps has limits)
  // Static Maps API supports up to 50 markers, but we limit to 20 for performance
  const maxMarkers = 20;
  const locationsToUse = validLocations.slice(0, maxMarkers);
  
  // Deduplicate locations (same location might appear multiple times)
  const uniqueLocations = Array.from(
    new Map(locationsToUse.map((loc) => [loc.location, loc])).values()
  );

  // Create markers (using unique locations)
  const markers: MapMarker[] = uniqueLocations.map((loc, index) => ({
    location: loc.location!,
    label: String.fromCharCode(65 + (index % 26)), // A, B, C, etc.
    color: index === 0 ? 'red' : 'blue', // First marker in red, others in blue
  }));

  // If we have multiple locations and showRoute is true, geocode to get path
  // Note: This is optional - if geocoding fails, we'll still show markers without a path
  let path: Coordinates[] | undefined;
  if (showRoute && uniqueLocations.length > 1) {
    // Limit geocoding to avoid hitting rate limits (geocode up to 10 unique locations for path)
    const locationsToGeocode = uniqueLocations.slice(0, 10);
    const coordinates: Coordinates[] = [];
    
    // Geocode locations in parallel (with error handling)
    const geocodePromises = locationsToGeocode.map((loc) => geocodeLocation(loc.location!));
    const results = await Promise.allSettled(geocodePromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        coordinates.push(result.value);
      }
    });
    
    // Only create path if we have at least 2 coordinates
    if (coordinates.length > 1) {
      path = coordinates;
    }
  }

  // Determine center and zoom
  let center: Coordinates | string | undefined = destination;
  let mapZoom = zoom;

  // If we have coordinates for the path, calculate center from them
  if (path && path.length > 0) {
    const avgLat = path.reduce((sum, coord) => sum + coord.lat, 0) / path.length;
    const avgLng = path.reduce((sum, coord) => sum + coord.lng, 0) / path.length;
    center = { lat: avgLat, lng: avgLng };
    
    // Calculate appropriate zoom based on bounds
    if (!mapZoom) {
      const latRange = Math.max(...path.map((c) => c.lat)) - Math.min(...path.map((c) => c.lat));
      const lngRange = Math.max(...path.map((c) => c.lng)) - Math.min(...path.map((c) => c.lng));
      const maxRange = Math.max(latRange, lngRange);
      
      if (maxRange > 10) mapZoom = 4;
      else if (maxRange > 5) mapZoom = 5;
      else if (maxRange > 2) mapZoom = 6;
      else if (maxRange > 1) mapZoom = 7;
      else if (maxRange > 0.5) mapZoom = 8;
      else if (maxRange > 0.2) mapZoom = 9;
      else if (maxRange > 0.1) mapZoom = 10;
      else mapZoom = 12;
    }
  }

  return generateStaticMapUrl(markers, {
    size,
    zoom: mapZoom || 10,
    center,
    path,
  });
}

/**
 * Generate a simple map URL for a single location
 */
export function generateLocationMap(
  location: string,
  options: {
    size?: string;
    zoom?: number;
    label?: string;
  } = {}
): string | null {
  if (!googleMaps.staticApiKey) {
    return null;
  }

  const { size = '400x300', zoom = 13, label } = options;

  return generateStaticMapUrl(
    [{ location, label, color: 'red' }],
    {
      size,
      zoom,
      center: location,
    }
  );
}

