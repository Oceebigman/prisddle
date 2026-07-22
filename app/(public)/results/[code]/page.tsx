'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReviewItem {
  question_number: number;
  riddle_text: string;
  options: string[];
  correct_index: number;
  picked_index: number | null;
  correct: boolean;
}

export default function ResultsPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  const router = useRouter();
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem('session_token');
    if (!token) {
      router.push(`/leaderboard/${code}`);
      return;
    }
    fetch(`/api/rooms/${code}/review?session_token=${token}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setReview(d);
        else router.push(`/leaderboard/${code}`);
      })
      .catch(() => router.push(`/leaderboard/${code}`))
      .finally(() => setLoading(false));
  }, [code, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-[#202020]/60">Loading your results...</p>
      </div>
    );
  }
  const correctCount = review.filter((r) => r.correct).length;
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="card-game rise-in p-8 text-center">
          <h1 className="text-3xl font-bold text-[#202020]">Your Score</h1>
          <p className="text-5xl font-extrabold text-[#202020] mt-3">
            {correctCount}/{review.length}
          </p>
          <p className="text-[#202020]/60 mt-1">{correctCount * 10} pts</p>
        </div>

        <div className="flex flex-col gap-3">
          {review.map((r) => (
            <div
              key={r.question_number}
              className={`card-game p-4 border-l-4 ${r.correct ? 'border-l-green-600' : 'border-l-red-600'}`}
            >
              <p className="font-semibold text-[#202020] mb-1">
                {r.correct ? '✓' : '✗'} {r.riddle_text}
              </p>
              {r.picked_index !== null ? (
                <p className={`text-sm ${r.correct ? 'text-green-700' : 'text-red-700'}`}>
                  Your answer: {r.options[r.picked_index]}
                </p>
              ) : (
                <p className="text-sm text-[#202020]/50">Not answered</p>
              )}
              {!r.correct && (
                <p className="text-sm text-green-700">Correct answer: {r.options[r.correct_index]}</p>
              )}
            </div>
          ))}
        </div>

        <Link href={`/leaderboard/${code}`} className="block">
          <button className="w-full surface-accent font-bold py-4 rounded-xl text-lg">
            View Leaderboard →
          </button>
        </Link>
      </div>
    </div>
  );
}
