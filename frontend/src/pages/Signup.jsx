import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Sign up with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (error) return setError(error.message);
    
    const user = data.user;
    const session = data.session;
    
    // Check if email confirmation is required
    if (user && !session) {
      // Email confirmation is enabled - show success message
      // Note: Profile is automatically created by database trigger
      setSuccess('✅ Account created! Please check your email to confirm your account before logging in.');
      // Clear form
      setFullName('');
      setEmail('');
      setPassword('');
    } else if (user && session) {
      // Auto-login enabled (no email confirmation)
      // Note: Profile is automatically created by database trigger
      // Just redirect to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn hover-lift">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-green bg-clip-text text-transparent">Join SoilGuard-AI</h1>
        <p className="text-gray-500 text-center mb-6">Create your account to get started</p>
        
        {error && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-200 animate-fadeIn">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-700 text-sm mb-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-fadeIn">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">Account Created Successfully!</p>
                <p className="text-sm">{success}</p>
                <p className="text-sm mt-2">
                  After confirming, <Link to="/login" className="text-green-600 font-semibold hover:underline">click here to login</Link>.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
              placeholder="Full Name" 
              value={fullName} 
              onChange={(e)=>setFullName(e.target.value)}
              required
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="relative">
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
              placeholder="Email" 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          
          <div className="relative">
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <button className="w-full gradient-green text-white rounded-lg p-3 font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all">
            Create Account
          </button>
        </form>
        
        <div className="text-sm mt-6 text-center text-gray-600">
          Have an account? <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
