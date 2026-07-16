import { supabase } from '@/lib/supabase-server';
import { selectRoomQuestions } from '@/lib/select-questions';
import type { RiddleQuestion } from '@/lib/scoring';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionToken = new URL(req.url).searchParams.get('session_token');

  if (!sessionToken) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

  const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  const { data: session } = await supabase
    .from('player_sessions')
    .select('id, room_id')
    .eq('session_token_hash', tokenHash)
    .single();

  if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { data: questions } = await supabase
    .from('riddle_questions')
    .select('id, question_number, riddle_text, options, correct_index, points')
    .eq('puzzle_id', id)
    .order('question_number');

  if (!questions) return NextResponse.json([]);

  // Deterministic per-room draw + option shuffle (same for all players in the room)
  const selected = selectRoomQuestions(session.room_id, questions as RiddleQuestion[], 10);

  // Strip the answer key before it leaves the server
  const publicQuestions = selected.map(({ question_number, riddle_text, options }) => ({
    question_number,
    riddle_text,
    options,
  }));

  return NextResponse.json(publicQuestions);
}
