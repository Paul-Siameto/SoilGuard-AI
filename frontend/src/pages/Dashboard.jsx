import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import MapPage from './MapPage.jsx';
import Insights from './Insights.jsx';
import Assistant from './Assistant.jsx';
import Payments from './Payments.jsx';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="map" replace />} />
            <Route path="map" element={<MapPage />} />
            <Route path="insights" element={<Insights />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="payments" element={<Payments />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
