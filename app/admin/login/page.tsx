'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../admin-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify password by attempting an admin API call
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': password,
        },
        body: JSON.stringify({
          room_name: 'test',
          puzzle_id: 'test',
          duration_seconds: 60,
        }),
      });

      if (res.status === 401) {
        throw new Error('Invalid admin key');
      }

      // If we get here, key is valid
      login(password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Admin Login</h1>
        
        <input
          type="password"
          placeholder="Admin Key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
