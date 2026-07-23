'use client';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center rise-in">

          {/* Logo mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt="Prisddle logo"
            className="mx-auto mb-8 h-16 w-16 rounded-2xl shadow-lg"
          />

          {/* Wordmark */}
          <h1 className="font-brand-serif text-6xl font-bold text-[#202020] tracking-tight">
            Prisddle
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full surface-accent" />

          {/* Pitch */}
          <p className="mt-6 text-[#202020]/60 text-lg leading-relaxed">
            Live trivia battles with friends.
            <br />
            One room code. Five minutes. One winner.
          </p>
          {/* Navigation */}
          <div className="mt-10 flex flex-col gap-3">
            <Link href="/join" className="block">
              <button className="w-full surface-accent font-bold py-4 rounded-xl text-lg">
                Join a Game
              </button>
            </Link>
            <Link href="/admin/login" className="block">
              <button className="w-full bg-transparent border-2 border-[#202020]/20 hover:border-[#202020]/50 text-[#202020] font-semibold py-3.5 rounded-xl transition-colors">
                Admin Panel
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p className="text-[#202020]/40 text-sm tracking-wide">
          Built on <span className="font-semibold text-[#202020]/60">PrismaX</span>
        </p>
      </footer>
    </div>
  );
}
