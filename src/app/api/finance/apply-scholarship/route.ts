import { NextResponse } from 'next/server';
import { financeService } from '@/lib/services/financeService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { scholarshipId } = await req.json();
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const result = await financeService.applyScholarship(studentId, scholarshipId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
