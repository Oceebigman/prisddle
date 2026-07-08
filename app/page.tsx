'use client';

import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4 font-black">🎮</div>
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PRISDDLE
          </h1>
          <p className="text-lg text-slate-300">
            Solve riddles. Compete live. Win glory.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-3 mb-8">
          <div className="card">
            <p className="text-sm text-slate-400">🧩</p>
            <p className="font-bold text-white">Challenge Riddles</p>
            <p className="text-sm text-slate-400 mt-1">Test your mind against mysterious riddles</p>
          </div>
          
          <div className="card">
            <p className="text-sm text-slate-400">⚡</p>
            <p className="font-bold text-white">Real-Time Battles</p>
            <p className="text-sm text-slate-400 mt-1">Compete with others in live matches</p>
          </div>
          
          <div className="card">
            <p className="text-sm text-slate-400">🏆</p>
            <p className="font-bold text-white">Climb Rankings</p>
            <p className="text-sm text-slate-400 mt-1">Earn your place on the leaderboard</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-8">
          <Link href="/join" className="block">
            <button className="w-full btn-primary">
              🎮 Join Game
            </button>
          </Link>
          
          <Link href="/admin/login" className="block">
            <button className="w-full btn-secondary">
              ⚙️ Admin Panel
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400">
          <p>Play solo or challenge friends</p>
        </div>
      </div>
    </div>
  );
}
