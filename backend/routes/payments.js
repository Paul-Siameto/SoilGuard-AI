import express from 'express';
import axios from 'axios';
import crypto from 'node:crypto';
import { requireAuth } from './auth.js';
import { supabaseServer } from '../utils/supabaseServer.js';

const router = express.Router();

const PAYSTACK_BASE = 'https://api.paystack.co';

// POST /api/payments/initiate
// Body example: { amount: 5000, type: 'donation' }
router.post('/initiate', requireAuth, async (req, res) => {
  const { amount, type } = req.body || {};
  const userId = req.user.id;

  // Create pending payment row
  const { data: paymentRow, error: insErr } = await supabaseServer
    .from('payments')
    .insert([{ user_id: userId, amount, type, status: 'pending' }])
    .select()
    .single();
  if (insErr) return res.status(400).json({ error: insErr.message });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY;

  // Fallback mock for local dev without keys
  if (!secret) {
    return res.json({
      mock: true,
      authorization_url: `https://paystack.mock/authorize/${paymentRow.id}`,
      reference: paymentRow.id,
      public_key: publicKey || 'pk_test_xxx'
    });
  }

  try {
    const initRes = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      {
        amount: Math.round(Number(amount) * 100),
        email: req.user.email || 'user@example.com',
        metadata: { user_id: userId, type, local_id: paymentRow.id }
      },
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    res.json(initRes.data?.data || initRes.data);
  } catch (e) {
    console.error('Paystack init error', e?.response?.data || e.message);
    res.status(400).json({ error: 'Failed to initialize payment' });
  }
});

// GET /api/payments/verify/:ref -> verify transaction by reference
router.get('/verify/:ref', requireAuth, async (req, res) => {
  const ref = req.params.ref;
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    // Mock success and update row
    await supabaseServer
      .from('payments')
      .update({ status: 'success' })
      .eq('id', ref)
      .eq('user_id', req.user.id);
    return res.json({ status: 'success', reference: ref, mock: true });
  }

  try {
    const verRes = await axios.get(`${PAYSTACK_BASE}/transaction/verify/${ref}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const status = verRes?.data?.data?.status === 'success' ? 'success' : 'failed';
    await supabaseServer
      .from('payments')
      .update({ status })
      .eq('user_id', req.user.id)
      .eq('id', ref);
    res.json({ status, reference: ref });
  } catch (e) {
    console.error('Paystack verify error', e?.response?.data || e.message);
    res.status(400).json({ error: 'Verification failed' });
  }
});

// POST /api/payments/webhook -> Paystack webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(200).send('ok'); // ignore in mock mode

  const signature = req.headers['x-paystack-signature'];
  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.body)
    .digest('hex');
  if (hash !== signature) return res.status(401).send('Invalid signature');

  const event = JSON.parse(req.body.toString());
  const ref = event?.data?.reference;
  const status = event?.data?.status;

  if (ref && status) {
    await supabaseServer
      .from('payments')
      .update({ status })
      .eq('id', ref);
  }
  res.status(200).send('ok');
});

export default router;
