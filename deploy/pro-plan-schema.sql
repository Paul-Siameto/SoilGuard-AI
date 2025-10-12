-- Add subscription column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro'));

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_date TIMESTAMPTZ;

-- Update existing payments table or create if not exists
DO $$ 
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'payments' AND column_name = 'payment_type') THEN
    ALTER TABLE payments ADD COLUMN payment_type TEXT CHECK (payment_type IN ('donation', 'pro_upgrade'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'payments' AND column_name = 'payment_reference') THEN
    ALTER TABLE payments ADD COLUMN payment_reference TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'payments' AND column_name = 'payment_status') THEN
    ALTER TABLE payments ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'payments' AND column_name = 'currency') THEN
    ALTER TABLE payments ADD COLUMN currency TEXT DEFAULT 'KES';
  END IF;
END $$;

-- Create land_images table for Pro users
CREATE TABLE IF NOT EXISTS land_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  land_id UUID REFERENCES land_data(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create land_documents table for Pro users (PDFs, etc.)
CREATE TABLE IF NOT EXISTS land_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  land_id UUID REFERENCES land_data(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT,
  file_size BIGINT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crop_tracking table for Pro users
CREATE TABLE IF NOT EXISTS crop_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  land_id UUID REFERENCES land_data(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  yield_amount DECIMAL(10, 2),
  yield_unit TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for land_images
CREATE POLICY "Users can view their own land images"
  ON land_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own land images"
  ON land_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own land images"
  ON land_images FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for land_documents
CREATE POLICY "Users can view their own land documents"
  ON land_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own land documents"
  ON land_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own land documents"
  ON land_documents FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for crop_tracking
CREATE POLICY "Users can view their own crop tracking"
  ON crop_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crop tracking"
  ON crop_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crop tracking"
  ON crop_tracking FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crop tracking"
  ON crop_tracking FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
-- Only create payment_reference index if column exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'payments' AND column_name = 'payment_reference') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_land_images_land_id ON land_images(land_id);
CREATE INDEX IF NOT EXISTS idx_land_documents_land_id ON land_documents(land_id);
CREATE INDEX IF NOT EXISTS idx_crop_tracking_land_id ON crop_tracking(land_id);
