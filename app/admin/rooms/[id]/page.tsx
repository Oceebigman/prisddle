'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../../admin-context';
import AdminHeader from '../../AdminHeader';

export default function RoomControlPage() {
  const params = useParams();
  const id = params.id as string;
  const { adminKey } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [roomCode, setRoomCode] = useState('');
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/admin/rooms/${id}/submissions`, {
          headers: { 'x-admin-key': adminKey! },
        });
        if (res.ok) {
          const data = await res.json();
          setPlayerCount(data.length || 0);
        }
      } catch (err) {
        console.error('Failed to fetch room:', err);
      }
    };

    const interval = setInterval(fetchRoom, 3000);
    fetchRoom();
    return () => clearInterval(interval);
  }, [id, adminKey]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/admin/rooms/${id}/info`, {
          headers: { 'x-admin-key': adminKey! },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.room_code) setRoomCode(data.room_code);
        }
      } catch (err) {
        console.error('Failed to fetch room info:', err);
      }
    };
    fetchInfo();
  }, [id, adminKey]);

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/rooms/${id}/start`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey! },
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
        headers: { 'x-admin-key': adminKey! },
      });

      if (!res.ok) throw new Error('Failed to end game');
      setEnded(true);
      setStarted(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'End failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <AdminHeader />

      <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white">Room Control</h1>

        {/* Status Card */}
        {started && !ended ? (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-white">✓ Game Started!</h2>
            <p className="text-green-200">Players are now solving riddles</p>
            <button
              onClick={handleEnd}
              disabled={loading}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Ending...' : 'End Game'}
            </button>
          </div>
        ) : ended ? (
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-white">✓ Game Ended!</h2>
            <p className="text-blue-200">Results are now available</p>
            <Link href={`/leaderboard/${roomCode || id}`}>
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                View Results
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Ready to Start?</h2>
            <p className="text-slate-400">Players can join before you start</p>

            <div className="max-w-xs mx-auto rounded-lg bg-slate-900/50 border border-slate-700 px-8 py-4 my-2">
              <p className="text-slate-400 text-sm mb-1">Players Joined</p>
              <p className="text-3xl font-bold text-blue-400">{playerCount}</p>
            </div>

            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            <button
              onClick={handleStart}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
          </div>
        )}

        {/* Game Info Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Game Info</h3>
          <p className="text-slate-300 text-sm mb-2">
            Room ID: <span className="font-mono text-blue-400 break-all">{id}</span>
          </p>
          <p className="text-slate-400 text-sm">
            {started 
              ? 'Game in progress — players have 20 minutes to solve 5 riddles'
              : 'Once started, players will have 20 minutes to solve 5 riddles'}
          </p>
        </div>
      </main>
    </div>
  );
}
