'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface LeaderboardEntry {
  username: string;
  score: number;
  correct_count: number;
  total_questions: number;
  time_used_seconds: number;
  rank: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const code = params.code as string;

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      const sessionToken = localStorage.getItem('session_token');
      
      try {
        // Get room status first
        const statusRes = await fetch(`/api/rooms/${code}/status`);
        if (!statusRes.ok) {
          throw new Error('Failed to fetch room status');
        }
        const statusData = await statusRes.json();
        setRoomName(statusData.room_name);

        // Get leaderboard
        const res = await fetch(`/api/rooms/${code}/leaderboard?session_token=${sessionToken}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Leaderboard not found');
          }
          throw new Error('Failed to load leaderboard');
        }

        const data = await res.json();
        
        if (!data || data.length === 0) {
          setEntries([]);
          setLoading(false);
          return;
        }

        // Sort by score descending, then time ascending
        const sorted = data.sort((a: any, b: any) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time_used_seconds - b.time_used_seconds;
        });

        // Add ranks
        const withRanks = sorted.map((entry: any, idx: number) => ({
          ...entry,
          rank: idx + 1,
        }));

        setEntries(withRanks);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <p className="text-slate-400">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/">
            <button className="inline-block px-6 py-2 surface-accent text-white font-semibold rounded-lg transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-slate-400 mb-4">No submissions this round</p>
          <Link href="/">
            <button className="inline-block px-6 py-2 surface-accent text-white font-semibold rounded-lg transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Top 3 podium
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'glow-gold border-yellow-500/60 md:order-2 md:scale-105 md:-translate-y-2';
      case 2:
        return 'border-slate-400/40 md:order-1';
      case 3:
        return 'border-orange-500/40 md:order-3';
      default:
        return '';
    }
  };

  const getPodiumEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{roomName}</h1>
          <h2 className="text-2xl font-bold text-slate-300">Final Results</h2>
        </div>

        {/* Podium - Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {podium.map((entry) => (
            <div
              key={entry.rank}
              className={`card-game rise-in p-6 text-center transition-transform ${getPodiumColor(entry.rank)}`}
            >
              <p className="text-3xl mb-1">{getPodiumEmoji(entry.rank)}</p>
              <div className="flex justify-center mb-3">
                <span className="avatar-circle w-14 h-14 text-xl">{entry.username.charAt(0).toUpperCase()}</span>
              </div>
              <p className="text-xl font-bold text-white">{entry.username}</p>
              <p className="text-sm text-slate-400 mt-2">{entry.correct_count}/{entry.total_questions} correct</p>
              <p className="text-2xl font-bold text-[#DFD8D0] mt-2">{entry.score} pts</p>
              <p className="text-xs text-slate-400 mt-1">{formatTime(entry.time_used_seconds)}</p>
            </div>
          ))}
        </div>

        {/* Remaining Entries - Table */}
        {rest.length > 0 && (
          <div className="space-y-2">
            {rest.map((entry, idx) => (
              <div
                key={entry.rank}
                className="card-game rise-in p-4 flex justify-between items-center gap-3"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <span className="avatar-circle w-10 h-10 text-sm shrink-0">{entry.username.charAt(0).toUpperCase()}</span>
                <div className="flex-1">
                  <p className="font-bold text-white">
                    #{entry.rank} {entry.username}
                  </p>
                  <p className="text-sm text-slate-400">
                    {entry.correct_count}/{entry.total_questions} correct • {formatTime(entry.time_used_seconds)}
                  </p>
                </div>
                <p className="text-2xl font-bold text-[#DFD8D0]">{entry.score}</p>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link href="/">
            <button className="inline-block px-8 py-3 surface-accent text-white font-semibold rounded-xl transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
