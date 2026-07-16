'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');
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
      localStorage.setItem('username', username);
      
      router.push(`/lobby/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Join failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className="max-w-md w-full space-y-4">
      <h1 className="text-2xl font-bold text-white text-center mb-8">Join Game</h1>
      
      <input
        type="text"
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full surface-accent disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Joining...' : 'Join Game'}
      </button>
    </form>
  );
}
