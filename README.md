# TerraTraks-v2

This is a [Next.js](https://nextjs.org/) project bootstrapped for TerraTraks.

## Getting Started

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Then fill in all API keys in .env.local
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

### Installed Libraries

- ✅ **OpenAI** - For GPT-4/GPT-3.5 API calls
- ✅ **NextAuth v5** - Authentication with Google OAuth
- ✅ **Stripe** - Payment processing
- ✅ **Supabase** - Database and backend services
- ✅ **Prisma** - ORM for database management
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Built-in fetch** - For OpenWeatherMap API calls

### Database Setup

The project uses Prisma with PostgreSQL (via Supabase) for data persistence.

1. **Set up the database** (see [DATABASE_SETUP.md](./DATABASE_SETUP.md)):
   ```bash
   # Install dependencies
   npm install
   
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed database
   npm run db:seed
   ```

2. **Database models**:
   - User (accounts, subscription status)
   - Itinerary (travel plans)
   - ItineraryItem (activities, accommodations, etc.)
   - Expense (travel expenses)

### Authentication Setup

The project uses NextAuth.js v5 with Google OAuth for user authentication.

1. **Configure Google OAuth** (see [AUTHENTICATION.md](./AUTHENTICATION.md)):
   - Get Google OAuth credentials from Google Cloud Console
   - Add redirect URIs for development and production
   - Add credentials to `.env.local`

2. **Update database schema**:
   ```bash
   npm run db:push
   ```

3. **Test authentication**:
   - Navigate to `/auth/signin`
   - Sign in with Google
   - Verify you're redirected to dashboard

For detailed authentication setup, see [AUTHENTICATION.md](./AUTHENTICATION.md).

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

