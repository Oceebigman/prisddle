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
  const [created, setCreated] = useState<{ id: string; code: string } | null>(null);

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
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 p-4">
        <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-md mx-auto p-8 mt-8">
        {created ? (
          <div className="bg-green-900 border border-green-600 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">✓ Room Created!</h2>
            <p className="mb-4">Game Code: <span className="font-mono font-bold text-green-300">{created.code}</span></p>
            <p className="text-sm text-slate-300 mb-6">Share this code with players to join</p>
            <Link
              href={`/admin/rooms/${created.id}`}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition inline-block"
            >
              Go to Room Control
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <h1 className="text-3xl font-bold text-center mb-8">Create New Room</h1>

            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="1200">20 minutes (default)</option>
              <option value="1800">30 minutes</option>
            </select>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
