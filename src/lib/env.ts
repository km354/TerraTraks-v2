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
  premiumPriceId: getEnvVar('STRIPE_PREMIUM_PRICE_ID'),
};

/**
 * Supabase Configuration
 */
export const supabase = {
  url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
};

/**
 * Database Configuration
 */
export const database = {
  url: getEnvVar('DATABASE_URL'),
};

/**
 * NextAuth Configuration
 */
export const auth = {
  secret: getEnvVar('AUTH_SECRET'),
  url: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',
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
 * Affiliate Program Configuration
 */
export const affiliates = {
  bookingCom: {
    affiliateId: getEnvVar('BOOKING_COM_AFFILIATE_ID', false),
  },
  rei: {
    affiliateId: getEnvVar('REI_AFFILIATE_ID', false),
  },
  getYourGuide: {
    affiliateId: getEnvVar('GET_YOUR_GUIDE_AFFILIATE_ID', false),
  },
  viator: {
    affiliateId: getEnvVar('VIATOR_AFFILIATE_ID', false),
  },
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
    'STRIPE_PREMIUM_PRICE_ID',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL',
    'AUTH_SECRET',
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

