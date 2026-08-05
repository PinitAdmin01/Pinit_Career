import { NextResponse } from 'next/server';
import { hostelService } from '@/lib/services/hostelService';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    // Get authorization session
    let studentId = 'demo-id';
    let studentName = 'demo-student';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
      studentName = session.user.user_metadata?.displayName || session.user.email || 'Student';
    }

    const stats = await hostelService.getStats(studentId, studentName);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
