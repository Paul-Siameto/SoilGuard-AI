-- Confirm all existing users (run in Supabase SQL Editor)
-- This updates the email_confirmed_at timestamp for unconfirmed users

update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;
