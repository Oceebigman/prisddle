'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../../admin-context';

export default function RoomControlPage() {
  const params = useParams();
  const id = params.id as string;
  const { adminKey } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/rooms/${id}/start`, {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey!,
        },
      });

      if (!res.ok) throw new Error('Failed to start game');
      setStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Start failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/rooms/${id}/end`, {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey!,
        },
      });

      if (!res.ok) throw new Error('Failed to end game');
      alert('Game ended!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'End failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <nav className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 font-bold">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Room Control</h1>

        {/* Status Card */}
        {started ? (
          <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">✓ Game Started!</h2>
            <p className="text-green-200 mb-6">Players are now solving riddles</p>
            <button
              onClick={handleEnd}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Ending...' : 'End Game'}
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Ready to Start?</h2>
            <p className="text-slate-400 mb-8">Players can join before you start the game</p>

            {error && <p className="text-red-400 mb-4 font-bold">{error}</p>}

            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition text-lg disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
          </div>
        )}

        {/* Game Info Card - Separate Below */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Game Info</h3>
          <p className="text-slate-300">
            Room ID: <span className="font-mono text-blue-400">{id}</span>
          </p>
          <p className="text-slate-400 text-sm mt-4">
            Once you start, players will have 20 minutes to solve 5 riddles
          </p>
        </div>
      </div>
    </div>
  );
}
