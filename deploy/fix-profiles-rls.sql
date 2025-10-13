-- Fix profiles RLS policies to allow signup and trigger-based profile creation
-- Run this in Supabase SQL Editor

-- Drop old policies if they exist
DROP POLICY IF EXISTS "profiles_owner" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Allow INSERT for authenticated users OR when auth.uid() matches
-- This allows both manual inserts and trigger-based inserts
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT 
  WITH CHECK (
    auth.uid() = id OR 
    auth.uid() IS NULL  -- Allow trigger to insert (no auth context)
  );

-- Allow users to view their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);
