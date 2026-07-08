'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../../admin-context';
import AdminHeader from '../../AdminHeader';

export default function CreateRoomPage() {
  const router = useRouter();
  const { isAdmin, adminKey } = useAdmin();
  const [roomName, setRoomName] = useState('');
  const [duration, setDuration] = useState('1200');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ id: string; room_code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const puzzleId = '7b86a0c6-3261-4d41-80fb-04d16d29393d';

      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey!,
        },
        body: JSON.stringify({
          room_name: roomName,
          puzzle_id: puzzleId,
          duration_seconds: parseInt(duration),
        }),
      });

      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      setCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (created) {
      await navigator.clipboard.writeText(created.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <AdminHeader backTo="/admin/dashboard" title="Create Room" />

      <main className="max-w-md mx-auto px-6 py-10">
        {created ? (
          <div className="bg-green-900/20 border border-green-700 rounded-xl text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">✓ Room Created!</h2>
            <button
              onClick={copyCode}
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : created.room_code}
            </button>
            <p className="text-sm text-slate-300">Share this code with players</p>
            <Link href={`/admin/rooms/${created.id}`}>
              <button className="inline-block mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors">
                Go to Room Control
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                ← Back to Dashboard
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-white text-center mb-8">Create New Room</h1>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Room Name</label>
                <input
                  type="text"
                  placeholder="Room Name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="1200">20 minutes (default)</option>
                  <option value="1800">30 minutes</option>
                </select>
              </div>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
