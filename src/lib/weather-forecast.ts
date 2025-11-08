/**
 * Weather Forecast Functions
 * 
 * Extended weather forecast functionality for packing list generation
 */

import { openWeather } from './env';
import { WeatherSummary, ForecastData } from './weather';
import { getWeatherData } from './weather';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get coordinates for a location (for forecast API)
 */
async function getCoordinates(location: string): Promise<{ lat: number; lon: number } | null> {
  if (!openWeather.apiKey) {
    return null;
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${openWeather.apiKey}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

/**
 * Get weather forecast for a date range
 * Uses OpenWeatherMap 5-day forecast API
 */
export async function getWeatherForecast(
  location: string,
  startDate: Date,
  endDate: Date
): Promise<WeatherSummary | null> {
  if (!openWeather.apiKey) {
    console.warn('OpenWeatherMap API key not configured');
    return null;
  }

  try {
    // Get coordinates first
    const coords = await getCoordinates(location);
    if (!coords) {
      console.warn(`Could not get coordinates for ${location}`);
      return null;
    }

    // Get 5-day forecast
    const url = `${OPENWEATHER_BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${openWeather.apiKey}&units=metric`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Forecast API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Filter forecasts within the date range
    const forecasts: ForecastData[] = [];
    const conditions = new Set<string>();
    let totalHigh = 0;
    let totalLow = 0;
    let count = 0;

    data.list.forEach((item: any) => {
      const forecastDate = new Date(item.dt * 1000);
      
      // Check if forecast date is within trip range
      if (forecastDate >= startDate && forecastDate <= endDate) {
        const tempHigh = Math.round(item.main.temp_max);
        const tempLow = Math.round(item.main.temp_min);
        
        forecasts.push({
          date: forecastDate,
          tempHigh,
          tempLow,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: item.wind?.speed || 0,
          icon: item.weather[0].icon,
          precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
        });

        conditions.add(item.weather[0].main.toLowerCase());
        totalHigh += tempHigh;
        totalLow += tempLow;
        count++;
      }
    });

    // If no forecasts found, try to get current weather as fallback
    if (forecasts.length === 0) {
      try {
        const currentWeather = await getWeatherData(location);
        const avgTemp = currentWeather.temperature;
        
        forecasts.push({
          date: startDate,
          tempHigh: avgTemp + 5,
          tempLow: avgTemp - 5,
          description: currentWeather.description,
          humidity: currentWeather.humidity,
          windSpeed: currentWeather.windSpeed,
          icon: currentWeather.icon,
        });

        totalHigh = avgTemp + 5;
        totalLow = avgTemp - 5;
        count = 1;
        conditions.add(currentWeather.description.toLowerCase());
      } catch (error) {
        console.error('Error getting fallback weather:', error);
        return null;
      }
    }

    return {
      location,
      startDate,
      endDate,
      forecasts,
      averageHigh: count > 0 ? Math.round(totalHigh / count) : 0,
      averageLow: count > 0 ? Math.round(totalLow / count) : 0,
      conditions: Array.from(conditions),
    };
  } catch (error) {
    console.error('Error getting weather forecast:', error);
    return null;
  }
}

