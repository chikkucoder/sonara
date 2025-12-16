-- Create profiles table for users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  shop_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create normal inventory table
CREATE TABLE IF NOT EXISTS public.inventory_normal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  metal_type TEXT NOT NULL,
  weight DECIMAL(10, 3) NOT NULL,
  purity TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  total_value DECIMAL(12, 2) NOT NULL,
  supplier TEXT,
  inventory_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on normal inventory
ALTER TABLE public.inventory_normal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory"
  ON public.inventory_normal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory"
  ON public.inventory_normal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
  ON public.inventory_normal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
  ON public.inventory_normal FOR DELETE
  USING (auth.uid() = user_id);

-- Create girvi inventory table
CREATE TABLE IF NOT EXISTS public.inventory_girvi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_aadhar TEXT,
  item_name TEXT NOT NULL,
  metal_type TEXT NOT NULL,
  weight DECIMAL(10, 3) NOT NULL,
  purity TEXT NOT NULL,
  loan_amount DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  loan_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on girvi inventory
ALTER TABLE public.inventory_girvi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own girvi inventory"
  ON public.inventory_girvi FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own girvi inventory"
  ON public.inventory_girvi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own girvi inventory"
  ON public.inventory_girvi FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own girvi inventory"
  ON public.inventory_girvi FOR DELETE
  USING (auth.uid() = user_id);

-- Create sales table (B2B and B2C)
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_type TEXT NOT NULL, -- 'b2c' or 'b2b'
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  business_name TEXT,
  gst_number TEXT,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(12, 2) DEFAULT 0,
  gst_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_terms TEXT,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on sales
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sales"
  ON public.sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales"
  ON public.sales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales"
  ON public.sales FOR DELETE
  USING (auth.uid() = user_id);

-- Create private sales table (Girvi + Most Private)
CREATE TABLE IF NOT EXISTS public.private_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_type TEXT NOT NULL, -- 'girvi' or 'most'
  source_id UUID, -- Reference to inventory_girvi.id or inventory_normal.id
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on private sales
ALTER TABLE public.private_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own private sales"
  ON public.private_sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own private sales"
  ON public.private_sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own private sales"
  ON public.private_sales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own private sales"
  ON public.private_sales FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_normal_user_id ON public.inventory_normal(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_normal_date ON public.inventory_normal(inventory_date);
CREATE INDEX IF NOT EXISTS idx_inventory_girvi_user_id ON public.inventory_girvi(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_girvi_status ON public.inventory_girvi(status);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON public.sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON public.sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_private_sales_user_id ON public.private_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_private_sales_date ON public.private_sales(sale_date);
