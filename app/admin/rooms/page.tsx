'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '../admin-context';
import AdminHeader from '../AdminHeader';
interface RoomRow {
  id: string;
  room_name: string;
  room_code: string;
  status: string;
  created_at: string;
  player_count: number;
  winner: { username: string; score: number } | null;
}
const statusStyle: Record<string, string> = {
  waiting: 'bg-yellow-200/60 text-yellow-900 border-yellow-700/40',
  scheduled: 'bg-green-200/60 text-green-900 border-green-700/40',
  live: 'bg-green-200/60 text-green-900 border-green-700/40',
  finished: 'bg-[#202020]/10 text-[#202020]/80 border-[#202020]/25',
};
export default function RoomsListPage() {
  const { adminKey } = useAdmin();
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/rooms', {
          headers: { 'x-admin-key': adminKey! },
        });
        if (!res.ok) throw new Error('Failed to load rooms');
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Load failed');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [adminKey]);
  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
        <Link href="/admin/dashboard" className="text-[#202020]/70 hover:text-[#202020] text-sm font-medium">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-[#202020]">Rooms</h1>
        {loading && <p className="text-[#202020]/60">Loading rooms...</p>}
        {error && <p className="text-red-700">{error}</p>}
        {!loading && !error && rooms.length === 0 && (
          <p className="text-[#202020]/60">No rooms yet. Create one to get started.</p>
        )}
        <div className="flex flex-col gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="card-game p-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="font-bold text-[#202020]">{room.room_name}</p>
                <p className="text-sm text-[#202020]/60 mt-1">
                  Code: <span className="font-mono text-[#202020]">{room.room_code}</span>
                  {' · '}{room.player_count} player{room.player_count === 1 ? '' : 's'}
                </p>
                {room.winner && (
                  <p className="text-sm text-yellow-300 mt-1">
                    🏆 {room.winner.username} — {room.winner.score} pts
                  </p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusStyle[room.status] || 'bg-white/60 text-[#202020]/75 border-[#202020]/25'}`}>
                {room.status}
              </span>
              <div className="flex gap-2">
                <Link href={`/admin/rooms/${room.id}`}>
                  <button className="px-4 py-2 bg-[#202020]/10 hover:bg-[#202020]/20 text-[#202020] text-sm font-semibold rounded-lg transition">
                    Manage
                  </button>
                </Link>
                {room.status === 'finished' && (
                  <Link href={`/leaderboard/${room.room_code}`}>
                    <button className="px-4 py-2 surface-accent text-[#202020] text-sm font-semibold rounded-lg transition">
                      View Results
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
