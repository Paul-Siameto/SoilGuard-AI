import express from 'express';
import axios from 'axios';
import crypto from 'node:crypto';
import { requireAuth } from './auth.js';
import { supabaseServer } from '../utils/supabaseServer.js';

const router = express.Router();

const PAYSTACK_BASE = 'https://api.paystack.co';

// POST /api/payments/initiate
// Body example: { amount: 5000, type: 'donation' | 'pro' }
router.post('/initiate', requireAuth, async (req, res) => {
  const { amount, type } = req.body || {};
  const userId = req.user.id;

  // For Pro upgrade, set fixed amount
  const finalAmount = type === 'pro' ? 2999 : amount;
  const paymentType = type === 'pro' ? 'pro_upgrade' : 'donation';

  // Create pending payment row
  const { data: paymentRow, error: insErr } = await supabaseServer
    .from('payments')
    .insert([{ 
      user_id: userId, 
      amount: finalAmount, 
      payment_type: paymentType,
      payment_status: 'pending',
      payment_reference: crypto.randomUUID()
    }])
    .select()
    .single();
  if (insErr) return res.status(400).json({ error: insErr.message });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY;

  // Fallback mock for local dev without keys
  if (!secret) {
    return res.json({
      mock: true,
      authorization_url: `https://paystack.mock/authorize/${paymentRow.payment_reference}`,
      reference: paymentRow.payment_reference,
      public_key: publicKey || 'pk_test_xxx'
    });
  }

  try {
    const initRes = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      {
        amount: Math.round(Number(finalAmount) * 100),
        email: req.user.email || 'user@example.com',
        reference: paymentRow.payment_reference,
        metadata: { user_id: userId, type: paymentType, local_id: paymentRow.id }
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
    const { data: payment } = await supabaseServer
      .from('payments')
      .update({ payment_status: 'success' })
      .eq('payment_reference', ref)
      .eq('user_id', req.user.id)
      .select()
      .single();
    
    // If Pro upgrade, update user's subscription
    if (payment?.payment_type === 'pro_upgrade') {
      await supabaseServer
        .from('profiles')
        .update({ 
          subscription_tier: 'pro',
          subscription_date: new Date().toISOString()
        })
        .eq('id', req.user.id);
    }
    
    return res.json({ status: 'success', reference: ref, mock: true });
  }

  try {
    const verRes = await axios.get(`${PAYSTACK_BASE}/transaction/verify/${ref}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const status = verRes?.data?.data?.status === 'success' ? 'success' : 'failed';
    
    const { data: payment } = await supabaseServer
      .from('payments')
      .update({ payment_status: status })
      .eq('payment_reference', ref)
      .eq('user_id', req.user.id)
      .select()
      .single();
    
    // If Pro upgrade and successful, update user's subscription
    if (status === 'success' && payment?.payment_type === 'pro_upgrade') {
      await supabaseServer
        .from('profiles')
        .update({ 
          subscription_tier: 'pro',
          subscription_date: new Date().toISOString()
        })
        .eq('id', req.user.id);
    }
    
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
  const userId = event?.data?.metadata?.user_id;

  if (ref && status) {
    const { data: payment } = await supabaseServer
      .from('payments')
      .update({ payment_status: status })
      .eq('payment_reference', ref)
      .select()
      .single();
    
    // If Pro upgrade and successful, update user's subscription
    if (status === 'success' && payment?.payment_type === 'pro_upgrade' && userId) {
      await supabaseServer
        .from('profiles')
        .update({ 
          subscription_tier: 'pro',
          subscription_date: new Date().toISOString()
        })
        .eq('id', userId);
    }
  }
  res.status(200).send('ok');
});

export default router;
