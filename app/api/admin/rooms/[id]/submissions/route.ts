import { supabase } from '@/lib/supabase-server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { data: submissions } = await supabase
      .from('submissions')
      .select('player_id, score, correct_count, total_questions, submitted_answers, submitted_at, time_used_seconds')
      .eq('room_id', id)
      .order('score', { ascending: false });

    if (!submissions) {
      return NextResponse.json([]);
    }

    const detailed = await Promise.all(
      submissions.map(async (sub) => {
        const { data: player } = await supabase
          .from('player_sessions')
          .select('username')
          .eq('id', sub.player_id)
          .single();

        return {
          username: player?.username || 'Anonymous',
          score: sub.score,
          correct_count: sub.correct_count,
          total_questions: sub.total_questions,
          accuracy: Math.round((sub.correct_count / sub.total_questions) * 100),
          submitted_answers: sub.submitted_answers,
          submitted_at: sub.submitted_at,
          time_used_seconds: sub.time_used_seconds,
        };
      })
    );

    return NextResponse.json(detailed);
  } catch (error) {
    console.error('Submissions error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
