import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

interface AttentionStats {
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

// Global in-memory cache for fast session retrieval and offline/local fallback
const serverProgressStore: Record<string, { stats: AttentionStats; hash: string; lastUpdated: string }> = {};

function computeIntegrityHash(userId: string, stats: AttentionStats): string {
  const payload = `${userId}:${stats.totalSessions}:${stats.streak}:${stats.reflexRushBest}:${stats.focusFireBest}:${stats.memoryMatrixBest}`;
  return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16);
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
    // Biologically impossible human reaction time; cap at realistic floor
    reflexBest = 80;
  }

  const sanitized: AttentionStats = {
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

  return sanitized;
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;

    // 1. Check in-memory store
    let entry = serverProgressStore[userId];

    // 2. Fallback to Supabase profiles metadata if not in memory
    if (!entry) {
      try {
        const { data } = await supabase
          .from('users')
          .select('id, attention_stats')
          .eq('id', userId)
          .single();

        if (data && (data as any).attention_stats) {
          const stats = sanitizeAndValidateStats((data as any).attention_stats);
          entry = {
            stats,
            hash: computeIntegrityHash(userId, stats),
            lastUpdated: new Date().toISOString(),
          };
          serverProgressStore[userId] = entry;
        }
      } catch {
        // Fall through to empty default
      }
    }

    if (!entry) {
      const defaultStats: AttentionStats = {
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
      entry = {
        stats: defaultStats,
        hash: computeIntegrityHash(userId, defaultStats),
        lastUpdated: new Date().toISOString(),
      };
      serverProgressStore[userId] = entry;
    }

    return NextResponse.json({
      ok: true,
      stats: entry.stats,
      integrityHash: entry.hash,
      lastUpdated: entry.lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const body = await req.json();
    const rawStats = body?.stats;

    if (!rawStats || typeof rawStats !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid stats payload' }, { status: 400 });
    }

    const validatedStats = sanitizeAndValidateStats(rawStats);
    const hash = computeIntegrityHash(userId, validatedStats);
    const now = new Date().toISOString();

    serverProgressStore[userId] = {
      stats: validatedStats,
      hash,
      lastUpdated: now,
    };

    // Try saving to Supabase users
    try {
      await supabase
        .from('users')
        .update({
          attention_stats: validatedStats,
          updated_at: now,
        })
        .eq('id', userId);
    } catch {
      // Non-blocking in local mode
    }

    return NextResponse.json({
      ok: true,
      stats: validatedStats,
      integrityHash: hash,
      lastUpdated: now,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
