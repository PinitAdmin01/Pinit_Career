// src/lib/attention/progress.ts
/**
 * Attention-span leaderboard and analytics, backed by
 * public.attention_span_progress (see the 20260909 migration)
 * with robust local JSON fallback to prevent cold-start data loss.
 */
import { supabase } from '@/lib/supabaseClient';
import { tableExists, getCampusSupabaseClient } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const TABLE = 'attention_span_progress';

export interface LeaderItem {
  userId: string;
  displayName: string;
  totalAccuracy: number;
}

export interface AttentionSpanRecord {
  user_id: string;
  display_name: string;
  total_accuracy: number;
  daily_logs: Record<string, any>;
  monthly_summaries: Record<string, any>;
  updated_at: string;
}

/**
 * Sanitizes display names to eliminate raw email addresses and PII leaks.
 * E.g., 'john.doe@university.edu' -> 'John.doe'
 */
export function sanitizeDisplayName(name: any): string {
  if (!name || typeof name !== 'string') return 'Student';
  const trimmed = name.trim();
  if (trimmed.includes('@')) {
    const userPart = trimmed.split('@')[0];
    return userPart ? userPart.charAt(0).toUpperCase() + userPart.slice(1) : 'Student';
  }
  return trimmed;
}

const toLeader = (r: Record<string, any>): LeaderItem => ({
  userId: r.user_id,
  displayName: sanitizeDisplayName(r.display_name),
  totalAccuracy: Number(r.total_accuracy) || 0,
});

const rankOf = (leaders: LeaderItem[], userId: string) => {
  const i = leaders.findIndex((l) => l.userId === userId);
  return i < 0 ? 0 : i + 1;
};

// --- Local JSON Fallback Store Operations ---
const LOCAL_DB_PATH = 'src/lib/data/attention_db.json';

async function readLocalAttentionRecords(): Promise<AttentionSpanRecord[]> {
  const data = await readLocalJson<{ progress: AttentionSpanRecord[] }>(
    LOCAL_DB_PATH,
    { progress: [] },
    'shared'
  );
  return Array.isArray(data?.progress) ? data.progress : [];
}

async function writeLocalAttentionRecords(records: AttentionSpanRecord[]): Promise<void> {
  await writeLocalJson(LOCAL_DB_PATH, { progress: records }, 'shared');
}

async function board() {
  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      const { data, error } = await client
        .from(TABLE)
        .select('user_id, display_name, total_accuracy')
        .order('total_accuracy', { ascending: false })
        .limit(100);
      if (!error && data) {
        return data.map(toLeader);
      }
    } catch {
      // Fall through to local store
    }
  }

  // Local JSON fallback
  const local = await readLocalAttentionRecords();
  return local
    .sort((a, b) => b.total_accuracy - a.total_accuracy)
    .slice(0, 100)
    .map(toLeader);
}

export async function getAttentionLeaderboard(userId: string) {
  const leaders = await board();
  return { ok: true as const, leaders, userRank: rankOf(leaders, userId) };
}

export async function addAttentionAccuracy(
  userId: string,
  displayName: string,
  accuracyEarned: number,
) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', leaders: [], userRank: 0 };

  const earned = Number(accuracyEarned);
  if (!Number.isFinite(earned) || earned < 0) {
    return { ok: false as const, error: 'INVALID_SCORE', message: 'accuracyEarned must be a non-negative number.', leaders: [], userRank: 0 };
  }

  const cleanName = sanitizeDisplayName(displayName);
  const now = new Date().toISOString();
  let updatedTotal = earned;

  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      const { data: existing } = await client
        .from(TABLE)
        .select('total_accuracy')
        .eq('user_id', userId)
        .maybeSingle();

      updatedTotal = (Number(existing?.total_accuracy) || 0) + earned;

      const { error } = await client.from(TABLE).upsert({
        user_id: userId,
        display_name: cleanName,
        total_accuracy: updatedTotal,
        updated_at: now,
      }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch {
      // Fallback to local
    }
  }

  // Always sync to local store for offline resilience & cold-start preservation
  const local = await readLocalAttentionRecords();
  const existingIdx = local.findIndex(r => r.user_id === userId);
  if (existingIdx >= 0) {
    updatedTotal = Math.max(updatedTotal, (local[existingIdx].total_accuracy || 0) + earned);
    local[existingIdx].total_accuracy = updatedTotal;
    local[existingIdx].display_name = cleanName;
    local[existingIdx].updated_at = now;
  } else {
    local.push({
      user_id: userId,
      display_name: cleanName,
      total_accuracy: updatedTotal,
      daily_logs: {},
      monthly_summaries: {},
      updated_at: now,
    });
  }
  await writeLocalAttentionRecords(local);

  const leaders = await board();
  return { ok: true as const, leaders, userRank: rankOf(leaders, userId), newTotalAccuracy: updatedTotal };
}

export async function getAttentionAnalytics(userId: string) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', analytics: null };

  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      const { data, error } = await client
        .from(TABLE)
        .select('daily_logs, monthly_summaries, updated_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
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
    } catch {
      // Fallback to local
    }
  }

  // Local JSON fallback
  const local = await readLocalAttentionRecords();
  const found = local.find(r => r.user_id === userId);
  return {
    ok: true as const,
    analytics: {
      userId,
      dailyLogs: found?.daily_logs || {},
      monthlySummaries: found?.monthly_summaries || {},
      lastUpdated: found?.updated_at || new Date().toISOString(),
    },
  };
}

export async function saveAttentionAnalytics(
  userId: string,
  dailyLog?: Record<string, any>,
  monthlySummary?: Record<string, any>,
) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.', analytics: null };

  const current = await getAttentionAnalytics(userId);
  const dailyLogs = { ...(current.analytics?.dailyLogs || {}) };
  const monthlySummaries = { ...(current.analytics?.monthlySummaries || {}) };

  if (dailyLog?.date) dailyLogs[dailyLog.date] = { ...dailyLogs[dailyLog.date], ...dailyLog };
  if (monthlySummary?.month) monthlySummaries[monthlySummary.month] = { ...monthlySummaries[monthlySummary.month], ...monthlySummary };

  const now = new Date().toISOString();

  const isPostgresReady = await tableExists(TABLE);
  if (isPostgresReady) {
    try {
      const client = await getCampusSupabaseClient();
      await client.from(TABLE).upsert({
        user_id: userId,
        daily_logs: dailyLogs,
        monthly_summaries: monthlySummaries,
        updated_at: now,
      }, { onConflict: 'user_id' });
    } catch {
      // Non-blocking fallback to local
    }
  }

  // Sync to local JSON store
  const local = await readLocalAttentionRecords();
  const existingIdx = local.findIndex(r => r.user_id === userId);
  if (existingIdx >= 0) {
    local[existingIdx].daily_logs = dailyLogs;
    local[existingIdx].monthly_summaries = monthlySummaries;
    local[existingIdx].updated_at = now;
  } else {
    local.push({
      user_id: userId,
      display_name: 'Student',
      total_accuracy: 0,
      daily_logs: dailyLogs,
      monthly_summaries: monthlySummaries,
      updated_at: now,
    });
  }
  await writeLocalAttentionRecords(local);

  return { ok: true as const, analytics: { userId, dailyLogs, monthlySummaries, lastUpdated: now } };
}
