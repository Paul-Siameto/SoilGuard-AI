import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useSubscription } from '../context/SubscriptionContext.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Insights() {
  const { isPro } = useSubscription();
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

  const downloadPDF = () => {
    if (!isPro()) {
      alert('🔒 PDF download is a Pro feature! Upgrade to download insights as PDF.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74); // Green color
    doc.text('SoilGuard-AI Insights Report', margin, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 28);

    // Soil Data Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Soil Analysis Data', margin, 40);
    
    doc.setFontSize(11);
    doc.text(`pH Level: ${ph}`, margin, 50);
    doc.text(`Moisture: ${moisture}%`, margin, 57);
    doc.text(`Crop Type: ${crop}`, margin, 64);

    // AI Recommendations Section
    doc.setFontSize(14);
    doc.text('AI Recommendations', margin, 78);

    doc.setFontSize(10);
    const lines = doc.splitTextToSize(result, maxWidth);
    doc.text(lines, margin, 88);

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Powered by SoilGuard-AI', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save
    doc.save(`SoilGuard-Insights-${crop}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="max-w-3xl animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🌱 Soil Insights</h2>
        <p className="text-gray-600">Get AI-powered recommendations for your soil health</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 hover-lift">
        <form onSubmit={generate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
              <div className="relative">
                <input 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                  placeholder="e.g., 6.5" 
                  value={ph} 
                  onChange={(e)=>setPh(e.target.value)}
                  type="number"
                  step="0.1"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">⚗️</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moisture %</label>
              <div className="relative">
                <input 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                  placeholder="e.g., 30" 
                  value={moisture} 
                  onChange={(e)=>setMoisture(e.target.value)}
                  type="number"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">💧</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
            <div className="relative">
              <input 
                className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                placeholder="e.g., Maize, Wheat, Rice" 
                value={crop} 
                onChange={(e)=>setCrop(e.target.value)}
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🌾</span>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full gradient-green text-white rounded-lg p-4 font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Insights...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Insights
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl p-6 animate-fadeIn border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">AI Recommendations</h3>
            </div>
            
            <button
              onClick={downloadPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isPro()
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed relative'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
              {!isPro() && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
