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
    const { data: updated, error } = await supabase
      .from('rooms')
      .update({
        status: 'finished',
        ends_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: updated.status });
  } catch (error) {
    console.error('End room error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
