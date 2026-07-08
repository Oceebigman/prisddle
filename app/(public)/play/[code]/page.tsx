'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Countdown from '../../components/Countdown';

interface Question {
  question_number: number;
  riddle_text: string;
  options: string[];
  correct_index: number;
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
  const [submitting, setSubmitting] = useState(false);

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

        const puzzleId = status.puzzle_id || '7b86a0c6-3261-4d41-80fb-04d16d29393d';
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
    setAnswers({...answers, [currentQuestion]: optionIndex});
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const sessionToken = localStorage.getItem('session_token');
    setSubmitting(true);
    
    try {
      // Convert option indices to answer text - using number keys correctly
      const submittedAnswers: Record<number, string> = {};
      
      Object.entries(answers).forEach(([qNumStr, optionIdx]) => {
        const qNum = parseInt(qNumStr);
        const q = questions.find(qu => qu.question_number === qNum);
        if (q && optionIdx !== undefined && typeof optionIdx === 'number') {
          submittedAnswers[qNum] = q.options[optionIdx];
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
        localStorage.removeItem('session_token');
        setTimeout(() => {
          router.push(`/leaderboard/${code}`);
        }, 1500);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting answers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading quiz...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">✓</p>
          <p className="text-white text-2xl font-bold">Submitted!</p>
          <p className="text-slate-400 mt-2">Redirecting to leaderboard...</p>
        </div>
      </div>
    );
  }

  const question = questions.find((q) => q.question_number === currentQuestion);
  const currentAnswer = answers[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {roomStatus && (
          <Countdown 
            startsAt={roomStatus.starts_at} 
            endsAt={roomStatus.ends_at} 
            onFinish={handleSubmit} 
          />
        )}

        {/* Progress */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400">Question {currentQuestion} of {questions.length}</span>
            <span className="text-blue-400 font-bold">{answeredCount}/{questions.length} answered</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-8">{question?.riddle_text}</h2>

          {/* Multiple Choice Options */}
          <div className="space-y-3 mb-6">
            {question?.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-lg font-medium text-left transition-all ${
                  currentAnswer === idx
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-slate-700 text-slate-200 border-2 border-slate-600 hover:border-blue-500'
                }`}
              >
                <span className="inline-block w-6 h-6 rounded border mr-3 text-center text-sm">
                  {currentAnswer === idx ? '✓' : String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>

          {currentAnswer !== undefined && (
            <p className="text-sm text-green-400">Answer selected ✓</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
              currentQuestion === 1 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            ← Previous
          </button>
          <button 
            onClick={handleNext}
            disabled={currentQuestion === questions.length}
            className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
              currentQuestion === questions.length 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            Next →
          </button>
        </div>

        {/* Submit */}
        <button 
          onClick={handleSubmit} 
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
        >
          {submitting ? '⏳ Submitting...' : '🎮 Submit Answers'}
        </button>
      </div>
    </div>
  );
}
