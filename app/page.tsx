'use client';

import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Prisddle</h1>
        <p className="text-slate-300 mb-8">Solve riddles in real-time. Compete with others.</p>

        <Link href="/join">
          <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition">
            Join a Game
          </button>
        </Link>

        <p className="text-slate-500 text-sm mt-6">Have a game code? Ask your host.</p>
      </div>
    </div>
  );
}
