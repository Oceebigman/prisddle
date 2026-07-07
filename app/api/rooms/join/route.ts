import { supabase } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { room_code, username } = await req.json();
    if (!room_code || !username) {
      return NextResponse.json({ error: 'Missing room_code or username' }, { status: 400 });
    }
    const { data: room } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', room_code.toUpperCase())
      .single();
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    if (!['waiting', 'scheduled', 'live'].includes(room.status)) {
      return NextResponse.json({ error: 'Room not joinable' }, { status: 400 });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const { data: session, error: sessionError } = await supabase
      .from('player_sessions')
      .insert({
        room_id: room.id,
        username: username.trim(),
        session_token_hash: tokenHash,
        status: 'joined',
      })
      .select()
      .single();
    if (sessionError) {
      return NextResponse.json({ error: 'Username taken' }, { status: 409 });
    }
    return NextResponse.json({
      player_id: session.id,
      session_token: token,
      room_name: room.room_name,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
