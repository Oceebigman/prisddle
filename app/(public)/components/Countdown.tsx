'use client';
import { useEffect, useState } from 'react';
interface CountdownProps {
  startsAt: string;
  endsAt: string;
  onFinish: () => void;
}
export default function Countdown({ startsAt, endsAt, onFinish }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState('--:--');
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const endTime = endsAt ? new Date(endsAt).getTime() : NaN;
    if (!endsAt || isNaN(endTime)) {
      setTimeRemaining('--:--');
      return; // no valid end time yet — never finish on bad data
    }
    const tick = () => {
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        setTimeRemaining('00:00');
        setFinished(true);
        onFinish();
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };
    const interval = setInterval(tick, 1000);
    tick();
    return () => clearInterval(interval);
  }, [endsAt, onFinish]);
  return (
    <div className={`text-center mb-6 p-4 rounded-lg ${finished ? 'bg-red-200/70' : 'bg-white/60'}`}>
      <p className="text-[#202020]/60 text-sm mb-2">Time Remaining</p>
      <p className={`text-4xl font-bold font-mono ${finished ? 'text-red-700' : 'text-[#202020]'}`}>
        {timeRemaining}
      </p>
    </div>
  );
}
