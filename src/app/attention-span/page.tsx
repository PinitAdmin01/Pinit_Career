'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';

import {
  GameId,
  Difficulty,
  AttentionStats,
  LeaderItem,
  HistoryEntry,
  STORAGE_KEY,
  HISTORY_KEY,
  ANALYTICS_KEY,
  AttentionAnalyticsState,
  DailyLog,
  MonthlySummary,
  defaultStats,
  RANKS,
  GAMES,
  playSound,
  calcFocusScore,
  getRank,
  getNextRank,
  isDifficultyUnlocked,
} from '@/components/attention-span/types';

import '@/styles/attention-games.css';
import { FocusFireGame } from '@/components/attention-span/FocusFireGame';
import { ReflexRushGame } from '@/components/attention-span/ReflexRushGame';
import { PatternForgeGame } from '@/components/attention-span/PatternForgeGame';
import { LogicCircuitGame } from '@/components/attention-span/LogicCircuitGame';
import { StoreSimGame } from '@/components/attention-span/StoreSimGame';
import {
  MemoryMatrixGame,
  SequenceSnapGame,
  VortexVisionGame,
  FlashFusionGame,
  ShapeShifterGame,
} from './game-components';

import { ConfettiCanvas } from '@/components/attention-span/ConfettiCanvas';
import { ProgressAnalyticsModal } from '@/components/attention-span/ProgressAnalyticsModal';

const todayStr = () => new Date().toISOString().slice(0, 10);

/* ═══════════════════════════════════════════════════════════════
   MAIN ATTENTION SPAN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function AttentionSpanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addXp, earnPins, rewardActivity } = useCareerOS();

  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy'); // Starts on Easy mode by default!
  const [stats, setStats] = useState<AttentionStats>(defaultStats);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [analytics, setAnalytics] = useState<AttentionAnalyticsState>({ dailyLogs: {}, monthlySummaries: {} });
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [loaded, setLoaded] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Leaderboard state ──
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [userRank, setUserRank] = useState<number>(1);
  const [userTotalAccuracy, setUserTotalAccuracy] = useState<number>(0);
  const [syncing, setSyncing] = useState<boolean>(false);

  // ── Auth guard ──
  useEffect(() => { if (user === null) router.replace('/login'); }, [user, router]);

  // ── Fetch Leaderboard API ──
  const fetchLeaderboard = useCallback(async (uid?: string) => {
    try {
      setSyncing(true);
      const res = await fetch(`/api/attention-span/leaderboard?userId=${uid || user?.id || ''}`);
      const data = await res.json();
      if (data.ok) {
        setLeaders(data.leaders || []);
        setUserRank(data.userRank || 1);
        const me = (data.leaders || []).find((l: LeaderItem) => l.userId === (uid || user?.id));
        if (me) setUserTotalAccuracy(me.totalAccuracy);
      }
    } catch {}
    setSyncing(false);
  }, [user?.id]);

  // ── Load stats, history, analytics & leaderboard ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStats(JSON.parse(raw));

      const rawHist = localStorage.getItem(HISTORY_KEY);
      if (rawHist) setHistory(JSON.parse(rawHist));

      const rawAnalytics = localStorage.getItem(ANALYTICS_KEY);
      if (rawAnalytics) setAnalytics(JSON.parse(rawAnalytics));

      const muted = localStorage.getItem('pinit_attention_muted');
      if (muted) setSoundMuted(muted === 'true');
    } catch {}
    setLoaded(true);
    if (user?.id) {
      fetchLeaderboard(user.id);
      fetch(`/api/attention-span/analytics?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.analytics) {
            setAnalytics(prev => ({
              dailyLogs: { ...prev.dailyLogs, ...(data.analytics.dailyLogs || {}) },
              monthlySummaries: { ...prev.monthlySummaries, ...(data.analytics.monthlySummaries || {}) },
            }));
          }
        })
        .catch(() => {});
    }
  }, [user?.id, fetchLeaderboard]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    localStorage.setItem('pinit_attention_muted', String(next));
    if (!next) {
      playSound('level', false);
    }
  };

  // ── Save stats helper ──
  const saveStats = useCallback((next: AttentionStats) => {
    setStats(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  // ── Save history helper ──
  const addHistoryEntry = useCallback((entry: HistoryEntry) => {
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const resetAllProgress = () => {
    if (confirm('Reset all completed difficulty unlocks and test from scratch?')) {
      const clean = { ...defaultStats, completedDifficulties: {} };
      saveStats(clean);
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
      playSound('click', soundMuted);
    }
  };

  // ── Submit Accuracy to End-to-End API ──
  const submitAccuracyToLeaderboard = useCallback(async (accuracyEarned: number) => {
    if (!user?.id) return;
    try {
      setSyncing(true);
      const name = user.displayName || user.email?.split('@')[0] || 'You';
      const res = await fetch('/api/attention-span/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          displayName: name,
          accuracyEarned,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setLeaders(data.leaders || []);
        setUserRank(data.userRank || 1);
        setUserTotalAccuracy(data.newTotalAccuracy || 0);
      }
    } catch {}
    setSyncing(false);
  }, [user]);

  // ── On game complete ──
  const handleGameComplete = useCallback((gameId: GameId, score: number, rawAccuracy: number) => {
    playSound('win', soundMuted);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const today = todayStr();
    const updated = { ...stats };
    let isNewHigh = false;

    // Difficulty Accuracy Multipliers: Easy 1.0x, Normal 1.5x, Hard 2.5x
    const mult = difficulty === 'hard' ? 2.5 : difficulty === 'normal' ? 1.5 : 1.0;
    const finalAccuracy = Math.round(rawAccuracy * mult);

    if (gameId === 'focus-fire' && score > updated.focusFireBest) { updated.focusFireBest = score; isNewHigh = true; }
    if (gameId === 'memory-matrix' && score > updated.memoryMatrixBest) { updated.memoryMatrixBest = score; isNewHigh = true; }
    if (gameId === 'reflex-rush' && (updated.reflexRushBest === 0 || score < updated.reflexRushBest)) { updated.reflexRushBest = score; isNewHigh = true; }
    if (gameId === 'sequence-snap' && score > updated.sequenceSnapBest) { updated.sequenceSnapBest = score; isNewHigh = true; }
    if (gameId === 'vortex-vision' && score > (updated.vortexVisionBest || 0)) { updated.vortexVisionBest = score; isNewHigh = true; }
    if (gameId === 'flash-fusion' && score > (updated.flashFusionBest || 0)) { updated.flashFusionBest = score; isNewHigh = true; }
    if (gameId === 'shape-shifter' && score > (updated.shapeShifterBest || 0)) { updated.shapeShifterBest = score; isNewHigh = true; }
    if (gameId === 'pattern-forge' && score > (updated.patternForgeBest || 0)) { updated.patternForgeBest = score; isNewHigh = true; }
    if (gameId === 'logic-circuit' && score > (updated.logicCircuitBest || 0)) { updated.logicCircuitBest = score; isNewHigh = true; }
    if (gameId === 'store-sim' && score > (updated.storeSimBest || 0)) { updated.storeSimBest = score; isNewHigh = true; }
    if (gameId === 'precision-pointer' && score > (updated.precisionPointerBest || 0)) { updated.precisionPointerBest = score; isNewHigh = true; }

    // Progressive Difficulty Completion Tracking
    const comp = { ...updated.completedDifficulties };
    const gameComp = comp[gameId] || [];
    if (!gameComp.includes(difficulty)) {
      comp[gameId] = [...gameComp, difficulty];
      updated.completedDifficulties = comp;
    }

    updated.totalSessions += 1;
    updated.dailySessions = { ...updated.dailySessions, [today]: (updated.dailySessions[today] || 0) + 1 };

    if (updated.lastPlayedDate !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      updated.streak = updated.lastPlayedDate === yStr ? updated.streak + 1 : 1;
      updated.lastPlayedDate = today;
    }

    // Calculate updated focus score and save stats
    const newFocusScore = calcFocusScore(updated);
    updated.dailyScores = { ...updated.dailyScores, [today]: newFocusScore };

    // Persist stats (including completedDifficulties ladder) & sync to leaderboard
    saveStats(updated);
    submitAccuracyToLeaderboard(finalAccuracy);

    // Update Daily and Monthly Analytics Records
    const currentMonth = today.slice(0, 7);
    const monthLabel = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' });

    setAnalytics(prevAnalytics => {
      const existingDaily: DailyLog = prevAnalytics.dailyLogs[today] || {
        date: today,
        avgFocusScore: newFocusScore,
        totalAccuracy: 0,
        sessionsCompleted: 0,
        bestReactionMs: gameId === 'reflex-rush' ? score : 0,
        selectiveScore: Math.min(100, Math.round((updated.focusFireBest / 25) * 100)),
        memoryScore: Math.min(100, Math.round((updated.memoryMatrixBest / 8) * 100)),
        reflexScore: updated.reflexRushBest > 0 ? Math.min(100, Math.max(10, Math.round(100 - (updated.reflexRushBest - 150) * 0.3))) : 0,
        spanScore: Math.min(100, Math.round((updated.sequenceSnapBest / 9) * 100)),
      };

      const updatedDaily: DailyLog = {
        ...existingDaily,
        avgFocusScore: Math.round((existingDaily.avgFocusScore + newFocusScore) / 2),
        totalAccuracy: existingDaily.totalAccuracy + finalAccuracy,
        sessionsCompleted: existingDaily.sessionsCompleted + 1,
        bestReactionMs: gameId === 'reflex-rush' ? (existingDaily.bestReactionMs > 0 ? Math.min(existingDaily.bestReactionMs, score) : score) : existingDaily.bestReactionMs,
      };

      const existingMonthly: MonthlySummary = prevAnalytics.monthlySummaries[currentMonth] || {
        month: currentMonth,
        monthLabel,
        avgFocusScore: newFocusScore,
        totalAccuracy: 0,
        totalSessions: 0,
        peakStreak: updated.streak,
        domainScores: {
          selective: updatedDaily.selectiveScore,
          memory: updatedDaily.memoryScore,
          reflex: updatedDaily.reflexScore,
          span: updatedDaily.spanScore,
        },
      };

      const updatedMonthly: MonthlySummary = {
        ...existingMonthly,
        avgFocusScore: Math.round((existingMonthly.avgFocusScore + newFocusScore) / 2),
        totalAccuracy: existingMonthly.totalAccuracy + finalAccuracy,
        totalSessions: existingMonthly.totalSessions + 1,
        peakStreak: Math.max(existingMonthly.peakStreak, updated.streak),
        domainScores: {
          selective: Math.max(existingMonthly.domainScores.selective, updatedDaily.selectiveScore),
          memory: Math.max(existingMonthly.domainScores.memory, updatedDaily.memoryScore),
          reflex: Math.max(existingMonthly.domainScores.reflex, updatedDaily.reflexScore),
          span: Math.max(existingMonthly.domainScores.span, updatedDaily.spanScore),
        },
      };

      const nextAnalyticsState: AttentionAnalyticsState = {
        dailyLogs: { ...prevAnalytics.dailyLogs, [today]: updatedDaily },
        monthlySummaries: { ...prevAnalytics.monthlySummaries, [currentMonth]: updatedMonthly },
      };

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(nextAnalyticsState));

      // Sync to backend Analytics API
      if (user?.id) {
        fetch('/api/attention-span/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            dailyLog: updatedDaily,
            monthlySummary: updatedMonthly,
          }),
        }).catch(() => {});
      }

      return nextAnalyticsState;
    });

    // Format score display string for history log
    let scoreDisplay = `${score} pts`;
    if (gameId === 'memory-matrix') scoreDisplay = `Level ${score}`;
    if (gameId === 'reflex-rush') scoreDisplay = `${score}ms avg`;
    if (gameId === 'sequence-snap') scoreDisplay = `${score} digits`;
    if (gameId === 'focus-duel') scoreDisplay = `Score: ${score}`;
    if (gameId === 'vortex-vision') scoreDisplay = `${score} stars`;
    if (gameId === 'flash-fusion') scoreDisplay = `${score} matches`;
    if (gameId === 'shape-shifter') scoreDisplay = `${score} flips`;
    if (gameId === 'pattern-forge') scoreDisplay = `${score} pts`;
    if (gameId === 'logic-circuit') scoreDisplay = `${score} pts`;
    if (gameId === 'store-sim') scoreDisplay = `${score} close`;

    const gameInfo = GAMES.find(g => g.id === gameId) || GAMES[0];
    const xpEarned = difficulty === 'hard' ? 35 : difficulty === 'normal' ? 20 : 10;

    // Log to session history
    addHistoryEntry({
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      gameId,
      gameName: gameInfo.name,
      gameIcon: gameInfo.icon,
      scoreDisplay,
      accuracyEarned: finalAccuracy,
      difficulty,
      timestamp: new Date().toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      xpEarned,
    });

    // Activity rewards (+10 XP, +1 DNA)
    try { rewardActivity('attention_game', `Attention: ${gameId}`); } catch {}
    if (isNewHigh) { try { addXp(15, 'Attention: New High Score!'); } catch {} }
  }, [stats, saveStats, addXp, rewardActivity, submitAccuracyToLeaderboard, soundMuted, difficulty, addHistoryEntry]);

  // ── Daily Quest Handler ──
  const today = todayStr();
  const todaySessionCount = stats.dailySessions[today] || 0;
  const questCompleted = todaySessionCount >= 2;
  const questClaimed = stats.questClaimedDate === today;

  const claimDailyQuest = () => {
    if (!questCompleted || questClaimed) return;
    playSound('level', soundMuted);
    saveStats({ ...stats, questClaimedDate: today });
    try {
      earnPins('mission_complete', 15, 'Daily Focus Quest Complete');
      addXp(40, 'Daily Focus Quest Completed');
    } catch {}
  };

  const handleLaunchGame = (gId: GameId) => {
    // If currently selected difficulty is locked for this game, default to 'easy'
    if (!isDifficultyUnlocked(gId, difficulty, stats.completedDifficulties)) {
      setDifficulty('easy');
    }
    setActiveGame(gId);
  };

  if (!user || !loaded) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--amber)', borderRadius: '50%', animation: 'attSpin 0.8s linear infinite' }} />
      </div>
    );
  }

  const focusScore = calcFocusScore(stats);
  const rank = getRank(focusScore);
  const nextRank = getNextRank(focusScore);

  // Radar chart metrics (normalized 0-100%)
  const selectiveScore = Math.min(100, Math.round((stats.focusFireBest / 25) * 100));
  const memoryScore = Math.min(100, Math.round((stats.memoryMatrixBest / 8) * 100));
  const reactionScore = stats.reflexRushBest > 0 ? Math.min(100, Math.max(10, Math.round(100 - (stats.reflexRushBest - 150) * 0.3))) : 0;
  const spanScore = Math.min(100, Math.round((stats.sequenceSnapBest / 9) * 100));

  // 7-day chart data
  const chartData: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });
    chartData.push({ label: dayLabel, value: stats.dailyScores[ds] || 0 });
  }
  const chartMax = Math.max(100, ...chartData.map(d => d.value));

  const bestDisplay = (gId: GameId) => {
    if (gId === 'focus-fire') return stats.focusFireBest > 0 ? `${stats.focusFireBest} pts` : '—';
    if (gId === 'memory-matrix') return stats.memoryMatrixBest > 0 ? `Level ${stats.memoryMatrixBest}` : '—';
    if (gId === 'reflex-rush') return stats.reflexRushBest > 0 ? `${stats.reflexRushBest}ms` : '—';
    if (gId === 'sequence-snap') return stats.sequenceSnapBest > 0 ? `${stats.sequenceSnapBest} digits` : '—';
    if (gId === 'vortex-vision') return stats.vortexVisionBest ? `${stats.vortexVisionBest} stars` : '—';
    if (gId === 'flash-fusion') return stats.flashFusionBest ? `${stats.flashFusionBest} matches` : '—';
    if (gId === 'shape-shifter') return stats.shapeShifterBest ? `${stats.shapeShifterBest} flips` : '—';
    if (gId === 'pattern-forge') return stats.patternForgeBest ? `${stats.patternForgeBest} pts` : '—';
    if (gId === 'logic-circuit') return stats.logicCircuitBest ? `${stats.logicCircuitBest} pts` : '—';
    if (gId === 'store-sim') return stats.storeSimBest ? `${stats.storeSimBest} close` : '—';
    return 'Play';
  };

  const filteredHistory = historyFilter === 'all'
    ? history
    : history.filter(h => h.gameId === historyFilter);

  return (
    <>
      <ConfettiCanvas active={showConfetti} />
      {showAnalyticsModal && (
        <ProgressAnalyticsModal
          analytics={analytics}
          currentFocusScore={calcFocusScore(stats)}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}
      {activeGame && createPortal(
        <div className="att-overlay">
          {activeGame === 'focus-fire' && <FocusFireGame gameId="focus-fire" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('focus-fire', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'memory-matrix' && <MemoryMatrixGame gameId="memory-matrix" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('memory-matrix', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'reflex-rush' && <ReflexRushGame gameId="reflex-rush" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('reflex-rush', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'sequence-snap' && <SequenceSnapGame gameId="sequence-snap" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('sequence-snap', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'vortex-vision' && <VortexVisionGame gameId="vortex-vision" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('vortex-vision', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'flash-fusion' && <FlashFusionGame gameId="flash-fusion" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('flash-fusion', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'shape-shifter' && <ShapeShifterGame gameId="shape-shifter" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('shape-shifter', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'pattern-forge' && <PatternForgeGame gameId="pattern-forge" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('pattern-forge', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'logic-circuit' && <LogicCircuitGame gameId="logic-circuit" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('logic-circuit', s, acc); }} onExit={() => setActiveGame(null)} />}
          {activeGame === 'store-sim' && <StoreSimGame gameId="store-sim" difficulty={difficulty} onDifficultyChange={setDifficulty} completedDifficulties={stats.completedDifficulties} soundMuted={soundMuted} onComplete={(s, acc) => { handleGameComplete('store-sim', s, acc); }} onExit={() => setActiveGame(null)} />}
        </div>,
        document.body
      )}

      <div className="att-dash">
        <div className="att-dash-head">
          <div>
            <h1>Attention Span</h1>
            <p>Quiet drills for focus, memory, and judgment.</p>
          </div>
          <div className="att-toolbar">
            <button type="button" className="att-tool is-accent" onClick={() => setShowAnalyticsModal(true)}>Progress</button>
            <button type="button" className={`att-tool${soundMuted ? '' : ' is-on'}`} onClick={toggleSound}>
              {soundMuted ? 'Sound off' : 'Sound on'}
            </button>
            <div className="att-tool">
              Mode · {difficulty}
            </div>
          </div>
        </div>

        <div className="att-quest">
          <div>
            <h3>Daily focus quest</h3>
            <p>Finish 2 sessions today ({todaySessionCount}/2) for +15 Pins and +40 XP.</p>
          </div>
          <button
            type="button"
            className={`att-btn ${questCompleted && !questClaimed ? 'att-btn-primary' : 'att-btn-ghost'}`}
            onClick={claimDailyQuest}
            disabled={!questCompleted || questClaimed}
          >
            {questClaimed ? 'Claimed' : questCompleted ? 'Claim' : 'In progress'}
          </button>
        </div>

        <div className="att-stats">
          {[
            { label: 'Focus score', value: focusScore },
            { label: 'Streak', value: stats.streak },
            { label: 'Accuracy', value: `${userTotalAccuracy}+` },
            { label: 'Sessions', value: stats.totalSessions },
          ].map((s) => (
            <div key={s.label} className="att-stat">
              <em>{s.label}</em>
              <b>{s.value}</b>
            </div>
          ))}
        </div>

        <div className="att-section-h">
          <h2>Studio ({GAMES.length})</h2>
          <span>Easy → Normal → Hard</span>
        </div>

        <div className="att-grid">
          {GAMES.map((g) => {
            const compList = stats.completedDifficulties?.[g.id] || [];
            const easyDone = compList.includes('easy');
            const normalDone = compList.includes('normal');
            const hardDone = compList.includes('hard');

            return (
              <button
                key={g.id}
                type="button"
                className="att-card"
                style={{ ['--card-key' as string]: g.color }}
                onClick={() => handleLaunchGame(g.id)}
              >
                <div>
                  <div className="att-card-top">
                    <div className="att-card-mark" data-kind={g.id} />
                    <div className="att-card-skill">{g.skill}</div>
                  </div>
                  <h3>{g.name}</h3>
                  <div className="att-tiers">
                    <i className={easyDone ? 'on' : undefined}>Easy</i>
                    <i className={normalDone ? 'on' : undefined}>Normal</i>
                    <i className={hardDone ? 'on' : undefined}>Hard</i>
                  </div>
                  <p>{g.desc}</p>
                </div>
                <div className="att-card-foot">
                  <span>Best <b>{bestDisplay(g.id)}</b></span>
                  <span className="att-play-chip">Play</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 🕸️ COGNITIVE RADAR & FOCUS RANK GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 28 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{rank.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: rank.color }}>{rank.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)' }}>Focus Score: {focusScore}</div>
                </div>
              </div>
              {nextRank && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--t2)' }}>Next: {nextRank.icon} {nextRank.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>{nextRank.min - focusScore} pts to go</div>
                </div>
              )}
            </div>
            <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (focusScore / 999) * 100)}%`, background: `linear-gradient(90deg, ${rank.color}, ${nextRank?.color || rank.color})`, borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              {RANKS.map((r) => (
                <div key={r.name} style={{ fontSize: 10, color: focusScore >= r.min ? r.color : 'var(--t3)', textAlign: 'center', fontWeight: focusScore >= r.min ? 700 : 400 }}>
                  {r.icon}<br/>{r.min}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>Cognitive profile</div>
            <svg viewBox="0 0 200 160" style={{ width: '100%', height: 130 }}>
              <polygon points="100,20 170,80 100,140 30,80" fill="none" stroke="var(--border2)" strokeWidth="1" />
              <polygon points="100,50 135,80 100,110 65,80" fill="none" stroke="var(--border)" strokeWidth="1" />

              {(() => {
                const top = 80 - (selectiveScore / 100) * 60;
                const right = 100 + (memoryScore / 100) * 70;
                const bottom = 80 + (reactionScore / 100) * 60;
                const left = 100 - (spanScore / 100) * 70;
                return (
                  <polygon
                    points={`100,${top} ${right},80 100,${bottom} ${left},80`}
                    fill="rgba(212,168,67,0.25)"
                    stroke="#d4a843"
                    strokeWidth="2"
                  />
                );
              })()}

              <text x="100" y="14" fill="#d4a843" fontSize="9" textAnchor="middle" fontWeight="bold">Selective ({selectiveScore}%)</text>
              <text x="175" y="83" fill="#8b5cf6" fontSize="9" textAnchor="start" fontWeight="bold">Memory ({memoryScore}%)</text>
              <text x="100" y="154" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">Reflex ({reactionScore}%)</text>
              <text x="25" y="83" fill="#3b82f6" fontSize="9" textAnchor="end" fontWeight="bold">Span ({spanScore}%)</text>
            </svg>
          </div>
        </div>

        {/* 7-Day Chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 16 }}>7-day focus</div>
          <svg viewBox="0 0 600 180" style={{ width: '100%', height: 160 }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
              <g key={i}>
                <line x1={50} y1={20 + (1 - p) * 130} x2={580} y2={20 + (1 - p) * 130} stroke="var(--border)" strokeWidth={1} />
                <text x={44} y={24 + (1 - p) * 130} fill="var(--t3)" fontSize={10} textAnchor="end">{Math.round(chartMax * p)}</text>
              </g>
            ))}
            <defs>
              <linearGradient id="attChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4a843" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={(() => {
              const pts = chartData.map((d, i) => ({ x: 50 + i * (530 / 6), y: 20 + (1 - d.value / chartMax) * 130 }));
              const area = `M${pts[0].x},${150} ` + pts.map(p => `L${p.x},${p.y}`).join(' ') + ` L${pts[pts.length - 1].x},${150} Z`;
              return area;
            })()} fill="url(#attChartGrad)" />
            <polyline
              points={chartData.map((d, i) => `${50 + i * (530 / 6)},${20 + (1 - d.value / chartMax) * 130}`).join(' ')}
              fill="none" stroke="#d4a843" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            />
            {chartData.map((d, i) => {
              const x = 50 + i * (530 / 6);
              const y = 20 + (1 - d.value / chartMax) * 130;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={4} fill="var(--card)" stroke="#d4a843" strokeWidth={2} />
                  {d.value > 0 && <text x={x} y={y - 10} fill="#d4a843" fontSize={10} textAnchor="middle" fontWeight="bold">{d.value}</text>}
                  <text x={x} y={168} fill="var(--t2)" fontSize={10} textAnchor="middle">{d.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 🏆 ACCURACY LEADERBOARD */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 26px', position: 'relative', overflow: 'hidden', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #d4a843, #f59e0b, #10b981)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                Accuracy board
                <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>
                  {syncing ? '⚡ Syncing...' : '🟢 Live End-to-End'}
                </span>
              </h2>
              <p style={{ color: 'var(--t2)', fontSize: 13, margin: '4px 0 0' }}>
                Rankings based on cumulative <strong style={{ color: '#10b981' }}>Accuracy Points</strong>. Higher difficulty = Multiplied Accuracy!
              </p>
            </div>
            
            <div style={{ background: 'var(--amber-light)', border: '1px solid var(--border)', borderRadius: 12, padding: '8px 16px', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>Your Position</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--amber)' }}>
                #{userRank} • {userTotalAccuracy}+ Accuracy
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaders.map((leader, index) => {
              const isMe = leader.userId === user?.id;
              const badge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
              const rowBorder = isMe ? '1px solid #d4a843' : '1px solid var(--border)';
              const rowBg = isMe ? 'var(--amber-light)' : 'var(--bg3)';

              return (
                <div
                  key={leader.userId || index}
                  className="att-leader-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: 12,
                    background: rowBg,
                    border: rowBorder,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 32, fontSize: 18, fontWeight: 800, textAlign: 'center' }}>
                      {badge}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isMe ? 'var(--amber)' : 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {leader.displayName}
                        {isMe && <span style={{ fontSize: 10, background: '#d4a843', color: '#0a0a0f', padding: '1px 6px', borderRadius: 6, fontWeight: 800 }}>YOU</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--t2)' }}>
                        {leader.gamesPlayed} game{leader.gamesPlayed !== 1 ? 's' : ''} played • Active {leader.lastActive}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>
                      {leader.totalAccuracy}+ Accuracy
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--t3)' }}>
                      Cumulative Score
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📜 TRAINING SESSION HISTORY LOG */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 26px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                Session history
              </h2>
              <p style={{ color: 'var(--t2)', fontSize: 13, margin: '4px 0 0' }}>
                Complete log of all your focus game sessions, accuracy gains, and difficulty levels.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={resetAllProgress} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                ↺ Reset Progress
              </button>
              {history.length > 0 && (
                <button onClick={clearHistory} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  Clear History
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {[{ id: 'all', name: 'All Games' }, ...GAMES].map(f => (
              <button
                key={f.id}
                onClick={() => setHistoryFilter(f.id)}
                style={{
                  background: historyFilter === f.id ? 'var(--amber-light)' : 'var(--bg3)',
                  border: `1px solid ${historyFilter === f.id ? 'var(--amber)' : 'var(--border)'}`,
                  color: historyFilter === f.id ? 'var(--amber)' : 'var(--t2)',
                  borderRadius: 8,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--t2)', fontSize: 14, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
              No sessions yet. Play a drill above to start the log.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{item.gameIcon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.gameName}
                        <span style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 4,
                          fontWeight: 700,
                          background: item.difficulty === 'hard' ? 'rgba(239,68,68,0.15)' : item.difficulty === 'easy' ? 'rgba(16,185,129,0.15)' : 'var(--amber-light)',
                          color: item.difficulty === 'hard' ? '#ef4444' : item.difficulty === 'easy' ? '#10b981' : 'var(--amber)',
                          border: `1px solid ${item.difficulty === 'hard' ? 'rgba(239,68,68,0.3)' : item.difficulty === 'easy' ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                          textTransform: 'uppercase',
                        }}>
                          {item.difficulty}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                        {item.timestamp}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>
                      +{item.accuracyEarned} Accuracy • {item.scoreDisplay}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--purple-mid, #8b5cf6)', fontWeight: 600 }}>
                      +{item.xpEarned} XP Earned
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
