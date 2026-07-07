import { supabase } from '@/lib/supabase-server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const now = new Date();
    const startsAt = new Date(now.getTime() + 30000); // 30 seconds from now
    const endsAt = new Date(startsAt.getTime() + 20 * 60 * 1000); // 20 minute default

    const { data: room } = await supabase
      .from('rooms')
      .select('duration_seconds')
      .eq('id', id)
      .single();

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const actualEndsAt = new Date(startsAt.getTime() + room.duration_seconds * 1000);

    const { data: updated, error } = await supabase
      .from('rooms')
      .update({
        status: 'scheduled',
        starts_at: startsAt.toISOString(),
        ends_at: actualEndsAt.toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: updated.status,
      starts_at: updated.starts_at,
      ends_at: updated.ends_at,
    });
  } catch (error) {
    console.error('Start room error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
