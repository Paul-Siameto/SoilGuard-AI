import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as esri from 'esri-leaflet';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import LandForm from '../components/LandForm.jsx';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = [0.0236, 37.9062]; // Kenya-ish center

// Component to handle ESRI layer switching
function EsriLayerControl({ showSatellite }) {
  const map = useMap();
  const esriLayerRef = useRef(null);

  useEffect(() => {
    if (showSatellite) {
      // Add ESRI World Imagery layer
      esriLayerRef.current = esri.basemapLayer('Imagery').addTo(map);
    } else {
      // Remove ESRI layer if it exists
      if (esriLayerRef.current) {
        map.removeLayer(esriLayerRef.current);
        esriLayerRef.current = null;
      }
    }

    return () => {
      if (esriLayerRef.current) {
        map.removeLayer(esriLayerRef.current);
      }
    };
  }, [showSatellite, map]);

  return null;
}

export default function MapPage() {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [lands, setLands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mapLayer, setMapLayer] = useState('street'); // 'street' or 'satellite'

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
    if (error) {
      console.error('Error adding land:', error);
      alert('Failed to add land: ' + error.message);
    } else {
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
    <div className="space-y-4 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-md hover-lift">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{lands.length}</div>
              <div className="text-sm text-gray-500">Total Lands</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[60vh] rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl hover-lift">
        {/* Layer Switcher Button */}
        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
          <button
            onClick={() => setMapLayer('street')}
            className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all ${
              mapLayer === 'street'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🗺️ Street
          </button>
          <button
            onClick={() => {
              if (!isPro()) {
                alert('🔒 Satellite view is a Pro feature! Upgrade to access ESRI satellite imagery.');
                return;
              }
              setMapLayer('satellite');
            }}
            className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all relative ${
              mapLayer === 'satellite'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛰️ Satellite
            {!isPro() && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                PRO
              </span>
            )}
          </button>
        </div>

        <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
          {/* OpenStreetMap Layer - only show when street mode */}
          {mapLayer === 'street' && (
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          )}
          
          {/* ESRI Satellite Layer Control */}
          <EsriLayerControl showSatellite={mapLayer === 'satellite'} />
          
          {/* Markers - shown on both layers */}
          {lands.filter(l => l.latitude && l.longitude && !isNaN(l.latitude) && !isNaN(l.longitude)).map((l) => (
            <Marker key={l.id} position={[Number(l.latitude), Number(l.longitude)]}>
              <Popup>
                <div className="space-y-2 p-2">
                  <div className="font-bold text-lg text-green-700">{l.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {l.latitude}, {l.longitude}
                  </div>
                  <div className="text-sm bg-green-50 px-2 py-1 rounded">
                    <span className="font-medium">Soil:</span> {l.soil_health || 'n/a'}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button 
                      className="flex-1 bg-blue-500 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-600 transition-all" 
                      onClick={() => setEditing(l)}
                    >
                      Edit
                    </button>
                    <button 
                      className="flex-1 bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600 transition-all" 
                      onClick={() => deleteLand(l.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setShowForm(true)} 
        className="fixed bottom-8 right-8 gradient-green text-white rounded-full px-6 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 font-semibold animate-pulse-slow"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Land
      </button>

      {/* Modal */}
      {(showForm || editing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn relative z-[10000]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editing ? '✏️ Edit Land' : '➕ Add New Land'}
              </h2>
              <button 
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
