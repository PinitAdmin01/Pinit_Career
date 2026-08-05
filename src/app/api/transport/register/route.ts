import { NextResponse } from 'next/server';
import { transportService } from '@/lib/services/transportService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { routeCode, stop } = await req.json();
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const result = await transportService.register(studentId, routeCode, stop);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
