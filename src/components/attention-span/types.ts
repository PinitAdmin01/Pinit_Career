export type GameId =
  | 'focus-fire'
  | 'memory-matrix'
  | 'reflex-rush'
  | 'sequence-snap'
  | 'focus-duel'
  | 'vortex-vision'
  | 'flash-fusion'
  | 'shape-shifter'
  | 'precision-pointer';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface AttentionStats {
  focusFireBest: number;
  memoryMatrixBest: number;
  reflexRushBest: number;        // ms (lower is better)
  sequenceSnapBest: number;      // digits
  vortexVisionBest?: number;     // score
  flashFusionBest?: number;      // score
  shapeShifterBest?: number;     // score
  precisionPointerBest?: number; // lock-on time (ms)
  totalSessions: number;
  dailySessions: Record<string, number>;
  dailyScores: Record<string, number>;
  streak: number;
  lastPlayedDate: string;
  questClaimedDate?: string;
  completedDifficulties?: Record<string, Difficulty[]>;
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
  vortexVisionBest: 0, flashFusionBest: 0, shapeShifterBest: 0, precisionPointerBest: 0,
  totalSessions: 0, dailySessions: {}, dailyScores: {}, streak: 0, lastPlayedDate: '',
  completedDifficulties: {},
};

export const RANKS = [
  { name: 'Wandering Mind', min: 0,   icon: '💭', color: '#6b7280' },
  { name: 'Aware',          min: 200, icon: '👁️', color: '#3b82f6' },
  { name: 'Focused Mind',   min: 400, icon: '🎯', color: '#8b5cf6' },
  { name: 'Deep Focus',     min: 600, icon: '🔥', color: '#f59e0b' },
  { name: 'Zen Master',     min: 800, icon: '🧘', color: '#d4a843' },
];

export const GAMES = [
  { id: 'focus-fire' as GameId,        icon: '🎯', name: 'Focus Fire',        desc: 'Tap gold targets as speed ramps up every 10s: Normal ➔ Boost ➔ Hyper!', skill: 'Selective Attention', color: '#d4a843' },
  { id: 'memory-matrix' as GameId,     icon: '🧠', name: 'Memory Matrix',     desc: 'Memorize expanding tile patterns and reproduce them from memory', skill: 'Working Memory', color: '#8b5cf6' },
  { id: 'reflex-rush' as GameId,       icon: '⚡', name: 'Reflex Rush',       desc: 'React fast to green circles — resist tapping red decoys', skill: 'Sustained Attention', color: '#10b981' },
  { id: 'sequence-snap' as GameId,     icon: '🔢', name: 'Sequence Snap',     desc: 'Watch number sequences flash and type them back in exact order', skill: 'Memory Span', color: '#3b82f6' },
  { id: 'focus-duel' as GameId,        icon: '⚔️', name: '1v1 AI Focus Duel', desc: 'Sprint head-to-head against AI rival Aarav in a live focus battle', skill: 'Competitive Focus', color: '#ef4444' },
  { id: 'vortex-vision' as GameId,     icon: '🌀', name: 'Vortex Vision',     desc: 'Track gold stars flashing inside a spinning vortex while ignoring orbiting debris', skill: 'Peripheral Focus', color: '#ec4899' },
  { id: 'flash-fusion' as GameId,      icon: '⚡', name: 'Flash Fusion',      desc: 'High-speed symbol stream — tap ONLY when consecutive symbols match back-to-back', skill: 'N-Back Vigilance', color: '#6366f1' },
  { id: 'shape-shifter' as GameId,     icon: '🧩', name: 'Shape Shifter',     desc: 'Dynamic task-switching — adapt instantly as rules flip between MATCH COLOR & MATCH SHAPE', skill: 'Task Switching', color: '#f59e0b' },
  { id: 'precision-pointer' as GameId, icon: '🎯', name: 'Precision Pointer', desc: 'Maintain continuous laser crosshair lock-on as targets maneuver along erratic paths', skill: 'Micro-Attention', color: '#14b8a6' },
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
  const ff = Math.min(180, s.focusFireBest * 7);
  const mm = Math.min(180, s.memoryMatrixBest * 25);
  const rr = s.reflexRushBest > 0 ? Math.min(180, Math.max(0, 180 - (s.reflexRushBest - 150) * 0.6)) : 0;
  const ss = Math.min(180, s.sequenceSnapBest * 18);
  const vv = Math.min(140, (s.vortexVisionBest || 0) * 12);
  const fl = Math.min(140, (s.flashFusionBest || 0) * 12);
  return Math.min(999, Math.round(ff + mm + rr + ss + vv + fl));
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
