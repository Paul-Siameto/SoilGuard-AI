import express from 'express';
import { supabaseServer } from '../utils/supabaseServer.js';
import { requireAuth } from './auth.js';

const router = express.Router();

// GET /api/land -> current user's rows
router.get('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { data, error } = await supabaseServer
    .from('land_data')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/land -> create
// Body example: { name, latitude, longitude, soil_health }
router.post('/', requireAuth, async (req, res) => {
  const { id } = req.user;
  const { name, latitude, longitude, soil_health } = req.body;
  const { data, error } = await supabaseServer
    .from('land_data')
    .insert([{ user_id: id, name, latitude, longitude, soil_health }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/land/:id -> update (owner only)
router.put('/:id', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const landId = req.params.id;
  const { name, latitude, longitude, soil_health } = req.body;

  // Ensure row belongs to user
  const { data: existing, error: selErr } = await supabaseServer
    .from('land_data')
    .select('user_id')
    .eq('id', landId)
    .single();
  if (selErr || !existing) return res.status(404).json({ error: 'Not found' });
  if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabaseServer
    .from('land_data')
    .update({ name, latitude, longitude, soil_health })
    .eq('id', landId)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/land/:id -> delete (owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const landId = req.params.id;

  const { data: existing, error: selErr } = await supabaseServer
    .from('land_data')
    .select('user_id')
    .eq('id', landId)
    .single();
  if (selErr || !existing) return res.status(404).json({ error: 'Not found' });
  if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabaseServer
    .from('land_data')
    .delete()
    .eq('id', landId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export default router;
