import { NextResponse } from 'next/server';
import { researchService } from '@/lib/services/researchService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { title, authors, journal, status } = await req.json();
    let studentId = 'demo-id';
    let studentName = 'Ashwanth Kumar';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
      studentName = session.user.user_metadata?.displayName || session.user.email || 'Student';
    }

    const result = await researchService.publishPaper(studentId, studentName, title, authors, journal, status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
