import { NextResponse } from 'next/server';
import { advisorService } from '@/lib/services/advisorService';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const performance = await advisorService.getPerformance(studentId);
    return NextResponse.json(performance);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
