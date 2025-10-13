-- Add full_name column to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Optional: Update existing profiles to use username as full_name if empty
UPDATE profiles 
SET full_name = username 
WHERE full_name IS NULL AND username IS NOT NULL;

