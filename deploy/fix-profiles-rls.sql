-- Fix profiles RLS policies to allow signup
-- Run this in Supabase SQL Editor

-- Drop the old policy if it exists
drop policy if exists "profiles_owner" on profiles;

-- Create separate policies for insert, select, and update
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
