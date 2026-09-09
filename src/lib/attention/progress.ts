// src/lib/attention/progress.ts
/**
 * Attention-span leaderboard and analytics, backed by
 * public.attention_span_progress (see the 20260909 migration).
 *
 * Both endpoints previously threw "Unhandled API path" — there was no handler
 * at all — and src/app/attention-span/page.tsx swallows fetch errors, so the
 * leaderboard simply stayed empty and nobody saw a failure.
 *
 * If the migration has not been applied yet these return { ok: false } with a
 * reason rather than throwing. The page already gates on `data.ok`, so it
 * degrades to an empty board instead of breaking, and the reason is visible in
 * the console rather than being silently swallowed.
 */
import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';

const TABLE = 'attention_span_progress';

export interface LeaderItem {
  userId: string;
  displayName: string;
  totalAccuracy: number;
}

const NOT_MIGRATED = {
  ok: false as const,
  error: 'TABLE_MISSING',
  message: 'attention_span_progress does not exist. Apply supabase/migrations/20260909_create_attention_span.sql.',
};

const toLeader = (r: Record<string, any>): LeaderItem => ({
  userId: r.user_id,
  displayName: r.display_name || 'Student',
  totalAccuracy: Number(r.total_accuracy) || 0,
});

async function board() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('user_id, display_name, total_accuracy')
    .order('total_accuracy', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []).map(toLeader);
}

const rankOf = (leaders: LeaderItem[], userId: string) => {
  const i = leaders.findIndex((l) => l.userId === userId);
  return i < 0 ? 0 : i + 1;
};

export async function getAttentionLeaderboard(userId: string) {
  if (!(await tableExists(TABLE))) return { ...NOT_MIGRATED, leaders: [], userRank: 0 };
  const leaders = await board();
  return { ok: true as const, leaders, userRank: rankOf(leaders, userId) };
}

export async function addAttentionAccuracy(
  userId: string,
  displayName: string,
  accuracyEarned: number,
) {
  if (!userId) return { ...NOT_MIGRATED, error: 'NO_USER', message: 'Not signed in.', leaders: [], userRank: 0 };
  if (!(await tableExists(TABLE))) return { ...NOT_MIGRATED, leaders: [], userRank: 0 };

  const earned = Number(accuracyEarned);
  if (!Number.isFinite(earned) || earned < 0) {
    return { ok: false as const, error: 'INVALID_SCORE', message: 'accuracyEarned must be a non-negative number.', leaders: [], userRank: 0 };
  }

  // Read-then-write rather than a raw increment: there is no server to hold a
  // transaction, and a single student posting their own score is not a
  // contended row. RLS restricts the write to the owner regardless.
  const { data: existing } = await supabase
    .from(TABLE).select('total_accuracy').eq('user_id', userId).maybeSingle();

  const newTotalAccuracy = (Number(existing?.total_accuracy) || 0) + earned;

  const { error } = await supabase.from(TABLE).upsert({
    user_id: userId,
    display_name: displayName || 'Student',
    total_accuracy: newTotalAccuracy,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;

  const leaders = await board();
  return { ok: true as const, leaders, userRank: rankOf(leaders, userId), newTotalAccuracy };
}

export async function getAttentionAnalytics(userId: string) {
  if (!(await tableExists(TABLE))) return { ...NOT_MIGRATED, analytics: null };
  const { data, error } = await supabase
    .from(TABLE).select('daily_logs, monthly_summaries, updated_at').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return {
    ok: true as const,
    analytics: {
      userId,
      dailyLogs: data?.daily_logs || {},
      monthlySummaries: data?.monthly_summaries || {},
      lastUpdated: data?.updated_at || new Date().toISOString(),
    },
  };
}

export async function saveAttentionAnalytics(
  userId: string,
  dailyLog?: Record<string, any>,
  monthlySummary?: Record<string, any>,
) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', analytics: null };
  if (!(await tableExists(TABLE))) return { ...NOT_MIGRATED, analytics: null };

  const current = await getAttentionAnalytics(userId);
  const dailyLogs = { ...(current.analytics?.dailyLogs || {}) };
  const monthlySummaries = { ...(current.analytics?.monthlySummaries || {}) };

  if (dailyLog?.date) dailyLogs[dailyLog.date] = { ...dailyLogs[dailyLog.date], ...dailyLog };
  if (monthlySummary?.month) monthlySummaries[monthlySummary.month] = { ...monthlySummaries[monthlySummary.month], ...monthlySummary };

  const { error } = await supabase.from(TABLE).upsert({
    user_id: userId,
    daily_logs: dailyLogs,
    monthly_summaries: monthlySummaries,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;

  return { ok: true as const, analytics: { userId, dailyLogs, monthlySummaries, lastUpdated: new Date().toISOString() } };
}
