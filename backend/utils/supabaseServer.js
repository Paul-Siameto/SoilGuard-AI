import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service_role key.
// IMPORTANT: Never expose the service_role key to the frontend.
export const supabaseServer = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  {
    auth: { persistSession: false }
  }
);
