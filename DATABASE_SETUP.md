# Database Setup Guide

This application uses Supabase as the backend database. Follow these steps to set up your database:

## 1. Environment Variables

Make sure you have these environment variables set in your Vercel project or `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Run Database Scripts

Execute the SQL scripts in order to create all necessary tables:

### Step 1: Create Tables
Run `scripts/001_create_tables.sql` in your Supabase SQL editor or use v0 to execute it.

This creates:
- `profiles` - User profiles
- `inventory_normal` - Normal jewelry inventory
- `inventory_girvi` - Girvi (mortgage) inventory
- `sales` - B2B and B2C sales
- `private_sales` - Private sales (Girvi auction + Most Private)

### Step 2: Create Profile Trigger
Run `scripts/002_create_profile_trigger.sql`

This automatically creates a profile when a new user signs up.

## 3. Row Level Security (RLS)

All tables have RLS enabled with policies that ensure users can only access their own data:

- Users can SELECT their own records (WHERE user_id = auth.uid())
- Users can INSERT with their user_id
- Users can UPDATE their own records
- Users can DELETE their own records

## 4. API Routes

The following API routes are available:

### Inventory
- `GET /api/inventory/normal` - Get all normal inventory
- `POST /api/inventory/normal` - Create new inventory item
- `PUT /api/inventory/normal` - Update inventory item
- `DELETE /api/inventory/normal?id=<id>` - Delete inventory item

- `GET /api/inventory/girvi` - Get all girvi inventory
- `POST /api/inventory/girvi` - Create new girvi item
- `PUT /api/inventory/girvi` - Update girvi item
- `DELETE /api/inventory/girvi?id=<id>` - Delete girvi item

### Sales
- `GET /api/sales?sale_type=b2c|b2b` - Get sales (optional filter)
- `POST /api/sales` - Create new sale
- `DELETE /api/sales?id=<id>` - Delete sale

### Private Sales
- `GET /api/private-sales?sale_type=girvi|most` - Get private sales (optional filter)
- `POST /api/private-sales` - Create new private sale
- `DELETE /api/private-sales?id=<id>` - Delete private sale

### Reports
- `GET /api/reports/inventory?date=YYYY-MM-DD` - Get inventory report for date
- `GET /api/reports/sales?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Get sales report

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## 5. Authentication

The app uses Supabase Auth with email/password:

- Sign up at `/signup`
- Login at `/login`
- Protected routes require authentication (enforced by middleware)
- Logout functionality integrated in sidebar

## 6. Testing

After setup, you can:
1. Sign up for a new account
2. Confirm email (check Supabase Auth settings for email confirmation)
3. Login and access dashboard
4. Use the UI to add inventory, create sales, etc.

All data is automatically associated with your user ID through RLS policies.
