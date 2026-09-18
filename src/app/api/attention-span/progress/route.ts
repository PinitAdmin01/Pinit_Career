import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { getAttentionAnalytics, saveAttentionAnalytics } from '@/lib/attention/progress';

export interface AttentionStats {
  focusFireBest: number;
  memoryMatrixBest: number;
  reflexRushBest: number;
  sequenceSnapBest: number;
  vortexVisionBest?: number;
  flashFusionBest?: number;
  shapeShifterBest?: number;
  patternForgeBest?: number;
  logicCircuitBest?: number;
  storeSimBest?: number;
  precisionPointerBest?: number;
  totalSessions: number;
  streak: number;
  lastPlayedDate: string;
  dailyScores: Record<string, number>;
  dailySessions: Record<string, number>;
  completedDifficulties: Record<string, string[]>;
}

/**
 * Keyed HMAC-SHA256 integrity signature.
 * Prevents client-side forgery of integrity tokens.
 */
export function computeIntegrityHash(userId: string, stats: AttentionStats): string {
  const secret = process.env.NEXTAUTH_SECRET || 'pinit-attention-integrity-secret-fallback-key';
  const payload = `${userId}:${stats.totalSessions}:${stats.streak}:${stats.reflexRushBest}:${stats.focusFireBest}:${stats.memoryMatrixBest}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex').substring(0, 16);
}

function sanitizeAndValidateStats(raw: Partial<AttentionStats>): AttentionStats {
  const sanitizeNum = (v: any, min = 0, max = 100000): number => {
    const num = Number(v);
    if (isNaN(num) || num < min) return min;
    if (num > max) return max;
    return Math.round(num);
  };

  // Reflex rush reaction time: 0 means unplayed; valid reaction range is 80ms - 10000ms
  let reflexBest = sanitizeNum(raw.reflexRushBest, 0, 10000);
  if (reflexBest > 0 && reflexBest < 80) {
    // Biologically impossible human reaction time floor
    reflexBest = 80;
  }

  return {
    focusFireBest: sanitizeNum(raw.focusFireBest, 0, 50000),
    memoryMatrixBest: sanitizeNum(raw.memoryMatrixBest, 0, 100),
    reflexRushBest: reflexBest,
    sequenceSnapBest: sanitizeNum(raw.sequenceSnapBest, 0, 100),
    vortexVisionBest: sanitizeNum(raw.vortexVisionBest, 0, 50000),
    flashFusionBest: sanitizeNum(raw.flashFusionBest, 0, 50000),
    shapeShifterBest: sanitizeNum(raw.shapeShifterBest, 0, 50000),
    patternForgeBest: sanitizeNum(raw.patternForgeBest, 0, 50000),
    logicCircuitBest: sanitizeNum(raw.logicCircuitBest, 0, 50000),
    storeSimBest: sanitizeNum(raw.storeSimBest, 0, 50000),
    precisionPointerBest: sanitizeNum(raw.precisionPointerBest, 0, 50000),
    totalSessions: sanitizeNum(raw.totalSessions, 0, 100000),
    streak: sanitizeNum(raw.streak, 0, 3650),
    lastPlayedDate: typeof raw.lastPlayedDate === 'string' ? raw.lastPlayedDate.slice(0, 10) : '',
    dailyScores: typeof raw.dailyScores === 'object' && raw.dailyScores !== null ? raw.dailyScores : {},
    dailySessions: typeof raw.dailySessions === 'object' && raw.dailySessions !== null ? raw.dailySessions : {},
    completedDifficulties: typeof raw.completedDifficulties === 'object' && raw.completedDifficulties !== null ? raw.completedDifficulties : {},
  };
}

const DEFAULT_STATS: AttentionStats = {
  focusFireBest: 0,
  memoryMatrixBest: 0,
  reflexRushBest: 0,
  sequenceSnapBest: 0,
  vortexVisionBest: 0,
  flashFusionBest: 0,
  shapeShifterBest: 0,
  patternForgeBest: 0,
  logicCircuitBest: 0,
  storeSimBest: 0,
  precisionPointerBest: 0,
  totalSessions: 0,
  streak: 0,
  lastPlayedDate: '',
  dailyScores: {},
  dailySessions: {},
  completedDifficulties: {},
};

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const analyticsRes = await getAttentionAnalytics(userId);

    const storedStats = analyticsRes.analytics?.dailyLogs?.current_stats?.stats;
    const stats = storedStats ? sanitizeAndValidateStats(storedStats) : DEFAULT_STATS;
    const hash = computeIntegrityHash(userId, stats);
    const lastUpdated = analyticsRes.analytics?.lastUpdated || new Date().toISOString();

    return NextResponse.json({
      ok: true,
      stats,
      integrityHash: hash,
      lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`attention_progress_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const body = await req.json().catch(() => ({}));
    const rawStats = body?.stats;

    if (!rawStats || typeof rawStats !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid stats payload' }, { status: 400 });
    }

    const validatedStats = sanitizeAndValidateStats(rawStats);

    // Monotonicity defense: totalSessions cannot decrease
    const existingRes = await getAttentionAnalytics(userId);
    const prevStats = existingRes.analytics?.dailyLogs?.current_stats?.stats;
    if (prevStats && typeof prevStats.totalSessions === 'number') {
      validatedStats.totalSessions = Math.max(validatedStats.totalSessions, prevStats.totalSessions);
    }

    const hash = computeIntegrityHash(userId, validatedStats);
    const now = new Date().toISOString();

    // Persist to attention_span_progress (and persistent local fallback)
    await saveAttentionAnalytics(
      userId,
      {
        date: 'current_stats',
        stats: validatedStats,
        integrityHash: hash,
        updatedAt: now,
      },
      undefined
    );

    return NextResponse.json({
      ok: true,
      stats: validatedStats,
      integrityHash: hash,
      lastUpdated: now,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to save progress' }, { status: 500 });
  }
}
