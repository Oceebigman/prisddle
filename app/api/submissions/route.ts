import { supabase } from '@/lib/supabase-server';
import { scoreRiddleSubmission } from '@/lib/scoring';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { session_token, submitted_answers } = await req.json();
    if (!session_token || !submitted_answers) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Verify token
    const tokenHash = crypto.createHash('sha256').update(session_token).digest('hex');
    const { data: session } = await supabase
      .from('player_sessions')
      .select('id, room_id')
      .eq('session_token_hash', tokenHash)
      .single();

    if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get room and check deadline
    const { data: room } = await supabase
      .from('rooms')
      .select('id, ends_at, puzzle_id')
      .eq('id', session.room_id)
      .single();

    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    // SERVER-SIDE TIME CHECK - Never trust client
    const now = new Date();
    if (room.ends_at && new Date(room.ends_at) < now) {
      return NextResponse.json({ error: 'Submission deadline passed' }, { status: 400 });
    }

    // Check for existing submission (idempotent)
    const { data: existing } = await supabase
      .from('submissions')
      .select('score')
      .eq('player_id', session.id)
      .single();

    if (existing) {
      return NextResponse.json({ score: existing.score });
    }

    // Get questions with correct answers (SERVER-ONLY)
    const { data: questions } = await supabase
      .from('riddle_questions')
      .select('*')
      .eq('puzzle_id', room.puzzle_id);

    if (!questions) return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });

    // Score submission
    const { score, correct_count, total_questions } = scoreRiddleSubmission(questions, submitted_answers);

    const joinedAt = new Date(session.id); // Approximate
    const timeUsed = Math.floor((now.getTime() - joinedAt.getTime()) / 1000);

    // Insert submission
    const { data: submission } = await supabase
      .from('submissions')
      .insert({
        room_id: room.id,
        player_id: session.id,
        submitted_answers,
        score,
        correct_count,
        total_questions,
        time_used_seconds: timeUsed,
      })
      .select()
      .single();

    return NextResponse.json({ score, correct_count, total_questions });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
