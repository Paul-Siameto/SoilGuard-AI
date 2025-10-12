import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx';
import { useSubscription } from '../context/SubscriptionContext.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Payments() {
  const { user } = useAuth();
  const { tier, isPro, refreshSubscription } = useSubscription();
  const [amount, setAmount] = useState('');
  const [ref, setRef] = useState('');
  const [status, setStatus] = useState('');

  const initiate = async (type) => {
    if (!user) {
      alert('Please sign in to initiate payment');
      return;
    }
    
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
      
      // Refresh subscription status if payment was successful
      if (data.status === 'success') {
        refreshSubscription();
      }
    } catch (e) {
      alert('Verification failed');
    }
  };

  return (
    <div className="max-w-4xl animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">💳 Payments</h2>
        <p className="text-gray-600">Support SoilGuard-AI or upgrade to Pro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donation Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 hover-lift border-2 border-transparent hover:border-green-200 transition-all">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Make a Donation</h3>
            <p className="text-gray-600">Support our mission to help farmers</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
              <input 
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                placeholder="Enter amount" 
                value={amount} 
                onChange={(e)=>setAmount(e.target.value)}
                type="number"
              />
            </div>
            
            <button 
              onClick={()=>initiate('donation')} 
              className="w-full gradient-green text-white rounded-lg p-4 font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Donate Now
            </button>
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className={`bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white hover-lift transform hover:scale-105 transition-all ${isPro() ? 'ring-4 ring-green-400' : ''}`}>
          {isPro() && (
            <div className="absolute top-4 right-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Active
            </div>
          )}
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <div className="text-4xl font-bold mb-2">KES 2,999<span className="text-lg font-normal"> one-time</span></div>
            <p className="text-white/80">Unlock premium features forever</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Land Management (images, PDFs, crops)</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Download insights as PDF</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>ESRI Satellite Map View</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Crop yield tracking</span>
            </li>
          </ul>
          
          <button 
            onClick={()=>initiate('pro')} 
            disabled={isPro()}
            className={`w-full rounded-lg p-4 font-bold transition-all ${
              isPro() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-purple-600 hover:shadow-2xl transform hover:scale-105'
            }`}
          >
            {isPro() ? '✓ Already Pro Member' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      {/* Payment Status */}
      {ref && (
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 animate-fadeIn border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Payment Status</h3>
              <p className="text-sm text-gray-500">Reference: <span className="font-mono">{ref}</span></p>
            </div>
          </div>
          
          {status && (
            <div className={`p-4 rounded-lg mb-4 ${
              status.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Status: {status}</span>
              </div>
            </div>
          )}
          
          <button 
            onClick={verify} 
            className="w-full bg-blue-500 text-white rounded-lg p-3 font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Verify Payment
          </button>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Development Mode</p>
          <p>For local development without Paystack keys, the backend returns mock responses for testing purposes.</p>
        </div>
      </div>
    </div>
  );
}
