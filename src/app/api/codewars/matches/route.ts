import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

const MODES = new Set(['1v1_duel', 'solo_speedrun', 'boss_challenge']);
const STATUSES = new Set(['active', 'victory', 'defeat', 'timeout']);
const MAX_LOG_CHARS = 20000;

const str = (v: unknown, max = 200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const nonNegative = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0);

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
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'INTERNAL_ERROR' }, { status: 500 });
  }
}

/**
 * Records a Code Wars match: a row in codewars_matches (20260822 schema) plus the student's
 * history copy in onboarding_answers.codewars_history, which the Code Wars screen reads.
 * The admin client bypasses RLS, so a match id that belongs to another student is refused.
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();
    const match = (await req.json().catch(() => null)) as Record<string, unknown> | null;

    const id = str(match?.id, 100);
    const problemId = str(match?.problemId, 100);
    if (!match || !id || !problemId) {
      return NextResponse.json({ error: 'Invalid match payload' }, { status: 400 });
    }

    const { data: owner, error: ownerErr } = await supabase
      .from('codewars_matches')
      .select('student_id')
      .eq('id', id)
      .maybeSingle();
    if (!ownerErr && owner && owner.student_id !== studentId) {
      return NextResponse.json({ ok: false, error: 'MATCH_NOT_OWNED' }, { status: 403 });
    }

    const opponent = (match.opponent && typeof match.opponent === 'object' ? match.opponent : {}) as Record<string, unknown>;
    const mode = MODES.has(String(match.mode)) ? String(match.mode) : '1v1_duel';
    const status = STATUSES.has(String(match.status)) ? String(match.status) : 'active';

    // evidence_record_id is a foreign key: keep it only if that evidence record exists.
    let evidenceRecordId: string | null = str(match.evidenceRecordId, 100) || null;
    if (evidenceRecordId) {
      const { data: evidence } = await supabase
        .from('competency_evidence_records')
        .select('id')
        .eq('id', evidenceRecordId)
        .maybeSingle();
      if (!evidence) evidenceRecordId = null;
    }

    if (!ownerErr) {
      const { error: tableErr } = await supabase.from('codewars_matches').upsert({
        id,
        student_id: studentId,
        problem_id: problemId,
        mode,
        opponent_name: str(opponent.name, 100) || 'AI Shadow Duelist',
        opponent_progress_pct: Math.min(100, Math.round(nonNegative(opponent.progressPct))),
        status,
        score: nonNegative(match.score),
        time_spent_seconds: Math.round(nonNegative(match.timeSpentSeconds)),
        execution_logs: typeof match.executionLogs === 'string' ? match.executionLogs.slice(0, MAX_LOG_CHARS) : null,
        evidence_record_id: evidenceRecordId,
        started_at: typeof match.startedAt === 'number' && match.startedAt > 0 ? Math.round(match.startedAt) : Date.now(),
      });
      if (tableErr) console.error('[codewars] codewars_matches write failed:', tableErr.message);
    } else {
      console.error('[codewars] codewars_matches unavailable:', ownerErr.message);
    }

    // Persist to users.onboarding_answers.codewars_history
    const { data: userRow } = await supabase
      .from('users')
      .select('onboarding_answers')
      .eq('id', studentId)
      .maybeSingle();

    const ob = { ...(userRow?.onboarding_answers || {}) };
    const existing = Array.isArray(ob.codewars_history) ? ob.codewars_history : [];
    const filtered = existing.filter((m: { id?: unknown }) => m?.id !== id);
    const saved = { ...match, id, studentId, problemId, mode, status };
    filtered.unshift(saved);
    ob.codewars_history = filtered.slice(0, 50);

    const { error: saveErr } = await supabase
      .from('users')
      .update({ onboarding_answers: ob })
      .eq('id', studentId);
    if (saveErr) {
      return NextResponse.json({ ok: false, error: 'SAVE_FAILED', message: saveErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, success: true, match: saved, history: ob.codewars_history });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'INTERNAL_ERROR' }, { status: 500 });
  }
}
