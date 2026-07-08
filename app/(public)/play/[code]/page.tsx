'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';

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
        setTimeout(() => router.push(`/leaderboard/${code}`), 2000);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white">Loading quiz...</p></div>;
  if (submitted) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white text-2xl">✓ Submitted!</p></div>;

  const question = questions.find((q) => q.question_number === currentQuestion);

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {roomStatus && <Countdown startsAt={roomStatus.starts_at} endsAt={roomStatus.ends_at} onFinish={handleSubmit} />}
        <div className="bg-slate-800 rounded-lg p-8 mt-8">
          <p className="text-slate-400 mb-2">Question {currentQuestion} of {questions.length}</p>
          <h2 className="text-2xl font-bold text-white mb-6">{question?.riddle_text}</h2>
          <input type="text" placeholder="Your answer..." onChange={(e) => setAnswers({...answers, [currentQuestion]: e.target.value})} className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg mb-6" />
          <div className="flex gap-4 mb-6">
            <button onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))} className="flex-1 bg-slate-700 text-white py-2 rounded-lg">Previous</button>
            <button onClick={() => setCurrentQuestion(Math.min(questions.length, currentQuestion + 1))} className="flex-1 bg-slate-700 text-white py-2 rounded-lg">Next</button>
          </div>
        </div>
        <button onClick={handleSubmit} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg">Submit Answers</button>
      </div>
    </div>
  );
}
