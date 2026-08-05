import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { installmentId } = await req.json();
    let studentId = 'demo-id';
    let studentName = 'Ashwanth Kumar';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
      studentName = session.user.user_metadata?.displayName || session.user.email || 'Student';
    }

    const result = await financeService.payDue(studentId, studentName, installmentId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
