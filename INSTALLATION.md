# Installation Guide

This guide will help you install all required dependencies and set up the TerraTraks project.

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git
- API keys for all services (see [ENV_SETUP.md](./ENV_SETUP.md))

## Step 1: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- **Next.js 14** - React framework
- **React & React DOM** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI SDK** - For GPT-4/GPT-3.5 API calls
- **NextAuth v5** - Authentication (App Router compatible)
- **Stripe** - Payment processing
- **Supabase** - Database and backend services
- **ESLint** - Code linting

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all API keys in `.env.local`:
   - OpenAI API key
   - OpenWeatherMap API key
   - Google Maps Static API key
   - Google OAuth credentials
   - Stripe API keys
   - Supabase credentials
   - Auth secret

3. Generate an Auth secret:
   ```bash
   openssl rand -base64 32
   ```
   Add this to `AUTH_SECRET` in your `.env.local` file.

For detailed instructions, see [ENV_SETUP.md](./ENV_SETUP.md).

## Step 3: Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Add them to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Verify Installation

The application will validate environment variables on startup. Check the console for any warnings about missing variables.

## Installed Packages

### Core Dependencies

- `next@14.2.5` - Next.js framework
- `react@^18.2.0` - React library
- `react-dom@^18.2.0` - React DOM

### API Integrations

- `openai@^4.28.0` - OpenAI SDK for GPT API calls
- `stripe@^14.21.0` - Stripe SDK for payments
- `@supabase/supabase-js@^2.39.3` - Supabase client
- `@supabase/ssr@^0.1.0` - Supabase SSR support

### Authentication

- `next-auth@^5.0.0-beta.20` - NextAuth v5 (App Router compatible)

### Styling

- `tailwindcss@^3.4.1` - Utility-first CSS framework
- `autoprefixer@^10.4.18` - CSS vendor prefixing
- `postcss@^8.4.35` - CSS processing

### Development Tools

- `typescript@^5.4.5` - TypeScript compiler
- `eslint@^8.57.0` - Code linting
- `eslint-config-next@14.2.5` - Next.js ESLint config
- `dotenv@^16.4.5` - Environment variable loading

## Troubleshooting

### npm install fails

- Make sure you have Node.js 18+ installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Check your internet connection

### Environment variables not loading

- Make sure `.env.local` exists in the project root
- Restart your development server after adding variables
- Check that variable names match exactly (case-sensitive)

### NextAuth errors

- Verify `AUTH_SECRET` is set in `.env.local`
- Check that Google OAuth credentials are correct
- Ensure redirect URIs match in Google Cloud Console

### Supabase connection errors

- Verify Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure network connectivity

## Next Steps

1. Set up your database schema in Supabase
2. Configure authentication providers
3. Set up Stripe webhooks
4. Deploy to Vercel (see [VERCEL_SETUP.md](./VERCEL_SETUP.md))

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth v5 Documentation](https://authjs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

