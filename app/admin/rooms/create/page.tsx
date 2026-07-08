'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../../admin-context';

export default function CreateRoomPage() {
  const router = useRouter();
  const { isAdmin, adminKey } = useAdmin();
  const [roomName, setRoomName] = useState('');
  const [duration, setDuration] = useState('1200');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ id: string; room_code: string } | null>(null);

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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <nav className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 font-bold">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-md mx-auto p-6 mt-8">
        {created ? (
          <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">✓ Room Created!</h2>
            <p className="mb-4">
              Game Code: <span className="font-mono font-bold text-green-300 text-xl">{created.room_code}</span>
            </p>
            <p className="text-sm text-slate-300 mb-6">Share this code with players to join</p>
            <Link href={`/admin/rooms/${created.id}`}>
              <button className="inline-block mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition">
                Go to Room Control
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Create New Room</h1>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Room Name</label>
              <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={loading}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={loading}
                className="w-full"
              >
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
                <option value="1200">20 minutes (default)</option>
                <option value="1800">30 minutes</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
