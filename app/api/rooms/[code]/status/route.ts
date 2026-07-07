import { supabase } from '@/lib/supabase-server';
import { getCached } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  
  const status = await getCached(`room:${code}:status`, 3, async () => {
    const { data: room } = await supabase
      .from('rooms')
      .select('id, room_name, status, starts_at, ends_at')
      .eq('room_code', code.toUpperCase())
      .single();
    if (!room) return null;
    const { count } = await supabase
      .from('player_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', room.id);
    return { status: room.status, room_name: room.room_name, player_count: count || 0, starts_at: room.starts_at, ends_at: room.ends_at };
  });
  return NextResponse.json(status || { error: 'Not found' }, { status: status ? 200 : 404 });
}
