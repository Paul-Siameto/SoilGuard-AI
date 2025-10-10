import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx';
import LandForm from '../components/LandForm.jsx';

// Fix default icon path for Leaflet in Vite
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

const defaultCenter = [0.0236, 37.9062]; // Kenya-ish center

export default function MapPage() {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchLands = async () => {
    const { data, error } = await supabase
      .from('land_data')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setLands(data || []);
  };

  useEffect(() => {
    if (user) fetchLands();
  }, [user]);

  const addLand = async (payload) => {
    const { error } = await supabase
      .from('land_data')
      .insert([{ ...payload, user_id: user.id }]);
    if (!error) {
      setShowForm(false);
      fetchLands();
    }
  };

  const updateLand = async (id, payload) => {
    const { error } = await supabase
      .from('land_data')
      .update(payload)
      .eq('id', id);
    if (!error) {
      setEditing(null);
      fetchLands();
    }
  };

  const deleteLand = async (id) => {
    const { error } = await supabase
      .from('land_data')
      .delete()
      .eq('id', id);
    if (!error) fetchLands();
  };

  return (
    <div className="space-y-4">
      <div className="h-[60vh] rounded overflow-hidden border">
        <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {lands.map((l) => (
            <Marker key={l.id} position={[l.latitude, l.longitude]} icon={new L.Icon.Default()}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-sm text-gray-600">{l.latitude}, {l.longitude}</div>
                  <div className="text-sm">Soil: {l.soil_health || 'n/a'}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-blue-600" onClick={() => setEditing(l)}>Edit</button>
                    <button className="text-red-600" onClick={() => deleteLand(l.id)}>Delete</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <button onClick={() => setShowForm(true)} className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full px-5 py-3 shadow">
        + Add Land
      </button>

      {(showForm || editing) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded p-4 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">{editing ? 'Edit Land' : 'Add Land'}</h2>
            <LandForm
              initial={editing}
              onSubmit={(payload) => editing ? updateLand(editing.id, payload) : addLand(payload)}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
