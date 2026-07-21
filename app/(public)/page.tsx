'use client';

import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Riddle Room</h1>
        <p className="text-slate-300 mb-8">Solve riddles in real-time. Compete with others.</p>
        
        <Link
          href="/join"
          className="inline-block w-full surface-accent text-white font-bold py-3 px-4 rounded-lg transition"
        >
          Join a Game
        </Link>
      </div>
    </div>
  );
}
