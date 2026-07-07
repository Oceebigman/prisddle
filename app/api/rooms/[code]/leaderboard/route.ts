import { supabase } from '@/lib/supabase-server';
import { getCached } from '@/lib/redis';
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
    .select('id')
    .eq('session_token_hash', tokenHash)
    .single();

  if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const leaderboard = await getCached(
    `room:${code}:leaderboard`,
    5,
    async () => {
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', code.toUpperCase())
        .single();

      if (!room) return null;

      const { data: submissions } = await supabase
        .from('submissions')
        .select('player_id, score, time_used_seconds, correct_count, total_questions')
        .eq('room_id', room.id)
        .order('score', { ascending: false })
        .order('time_used_seconds', { ascending: true })
        .limit(20);

      if (!submissions) return [];

      return Promise.all(
        submissions.map(async (sub) => {
          const { data: player } = await supabase
            .from('player_sessions')
            .select('username')
            .eq('id', sub.player_id)
            .single();
          return {
            username: player?.username || 'Anonymous',
            score: sub.score,
            accuracy: Math.round((sub.correct_count / sub.total_questions) * 100),
          };
        })
      );
    }
  );

  return NextResponse.json(leaderboard || []);
}
