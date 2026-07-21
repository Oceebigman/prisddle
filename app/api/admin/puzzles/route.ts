import { supabase } from '@/lib/supabase-server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: puzzles } = await supabase
    .from('riddle_puzzles')
    .select('*')
    .eq('status', 'ready');
  return NextResponse.json(puzzles || []);
}
