import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';
import { updateUserProfile } from '@/lib/services/supabase/userService';

export function normalizeVisibility(raw: any): { score: number; label: string } {
  if (raw === false || raw === 0 || raw === '0' || raw === 'private' || raw === 'none' || raw === 'hidden') {
    return { score: 0, label: 'private' };
  }
  if (raw === 'institution_only' || raw === 'institution' || raw === 50 || raw === '50') {
    return { score: 50, label: 'institution_only' };
  }
  if (raw === 'public' || raw === 100 || raw === '100') {
    return { score: 100, label: 'public' };
  }
  if (raw === 'recruiters_only' || raw === true || raw === 'true' || raw === 80 || raw === '80') {
    return { score: 80, label: 'recruiters_only' };
  }
  if (typeof raw === 'number' && !isNaN(raw)) {
    const clamped = Math.min(100, Math.max(0, Math.round(raw)));
    return {
      score: clamped,
      label: clamped === 0 ? 'private' : clamped === 100 ? 'public' : clamped === 50 ? 'institution_only' : 'recruiters_only',
    };
  }
  if (typeof raw === 'string' && !isNaN(Number(raw))) {
    const num = Math.min(100, Math.max(0, Math.round(Number(raw))));
    return {
      score: num,
      label: num === 0 ? 'private' : num === 100 ? 'public' : num === 50 ? 'institution_only' : 'recruiters_only',
    };
  }
  return { score: 80, label: 'recruiters_only' };
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);

    const { data: userRow, error } = await supabase
      .from('users')
      .select('recruiter_visibility')
      .eq('id', studentId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const currentScore = userRow?.recruiter_visibility ?? 80;
    const { label } = normalizeVisibility(currentScore);

    return NextResponse.json({
      ok: true,
      recruiter_visibility: currentScore,
      visibility: label,
      visible: currentScore > 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  return handleVisibilityUpdate(req);
}

export async function POST(req: Request) {
  return handleVisibilityUpdate(req);
}

async function handleVisibilityUpdate(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);

    const body = await req.json().catch(() => ({}));
    const raw = body.visibility ?? body.visible ?? body.recruiter_visibility ?? body.recruiterVisibility;

    const { score, label } = normalizeVisibility(raw);

    // Update using authoritative Supabase client
    const { data, error } = await supabase
      .from('users')
      .update({
        recruiter_visibility: score,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId)
      .select('id, recruiter_visibility')
      .maybeSingle();

    if (error) {
      console.warn('[Recruiter Visibility Route] Direct Supabase update warning, falling back to service:', error.message);
      await updateUserProfile(studentId, { recruiter_visibility: score });
    }

    return NextResponse.json({
      ok: true,
      recruiter_visibility: score,
      visibility: label,
      visible: score > 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
