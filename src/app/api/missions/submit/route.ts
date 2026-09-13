import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { submitMission } from '@/lib/supabaseService';
import { validateBody } from '@/lib/server/validate';
import { MissionSubmitSchema } from '@/lib/schemas/apiSchemas';

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

    const { data, error } = validateBody(MissionSubmitSchema, body);
    if (error) return error;
    const { missionId, ...rest } = data;

    const uid = gated.user!.id;
    await submitMission(uid, missionId, rest);

    return NextResponse.json({ ok: true, message: 'Mission submitted successfully' });
  } catch (err: any) {
    const status = err.message?.includes('Daily Limit Reached') ? 400 : 500;
    return NextResponse.json({ error: err.message || 'Failed to submit mission' }, { status });
  }
}
