'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JoinPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_code: roomCode.toUpperCase(),
          username,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to join');
      }

      const data = await res.json();
      localStorage.setItem('session_token', data.session_token);
      localStorage.setItem('player_id', data.player_id);
      
      router.push(`/lobby/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Join failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md">
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-bold mb-8 inline-flex items-center gap-2">
          ← Back
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-2">Join Game</h1>
          <p className="text-slate-400">Enter the game code to join</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Game Code</label>
            <input
              type="text"
              placeholder="e.g., ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              disabled={loading}
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Username</label>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

          <button type="submit" disabled={loading || !roomCode || !username} className="w-full btn-primary">
            {loading ? '⏳ Joining...' : '🎮 Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
