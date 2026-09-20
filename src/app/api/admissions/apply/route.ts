import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, gpa, course, marksheetFileName, rank } = body || {};

    if (!name || !name.trim()) {
      return NextResponse.json({ ok: false, error: 'Applicant name is required.' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ ok: false, error: 'Valid email address is required.' }, { status: 400 });
    }

    const applicantId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const result = await admissionsService.apply(
      applicantId,
      name.trim(),
      course || 'Computer Science',
      Number(rank) || 0,
      email.trim(),
      gpa,
      marksheetFileName || '12th_marksheet.pdf'
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || 'Admissions application failed.' },
      { status: 500 }
    );
  }
}
