import { supabase } from '@/lib/supabase-server';
import { scoreRiddleSubmission } from '@/lib/scoring';
import { selectRoomQuestions } from '@/lib/select-questions';
import type { RiddleQuestion } from '@/lib/scoring';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
export async function POST(req: NextRequest) {
  try {
    const { session_token, submitted_answers } = await req.json();
    if (!session_token || !submitted_answers) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    const tokenHash = crypto.createHash('sha256').update(session_token).digest('hex');
    const { data: session } = await supabase
      .from('player_sessions')
      .select('id, room_id')
      .eq('session_token_hash', tokenHash)
      .single();
    if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    const { data: room } = await supabase
      .from('rooms')
      .select('id, starts_at, ends_at, puzzle_id')
      .eq('id', session.room_id)
      .single();
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    const now = new Date();
    // 60s grace so timer-expiry auto-submits landing just after ends_at still count
    if (room.ends_at && new Date(room.ends_at).getTime() + 60000 < now.getTime()) {
      return NextResponse.json({ error: 'Submission deadline passed' }, { status: 400 });
    }
    const { data: existing } = await supabase
      .from('submissions')
      .select('score')
      .eq('player_id', session.id)
      .single();
    if (existing) {
      return NextResponse.json({ score: existing.score });
    }
    const { data: questions } = await supabase
      .from('riddle_questions')
      .select('*')
      .eq('puzzle_id', room.puzzle_id);
    if (!questions) return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
    const roomQuestions = selectRoomQuestions(room.id, questions as RiddleQuestion[], 10);
    const { score, correct_count, total_questions } = scoreRiddleSubmission(roomQuestions, submitted_answers);
    const startMs = room.starts_at ? new Date(room.starts_at).getTime() : now.getTime();
    const timeUsed = Math.max(0, Math.floor((now.getTime() - startMs) / 1000));
    const { error: insertError } = await supabase
      .from('submissions')
      .insert({
        room_id: room.id,
        player_id: session.id,
        submitted_answers,
        score,
        correct_count,
        total_questions,
        time_used_seconds: timeUsed,
      });
    if (insertError) {
      console.error('Submission insert failed:', insertError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }
    return NextResponse.json({ score, correct_count, total_questions });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
