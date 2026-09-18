import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();

    // Fetch from users.onboarding_answers.codewars_history
    const { data: userRow } = await supabase
      .from('users')
      .select('onboarding_answers, xp_total')
      .eq('id', studentId)
      .maybeSingle();

    const ob = userRow?.onboarding_answers || {};
    const matches = Array.isArray(ob.codewars_history) ? ob.codewars_history : [];

    return NextResponse.json({ ok: true, matches, totalXp: userRow?.xp_total || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();
    const match = await req.json();

    if (!match || !match.id) {
      return NextResponse.json({ error: 'Invalid match payload' }, { status: 400 });
    }

    // Try dedicated table if exists
    try {
      await supabase.from('codewars_matches').upsert({
        id: match.id,
        player_id: studentId,
        opponent_name: match.opponent?.name || 'AI Shadow Duelist',
        problem_id: match.problemId,
        outcome: match.status,
        elo_delta: match.status === 'victory' ? 25 : -10,
        score: match.score || 0,
        created_at: new Date().toISOString()
      });
    } catch {}

    // Persist to users.onboarding_answers.codewars_history
    const { data: userRow } = await supabase
      .from('users')
      .select('onboarding_answers')
      .eq('id', studentId)
      .maybeSingle();

    const ob = { ...(userRow?.onboarding_answers || {}) };
    const existing = Array.isArray(ob.codewars_history) ? ob.codewars_history : [];
    const filtered = existing.filter((m: any) => m.id !== match.id);
    filtered.unshift(match);
    ob.codewars_history = filtered.slice(0, 50);

    await supabase
      .from('users')
      .update({ onboarding_answers: ob })
      .eq('id', studentId);

    return NextResponse.json({ ok: true, success: true, match, history: ob.codewars_history });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
