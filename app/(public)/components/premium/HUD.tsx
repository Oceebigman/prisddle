'use client';

export interface HUDProps {
  level?: number;
  xp?: number;
  maxXp?: number;
  streak?: number;
  onSettings?: () => void;
}

export default function PremiumHUD({ level = 1, xp = 450, maxXp = 1000, streak = 5, onSettings }: HUDProps) {
  return (
    <div className="w-full bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm border-b border-purple-500/20 px-4 py-3">
      <div className="max-w-550 mx-auto flex items-center justify-between gap-4">
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <div className="premium-card px-3 py-2 flex items-center gap-2">
            <span className="text-sm font-bold text-amber-300">⭐</span>
            <span className="text-lg font-bold text-white">Lvl {level}</span>
          </div>
        </div>

        {/* Streak Counter */}
        {streak > 0 && (
          <div className="premium-card px-3 py-2 flex items-center gap-1">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-orange-400">{streak}</span>
          </div>
        )}

        {/* Settings */}
        <button
          onClick={onSettings}
          className="ml-auto premium-card px-3 py-2 hover:shadow-lg transition"
        >
          <span className="text-xl">⚙️</span>
        </button>
      </div>

      {/* XP Bar */}
      {maxXp && (
        <div className="max-w-550 mx-auto mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>XP</span>
            <span>{xp}/{maxXp}</span>
          </div>
          <div className="premium-progress">
            <div
              className="premium-progress-fill"
              style={{ width: `${(xp / maxXp) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
