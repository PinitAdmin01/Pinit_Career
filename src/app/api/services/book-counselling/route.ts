import { NextResponse } from 'next/server';
import { servicesService } from '@/lib/services/servicesService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { counselorName, date, time } = await req.json();
    let studentId = 'demo-id';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      studentId = session.user.id;
    }

    const result = await servicesService.bookCounselling(studentId, counselorName, date, time);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
