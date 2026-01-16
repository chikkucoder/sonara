-- Create a test user directly (bypass email confirmation)
-- This is for development only

-- First, you need to create the user in Supabase Auth Dashboard:
-- 1. Go to Authentication → Users
-- 2. Click "Add User"
-- 3. Email: ankitsonar@gmail.com
-- 4. Password: ankitsonar (or your choice)
-- 5. Toggle "Auto Confirm User" to YES
-- 6. Click "Create User"

-- After creating in Auth Dashboard, run this to set up the profile:
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'ankitsonar@gmail.com';

-- Ensure profile is created and enabled
INSERT INTO profiles (id, email, enabled, role, full_name)
SELECT 
  id, 
  email, 
  true, 
  'user',
  'Ankit Sonar'
FROM auth.users 
WHERE email = 'ankitsonar@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET enabled = true, role = 'user';
