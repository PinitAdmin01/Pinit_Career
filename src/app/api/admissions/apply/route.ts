import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`admissions_apply_${ip}`, { limit: 10, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: 'RATE_LIMIT_EXCEEDED', message: 'Too many applications submitted from this IP. Please try again shortly.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
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
