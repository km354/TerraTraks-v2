/**
 * OpenWeatherMap API Client
 * 
 * Provides functions to fetch weather data using the OpenWeatherMap API
 */

import { openWeather } from './env';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  icon: string;
}

/**
 * Fetch current weather data for a location
 */
export async function getWeatherData(
  city: string,
  countryCode?: string
): Promise<WeatherData> {
  if (!openWeather.apiKey) {
    throw new Error('OpenWeatherMap API key is not configured. Please set OPENWEATHER_API_KEY in your environment variables.');
  }

  const location = countryCode ? `${city},${countryCode}` : city;
  const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${openWeather.apiKey}&units=metric`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      city: data.name,
      country: data.sys.country,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

/**
 * Fetch weather data by coordinates
 */
export async function getWeatherByCoordinates(
  lat: number,
  lon: number
): Promise<WeatherData> {
  if (!openWeather.apiKey) {
    throw new Error('OpenWeatherMap API key is not configured. Please set OPENWEATHER_API_KEY in your environment variables.');
  }

  const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${openWeather.apiKey}&units=metric`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      city: data.name,
      country: data.sys.country,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

