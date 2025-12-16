-- Add role and enabled columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('super_admin', 'user'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shop_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shop_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shop_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shop_gst TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create super admin user (you'll need to manually set this in Supabase Auth)
-- After creating a user in Supabase Auth with email superadmin@jewelpro.com
-- Run: UPDATE profiles SET role = 'super_admin' WHERE email = 'superadmin@jewelpro.com';

-- Update RLS policies to check enabled status
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id 
    OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (
    (auth.uid() = id AND enabled = true)
    OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Super admin can insert new users
CREATE POLICY "Super admin can create users" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Update inventory policies to check if user is enabled
DROP POLICY IF EXISTS "Users can view own inventory" ON inventory_normal;
CREATE POLICY "Users can view own inventory" ON inventory_normal
  FOR SELECT USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can insert own inventory" ON inventory_normal;
CREATE POLICY "Users can insert own inventory" ON inventory_normal
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can update own inventory" ON inventory_normal;
CREATE POLICY "Users can update own inventory" ON inventory_normal
  FOR UPDATE USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can delete own inventory" ON inventory_normal;
CREATE POLICY "Users can delete own inventory" ON inventory_normal
  FOR DELETE USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

-- Similar updates for other tables (inventory_girvi, sales, private_sales)
DROP POLICY IF EXISTS "Users can view own girvi inventory" ON inventory_girvi;
CREATE POLICY "Users can view own girvi inventory" ON inventory_girvi
  FOR SELECT USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can insert own girvi inventory" ON inventory_girvi;
CREATE POLICY "Users can insert own girvi inventory" ON inventory_girvi
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can update own girvi inventory" ON inventory_girvi;
CREATE POLICY "Users can update own girvi inventory" ON inventory_girvi
  FOR UPDATE USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can delete own girvi inventory" ON inventory_girvi;
CREATE POLICY "Users can delete own girvi inventory" ON inventory_girvi
  FOR DELETE USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can view own sales" ON sales;
CREATE POLICY "Users can view own sales" ON sales
  FOR SELECT USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can insert own sales" ON sales;
CREATE POLICY "Users can insert own sales" ON sales
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can view own private sales" ON private_sales;
CREATE POLICY "Users can view own private sales" ON private_sales
  FOR SELECT USING (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );

DROP POLICY IF EXISTS "Users can insert own private sales" ON private_sales;
CREATE POLICY "Users can insert own private sales" ON private_sales
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND enabled = true)
  );
