/**
 * PinIT Career OS — Unified Telemetry & Mentality Ledger
 *
 * Tracks every positive (+) and negative (-) adjustment across:
 * - Trust Score (+3 missions/lessons/exams/interviews, +5 verified vault, -5 fake vault, -2 cheat/session)
 * - Arena League Points (+LP from Weekly XP & Arena wins)
 * - Arena ELO (+20 win / -20 loss, default 100)
 * - Weekly Experience (XP earned)
 * - Career Score (0-100 composite readiness growth)
 * - Mentality Shifts (Pattern Hunter, Social Intelligence, Stabilizer, Explorer)
 */

export type MetricKind =
  | 'trust_score'
  | 'arena_league_points'
  | 'arena_elo'
  | 'weekly_xp'
  | 'career_score'
  | 'mentality';

export type MentalityTrait =
  | 'Pattern Hunter'
  | 'Social Intelligence'
  | 'Stabilizer'
  | 'Explorer';

export interface MetricLedgerEntry {
  id: string;
  timestamp: string;
  metric: MetricKind;
  feature: string;
  action: string;
  delta: number;
  previousValue: number;
  valueAfter: number;
  mentalityTag?: MentalityTrait;
  meta?: Record<string, any>;
}

export interface MentalityProfileBreakdown {
  dominant: MentalityTrait;
  secondary: MentalityTrait;
  traits: Array<{
    trait: MentalityTrait;
    score: number;
    percent: number;
    badge: string;
    summary: string;
    color: string;
  }>;
}

const MAX_LEDGER_ENTRIES = 300;
const inMemoryLedgers = new Map<string, MetricLedgerEntry[]>();

export function getMetricsLedgerStorageKey(userId?: string | null): string {
  const safeId = userId && userId !== 'guest' ? userId : 'guest';
  return `pinit_metrics_ledger_${safeId}`;
}

function readStoredLedger(userId?: string | null): MetricLedgerEntry[] {
  const safeId = userId && userId !== 'guest' ? userId : 'guest';
  if (inMemoryLedgers.has(safeId)) {
    return inMemoryLedgers.get(safeId)!;
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(getMetricsLedgerStorageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          inMemoryLedgers.set(safeId, parsed);
          return parsed;
        }
      }
    } catch {}
  }
  return [];
}

function saveStoredLedger(userId: string | null | undefined, entries: MetricLedgerEntry[]): void {
  const safeId = userId && userId !== 'guest' ? userId : 'guest';
  const bounded = entries.slice(0, MAX_LEDGER_ENTRIES);
  inMemoryLedgers.set(safeId, bounded);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(getMetricsLedgerStorageKey(userId), JSON.stringify(bounded));
      window.dispatchEvent(
        new CustomEvent('pinit-metrics-ledger-updated', {
          detail: { userId: safeId, count: bounded.length, latest: bounded[0] },
        })
      );
    } catch {}
  }
}

export function clearMetricLedger(userId?: string | null): void {
  if (!userId) {
    inMemoryLedgers.clear();
  } else {
    const safeId = userId !== 'guest' ? userId : 'guest';
    inMemoryLedgers.delete(safeId);
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(getMetricsLedgerStorageKey(userId));
    } catch {}
  }
}

export function recordMetricLedgerEntry(
  userId: string | null | undefined,
  input: Omit<MetricLedgerEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): MetricLedgerEntry {
  const existing = readStoredLedger(userId);
  const entry: MetricLedgerEntry = {
    id: input.id || `ml_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: input.timestamp || new Date().toISOString(),
    metric: input.metric,
    feature: input.feature,
    action: input.action,
    delta: Math.round(input.delta),
    previousValue: Math.round(input.previousValue),
    valueAfter: Math.round(input.valueAfter),
    mentalityTag: input.mentalityTag,
    meta: input.meta,
  };

  const next = [entry, ...existing];
  saveStoredLedger(userId, next);
  return entry;
}

export function getMetricLedger(
  userId?: string | null,
  metricFilter?: MetricKind
): MetricLedgerEntry[] {
  const all = readStoredLedger(userId);
  if (!metricFilter) return all;
  return all.filter((e) => e.metric === metricFilter);
}

/**
 * Computes real-time Mentality Breakdown (Pattern Hunter, Social Intelligence, Stabilizer, Explorer)
 * from the student's actual completed quests, missions, verified proofs, trust integrity, and Arena stats.
 */
export function computeMentalityBreakdown(params: {
  completedQuestsCount?: number;
  completedMissionsCount?: number;
  missionStreak?: number;
  trustScore?: number;
  arenaElo?: number;
  arenaWins?: number;
  verifiedVaultCount?: number;
  totalVaultCount?: number;
  interviewsCount?: number;
  baseArchetype?: string | null;
}): MentalityProfileBreakdown {
  const quests = Math.max(0, Number(params.completedQuestsCount) || 0);
  const missions = Math.max(0, Number(params.completedMissionsCount) || 0);
  const streak = Math.max(0, Number(params.missionStreak) || 0);
  const trust = Number.isFinite(Number(params.trustScore)) ? Number(params.trustScore) : 50;
  const elo = Number.isFinite(Number(params.arenaElo)) ? Number(params.arenaElo) : 100;
  const wins = Math.max(0, Number(params.arenaWins) || 0);
  const verifiedVault = Math.max(0, Number(params.verifiedVaultCount) || 0);
  const totalVault = Math.max(0, Number(params.totalVaultCount) || 0);
  const interviews = Math.max(0, Number(params.interviewsCount) || 0);
  const base = String(params.baseArchetype || '').toLowerCase();

  let patternHunter = 25 + Math.min(40, quests * 4) + Math.min(25, Math.max(0, elo - 100) * 0.5) + wins * 6;
  let stabilizer = 25 + Math.min(35, Math.max(0, trust - 30) * 0.6) + Math.min(25, streak * 5) + verifiedVault * 8;
  let socialIntelligence = 25 + Math.min(35, interviews * 10) + Math.min(20, missions * 4) + verifiedVault * 4;
  let explorer = 25 + Math.min(30, totalVault * 6) + Math.min(25, quests * 2) + Math.min(20, missions * 3);

  // Subtle calibration weight from initial diagnostic archetype
  if (base.includes('pattern')) patternHunter += 12;
  else if (base.includes('stabiliz')) stabilizer += 12;
  else if (base.includes('social')) socialIntelligence += 12;
  else if (base.includes('explor')) explorer += 12;

  const rawList: Array<{ trait: MentalityTrait; score: number; badge: string; summary: string; color: string }> = [
    {
      trait: 'Pattern Hunter',
      score: Math.round(patternHunter),
      badge: '🔍',
      summary: 'Algorithmic decomposition, coding speed, and Arena tactical logic.',
      color: 'var(--accent)',
    },
    {
      trait: 'Stabilizer',
      score: Math.round(stabilizer),
      badge: '🛡️',
      summary: 'High Trust integrity, streak consistency, and verified proof-of-work.',
      color: 'var(--green)',
    },
    {
      trait: 'Social Intelligence',
      score: Math.round(socialIntelligence),
      badge: '🤝',
      summary: 'STAR interview articulation, oral defense composure, and collaboration.',
      color: 'var(--teal)',
    },
    {
      trait: 'Explorer',
      score: Math.round(explorer),
      badge: '🧭',
      summary: 'Cross-domain skill acquisition, Vault evidence breadth, and curiosity.',
      color: 'var(--amber)',
    },
  ];

  const totalScore = rawList.reduce((acc, r) => acc + r.score, 0) || 1;
  const sorted = rawList
    .map((r) => ({ ...r, percent: Math.round((r.score / totalScore) * 100) }))
    .sort((a, b) => b.score - a.score);

  return {
    dominant: sorted[0].trait,
    secondary: sorted[1].trait,
    traits: sorted,
  };
}

export const METRIC_LABELS: Record<MetricKind, { label: string; unit: string; color: string }> = {
  trust_score: { label: 'Trust Score', unit: 'pts', color: 'var(--green)' },
  arena_league_points: { label: 'Arena League Points', unit: 'LP', color: 'var(--amber)' },
  arena_elo: { label: 'Arena ELO', unit: 'ELO', color: 'var(--teal)' },
  weekly_xp: { label: 'Weekly Experience', unit: 'XP', color: 'var(--purple)' },
  career_score: { label: 'Career Score', unit: 'pts', color: 'var(--accent)' },
  mentality: { label: 'Mentality Shift', unit: 'idx', color: 'var(--blue)' },
};
