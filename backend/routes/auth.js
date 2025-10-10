import { createClient } from '@supabase/supabase-js';

// Helper to verify Supabase JWT from Authorization: Bearer <token>
// Usage example in Express routes:
//   app.get('/api/protected', requireAuth, (req, res) => res.json({ user: req.user }));

const supabaseAdmin = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false }
  });

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const supabase = supabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: data.user.id, email: data.user.email };
    next();
  } catch (e) {
    console.error('Auth error', e);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
