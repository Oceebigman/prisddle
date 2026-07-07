'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  startsAt: string;
  endsAt: string;
  onFinish?: () => void;
}

export default function Countdown({ startsAt, endsAt, onFinish }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startsAt).getTime();
      const end = new Date(endsAt).getTime();

      if (now < start) {
        setStarted(false);
        setTimeRemaining(Math.ceil((start - now) / 1000));
      } else if (now < end) {
        setStarted(true);
        setTimeRemaining(Math.ceil((end - now) / 1000));
      } else {
        setStarted(true);
        setTimeRemaining(0);
        onFinish?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startsAt, endsAt, onFinish]);

  return (
    <div className="text-center">
      <div className={`text-6xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-green-500'}`}>
        {timeRemaining}
      </div>
      <p className="text-slate-400 mt-2">{started ? 'Time remaining' : 'Starts in'}</p>
    </div>
  );
}
