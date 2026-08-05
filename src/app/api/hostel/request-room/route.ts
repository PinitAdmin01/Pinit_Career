import { NextResponse } from 'next/server';
import { hostelService } from '@/lib/services/hostelService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { roomCode } = await req.json();
    let studentId = 'demo-id';
    let studentName = 'demo-student';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
      studentName = session.user.user_metadata?.displayName || session.user.email || 'Student';
    }

    const result = await hostelService.requestRoom(studentId, studentName, roomCode);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
