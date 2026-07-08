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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <p className="text-slate-400">Loading room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Back Link - Inside Container */}
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          ← Back
        </Link>

        {/* Room Info Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-white">{status?.room_name}</h1>
          <p className="text-slate-400 mt-2">
            Code: <span className="font-mono text-blue-400">{code}</span>
          </p>
        </div>

        {/* Players Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <p className="text-slate-400">Players Joined</p>
          <p className="text-5xl font-bold text-white mt-2">{status?.player_count}</p>
        </div>

        {/* Countdown */}
        {status?.starts_at && (
          <Countdown startsAt={status.starts_at} endsAt={status.ends_at} onFinish={() => router.push(`/play/${code}`)} />
        )}

        {/* Waiting Text */}
        <p className="text-center text-slate-400 text-sm animate-pulse">
          Waiting for host to start...
        </p>
      </div>
    </div>
  );
}
