import { supabase } from '@/lib/supabase-server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; // Exclude 0/O, 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { room_name, puzzle_id, duration_seconds } = await req.json();

    if (!room_name || !puzzle_id || !duration_seconds) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify puzzle exists and is ready
    const { data: puzzle } = await supabase
      .from('riddle_puzzles')
      .select('id')
      .eq('id', puzzle_id)
      .eq('status', 'ready')
      .single();

    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found or not ready' }, { status: 404 });
    }

    // Generate unique room code
    let room_code = generateRoomCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', room_code)
        .single();

      if (!existing) break;
      room_code = generateRoomCode();
      attempts++;
    }

    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        room_name,
        room_code,
        puzzle_id,
        duration_seconds,
        status: 'waiting',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: room.id,
      room_code: room.room_code,
      room_name: room.room_name,
      status: room.status,
    });
  } catch (error) {
    console.error('Create room error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
