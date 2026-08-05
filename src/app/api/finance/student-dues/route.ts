import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const dues = await financeService.getStudentDues(studentId);
    return NextResponse.json(dues);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
