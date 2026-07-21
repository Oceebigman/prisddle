'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-browser';
interface RoomStatus {
  status: string;
  room_name: string;
  player_count: number;
  starts_at: string;
  ends_at: string;
}
export default function LobbyPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  const router = useRouter();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/rooms/${code}/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          setLoading(false);
          if (data.status === 'live' || data.status === 'scheduled' || data.status === 'finished') {
            router.push(data.status === 'finished' ? `/leaderboard/${code}` : `/play/${code}`);
          }
        }
      } catch (error) {
        console.error('Status error:', error);
      }
    };
    fetchStatus();
    const poll = setInterval(fetchStatus, 15000);
    const playerId = localStorage.getItem('player_id') || `anon-${Math.random().toString(36).slice(2, 8)}`;
    const username = localStorage.getItem('username') || 'Player';
    const channel = supabaseBrowser
      .channel(`room:${code}`, { config: { presence: { key: playerId } } })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `room_code=eq.${code}` },
        (payload) => {
          const s = (payload.new as { status?: string })?.status;
          if (s === 'live' || s === 'scheduled') router.push(`/play/${code}`);
        })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const names = Object.values(state).flat().map((p) => (p as { username?: string }).username || 'Player');
        setPlayers(names);
      })
      .subscribe(async (s) => {
        if (s === 'SUBSCRIBED') await channel.track({ username });
      });
    return () => {
      clearInterval(poll);
      supabaseBrowser.removeChannel(channel);
    };
  }, [code, router]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-400">Loading room...</p>
      </div>
    );
  }
  const count = players.length > 0 ? players.length : status?.player_count ?? 0;
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto w-full flex flex-col gap-6">
        <Link href="/" className="text-[#DFD8D0]/80 hover:text-[#DFD8D0] text-sm font-medium">
          ← Back
        </Link>
        <div className="card-game rise-in p-8 text-center">
          <h1 className="text-4xl font-bold text-white">{status?.room_name}</h1>
          <p className="text-slate-400 mt-2">
            Code: <span className="font-mono text-[#DFD8D0]">{code}</span>
          </p>
        </div>
        <div className="card-game rise-in p-8 text-center">
          <p className="text-slate-400">Players Joined</p>
          <p className="text-5xl font-bold text-white mt-2">{count}</p>
          {players.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {players.map((name, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-slate-900/50 border border-[#DFD8D0]/30 text-slate-200 text-sm">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
        {status?.starts_at && (
          <Countdown startsAt={status.starts_at} endsAt={status.ends_at} onFinish={() => router.push(`/play/${code}`)} />
        )}
        <p className="text-center text-slate-400 text-sm animate-pulse">
          Waiting for host to start...
        </p>
      </div>
    </div>
  );
}
