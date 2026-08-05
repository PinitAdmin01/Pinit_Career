import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const sheet = await examsService.getStudentResults(studentId);
    return NextResponse.json(sheet);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
