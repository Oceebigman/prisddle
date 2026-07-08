import { supabase } from '@/lib/supabase-server';
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
    .select('id')
    .eq('session_token_hash', tokenHash)
    .single();

  if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  // Only send options, NOT correct_index (answer key stays on server)
  const { data: questions } = await supabase
    .from('riddle_questions')
    .select('question_number, riddle_text, options')
    .eq('puzzle_id', id)
    .order('question_number');

  return NextResponse.json(questions || []);
}
