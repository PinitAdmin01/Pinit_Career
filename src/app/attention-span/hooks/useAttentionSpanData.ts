'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  GameId,
  Difficulty,
  AttentionStats,
  LeaderItem,
  HistoryEntry,
  AttentionAnalyticsState,
  DailyLog,
  MonthlySummary,
  defaultStats,
  GAMES,
  playSound,
  calcFocusScore,
  isDifficultyUnlocked,
} from '@/components/attention-span/types';

import { useCareerOS } from '@/lib/context/CareerOSContext';

const todayStr = () => new Date().toISOString().slice(0, 10);

export function useAttentionSpanData(user: any) {
  const { addXp, earnPins, rewardActivity } = useCareerOS();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [stats, setStats] = useState<AttentionStats>(defaultStats);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [analytics, setAnalytics] = useState<AttentionAnalyticsState>({ dailyLogs: {}, monthlySummaries: {} });
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [loaded, setLoaded] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Leaderboard state
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [userRank, setUserRank] = useState<number>(1);
  const [userTotalAccuracy, setUserTotalAccuracy] = useState<number>(0);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Fetch Leaderboard API
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

  // Load progress and history from Supabase (Zero localStorage)
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!user?.id) {
        setLoaded(true);
        return;
      }

      try {
        // 1. Fetch user progress from Supabase attention_span_progress
        const { data: progressData } = await supabase
          .from('attention_span_progress')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (progressData && !cancelled) {
          if (progressData.daily_logs || progressData.monthly_summaries) {
            setAnalytics({
              dailyLogs: progressData.daily_logs || {},
              monthlySummaries: progressData.monthly_summaries || {},
            });
          }
        }

        // 2. Fetch past sessions from Supabase attention_span_sessions
        const { data: sessionRows } = await supabase
          .from('attention_span_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (sessionRows && !cancelled) {
          const mappedHistory: HistoryEntry[] = sessionRows.map((r: any) => ({
            id: r.id,
            gameId: r.game_id as GameId,
            gameName: r.game_name,
            gameIcon: r.game_icon,
            scoreDisplay: r.score_display,
            accuracyEarned: Number(r.accuracy_earned),
            difficulty: r.difficulty as Difficulty,
            timestamp: new Date(r.created_at).toLocaleTimeString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            xpEarned: r.xp_earned,
          }));
          setHistory(mappedHistory);
        }

        // 3. Fetch remote leaderboard
        await fetchLeaderboard(user.id);
      } catch (err) {
        console.warn('[AttentionSpan] Error loading remote data:', err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user?.id, fetchLeaderboard]);

  const toggleSound = () => {
    setSoundMuted(prev => !prev);
  };

  // Submit accuracy to leaderboard
  const submitAccuracyToLeaderboard = useCallback(async (accPoints: number) => {
    if (!user?.id) return;
    try {
      await fetch('/api/attention-span/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          displayName: user.displayName || user.name || 'Anonymous Student',
          accuracyPoints: accPoints,
        }),
      });
      fetchLeaderboard(user.id);
    } catch {}
  }, [user, fetchLeaderboard]);

  // Save stats to Supabase attention_span_progress
  const saveStats = useCallback(async (newStats: AttentionStats) => {
    setStats(newStats);
    if (!user?.id) return;

    try {
      await supabase
        .from('attention_span_progress')
        .upsert({
          user_id: user.id,
          display_name: user.displayName || user.name || 'Student',
          total_accuracy: userTotalAccuracy,
          updated_at: new Date().toISOString(),
        });
    } catch {}
  }, [user, userTotalAccuracy]);

  // Add session history to Supabase attention_span_sessions
  const addHistoryEntry = useCallback(async (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev].slice(0, 50));
    if (!user?.id) return;

    try {
      await supabase
        .from('attention_span_sessions')
        .insert({
          id: entry.id,
          user_id: user.id,
          game_id: entry.gameId,
          game_name: entry.gameName,
          game_icon: entry.gameIcon,
          score_display: entry.scoreDisplay,
          accuracy_earned: entry.accuracyEarned,
          difficulty: entry.difficulty,
          xp_earned: entry.xpEarned,
        });
    } catch (err) {
      console.warn('[AttentionSpan] Could not insert session row:', err);
    }
  }, [user?.id]);

  // Clear all history
  const clearHistory = useCallback(async () => {
    setHistory([]);
    if (!user?.id) return;
    try {
      await supabase
        .from('attention_span_sessions')
        .delete()
        .eq('user_id', user.id);
    } catch {}
  }, [user?.id]);

  // Reset all progress
  const resetAllProgress = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.confirm('Reset all your focus scores, stats and history? This cannot be undone.')) {
      return;
    }
    setStats(defaultStats);
    setHistory([]);
    setAnalytics({ dailyLogs: {}, monthlySummaries: {} });
    setUserTotalAccuracy(0);
    if (!user?.id) return;

    try {
      await supabase
        .from('attention_span_sessions')
        .delete()
        .eq('user_id', user.id);

      await supabase
        .from('attention_span_progress')
        .delete()
        .eq('user_id', user.id);
    } catch {}
  }, [user?.id]);

  // Game complete handler
  const handleGameComplete = useCallback((gameId: GameId, score: number, accuracy: number) => {
    setActiveGame(null);

    const diffMultiplier = difficulty === 'hard' ? 2.5 : difficulty === 'normal' ? 1.5 : 1.0;
    const finalAccuracy = Math.round(accuracy * diffMultiplier);

    submitAccuracyToLeaderboard(finalAccuracy);

    const today = todayStr();
    const isNewDay = !stats.dailySessions[today];
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const yesterdayStr = prevDate.toISOString().slice(0, 10);
    const streakContinues = stats.dailySessions[yesterdayStr] !== undefined;

    let newStreak = stats.streak;
    if (isNewDay) {
      newStreak = streakContinues ? stats.streak + 1 : 1;
    }

    const currentBest = (stats as any)[`${gameId.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Best`] || 0;
    const isNewHigh = score > currentBest;

    const currentCompleted = stats.completedDifficulties?.[gameId] || [];
    let updatedCompleted = [...currentCompleted];
    if (finalAccuracy >= 50 && !updatedCompleted.includes(difficulty)) {
      updatedCompleted.push(difficulty);
    }

    const newStats: AttentionStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      streak: newStreak,
      lastPlayedDate: today,
      completedDifficulties: {
        ...stats.completedDifficulties,
        [gameId]: updatedCompleted,
      },
      dailySessions: {
        ...stats.dailySessions,
        [today]: (stats.dailySessions[today] || 0) + 1,
      },
      dailyScores: {
        ...stats.dailyScores,
        [today]: Math.max(stats.dailyScores[today] || 0, score),
      },
    };

    if (gameId === 'focus-fire') newStats.focusFireBest = Math.max(stats.focusFireBest, score);
    if (gameId === 'memory-matrix') newStats.memoryMatrixBest = Math.max(stats.memoryMatrixBest, score);
    if (gameId === 'reflex-rush') newStats.reflexRushBest = stats.reflexRushBest === 0 ? score : Math.min(stats.reflexRushBest, score);
    if (gameId === 'sequence-snap') newStats.sequenceSnapBest = Math.max(stats.sequenceSnapBest, score);
    if (gameId === 'vortex-vision') newStats.vortexVisionBest = Math.max(stats.vortexVisionBest || 0, score);
    if (gameId === 'flash-fusion') newStats.flashFusionBest = Math.max(stats.flashFusionBest || 0, score);
    if (gameId === 'shape-shifter') newStats.shapeShifterBest = Math.max(stats.shapeShifterBest || 0, score);
    if (gameId === 'pattern-forge') newStats.patternForgeBest = Math.max(stats.patternForgeBest || 0, score);
    if (gameId === 'logic-circuit') newStats.logicCircuitBest = Math.max(stats.logicCircuitBest || 0, score);
    if (gameId === 'store-sim') newStats.storeSimBest = Math.max(stats.storeSimBest || 0, score);

    saveStats(newStats);

    if (isNewHigh) {
      playSound('level', soundMuted);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      playSound('win', soundMuted);
    }

    // Analytics computation
    const currentMonth = today.slice(0, 7);
    const focusScore = calcFocusScore(newStats);
    const selScore = Math.min(100, Math.round((newStats.focusFireBest / 25) * 100));
    const memScore = Math.min(100, Math.round((newStats.memoryMatrixBest / 8) * 100));
    const refScore = newStats.reflexRushBest > 0 ? Math.min(100, Math.max(10, Math.round(100 - (newStats.reflexRushBest - 150) * 0.3))) : 0;
    const spScore = Math.min(100, Math.round((newStats.sequenceSnapBest / 9) * 100));

    setAnalytics(prevAnalytics => {
      const prevDaily = prevAnalytics.dailyLogs[today] || {
        date: today,
        avgFocusScore: focusScore,
        totalAccuracy: 0,
        sessionsCompleted: 0,
        bestReactionMs: newStats.reflexRushBest,
        selectiveScore: selScore,
        memoryScore: memScore,
        reflexScore: refScore,
        spanScore: spScore,
      };

      const nextSessionsCompleted = prevDaily.sessionsCompleted + 1;
      const nextTotalAcc = prevDaily.totalAccuracy + finalAccuracy;
      const nextAvgScore = Math.round((prevDaily.avgFocusScore + focusScore) / 2);

      const updatedDaily: DailyLog = {
        date: today,
        avgFocusScore: nextAvgScore,
        totalAccuracy: nextTotalAcc,
        sessionsCompleted: nextSessionsCompleted,
        bestReactionMs: newStats.reflexRushBest > 0 ? Math.min(prevDaily.bestReactionMs || 9999, newStats.reflexRushBest) : prevDaily.bestReactionMs,
        selectiveScore: selScore,
        memoryScore: memScore,
        reflexScore: refScore,
        spanScore: spScore,
      };

      const monthLabel = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' });
      const prevMonthly = prevAnalytics.monthlySummaries[currentMonth] || {
        month: currentMonth,
        monthLabel,
        avgFocusScore: focusScore,
        totalAccuracy: 0,
        totalSessions: 0,
        peakStreak: newStats.streak,
        domainScores: { selective: selScore, memory: memScore, reflex: refScore, span: spScore },
      };

      const updatedMonthly: MonthlySummary = {
        month: currentMonth,
        monthLabel,
        avgFocusScore: Math.round((prevMonthly.avgFocusScore + focusScore) / 2),
        totalAccuracy: prevMonthly.totalAccuracy + finalAccuracy,
        totalSessions: prevMonthly.totalSessions + 1,
        peakStreak: Math.max(prevMonthly.peakStreak, newStats.streak),
        domainScores: { selective: selScore, memory: memScore, reflex: refScore, span: spScore },
      };

      const nextAnalyticsState: AttentionAnalyticsState = {
        dailyLogs: { ...prevAnalytics.dailyLogs, [today]: updatedDaily },
        monthlySummaries: { ...prevAnalytics.monthlySummaries, [currentMonth]: updatedMonthly },
      };

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

    let scoreDisplay = `${score} pts`;
    if (gameId === 'memory-matrix') scoreDisplay = `Level ${score}`;
    if (gameId === 'reflex-rush') scoreDisplay = `${score}ms avg`;
    if (gameId === 'sequence-snap') scoreDisplay = `${score} digits`;
    if (gameId === 'vortex-vision') scoreDisplay = `${score} stars`;
    if (gameId === 'flash-fusion') scoreDisplay = `${score} matches`;
    if (gameId === 'shape-shifter') scoreDisplay = `${score} flips`;
    if (gameId === 'pattern-forge') scoreDisplay = `${score} pts`;
    if (gameId === 'logic-circuit') scoreDisplay = `${score} pts`;
    if (gameId === 'store-sim') scoreDisplay = `${score} close`;

    const gameInfo = GAMES.find(g => g.id === gameId) || GAMES[0];
    const xpEarned = difficulty === 'hard' ? 35 : difficulty === 'normal' ? 20 : 10;

    // Cryptographically secure UUID for session history (Fixes L394 Math.random)
    const historyId = crypto.randomUUID();

    addHistoryEntry({
      id: historyId,
      gameId,
      gameName: gameInfo.name,
      gameIcon: gameInfo.icon,
      scoreDisplay,
      accuracyEarned: finalAccuracy,
      difficulty,
      timestamp: new Date().toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      xpEarned,
    });

    try { rewardActivity('attention_game', `Attention: ${gameId}`); } catch {}
    if (isNewHigh) { try { addXp(15, 'Attention: New High Score!'); } catch {} }
  }, [difficulty, submitAccuracyToLeaderboard, stats, saveStats, soundMuted, user?.id, addHistoryEntry, rewardActivity, addXp]);

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
    if (!isDifficultyUnlocked(gId, difficulty, stats.completedDifficulties)) {
      setDifficulty('easy');
    }
    setActiveGame(gId);
  };

  return {
    activeGame,
    setActiveGame,
    difficulty,
    setDifficulty,
    stats,
    history,
    analytics,
    showAnalyticsModal,
    setShowAnalyticsModal,
    historyFilter,
    setHistoryFilter,
    loaded,
    soundMuted,
    showConfetti,
    leaders,
    userRank,
    userTotalAccuracy,
    syncing,
    toggleSound,
    handleLaunchGame,
    handleGameComplete,
    claimDailyQuest,
    clearHistory,
    resetAllProgress,
    todaySessionCount,
    questCompleted,
    questClaimed,
  };
}
