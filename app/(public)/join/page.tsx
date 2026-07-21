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
        throw new Error('Invalid room code or username');
      }

      const data = await res.json();
      sessionStorage.setItem('session_token', data.session_token);
      sessionStorage.setItem('username', username);
      router.push(`/lobby/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto w-full">
        <Link href="/" className="text-[#202020]/70 hover:text-[#202020] text-sm font-medium mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[#202020] text-center mb-8">Join Game</h1>

        <form onSubmit={handleJoin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#202020]/75 mb-1.5">Game Code</label>
            <input
              type="text"
              placeholder="e.g., ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              disabled={loading}
              maxLength={6}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              className="w-full px-4 py-3 bg-white/60 border border-[#202020]/25 rounded-lg text-[#202020] focus:ring-2 focus:ring-[#202020]/30 focus:border-[#202020] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#202020]/75 mb-1.5">Username</label>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              spellCheck="false"
              className="w-full px-4 py-3 bg-white/60 border border-[#202020]/25 rounded-lg text-[#202020] focus:ring-2 focus:ring-[#202020]/30 focus:border-[#202020] outline-none transition"
            />
          </div>

          {error && <p className="text-red-700 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading || !roomCode || !username}
            className="w-full py-3 px-4 surface-accent text-[#202020] font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
