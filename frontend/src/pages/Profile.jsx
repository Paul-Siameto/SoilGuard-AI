import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || '');
        setEmail(data.email || user.email || '');
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
      setEmail(user.email || '');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username, email })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error('Error updating profile:', e);
      setError(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-semibold">
            {username?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium">{username || 'No username set'}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2 bg-gray-50"
              placeholder="Enter your email"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Contact support to update.</p>
          </div>

          {message && (
            <div className="p-3 bg-green-50 text-green-700 rounded text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Account Info */}
        <div className="pt-6 border-t">
          <h3 className="font-medium mb-3">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Created:</span>
              <span>{new Date(user?.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
