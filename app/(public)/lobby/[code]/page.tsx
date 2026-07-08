'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';
import Link from 'next/link';

interface RoomStatus {
  status: string;
  room_name: string;
  player_count: number;
  starts_at: string;
  ends_at: string;
}

export default function LobbyPage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jitter = Math.random() * 2000;
    const pollStatus = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${code}/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          setLoading(false);
          if (data.status === 'live' || data.status === 'scheduled') {
            router.push(`/play/${code}`);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000 + jitter);

    return () => clearInterval(pollStatus);
  }, [code, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="container max-w-md text-center">
          <p className="text-lg text-slate-300">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md">
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-bold mb-8 inline-flex items-center gap-2">
          ← Back
        </Link>

        <div className="card text-center mb-6">
          <h1 className="text-2xl font-black mb-2">{status?.room_name}</h1>
          <p className="text-slate-400">Game Code: <span className="font-mono font-bold text-blue-400">{code}</span></p>
        </div>

        <div className="card text-center mb-6">
          <p className="text-sm text-slate-400 mb-2">Players Joined</p>
          <p className="text-4xl font-black text-blue-400">{status?.player_count}</p>
        </div>

        {status?.starts_at && (
          <div className="mb-6">
            <Countdown startsAt={status.starts_at} endsAt={status.ends_at} onFinish={() => router.push(`/play/${code}`)} />
          </div>
        )}

        <p className="text-center text-slate-400 text-sm">Waiting for the game to start...</p>
      </div>
    </div>
  );
}
