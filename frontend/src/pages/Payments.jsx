import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Payments() {
  const [amount, setAmount] = useState('');
  const [ref, setRef] = useState('');
  const [status, setStatus] = useState('');

  const initiate = async (type) => {
    try {
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess?.session?.access_token;
      const { data } = await axios.post(
        `${API}/api/payments/initiate`,
        { amount, type },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        }
      );
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.mock) {
        setRef(data.reference);
        setStatus('Pending (mock)');
      }
    } catch (e) {
      alert('Failed to initiate payment');
    }
  };

  const verify = async () => {
    if (!ref) return;
    try {
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess?.session?.access_token;
      const { data } = await axios.get(`${API}/api/payments/verify/${ref}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
      setStatus(data.status);
    } catch (e) {
      alert('Verification failed');
    }
  };

  return (
    <div className="max-w-md space-y-3">
      <h2 className="text-xl font-semibold">Payments</h2>
      <input className="w-full border rounded p-2" placeholder="Amount (e.g. 1000)" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={()=>initiate('donation')} className="bg-green-600 text-white rounded px-4 py-2">Donate</button>
        <button onClick={()=>initiate('pro')} className="border rounded px-4 py-2">Buy Pro</button>
      </div>
      {ref && (
        <div className="space-y-2">
          <div className="text-sm">Reference: {ref}</div>
          <button onClick={verify} className="border rounded px-3 py-1">Verify Payment</button>
          {status && <div className="text-sm">Status: {status}</div>}
        </div>
      )}
      <div className="text-xs text-gray-500">Note: For local dev without Paystack keys, backend returns a mock URL and verification.</div>
    </div>
  );
}
