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
    <form onSubmit={handleSubmit} className="space-y-2">
      <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <input className="w-full border rounded p-2" placeholder="Latitude" value={latitude} onChange={(e)=>setLatitude(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Longitude" value={longitude} onChange={(e)=>setLongitude(e.target.value)} />
      </div>
      <input className="w-full border rounded p-2" placeholder="Soil health" value={soil_health} onChange={(e)=>setSoilHealth(e.target.value)} />
      <div className="flex gap-2">
        <button className="bg-green-600 text-white rounded px-4 py-2">Save</button>
        <button type="button" onClick={onCancel} className="border rounded px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}
