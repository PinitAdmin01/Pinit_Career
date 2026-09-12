import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { submitMission } from '@/lib/supabaseService';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Malformed JSON payload' }, { status: 400 });
    }

    const { missionId, ...rest } = body || {};
    if (!missionId) {
      return NextResponse.json({ error: 'MISSING_FIELD', message: 'missionId is required' }, { status: 400 });
    }

    const uid = gated.user!.id;
    await submitMission(uid, missionId, rest);

    return NextResponse.json({ ok: true, message: 'Mission submitted successfully' });
  } catch (err: any) {
    const status = err.message?.includes('Daily Limit Reached') ? 400 : 500;
    return NextResponse.json({ error: err.message || 'Failed to submit mission' }, { status });
  }
}
