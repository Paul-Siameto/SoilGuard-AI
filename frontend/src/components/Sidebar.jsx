import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-green-50 ${isActive ? 'bg-green-100 text-green-800' : ''}`;

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-4 font-bold text-xl">SoilGuard-AI</div>
      <nav className="p-2 space-y-1">
        <NavLink to="/dashboard/map" className={linkClass}>Map</NavLink>
        <NavLink to="/dashboard/insights" className={linkClass}>Insights</NavLink>
        <NavLink to="/dashboard/assistant" className={linkClass}>Assistant</NavLink>
        <NavLink to="/dashboard/payments" className={linkClass}>Payments</NavLink>
        <button onClick={onLogout} className="mt-4 w-full text-left px-4 py-2 rounded bg-red-50 text-red-700">Logout</button>
      </nav>
    </aside>
  );
}
