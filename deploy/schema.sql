-- Profiles (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade,
  username text,
  email text,
  created_at timestamp with time zone default timezone('utc', now()),
  primary key (id)
);

-- Land data
create table if not exists land_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  name text,
  latitude double precision,
  longitude double precision,
  soil_health text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Payments
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  amount numeric,
  type text,
  status text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- enable RLS
alter table land_data enable row level security;
create policy "land_select_owner" on land_data
  for select using (auth.uid() = user_id);

create policy "land_insert_owner" on land_data
  for insert with check (auth.uid() = user_id);

create policy "land_update_owner" on land_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table payments enable row level security;
create policy "payments_owner_insert" on payments
  for insert with check (auth.uid() = user_id);
create policy "payments_owner_select" on payments
  for select using (auth.uid() = user_id);

-- allow profile read/write for owner
alter table profiles enable row level security;

-- Allow users to insert their own profile during signup
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- Allow users to select and update their own profile
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
