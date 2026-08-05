import { NextResponse } from 'next/server';
import { servicesService } from '@/lib/services/servicesService';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const stats = await servicesService.getStats(studentId);
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
