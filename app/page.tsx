'use client';

import Link from 'next/link';
import PremiumTitle from './(public)/components/premium/Title';
import PremiumButton from './(public)/components/premium/Button';
import PremiumCard from './(public)/components/premium/Card';

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="game-container flex flex-col items-center gap-8 animate-[slide-up_0.8s_ease-out]">
          {/* Title Section */}
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="text-6xl md:text-7xl font-black mb-4 animate-[pulse-glow_2s_ease-in-out_infinite]">
                🎮
              </div>
            </div>
            <PremiumTitle size="2xl">
              PRISDDLE
            </PremiumTitle>
            <p className="text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text max-w-md mx-auto">
              Challenge Your Mind. Climb the Leaderboard. Become a Legend.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <PremiumCard>
              <div className="text-center space-y-2">
                <div className="text-4xl">🧩</div>
                <h3 className="font-bold text-lg text-white">Riddles</h3>
                <p className="text-sm text-slate-300">Solve mysterious riddles</p>
              </div>
            </PremiumCard>

            <PremiumCard>
              <div className="text-center space-y-2">
                <div className="text-4xl">⚡</div>
                <h3 className="font-bold text-lg text-white">Real-Time</h3>
                <p className="text-sm text-slate-300">Compete live with others</p>
              </div>
            </PremiumCard>

            <PremiumCard>
              <div className="text-center space-y-2">
                <div className="text-4xl">🏆</div>
                <h3 className="font-bold text-lg text-white">Rewards</h3>
                <p className="text-sm text-slate-300">Earn prestige & rank</p>
              </div>
            </PremiumCard>
          </div>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col md:flex-row gap-4 justify-center mt-8 md:mt-12">
            <Link href="/join" className="w-full md:w-auto">
              <PremiumButton variant="primary" size="lg" fullWidth className="hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]">
                🎮 JOIN GAME
              </PremiumButton>
            </Link>
            <Link href="/admin/login" className="w-full md:w-auto">
              <PremiumButton variant="secondary" size="lg" fullWidth>
                ⚙️ ADMIN PANEL
              </PremiumButton>
            </Link>
          </div>

          {/* Footer info */}
          <div className="mt-12 pt-8 border-t border-purple-500/20 text-center text-slate-400 text-sm max-w-md">
            <p>Play solo or challenge friends. Compete for glory. Master the riddles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
