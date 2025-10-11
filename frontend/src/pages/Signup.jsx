import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Sign up with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });
    
    if (error) return setError(error.message);
    
    const user = data.user;
    const session = data.session;
    
    if (user && session) {
      // Insert profile row (user is now authenticated)
      const { error: profErr } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username, email }]);
      if (profErr) return setError(profErr.message);
      
      navigate('/dashboard');
    } else {
      // Email confirmation required
      setError('Please check your email to confirm your account.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white rounded p-2">Sign up</button>
        </form>
        <div className="text-sm mt-3 text-gray-600">Have an account? <Link to="/login" className="text-green-700">Log in</Link></div>
      </div>
    </div>
  );
}
