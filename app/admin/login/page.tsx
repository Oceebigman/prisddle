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

      login(password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full card-game p-8">
        <h1 className="text-3xl font-bold text-[#202020] text-center mb-6">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#202020]/75 mb-2">Admin Key</label>
            <input
              type="password"
              placeholder="Enter admin key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-white/60 border border-[#202020]/25 rounded-lg text-[#202020] focus:ring-2 focus:ring-[#202020]/30 focus:border-[#202020] outline-none transition"
            />
          </div>

          {error && <p className="text-red-700 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 surface-accent text-[#202020] rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
