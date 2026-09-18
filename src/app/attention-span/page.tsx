'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

import '@/styles/attention-games.css';
import { ConfettiCanvas } from '@/components/attention-span/ConfettiCanvas';
import { ProgressAnalyticsModal } from '@/components/attention-span/ProgressAnalyticsModal';
import { calcFocusScore } from '@/components/attention-span/types';

import { useAttentionSpanData } from './hooks/useAttentionSpanData';
import { AttentionGameBoard } from './components/AttentionGameBoard';
import { AttentionScorePanel } from './components/AttentionScorePanel';
import { AttentionProgressChart } from './components/AttentionProgressChart';
import { AttentionHistoryView } from './components/AttentionHistoryView';

export default function AttentionSpanPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    if (user === null) router.replace('/login');
  }, [user, router]);

  const {
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
  } = useAttentionSpanData(user);

  if (!user || !loaded) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid var(--border)', borderTop: '2px solid var(--amber)', borderRadius: '50%', animation: 'attSpin 0.8s linear infinite' }} />
      </div>
    );
  }

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

      <div className="att-dash">
        <AttentionScorePanel
          stats={stats}
          difficulty={difficulty}
          soundMuted={soundMuted}
          toggleSound={toggleSound}
          onOpenAnalytics={() => setShowAnalyticsModal(true)}
          todaySessionCount={todaySessionCount}
          questCompleted={questCompleted}
          questClaimed={questClaimed}
          onClaimDailyQuest={claimDailyQuest}
          userTotalAccuracy={userTotalAccuracy}
        />

        <AttentionGameBoard
          activeGame={activeGame}
          setActiveGame={setActiveGame}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          stats={stats}
          soundMuted={soundMuted}
          onGameComplete={handleGameComplete}
          onLaunchGame={handleLaunchGame}
        />

        <AttentionProgressChart
          stats={stats}
          leaders={leaders}
          userRank={userRank}
          userTotalAccuracy={userTotalAccuracy}
          syncing={syncing}
          currentUserId={user?.id}
        />

        <AttentionHistoryView
          history={history}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
          onResetAllProgress={resetAllProgress}
          onClearHistory={clearHistory}
        />
      </div>
    </>
  );
}
