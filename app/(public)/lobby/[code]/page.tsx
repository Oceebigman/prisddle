'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';

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
    }, 3000);

    return () => clearInterval(pollStatus);
  }, [code, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{status?.room_name}</h1>
        <p className="text-slate-400 mb-8">Code: <span className="font-mono font-bold text-blue-400">{code}</span></p>
        <div className="bg-slate-800 rounded-lg p-8 mb-8">
          <p className="text-slate-300 mb-4">Players joined</p>
          <p className="text-4xl font-bold text-white">{status?.player_count}</p>
        </div>
        {status?.starts_at && (
          <Countdown startsAt={status.starts_at} endsAt={status.ends_at} onFinish={() => router.push(`/play/${code}`)} />
        )}
        <p className="text-slate-400 mt-8 text-sm">Waiting for host to start...</p>
      </div>
    </div>
  );
}
