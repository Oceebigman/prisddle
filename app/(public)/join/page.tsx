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
        throw new Error('Failed to join');
      }

      const data = await res.json();
      localStorage.setItem('session_token', data.session_token);
      router.push(`/lobby/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError('Invalid room code or username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-bold mb-8">← Back</Link>

        <h1 className="text-3xl font-bold text-white mb-4 text-center">Join Game</h1>

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
              className="w-full"
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
              className="w-full"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50">
            {loading ? 'Joining...' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
