export type GameId =
  | 'focus-fire'
  | 'memory-matrix'
  | 'reflex-rush'
  | 'sequence-snap'
  | 'vortex-vision'
  | 'flash-fusion'
  | 'shape-shifter'
  | 'pattern-forge'
  | 'logic-circuit'
  | 'store-sim'
  | 'precision-pointer'
  | 'focus-duel';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameComponentProps {
  gameId: GameId;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  completedDifficulties?: Record<string, Difficulty[]>;
  soundMuted: boolean;
  onComplete: (score: number, accuracyEarned: number) => void;
  onExit: () => void;
}

export interface AttentionStats {
  focusFireBest: number;
  memoryMatrixBest: number;
  reflexRushBest: number;        // ms (lower is better)
  sequenceSnapBest: number;      // digits
  vortexVisionBest?: number;     // score
  flashFusionBest?: number;      // score
  shapeShifterBest?: number;     // score
  patternForgeBest?: number;     // max level / score
  logicCircuitBest?: number;     // max level / score
  storeSimBest?: number;         // close score
  totalSessions: number;
  dailySessions: Record<string, number>;
  dailyScores: Record<string, number>;
  streak: number;
  lastPlayedDate: string;
  questClaimedDate?: string;
  completedDifficulties?: Record<string, Difficulty[]>;

  // Backward compatibility optional fields
  focusDuelBest?: number;
  precisionPointerBest?: number;
}

export interface LeaderItem {
  userId: string;
  displayName: string;
  totalAccuracy: number;
  gamesPlayed: number;
  lastActive: string;
  rank?: number;
}

export interface HistoryEntry {
  id: string;
  gameId: GameId;
  gameName: string;
  gameIcon: string;
  scoreDisplay: string;
  accuracyEarned: number;
  difficulty: Difficulty;
  timestamp: string;
  xpEarned: number;
}

/* 📊 Long-Term Progress Analytics Data Types */

export interface DailyLog {
  date: string;               // YYYY-MM-DD
  avgFocusScore: number;
  totalAccuracy: number;
  sessionsCompleted: number;
  bestReactionMs: number;
  selectiveScore: number;
  memoryScore: number;
  reflexScore: number;
  spanScore: number;
  patternScore?: number;
  logicScore?: number;
}

export interface MonthlySummary {
  month: string;              // YYYY-MM
  monthLabel: string;         // e.g. "August 2026"
  avgFocusScore: number;
  totalAccuracy: number;
  totalSessions: number;
  peakStreak: number;
  domainScores: {
    selective: number;
    memory: number;
    reflex: number;
    span: number;
    pattern?: number;
    logic?: number;
  };
}

export interface AttentionAnalyticsState {
  dailyLogs: Record<string, DailyLog>;          // YYYY-MM-DD
  monthlySummaries: Record<string, MonthlySummary>; // YYYY-MM
}

export const STORAGE_KEY = 'pinit_attention_stats';
export const HISTORY_KEY = 'pinit_attention_history';
export const ANALYTICS_KEY = 'pinit_attention_analytics_v2';

export const defaultStats: AttentionStats = {
  focusFireBest: 0, memoryMatrixBest: 0, reflexRushBest: 0, sequenceSnapBest: 0,
  vortexVisionBest: 0, flashFusionBest: 0, shapeShifterBest: 0,
  patternForgeBest: 0, logicCircuitBest: 0, storeSimBest: 0,
  totalSessions: 0, dailySessions: {}, dailyScores: {}, streak: 0, lastPlayedDate: '',
  completedDifficulties: {},
};

export const RANKS = [
  { name: 'Wandering', min: 0,   icon: '·', color: '#6b7280' },
  { name: 'Aware',     min: 200, icon: '◦', color: '#3b82f6' },
  { name: 'Focused',   min: 400, icon: '●', color: '#8b5cf6' },
  { name: 'Deep',      min: 600, icon: '◉', color: '#d97706' },
  { name: 'Still',     min: 800, icon: '◎', color: '#d4a843' },
];

export const GAMES = [
  { id: 'focus-fire' as GameId,    icon: '◉', name: 'Focus Fire',     desc: 'Tap the raised gold tile. Ignore the rest as the pace steps up.', skill: 'Selective attention', color: '#d97706' },
  { id: 'memory-matrix' as GameId, icon: '▦', name: 'Memory Matrix',  desc: 'Hold a tile pattern, then tap it back from memory.', skill: 'Working memory', color: '#7c3aed' },
  { id: 'reflex-rush' as GameId,   icon: '●', name: 'Reflex Rush',    desc: 'Wait for green. Do not tap early, and skip red.', skill: 'Sustained attention', color: '#059669' },
  { id: 'sequence-snap' as GameId, icon: '≡', name: 'Sequence Snap',  desc: 'Watch the digits, then enter them in order on the pad.', skill: 'Memory span', color: '#2563eb' },
  { id: 'vortex-vision' as GameId, icon: '◌', name: 'Vortex Vision',  desc: 'Track the gold mark in a slow orbit. Ignore the rest.', skill: 'Peripheral focus', color: '#db2777' },
  { id: 'flash-fusion' as GameId,  icon: '▣', name: 'Flash Fusion',   desc: 'Tap only when the current symbol matches the last one.', skill: 'N-back vigilance', color: '#6366f1' },
  { id: 'shape-shifter' as GameId, icon: '◇', name: 'Shape Shifter',  desc: 'The rule flips between color and shape. Switch with it.', skill: 'Task switching', color: '#d97706' },
  { id: 'pattern-forge' as GameId, icon: '▤', name: 'Pattern Forge',  desc: 'Find the sequence, rotation, or matrix rule before time runs out.', skill: 'Pattern reasoning', color: '#db2777' },
  { id: 'logic-circuit' as GameId, icon: '⊞', name: 'Logic Circuit',  desc: 'Read the gates and conditions. Choose the valid output.', skill: 'Analytical reasoning', color: '#2563eb' },
  { id: 'store-sim' as GameId,     icon: '◆', name: 'Studio Counter', desc: 'Sell your CSS or business piece to an AI buyer. Match the brief, price it fairly.', skill: 'Social focus', color: '#0d9488' },
];

export function triggerHaptic(type: 'light' | 'heavy' | 'success') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    if (type === 'light') navigator.vibrate(15);
    else if (type === 'heavy') navigator.vibrate([30, 40, 30]);
    else if (type === 'success') navigator.vibrate([20, 30, 60]);
  } catch {}
}

export function playSound(type: 'correct' | 'wrong' | 'win' | 'click' | 'level', muted: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start(); osc.stop(ctx.currentTime + 0.12);
      triggerHaptic('light');
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.start(); osc.stop(ctx.currentTime + 0.22);
      triggerHaptic('heavy');
    } else if (type === 'level') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
      triggerHaptic('success');
    } else if (type === 'click') {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
      triggerHaptic('success');
    }
  } catch {}
}

export function calcFocusScore(s: AttentionStats): number {
  const ff = Math.min(150, s.focusFireBest * 6);
  const mm = Math.min(150, s.memoryMatrixBest * 22);
  const rr = s.reflexRushBest > 0 ? Math.min(150, Math.max(0, 150 - (s.reflexRushBest - 150) * 0.5)) : 0;
  const ss = Math.min(150, s.sequenceSnapBest * 16);
  const vv = Math.min(120, (s.vortexVisionBest || 0) * 10);
  const fl = Math.min(120, (s.flashFusionBest || 0) * 10);
  const pf = Math.min(140, (s.patternForgeBest || 0) * 20);
  const lc = Math.min(140, (s.logicCircuitBest || 0) * 20);
  const sh = Math.min(100, (s.shapeShifterBest || 0) * 8);
  const st = Math.min(120, (s.storeSimBest || 0) * 0.35);
  return Math.min(999, Math.round(ff + mm + rr + ss + vv + fl + pf + lc + sh + st));
}

export function getRank(score: number) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (score >= r.min) rank = r; }
  return rank;
}

export function getNextRank(score: number) {
  for (const r of RANKS) { if (score < r.min) return r; }
  return null;
}

export function isDifficultyUnlocked(gameId: GameId, diff: Difficulty, completedMap?: Record<string, Difficulty[]>): boolean {
  if (diff === 'easy') return true;
  const gameDone = completedMap?.[gameId] || [];
  if (diff === 'normal') return gameDone.includes('easy') || gameDone.includes('normal') || gameDone.includes('hard');
  if (diff === 'hard') return gameDone.includes('normal') || gameDone.includes('hard');
  return false;
}
