'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LeaderboardEntry {
  username: string;
  score: number;
  accuracy: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const code = params.code as string;
  
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

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white">Loading results...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Results</h1>
        <div className="space-y-3 mb-8">
          {entries.map((entry, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-4 flex justify-between">
              <div><p className="text-white font-bold">{index + 1}. {entry.username}</p><p className="text-slate-400 text-sm">{entry.accuracy}% accuracy</p></div>
              <p className="text-2xl font-bold text-blue-400">{entry.score}</p>
            </div>
          ))}
        </div>
        <Link href="/" className="w-full block text-center bg-blue-600 text-white font-bold py-3 rounded-lg">Back to Home</Link>
      </div>
    </div>
  );
}
