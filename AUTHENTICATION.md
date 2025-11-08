# Authentication Setup Guide

This guide explains how Google OAuth authentication is configured in TerraTraks using NextAuth.js v5.

## 🔐 Authentication Overview

TerraTraks uses NextAuth.js v5 with Google OAuth for user authentication. Sessions are stored in the database using Prisma adapter.

## 📋 Setup Steps

### 1. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen:
   - User type: External
   - App name: TerraTraks
   - Support email: Your email
   - Developer contact: Your email
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 2. Set Environment Variables

Add to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_SECRET=your_auth_secret  # Generate with: openssl rand -base64 32
```

### 3. Update Database Schema

Run Prisma migrations to create NextAuth tables:

```bash
npm run db:push
# or
npm run db:migrate
```

This will create:
- `accounts` table (OAuth accounts)
- `sessions` table (user sessions)
- `verification_tokens` table (email verification)

### 4. Verify Setup

1. Start the development server: `npm run dev`
2. Navigate to `/auth/signin`
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to `/dashboard`

## 🛡️ Protected Routes

The following routes require authentication:

- `/dashboard` - User dashboard
- `/new-itinerary` - Create new itinerary
- `/itinerary/[id]` - View itinerary details

Unauthenticated users are automatically redirected to `/auth/signin` with a callback URL.

## 🔓 Public Routes

The following routes are publicly accessible:

- `/` - Landing page
- `/pricing` - Pricing page
- `/auth/signin` - Sign in page
- `/auth/error` - Error page

## 📝 Authentication Flow

1. User clicks "Sign In" in navigation
2. Redirected to `/auth/signin`
3. User clicks "Continue with Google"
4. Redirected to Google OAuth consent screen
5. User authorizes the application
6. Google redirects back to `/api/auth/callback/google`
7. NextAuth creates/updates user in database
8. Session is created and stored in database
9. User is redirected to callback URL (or `/dashboard`)

## 🎨 User Interface

### Navigation

The navigation bar shows:
- **Not logged in**: "Sign In" button
- **Logged in**: User avatar/name with dropdown menu
  - Dashboard link
  - Sign out option

### User Menu

When logged in, users can:
- View their profile (avatar, name, email)
- Access dashboard
- Sign out

## 🔧 Configuration Files

### `src/auth.ts`

Main NextAuth configuration:
- Google OAuth provider
- Prisma adapter for database sessions
- Custom session callbacks
- Custom pages (sign-in, error)

### `src/middleware.ts`

Route protection middleware:
- Protects authenticated routes
- Allows public routes
- Redirects unauthenticated users to sign-in

### `src/app/auth/signin/page.tsx`

Sign-in page with Google OAuth button.

### `src/components/UserMenu.tsx`

Client component that displays user info and sign-out option.

## 🗄️ Database Models

### User Model

- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User's display name
- `image` - Profile image URL
- `emailVerified` - Email verification timestamp
- `accounts` - Related OAuth accounts
- `sessions` - User sessions

### Account Model

- `id` - Unique identifier
- `userId` - Foreign key to User
- `provider` - OAuth provider (e.g., "google")
- `providerAccountId` - Provider's user ID
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token

### Session Model

- `id` - Unique identifier
- `sessionToken` - Session token
- `userId` - Foreign key to User
- `expires` - Session expiration date

## 🚀 Testing Authentication

### Local Development

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign In" in navigation
4. Sign in with Google
5. Verify you're redirected to dashboard
6. Check that your name/avatar appears in navigation

### Production

1. Deploy to Vercel
2. Add environment variables in Vercel dashboard
3. Update Google OAuth redirect URI to production URL
4. Test sign-in flow on deployed site

## 🐛 Troubleshooting

### "OAuthSignin" error

- Check Google OAuth credentials are correct
- Verify redirect URI matches exactly in Google Cloud Console
- Ensure Google+ API is enabled

### Session not persisting

- Check AUTH_SECRET is set
- Verify database connection
- Check Prisma adapter is configured correctly
- Ensure sessions table exists in database

### Redirect loop

- Check middleware configuration
- Verify callback URL is correct
- Check that AUTH_SECRET is set

### User not created in database

- Verify Prisma adapter is working
- Check database connection
- Ensure User model has correct fields
- Check Prisma migrations are applied

## 📚 Additional Resources

- [NextAuth.js Documentation](https://authjs.dev)
- [NextAuth.js v5 Guide](https://authjs.dev/getting-started/installation)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)

