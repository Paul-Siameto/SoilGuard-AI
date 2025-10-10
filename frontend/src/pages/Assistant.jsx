import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Assistant() {
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

  return (
    <div className="max-w-2xl space-y-3">
      <div className="h-80 border rounded p-3 bg-white overflow-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 ${m.role === 'ai' ? '' : 'text-right'}`}>
            <span className={`inline-block px-3 py-2 rounded ${m.role === 'ai' ? 'bg-gray-100' : 'bg-green-600 text-white'}`}>{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input className="flex-1 border rounded p-2" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" />
        <button className="bg-green-600 text-white rounded px-4">Send</button>
      </form>
    </div>
  );
}
