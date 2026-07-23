'use client';
import Link from 'next/link';
import { useState } from 'react';

const TEAM = [
  { name: 'Ebuka', role: 'Founder & Product Lead', handle: 'heis_Ebuka_' },
  { name: 'EGCrypt', role: 'Co-Founder & Lead Developer', handle: 'EGCrypt_' },
];

export default function Landing() {
  const [teamOpen, setTeamOpen] = useState(false);
  const navBtn = "bg-transparent border border-[#202020]/20 hover:border-[#202020]/50 text-[#202020] font-semibold px-5 py-2 rounded-lg text-sm transition-colors";
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-end items-center gap-2 px-6 py-5 relative">
        <button onClick={() => setTeamOpen(!teamOpen)} className={navBtn}>Team</button>
        <Link href="/admin/login"><button className={navBtn}>Admin Panel</button></Link>
        {teamOpen && (
          <div className="absolute top-16 right-6 z-10 card-game rise-in p-5 w-72 flex flex-col gap-4">
            {TEAM.map((m) => (
              <a key={m.handle} href={"https://x.com/" + m.handle} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <img src={"https://unavatar.io/x/" + m.handle} alt={m.name} className="h-12 w-12 rounded-full border border-[#202020]/15 object-cover" />
                <div className="text-left">
                  <p className="font-bold text-[#202020] group-hover:underline">{m.name}</p>
                  <p className="text-xs text-[#202020]/60">{m.role}</p>
                  <p className="text-xs text-[#202020]/40">@{m.handle}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center rise-in">
          <img src="/icon.svg" alt="Prisddle logo" className="mx-auto mb-8 h-16 w-16 rounded-2xl shadow-lg" />
          <h1 className="font-brand-serif text-6xl font-bold text-[#202020] tracking-tight">Prisddle</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full surface-accent" />
          <div className="mt-10">
            <Link href="/join" className="block">
              <button className="w-full surface-accent font-bold py-4 rounded-xl text-lg">Join a Game</button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="pb-8 text-center">
        <p className="text-[#202020]/40 text-sm tracking-wide">
          Built on <span className="font-semibold text-[#202020]/60">PrismaX</span>
        </p>
      </footer>
    </div>
  );
}
