import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Insights() {
  const [ph, setPh] = useState('');
  const [moisture, setMoisture] = useState('');
  const [crop, setCrop] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await axios.post(`${API}/api/ai/insights`, { ph, moisture, crop });
    setResult(data?.result || '');
    setLoading(false);
  };

  return (
    <div className="max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Soil Insights</h2>
      <form onSubmit={generate} className="space-y-2">
        <input className="w-full border rounded p-2" placeholder="pH" value={ph} onChange={(e)=>setPh(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Moisture %" value={moisture} onChange={(e)=>setMoisture(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Crop type" value={crop} onChange={(e)=>setCrop(e.target.value)} />
        <button className="bg-green-600 text-white rounded px-4 py-2">{loading ? 'Generating...' : 'Generate'}</button>
      </form>
      {result && (
        <div className="p-3 border rounded bg-white"><pre className="whitespace-pre-wrap">{result}</pre></div>
      )}
    </div>
  );
}
