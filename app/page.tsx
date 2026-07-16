'use client';
import Link from 'next/link';
export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center rise-in">
        <h1 className="text-6xl font-extrabold text-white tracking-tight mb-3">
          Prisddle
        </h1>
        <div className="mx-auto mb-10 h-1 w-16 rounded-full surface-accent" />
        <Link href="/join">
          <button className="surface-accent text-white font-bold px-10 py-4 rounded-xl text-lg">
            Join a Game
          </button>
        </Link>
      </div>
    </div>
  );
}
