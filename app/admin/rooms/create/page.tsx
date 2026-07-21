'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '../../admin-context';
import AdminHeader from '../../AdminHeader';

export default function CreateRoomPage() {
  const router = useRouter();
  const { isAdmin, adminKey } = useAdmin();
  const [roomName, setRoomName] = useState('');
  const [duration, setDuration] = useState('120');
  const [questionCount, setQuestionCount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ id: string; room_code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const puzzleId = '7b86a0c6-3261-4d41-80fb-04d16d29393d';

      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey!,
        },
        body: JSON.stringify({
          room_name: roomName,
          puzzle_id: puzzleId,
          duration_seconds: parseInt(duration),
          question_count: parseInt(questionCount),
        }),
      });

      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      setCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (created) {
      await navigator.clipboard.writeText(created.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen">
      <AdminHeader />

      <main className="max-w-md mx-auto px-6 py-10 flex flex-col gap-6">
        {created ? (
          <div className="bg-green-200/50 border border-green-700/40 rounded-xl text-center p-8 space-y-4">
            <h1 className="text-2xl font-bold text-[#202020]">✓ Room Created!</h1>
            <button
              onClick={copyCode}
              className="inline-block px-4 py-2 surface-accent text-[#202020] font-mono font-bold rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : created.room_code}
            </button>
            <p className="text-sm text-[#202020]/75">Share this code with players</p>
            <Link href={`/admin/rooms/${created.id}`}>
              <button className="inline-block mt-2 px-6 py-2 bg-[#202020]/10 hover:bg-[#202020]/20 text-[#202020] font-medium rounded-lg transition-colors">
                Go to Room Control
              </button>
            </Link>
          </div>
        ) : (
          <>
            <Link href="/admin/dashboard" className="text-[#202020]/70 hover:text-[#202020] text-sm font-medium">
              ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-[#202020] text-center mb-2">Create New Room</h1>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202020]/75 mb-1.5">Room Name</label>
                <input
                  type="text"
                  placeholder="Room Name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/60 border border-[#202020]/25 rounded-lg text-[#202020] focus:ring-2 focus:ring-[#202020]/30 focus:border-[#202020] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#202020]/75 mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/60 border border-[#202020]/25 rounded-lg text-[#202020] focus:ring-2 focus:ring-[#202020]/30 focus:border-[#202020] outline-none transition"
                >
                  <option value="120">2 minutes (default)</option>
                  <option value="180">3 minutes</option>
                  <option value="300">5 minutes</option>
                  <option value="480">8 minutes</option>
                  <option value="600">10 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#202020]/75 mb-1.5">Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white/60 border border-[#202020]/25 rounded-lg outline-none transition"
                >
                  <option value="5">5 questions</option>
                  <option value="10">10 questions (default)</option>
                  <option value="15">15 questions</option>
                  <option value="20">20 questions</option>
                </select>
              </div>

              {error && <p className="text-red-700 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 surface-accent text-[#202020] font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
