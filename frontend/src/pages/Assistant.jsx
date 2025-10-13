import React, { useState } from 'react';
import axios from 'axios';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Assistant() {
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! Ask me about soil health.' }]);
  const [input, setInput] = useState('');

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    const { data } = await axios.post(`${API}/api/ai/chat`, { message: userMsg.text });
    setMessages((m) => [...m, { role: 'ai', text: data?.reply || '...' }]);
  };

  // Restrict to Pro users only
  if (!isPro()) {
    return (
      <div className="max-w-4xl animate-fadeIn">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 text-center border-2 border-purple-200">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🔒 AI Assistant - Pro Feature</h2>
          <p className="text-gray-600 mb-6">
            The AI Assistant is a premium feature available exclusively to Pro members. 
            Upgrade to Pro to get instant answers about soil health, farming techniques, and crop management.
          </p>
          <div className="bg-white rounded-lg p-4 text-left mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Pro Features Include:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">AI Assistant</span> - Get instant farming advice
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Land Management with images & documents
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Download insights as PDF
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ESRI Satellite Map View
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Crop yield tracking
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/dashboard/payments')}
            className="gradient-green text-white px-8 py-3 rounded-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Upgrade to Pro - KES 2,999
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI Assistant</h2>
        <p className="text-gray-600">Ask me anything about soil health and farming</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
              <div className={`flex gap-3 max-w-[80%] ${m.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'ai' ? 'bg-gradient-green' : 'bg-blue-500'
                }`}>
                  {m.role === 'ai' ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 shadow-md ${
                  m.role === 'ai' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'gradient-green text-white'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t bg-gray-50 p-4">
          <form onSubmit={send} className="flex gap-3">
            <input 
              className="flex-1 border-2 border-gray-200 rounded-full px-6 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
              value={input} 
              onChange={(e)=>setInput(e.target.value)} 
              placeholder="Type your question here..."
            />
            <button 
              type="submit"
              className="gradient-green text-white rounded-full px-8 py-3 font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
