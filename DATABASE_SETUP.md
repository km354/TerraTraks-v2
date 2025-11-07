# Database Setup Guide

This guide explains how to set up the database for TerraTraks using Prisma and Supabase PostgreSQL.

## 📋 Prerequisites

- Supabase account and project (see [ENV_SETUP.md](./ENV_SETUP.md))
- Node.js and npm installed
- Environment variables configured

## 🚀 Setup Steps

### Step 1: Get Database Connection String from Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Select **URI** tab
6. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with your actual database password
   - You can find/reset your password in **Settings** → **Database** → **Database password**

### Step 2: Add DATABASE_URL to Environment Variables

1. Open your `.env.local` file
2. Add the DATABASE_URL:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.your_project_ref.supabase.co:5432/postgres
   ```
3. Make sure to replace:
   - `your_password` with your actual database password
   - `your_project_ref` with your Supabase project reference

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI for migrations
- `tsx` - TypeScript execution for seed scripts

### Step 4: Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

### Step 5: Push Schema to Database

```bash
npm run db:push
```

This creates the database tables based on your Prisma schema.

**Alternative: Use Migrations (Recommended for Production)**

```bash
npm run db:migrate
```

This creates a migration file and applies it to the database. Migrations are better for production as they track schema changes.

### Step 6: (Optional) Seed the Database

```bash
npm run db:seed
```

This populates the database with sample data for testing.

## 📊 Database Schema

### Models

#### User
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User's display name
- `image` - Profile image URL
- `emailVerified` - Email verification timestamp
- `subscriptionStatus` - Subscription status (free, active, cancelled, past_due)
- `stripeCustomerId` - Stripe customer ID
- `stripeSubscriptionId` - Stripe subscription ID
- `subscriptionEndsAt` - Subscription expiration date
- `createdAt` - Account creation date
- `updatedAt` - Last update timestamp

#### Itinerary
- `id` - Unique identifier
- `userId` - Foreign key to User
- `title` - Itinerary title
- `destination` - Destination location
- `description` - Itinerary description
- `startDate` - Trip start date
- `endDate` - Trip end date
- `isPublic` - Whether itinerary is public
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### ItineraryItem
- `id` - Unique identifier
- `itineraryId` - Foreign key to Itinerary
- `title` - Item title
- `description` - Item description
- `location` - Item location
- `startTime` - Start time
- `endTime` - End time
- `date` - Item date
- `category` - Item category (accommodation, activity, transportation, food, other)
- `order` - Display order
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### Expense
- `id` - Unique identifier
- `userId` - Foreign key to User
- `itineraryId` - Foreign key to Itinerary (optional)
- `title` - Expense title
- `description` - Expense description
- `amount` - Expense amount (decimal)
- `currency` - Currency code (default: USD)
- `category` - Expense category (accommodation, food, transportation, activity, shopping, other)
- `date` - Expense date
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🔧 Prisma Commands

### Generate Prisma Client
```bash
npm run db:generate
```
Generates the Prisma Client based on your schema.

### Push Schema to Database
```bash
npm run db:push
```
Pushes schema changes directly to the database (good for development).

### Create and Run Migration
```bash
npm run db:migrate
```
Creates a migration file and applies it to the database (recommended for production).

### Open Prisma Studio
```bash
npm run db:studio
```
Opens a visual database browser at `http://localhost:5555`.

### Seed Database
```bash
npm run db:seed
```
Runs the seed script to populate the database with sample data.

## 🔒 Database Security

### Supabase Row Level Security (RLS)

After setting up Prisma, you should enable Row Level Security in Supabase:

1. Go to **Authentication** → **Policies** in Supabase Dashboard
2. Enable RLS on your tables
3. Create policies to ensure users can only access their own data

Example SQL for enabling RLS:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on itineraries table
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own data
CREATE POLICY "Users can view own itineraries"
ON itineraries FOR SELECT
USING (auth.uid()::text = user_id);

-- Create policy for users to create their own itineraries
CREATE POLICY "Users can create own itineraries"
ON itineraries FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to update their own itineraries
CREATE POLICY "Users can update own itineraries"
ON itineraries FOR UPDATE
USING (auth.uid()::text = user_id);

-- Create policy for users to delete their own itineraries
CREATE POLICY "Users can delete own itineraries"
ON itineraries FOR DELETE
USING (auth.uid()::text = user_id);
```

## 📝 Using Prisma in Your Code

### Import Prisma Client

```typescript
import { prisma } from '@/lib/prisma';
```

### Example Queries

#### Create a User
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    subscriptionStatus: 'free',
  },
});
```

#### Get User's Itineraries
```typescript
const itineraries = await prisma.itinerary.findMany({
  where: {
    userId: user.id,
  },
  include: {
    items: true,
    expenses: true,
  },
});
```

#### Create Itinerary with Items
```typescript
const itinerary = await prisma.itinerary.create({
  data: {
    userId: user.id,
    title: 'Trip to Tokyo',
    destination: 'Tokyo, Japan',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-07'),
    items: {
      create: [
        {
          title: 'Visit Shibuya',
          category: 'activity',
          date: new Date('2024-07-01'),
        },
      ],
    },
  },
});
```

#### Create Expense
```typescript
const expense = await prisma.expense.create({
  data: {
    userId: user.id,
    itineraryId: itinerary.id,
    title: 'Hotel Booking',
    amount: 500.00,
    currency: 'USD',
    category: 'accommodation',
  },
});
```

## 🐛 Troubleshooting

### "Can't reach database server" error
- Check your DATABASE_URL is correct
- Verify your Supabase project is active
- Check your database password is correct
- Ensure your IP is allowed (Supabase allows all IPs by default)

### "Relation does not exist" error
- Run `npm run db:push` to create the tables
- Or run `npm run db:migrate` to apply migrations

### Prisma Client not found
- Run `npm run db:generate` to generate the client
- Make sure `@prisma/client` is installed

### Migration conflicts
- Check your migration files in `prisma/migrations/`
- You may need to reset the database (development only):
  ```bash
  npx prisma migrate reset
  ```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Prisma with Next.js](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

