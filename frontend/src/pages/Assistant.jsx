import React, { useState } from 'react';
import axios from 'axios';
import { useSubscription } from '../context/SubscriptionContext.jsx';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Assistant() {
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! Ask me about soil health.' }]);
  const [input, setInput] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const inputRef = React.useRef(null);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, html: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    const { data } = await axios.post(`${API}/api/ai/chat`, { message: userMsg.text });
    setMessages((m) => [...m, { role: 'ai', text: data?.reply || '...', html: data?.reply || '...' }]);
  };

  const insertFormatting = (format) => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = input.substring(start, end);
    
    let formattedText = '';
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        formattedText = `### ${selectedText || 'Heading'}`;
        break;
      case 'bullet':
        formattedText = `\n• ${selectedText || 'List item'}`;
        break;
      case 'number':
        formattedText = `\n1. ${selectedText || 'Numbered item'}`;
        break;
    }

    const newText = input.substring(0, start) + formattedText + input.substring(end);
    setInput(newText);
    
    // Refocus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + formattedText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const renderFormattedText = (text) => {
    if (!text) return '';
    
    // Convert markdown-style formatting to HTML
    let formatted = text
      // Bold: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/__(.+?)__/g, '<strong class="font-bold text-gray-900">$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
      // Headings: ### text
      .replace(/###\s(.+?)(\n|$)/g, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
      .replace(/##\s(.+?)(\n|$)/g, '<h2 class="text-xl font-bold mt-2 mb-1">$1</h2>')
      .replace(/#\s(.+?)(\n|$)/g, '<h1 class="text-2xl font-bold mt-2 mb-1">$1</h1>');
    
    return formatted;
  };

  // Restrict to Pro users only
  if (!isPro()) {
    return (
      <div className="max-w-4xl animate-fadeIn">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 text-center border-2 border-purple-200">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🔒 AI Assistant - Pro Feature</h2>
          <p className="text-gray-600 mb-6">
            The AI Assistant is a premium feature available exclusively to Pro members. 
            Upgrade to Pro to get instant answers about soil health, farming techniques, and crop management.
          </p>
          <div className="bg-white rounded-lg p-4 text-left mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Pro Features Include:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">AI Assistant</span> - Get instant farming advice
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Land Management with images & documents
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Download insights as PDF
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ESRI Satellite Map View
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Crop yield tracking
              </li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/dashboard/payments')}
            className="gradient-green text-white px-8 py-3 rounded-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Upgrade to Pro - KES 1
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="mb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-green rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">AI Farming Assistant</h2>
            <p className="text-gray-600">Get expert advice on soil health, crop management, and sustainable farming practices</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-100">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  m.role === 'ai' ? 'bg-gradient-green' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {m.role === 'ai' ? (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-2xl px-5 py-4 shadow-lg ${
                  m.role === 'ai' 
                    ? 'bg-white border-2 border-green-100 text-gray-800' 
                    : 'gradient-green text-white'
                }`}>
                  <div className={`text-sm font-semibold mb-2 ${m.role === 'ai' ? 'text-green-700' : 'text-green-100'}`}>
                    {m.role === 'ai' ? '🌱 AI Assistant' : 'You'}
                  </div>
                  <div 
                    className="leading-relaxed text-base"
                    dangerouslySetInnerHTML={{ 
                      __html: renderFormattedText(m.text || m.html || '').split('\n').map((line, i) => {
                        if (line.startsWith('•') || line.startsWith('-')) {
                          return `<p class="${i > 0 ? 'mt-3' : ''}"><span class="flex gap-2"><span class="${m.role === 'ai' ? 'text-green-600' : 'text-green-200'}">•</span><span>${line.replace(/^[•-]\s*/, '')}</span></span></p>`;
                        } else if (line.match(/^\d+\./)) {
                          return `<p class="${i > 0 ? 'mt-3' : ''}"><span class="flex gap-2"><span class="font-semibold ${m.role === 'ai' ? 'text-green-600' : 'text-green-200'}">${line.match(/^\d+\./)[0]}</span><span>${line.replace(/^\d+\.\s*/, '')}</span></span></p>`;
                        } else {
                          return `<p class="${i > 0 ? 'mt-3' : ''}">${line}</p>`;
                        }
                      }).join('')
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t bg-gray-50 p-4">
          {/* Formatting Toolbar Toggle */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setShowToolbar(!showToolbar)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-all"
            >
              <svg className={`w-4 h-4 transition-transform ${showToolbar ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="font-medium">{showToolbar ? 'Hide' : 'Show'} Formatting Toolbar</span>
            </button>
          </div>

          {/* Formatting Toolbar */}
          {showToolbar && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 animate-fadeIn">
              <span className="text-xs font-semibold text-gray-500 mr-2">Format:</span>
            <button
              type="button"
              onClick={() => insertFormatting('bold')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all group relative"
              title="Bold (Ctrl+B)"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Bold
              </span>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('italic')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all group relative"
              title="Italic (Ctrl+I)"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="19" y1="4" x2="10" y2="4" strokeWidth={2}/>
                <line x1="14" y1="20" x2="5" y2="20" strokeWidth={2}/>
                <line x1="15" y1="4" x2="9" y2="20" strokeWidth={2}/>
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Italic
              </span>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('heading')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all group relative"
              title="Heading"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Heading
              </span>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => insertFormatting('bullet')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all group relative"
              title="Bullet List"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="4" cy="6" r="1" fill="currentColor"/>
                <circle cx="4" cy="12" r="1" fill="currentColor"/>
                <circle cx="4" cy="18" r="1" fill="currentColor"/>
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Bullet List
              </span>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('number')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all group relative"
              title="Numbered List"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13" />
                <text x="2" y="8" fontSize="8" fill="currentColor">1</text>
                <text x="2" y="14" fontSize="8" fill="currentColor">2</text>
                <text x="2" y="20" fontSize="8" fill="currentColor">3</text>
              </svg>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Numbered List
              </span>
            </button>
            </div>
          )}

          <form onSubmit={send} className="flex gap-3">
            <textarea
              ref={inputRef}
              className="flex-1 border-2 border-gray-200 rounded-xl px-6 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none" 
              value={input} 
              onChange={(e)=>setInput(e.target.value)} 
              placeholder="Type your question here... Use the toolbar above to format text."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(e);
                }
              }}
            />
            <button 
              type="submit"
              className="gradient-green text-white rounded-xl px-8 py-3 font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 self-end"
            >
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
