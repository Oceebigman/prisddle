'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';
import Link from 'next/link';

interface Question {
  question_number: number;
  riddle_text: string;
}

export default function PlayPage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roomStatus, setRoomStatus] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        router.push('/join');
        return;
      }

      try {
        const statusRes = await fetch(`/api/rooms/${code}/status`);
        const status = await statusRes.json();
        setRoomStatus(status);

        const puzzleId = '7b86a0c6-3261-4d41-80fb-04d16d29393d';
        const res = await fetch(`/api/puzzles/${puzzleId}/play?session_token=${sessionToken}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Load error:', error);
      }
    };

    loadQuestions();
  }, [code, router]);

  const handleSubmit = async () => {
    const sessionToken = localStorage.getItem('session_token');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken, submitted_answers: answers }),
      });
      if (res.ok) {
        setSubmitted(true);
        localStorage.removeItem('session_token');
        setTimeout(() => router.push(`/leaderboard/${code}`), 1500);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md text-center">
        <p className="text-lg text-slate-300">Loading quiz...</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-black mb-2">Submitted!</h1>
        <p className="text-slate-400">Redirecting to leaderboard...</p>
      </div>
    </div>
  );

  const question = questions.find((q) => q.question_number === currentQuestion);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="container max-w-md">
        {roomStatus && (
          <div className="mb-6">
            <Countdown startsAt={roomStatus.starts_at} endsAt={roomStatus.ends_at} onFinish={handleSubmit} />
          </div>
        )}

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-400">Question {currentQuestion} of {questions.length}</span>
            <span className="text-sm font-bold text-blue-400">{Math.round((currentQuestion / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-6 text-white">{question?.riddle_text}</h2>
          <input 
            type="text" 
            placeholder="Your answer..." 
            value={answers[currentQuestion] || ''}
            onChange={(e) => setAnswers({...answers, [currentQuestion]: e.target.value})}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
            className="flex-1 btn-secondary"
            disabled={currentQuestion === 1}
          >
            ← Previous
          </button>
          <button 
            onClick={() => setCurrentQuestion(Math.min(questions.length, currentQuestion + 1))}
            className="flex-1 btn-secondary"
            disabled={currentQuestion === questions.length}
          >
            Next →
          </button>
        </div>

        <button onClick={handleSubmit} className="w-full btn-primary font-bold">
          🎮 Submit Answers
        </button>
      </div>
    </div>
  );
}
