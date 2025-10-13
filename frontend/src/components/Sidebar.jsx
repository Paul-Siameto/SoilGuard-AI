import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext.jsx';

export default function Sidebar({ onLogout }) {
  const { isPro } = useSubscription();
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-gradient-green text-white shadow-md transform scale-[1.02]' 
        : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:translate-x-1'
    }`;

  return (
    <aside className="w-64 bg-white border-r hidden md:flex md:flex-col animate-slideIn shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-green-600">
            <svg className="w-8 h-8 text-green-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v5.43c0 4.54-3.13 8.79-7 9.86-3.87-1.07-7-5.32-7-9.86V8.07l7-3.89zM12 7c-1.66 0-3 1.34-3 3v1c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1c0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1v1h-2v-1c0-.55.45-1 1-1z"/>
              <path d="M12 13c-1.1 0-2 .9-2 2v3h4v-3c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-xl text-green-800">SoilGuard-AI</div>
            <div className="text-xs text-green-600 font-medium">Smart Farming Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard/map" className={linkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="font-medium">Map</span>
        </NavLink>
        
        <NavLink to="/dashboard/insights" className={linkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">Insights</span>
        </NavLink>
        
        <NavLink to="/dashboard/assistant" className={linkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="font-medium">Assistant</span>
        </NavLink>

        {/* Pro Feature: Land Management */}
        {isPro() && (
          <NavLink to="/dashboard/land-management" className={linkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-medium flex items-center gap-2">
              Land Management
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full font-bold">PRO</span>
            </span>
          </NavLink>
        )}
        
        <NavLink to="/dashboard/payments" className={linkClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="font-medium">Payments</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
