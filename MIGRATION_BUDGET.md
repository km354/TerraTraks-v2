# Database Migration: Add Budget Fields

This migration adds budget tracking fields to the Itinerary model.

## Changes

- Added `budget` field (Decimal, optional) to `Itinerary` model
- Added `budgetCurrency` field (String, optional, default: "USD") to `Itinerary` model

## How to Apply

1. Generate Prisma Client:
```bash
npx prisma generate
```

2. Push schema changes to database:
```bash
npx prisma db push
```

Or create a migration:
```bash
npx prisma migrate dev --name add_budget_fields
```

## Verification

After applying the migration, verify the changes:
- Check that the `itineraries` table has `budget` and `budget_currency` columns
- Existing itineraries should have `NULL` for these fields (which is expected)
- New itineraries can have budget values set

## Rollback

If you need to rollback, you can manually remove the columns:
```sql
ALTER TABLE itineraries DROP COLUMN budget;
ALTER TABLE itineraries DROP COLUMN budget_currency;
```

Or create a rollback migration:
```bash
npx prisma migrate dev --name remove_budget_fields
```

