/**
 * Environment Variables Configuration
 * 
 * This file provides type-safe access to environment variables.
 * It validates that required variables are present and provides
 * helpful error messages if they're missing.
 */

/**
 * Validates that an environment variable is set
 * Returns empty string if not found (doesn't throw to allow app to run)
 */
function getEnvVar(key: string, required = false): string {
  const value = process.env[key];
  
  // Check if value is a placeholder
  if (value && (value.includes('your_') || value.includes('_here'))) {
    return '';
  }
  
  return value || '';
}

/**
 * OpenAI API Configuration
 */
export const openAI = {
  apiKey: getEnvVar('OPENAI_API_KEY'),
};

/**
 * OpenWeatherMap API Configuration
 */
export const openWeather = {
  apiKey: getEnvVar('OPENWEATHER_API_KEY'),
};

/**
 * Google Maps Static API Configuration
 */
export const googleMaps = {
  staticApiKey: getEnvVar('GOOGLE_MAPS_STATIC_API_KEY'),
};

/**
 * Google OAuth Configuration
 */
export const googleOAuth = {
  clientId: getEnvVar('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URI') || 
    (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/auth/callback/google',
};

/**
 * Stripe API Configuration
 */
export const stripe = {
  secretKey: getEnvVar('STRIPE_SECRET_KEY'),
  publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY'),
  publicPublishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
};

/**
 * Application Configuration
 */
export const app = {
  url: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',
  nodeEnv: getEnvVar('NODE_ENV', false) || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

/**
 * Validates all required environment variables are set
 * Call this at application startup to catch missing variables early
 */
export function validateEnv(): void {
  const requiredVars = [
    'OPENAI_API_KEY',
    'OPENWEATHER_API_KEY',
    'GOOGLE_MAPS_STATIC_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  ];

  const missing: string[] = [];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.warn(
      '⚠️  Missing environment variables:\n' +
      missing.map((key) => `   - ${key}`).join('\n') +
      '\n\nPlease add them to your .env.local file.'
    );
  }
}

