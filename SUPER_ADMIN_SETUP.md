# Super Admin Setup Guide

## Step 1: Create Super Admin User in Supabase

1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add User" and create a new user with:
   - Email: `superadmin@jewelpro.com` (or your choice)
   - Password: Choose a strong password
   - Auto Confirm User: YES

## Step 2: Run Database Migration

Run the SQL script `scripts/003_add_super_admin_and_shop.sql` in Supabase SQL Editor

## Step 3: Set User as Super Admin

After creating the user in Supabase Auth, run this SQL query in Supabase SQL Editor:

```sql
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'superadmin@jewelpro.com';
```

## Step 4: Access Super Admin Panel

1. Go to `/super-admin/login`
2. Login with super admin credentials
3. You can now create users with shop details

## Features

### Super Admin Can:
- Create new users with shop details
- Generate login credentials for users
- View all registered users
- Enable/Disable user accounts
- See registration dates and user activity

### Regular Users:
- Login with credentials created by super admin
- Access their dashboard if enabled
- Cannot login if disabled by admin
- Manage inventory, sales, reports, etc.

## Security

- Super admin role is checked on every API call
- Disabled users cannot access any protected resources
- RLS policies enforce data isolation
- All validation on both frontend and backend
