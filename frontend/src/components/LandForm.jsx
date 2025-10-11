import React, { useState, useEffect } from 'react';

export default function LandForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [soil_health, setSoilHealth] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setLatitude(initial.latitude ?? '');
      setLongitude(initial.longitude ?? '');
      setSoilHealth(initial.soil_health || '');
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, latitude: Number(latitude), longitude: Number(longitude), soil_health });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Land Name</label>
        <input 
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
          placeholder="e.g., North Field" 
          value={name} 
          onChange={(e)=>setName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input 
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
            placeholder="-1.286389" 
            value={latitude} 
            onChange={(e)=>setLatitude(e.target.value)}
            type="number"
            step="any"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input 
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
            placeholder="36.817223" 
            value={longitude} 
            onChange={(e)=>setLongitude(e.target.value)}
            type="number"
            step="any"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Soil Health</label>
        <input 
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
          placeholder="e.g., Good, Fair, Poor" 
          value={soil_health} 
          onChange={(e)=>setSoilHealth(e.target.value)}
        />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button 
          type="submit"
          className="flex-1 gradient-green text-white rounded-lg px-6 py-3 font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
        >
          💾 Save Land
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
