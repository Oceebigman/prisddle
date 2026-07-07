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
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 p-4">
        <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Room Control</h1>

        {started ? (
          <div className="bg-green-900 border border-green-600 rounded-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">✓ Game Started!</h2>
            <p className="text-green-200 mb-6">Players are now solving riddles</p>
            <button
              onClick={handleEnd}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 px-6 py-3 rounded-lg transition font-bold"
            >
              {loading ? 'Ending...' : 'End Game'}
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-6">Ready to Start?</h2>
            <p className="text-slate-400 mb-8">Players can join before you start the game</p>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-8 py-3 rounded-lg transition font-bold text-lg"
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Game Info</h3>
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
