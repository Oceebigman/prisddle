import { supabase } from '@/lib/supabase-server';
import { selectRoomQuestions } from '@/lib/select-questions';
import type { RiddleQuestion } from '@/lib/scoring';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const sessionToken = new URL(req.url).searchParams.get('session_token');
  if (!sessionToken) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

  const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  const { data: session } = await supabase
    .from('player_sessions')
    .select('id, room_id')
    .eq('session_token_hash', tokenHash)
    .single();
  if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { data: room } = await supabase
    .from('rooms')
    .select('id, status, starts_at, puzzle_id, question_count')
    .eq('id', session.room_id)
    .single();
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });


  const { data: submission } = await supabase
    .from('submissions')
    .select('submitted_answers')
    .eq('player_id', session.id)
    .eq('room_id', room.id)
    .single();
  if (!submission) return NextResponse.json({ error: 'No submission' }, { status: 404 });

  const { data: questions } = await supabase
    .from('riddle_questions')
    .select('id, question_number, riddle_text, options, correct_index, points, image_url')
    .eq('puzzle_id', room.puzzle_id)
    .order('question_number');
  if (!questions) return NextResponse.json([]);

  const seed = room.id + ':' + (room.starts_at || '');
  const roomQuestions = selectRoomQuestions(seed, questions as RiddleQuestion[], room.question_count || 10);

  const answers = (submission.submitted_answers || {}) as Record<string, number>;
  const review = roomQuestions.map((q) => {
    const picked = answers[q.question_number.toString()];
    return {
      question_number: q.question_number,
      riddle_text: q.riddle_text,
      image_url: (q as RiddleQuestion & { image_url?: string }).image_url || null,
      options: q.options,
      correct_index: q.correct_index,
      picked_index: picked ?? null,
      correct: picked === q.correct_index,
    };
  });
  return NextResponse.json(review);
}
