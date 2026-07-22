'use client';

import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';

interface Question {
  question_number: number;
  riddle_text: string;
  image_url?: string | null;
  options: string[];
}

export default function PlayPage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roomStatus, setRoomStatus] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submittedRef = useRef(false);
  const answersRef = useRef<Record<number, number>>({});
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    const loadQuestions = async () => {
      const sessionToken = sessionStorage.getItem('session_token');
      
      // No session token → redirect to join
      if (!sessionToken) {
        router.push(`/join?code=${code}`);
        return;
      }

      try {
        let puzzleId = '7b86a0c6-3261-4d41-80fb-04d16d29393d';
        const statusRes = await fetch(`/api/rooms/${code}/status`);
        if (statusRes.ok) {
          const status = await statusRes.json();
          setRoomStatus(status);
          if (status.puzzle_id) puzzleId = status.puzzle_id;
        }

        const res = await fetch(`/api/puzzles/${puzzleId}/play?session_token=${sessionToken}`);
        
        // Validate response is OK and is an array
        if (!res.ok) {
          if (res.status === 401) {
            setError('Session expired. Please join again.');
            setTimeout(() => router.push(`/join?code=${code}`), 2000);
          } else {
            setError('Failed to load questions. Please try again.');
          }
          return;
        }

        const data = await res.json();
        
        // Validate data is an array
        if (!Array.isArray(data)) {
          setError('Invalid response from server. Please refresh.');
          return;
        }

        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Load error:', error);
        setError('Connection error. Please refresh.');
      }
    };

    loadQuestions();
  }, [code, router]);

  useEffect(() => {
    const CODE = code.toUpperCase();
    let done = false;
    const onGameEnd = async () => {
      if (done) return;
      done = true;
      if (!submittedRef.current && Object.keys(answersRef.current).length > 0) {
        try {
          await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_token: sessionStorage.getItem('session_token'),
              submitted_answers: answersRef.current,
            }),
          });
        } catch {}
      }
      router.push(`/results/${CODE}`);
    };
    const channel = supabaseBrowser
      .channel(`room-status:${CODE}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `room_code=eq.${CODE}` },
        (payload) => {
          if ((payload.new as { status?: string })?.status === 'finished') onGameEnd();
        })
      .subscribe();
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${CODE}/status`);
        if (res.ok) {
          const d = await res.json();
          if (d.status === 'finished') onGameEnd();
        }
      } catch {}
    }, 15000);
    return () => { supabaseBrowser.removeChannel(channel); clearInterval(poll); };
  }, [code, router]);

  // Status cache (3s) can serve a pre-start snapshot right after a Realtime
  // game-start sweep; re-fetch until ends_at exists so the timer is real.
  useEffect(() => {
    if (roomStatus && roomStatus.ends_at) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${code}/status`);
        if (res.ok) {
          const d = await res.json();
          if (d.ends_at) setRoomStatus(d);
        }
      } catch {}
    }, 2500);
    return () => clearInterval(t);
  }, [code, roomStatus]);

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const q = questions[currentQuestion - 1];
    if (!q) return;
    setAnswers({...answers, [q.question_number]: optionIndex});
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const sessionToken = sessionStorage.getItem('session_token');
    setSubmitting(true);
    
    try {
      // Send selected indices to server
      const submittedAnswers: Record<number, number> = {};
      Object.entries(answers).forEach(([qNumStr, optionIdx]) => {
        if (optionIdx !== undefined) {
          submittedAnswers[parseInt(qNumStr)] = optionIdx;
        }
      });

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_token: sessionToken, 
          submitted_answers: submittedAnswers 
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push(`/results/${code}`);
        }, 1500);
      } else if (res.status === 400) {
        router.push(`/results/${code}`);
        return;
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Error submitting answers');
    } finally {
      setSubmitting(false);
    }
  };

  // Show error state
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => router.push(`/join?code=${code}`)}
            className="px-6 py-2 surface-accent text-[#202020] rounded-lg"
          >
            Back to Join
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#202020]">Loading quiz...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-[#202020]/60 mb-4">No questions available</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 surface-accent text-[#202020] rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">✓</p>
          <p className="text-[#202020] text-2xl font-bold">Submitted!</p>
          <p className="text-[#202020]/60 mt-2">Redirecting to leaderboard...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion - 1];
  const currentAnswer = question ? answers[question.question_number] : undefined;
  const answeredCount = Object.keys(answers).length;

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#202020]/60">Question not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {roomStatus && (
          <Countdown 
            startsAt={roomStatus.starts_at} 
            endsAt={roomStatus.ends_at} 
            onFinish={handleSubmit} 
          />
        )}

        {/* Progress */}
        <div className="card-game p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#202020]/60">Question {currentQuestion} of {questions.length}</span>
            <span className="text-[#202020] font-bold">{answeredCount}/{questions.length} answered</span>
          </div>
          <div className="w-full bg-[#202020]/10 rounded-full h-2">
            <div 
              className="surface-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card-game p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#202020] mb-8">{question.riddle_text}</h2>
          {question.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={question.image_url} alt="Question image" className="mx-auto mb-6 max-h-40 rounded-lg border border-[#202020]/15 shadow" />
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {question.options && Array.isArray(question.options) ? (
              question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-lg font-medium text-left transition-all ${
                    currentAnswer === idx
                      ? 'surface-accent text-[#202020] border-2 border-[#DFD8D0]/60'
                      : 'bg-white/55 text-[#202020]/85 border-2 border-[#202020]/25 hover:border-[#202020]/50 hover:bg-[#202020]/10/60'
                  }`}
                >
                  <span className="inline-block w-6 h-6 rounded border mr-3 text-center text-sm">
                    {currentAnswer === idx ? '✓' : String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))
            ) : (
              <p className="text-red-700">Error: Options not available</p>
            )}
          </div>

          {currentAnswer !== undefined && (
            <p className="text-sm text-green-700">Answer selected ✓</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
              currentQuestion === 1 
                ? 'bg-[#202020]/10 text-[#202020]/50 cursor-not-allowed opacity-50' 
                : 'bg-[#202020]/10 text-[#202020] hover:bg-[#202020]/20'
            }`}
          >
            ← Previous
          </button>
          <button 
            onClick={handleNext}
            disabled={currentQuestion === questions.length}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
              currentQuestion === questions.length 
                ? 'bg-[#202020]/10 text-[#202020]/50 cursor-not-allowed opacity-50' 
                : 'bg-[#202020]/10 text-[#202020] hover:bg-[#202020]/20'
            }`}
          >
            Next →
          </button>
        </div>

        {/* Submit */}
        {currentQuestion === questions.length && (
          <button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="w-full surface-accent text-[#202020] font-bold py-4 px-4 rounded-xl transition disabled:opacity-50"
          >
            {submitting ? '⏳ Submitting...' : '🎮 Submit Answers'}
          </button>
        )}
      </div>
    </div>
  );
}
