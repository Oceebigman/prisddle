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
export async function GET(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data: rooms } = await supabase
      .from('rooms')
      .select('id, room_name, room_code, status, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!rooms) return NextResponse.json([]);
    const detailed = await Promise.all(
      rooms.map(async (room) => {
        const { count } = await supabase
          .from('player_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('room_id', room.id);
        let winner = null;
        if (room.status === 'finished') {
          const { data: top } = await supabase
            .from('submissions')
            .select('player_id, score, time_used_seconds')
            .eq('room_id', room.id)
            .order('score', { ascending: false })
            .order('time_used_seconds', { ascending: true })
            .limit(1)
            .single();
          if (top) {
            const { data: player } = await supabase
              .from('player_sessions')
              .select('username')
              .eq('id', top.player_id)
              .single();
            winner = { username: player?.username || 'Anonymous', score: top.score };
          }
        }
        return { ...room, player_count: count ?? 0, winner };
      })
    );
    return NextResponse.json(detailed);
  } catch (error) {
    console.error('List rooms error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
