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
  const { data: room } = await supabase
    .from('rooms')
    .select('room_code, room_name, status')
    .eq('id', id)
    .single();
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  return NextResponse.json(room);
}
