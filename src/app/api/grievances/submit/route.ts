import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { reporterType, category, title, description, anonymous } = await req.json();
    let studentId = 'demo-id';
    let studentName = 'Ashwanth Kumar';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
      studentName = session.user.user_metadata?.displayName || session.user.email || 'Student';
    }

    const result = await grievancesService.submit(studentId, studentName, reporterType, category, title, description, anonymous);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
