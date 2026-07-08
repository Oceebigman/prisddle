'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LeaderboardEntry {
  username: string;
  score: number;
  accuracy: number;
  rank?: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const sessionToken = localStorage.getItem('session_token');
      try {
        const res = await fetch(`/api/rooms/${code}/leaderboard?session_token=${sessionToken}`);
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Leaderboard error:', error);
      }
    };
    loadLeaderboard();
  }, [code]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md text-center">
        <p className="text-lg text-slate-300">Loading results...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md">
        <h1 className="text-3xl font-black text-center mb-8">🏆 Leaderboard</h1>

        <div className="space-y-2 mb-8">
          {entries.map((entry, index) => (
            <div key={index} className="card flex justify-between items-center">
              <div>
                <p className="font-bold text-white">#{index + 1} {entry.username}</p>
                <p className="text-sm text-slate-400">{entry.accuracy}% accuracy</p>
              </div>
              <p className="text-2xl font-black text-blue-400">{entry.score}</p>
            </div>
          ))}
        </div>

        <Link href="/" className="block">
          <button className="w-full btn-secondary">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
