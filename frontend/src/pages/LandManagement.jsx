import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function LandManagement() {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not Pro
  useEffect(() => {
    if (!isPro()) {
      navigate('/dashboard/payments');
    }
  }, [isPro, navigate]);

  useEffect(() => {
    if (user && isPro()) {
      fetchLands();
    }
  }, [user, isPro]);

  const fetchLands = async () => {
    try {
      const { data, error } = await supabase
        .from('land_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLands(data || []);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPro()) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl animate-fadeIn">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">🌾 Land Management</h2>
            <p className="text-gray-600">Manage your lands, images, documents, and crop tracking</p>
          </div>
          <div className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            ⭐ PRO FEATURE
          </div>
        </div>
      </div>

      {lands.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Lands Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding land data from the Map page</p>
          <button
            onClick={() => navigate('/dashboard/map')}
            className="gradient-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Go to Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Land List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Lands</h3>
            {lands.map((land) => (
              <div
                key={land.id}
                onClick={() => setSelectedLand(land)}
                className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover-lift transition-all ${
                  selectedLand?.id === land.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {land.latitude ? land.latitude.toFixed(4) : 'N/A'}, {land.longitude ? land.longitude.toFixed(4) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(land.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Land Details */}
          <div className="lg:col-span-2">
            {selectedLand ? (
              <LandDetails land={selectedLand} onUpdate={fetchLands} />
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Land</h3>
                <p className="text-gray-600">Choose a land from the list to view and manage its details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LandDetails({ land, onUpdate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('images');
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLandData();
  }, [land.id]);

  const fetchLandData = async () => {
    setLoading(true);
    try {
      // Fetch images
      const { data: imagesData } = await supabase
        .from('land_images')
        .select('*')
        .eq('land_id', land.id)
        .order('uploaded_at', { ascending: false });
      setImages(imagesData || []);

      // Fetch documents
      const { data: docsData } = await supabase
        .from('land_documents')
        .select('*')
        .eq('land_id', land.id)
        .order('uploaded_at', { ascending: false });
      setDocuments(docsData || []);

      // Fetch crops
      const { data: cropsData } = await supabase
        .from('crop_tracking')
        .select('*')
        .eq('land_id', land.id)
        .order('created_at', { ascending: false });
      setCrops(cropsData || []);
    } catch (error) {
      console.error('Error fetching land data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'images', label: 'Images', icon: '🖼️', count: images.length },
    { id: 'documents', label: 'Documents', icon: '📄', count: documents.length },
    { id: 'crops', label: 'Crop Tracking', icon: '🌱', count: crops.length },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
        <h3 className="text-2xl font-bold mb-2">Land Details</h3>
        <p className="text-white/80">
          📍 {land.latitude ? land.latitude.toFixed(6) : 'N/A'}, {land.longitude ? land.longitude.toFixed(6) : 'N/A'}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'images' && <ImagesTab images={images} landId={land.id} onUpdate={fetchLandData} />}
            {activeTab === 'documents' && <DocumentsTab documents={documents} landId={land.id} onUpdate={fetchLandData} />}
            {activeTab === 'crops' && <CropsTab crops={crops} landId={land.id} onUpdate={fetchLandData} />}
          </>
        )}
      </div>
    </div>
  );
}

function ImagesTab({ images, landId, onUpdate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800">Land Images</h4>
        <button className="gradient-green text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          + Upload Image
        </button>
      </div>
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.image_url}
                alt={img.caption || 'Land image'}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              {img.caption && (
                <p className="mt-2 text-sm text-gray-600">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsTab({ documents, landId, onUpdate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800">Documents</h4>
        <button className="gradient-green text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          + Upload Document
        </button>
      </div>
      {documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{doc.document_name}</p>
                <p className="text-sm text-gray-500">
                  {doc.document_type} • {(doc.file_size / 1024).toFixed(2)} KB
                </p>
              </div>
              <a
                href={doc.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CropsTab({ crops, landId, onUpdate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800">Crop Tracking</h4>
        <button className="gradient-green text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          + Add Crop
        </button>
      </div>
      {crops.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No crops tracked yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {crops.map((crop) => (
            <div key={crop.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-lg font-bold text-gray-800">{crop.crop_name}</h5>
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                  {crop.actual_harvest_date ? 'Harvested' : 'Growing'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Planting Date</p>
                  <p className="font-semibold text-gray-800">
                    {crop.planting_date ? new Date(crop.planting_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Expected Harvest</p>
                  <p className="font-semibold text-gray-800">
                    {crop.expected_harvest_date ? new Date(crop.expected_harvest_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                {crop.actual_harvest_date && (
                  <>
                    <div>
                      <p className="text-gray-600">Actual Harvest</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(crop.actual_harvest_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Yield</p>
                      <p className="font-semibold text-gray-800">
                        {crop.yield_amount} {crop.yield_unit}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {crop.notes && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-sm text-gray-600">{crop.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
