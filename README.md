# TerraTraks-v2

This is a [Next.js](https://nextjs.org/) project bootstrapped for TerraTraks.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Auto-Push Setup

✅ Automatic commits and pushes to GitHub are now configured. All changes made to this project will be automatically committed and pushed to the repository.

## Environment Variables Setup

⚠️ **Important**: Before running the application, you need to configure environment variables.

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your API keys** in `.env.local`:
   - OpenAI API key
   - OpenWeatherMap API key
   - Google Maps Static API key
   - Google OAuth credentials
   - Stripe API keys

3. **For detailed setup instructions**, see:
   - [ENV_SETUP.md](./ENV_SETUP.md) - Complete guide for obtaining API keys
   - [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Setting up variables in Vercel

4. **For production deployment**, add all environment variables in Vercel Dashboard:
   - Project Settings → Environment Variables
   - See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for step-by-step instructions

