'use client';

// Gamified daily missions, quest tracker, and 3D Role-Play Persona Evolution Simulator
import { Suspense } from 'react';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { stopSpeaking } from '@/lib/tts';
import MissionsHistoryTab from '@/components/missions/MissionsHistoryTab';
import { useMissionsState } from './hooks/useMissionsState';
import { useMissionsData } from './hooks/useMissionsData';
import { useMissionsList } from './hooks/useMissionsList';
import MissionsHeader from './components/MissionsHeader';
import MissionsPersonaSimulator from './components/MissionsPersonaSimulator';
import MissionsStreakPanel from './components/MissionsStreakPanel';
import MissionsLinguaLabWrapper from './components/MissionsLinguaLabWrapper';
import MissionsEvolveBanner from './components/MissionsEvolveBanner';
import MissionsConclusionDetail from './components/MissionsConclusionDetail';

function MissionsPageInner() {
  const cOS = useCareerOS();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const state = useMissionsState(cOS.onboardingAnswers?.role || 'Software Developer');

  const {
    tab, setTab,
    extraMissions, setExtraMissions,
    customSkill, setCustomSkill,
    generatingSkill,
    activeTab, setActiveTab,
    selectedHistoryRecord, setSelectedHistoryRecord,
    socraticHistory,
    historySearchQuery, setHistorySearchQuery,
    historyCategoryFilter, setHistoryCategoryFilter,
    hoveredQuadrant, setHoveredQuadrant,
    selectedQuadrant, setSelectedQuadrant,
    hoveredRadarMetric, setHoveredRadarMetric,
    roleplayActive,
    updateRoleplayActive,
    isUnlocking,
    roleplayLoading,
    roleplayScenario,
    roleplayHistory,
    animState,
    evaluationReport,
    setEvaluationReport,
    evaluationLoading,
    timerCount,
    selectedChoiceIdx,
    showTraditionalMissions, setShowTraditionalMissions,
    qt2Delta,
    sessionElapsed,
  } = state;

  const {
    initiateRoleplay,
    handleSelectChoice,
    handleGenerateCustomQuests,
  } = useMissionsData({
    state,
    cOS,
    user,
    refresh,
    searchParams,
  });

  const {
    missionOnlyStreak,
    xp,
    completedMissions,
    onboardingAnswers,
    completeMission,
  } = cOS;

  const teacherId = user?.selectedTeacherId || 'priya';
  const teacher = ({
    priya: { name: 'Ms. Priya', emoji: '👩‍💼' },
    aisha: { name: 'Ms. Aisha', emoji: '👩‍🏫' },
    rohan: { name: 'Mr. Rohan', emoji: '👨‍💻' },
    vikram: { name: 'Mr. Vikram', emoji: '👨‍⚖️' },
  } as Record<string, { name: string; emoji: string }>)[teacherId] || { name: 'Ms. Priya', emoji: '👩‍💼' };

  const {
    allTodayMissions,
    pending,
    completed,
    todayPct,
    pastCompleted,
    gapClosurePct,
    generating,
    handleTriggerRegenerate,
  } = useMissionsList(
    onboardingAnswers?.role || 'Software Developer',
    extraMissions,
    setExtraMissions,
    completedMissions
  );

  const theme = {
    bg: 'var(--bg)',
    bgCard: 'var(--bg2)',
    bgInside: 'var(--bg3)',
    border: 'var(--border)',
    tPrimary: 'var(--t1)',
    tSecondary: 'var(--t2)',
    tTertiary: 'var(--t3)',
    accentLight: 'var(--accent-light)',
  };

  if (roleplayActive) {
    return (
      <MissionsPersonaSimulator
        theme={theme}
        roleplayScenario={roleplayScenario}
        roleplayHistory={roleplayHistory}
        roleplayLoading={roleplayLoading}
        animState={animState}
        evaluationReport={evaluationReport}
        evaluationLoading={evaluationLoading}
        timerCount={timerCount}
        selectedChoiceIdx={selectedChoiceIdx}
        qt2Delta={qt2Delta}
        sessionElapsed={sessionElapsed}
        handleSelectChoice={handleSelectChoice}
        updateRoleplayActive={updateRoleplayActive}
        setEvaluationReport={setEvaluationReport}
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: 1140,
        margin: '0 auto',
        background: theme.bg,
        color: theme.tPrimary,
        padding: '20px',
        borderRadius: '24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="animate-fade-in"
    >
      <MissionsHeader theme={theme} xp={xp} missionOnlyStreak={missionOnlyStreak} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Tab contents */}
        <div>
          {/* Progress bar */}
          {allTodayMissions.length > 0 && (
            <div
              style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.tPrimary }}>Today's Progress</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: theme.tSecondary, fontWeight: 600 }}>
                    {completed.length}/{allTodayMissions.length} Completed
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8, background: theme.bgInside, borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${todayPct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--accent), var(--teal))',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tabs Split System */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 20,
              borderBottom: `1px solid ${theme.border}`,
              paddingBottom: 12,
            }}
          >
            {(['evolve', 'language', 'history'] as const).map((tKey) => (
              <button
                key={tKey}
                onClick={() => {
                  setActiveTab(tKey);
                  stopSpeaking();
                  updateRoleplayActive(false);
                  if (tKey === 'history') setSelectedHistoryRecord(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: activeTab === tKey ? 800 : 500,
                  color: activeTab === tKey ? 'var(--accent)' : theme.tTertiary,
                  borderBottom: activeTab === tKey ? '3px solid var(--accent)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tKey === 'evolve' && '🧬 Evolve Yourself'}
                {tKey === 'language' && '🎙️ Career Communication Lab'}
                {tKey === 'history' && '📋 Conclusion History'}
              </button>
            ))}
          </div>

          {activeTab === 'evolve' ? (
            <MissionsEvolveBanner
              theme={theme}
              onboardingAnswers={onboardingAnswers}
              roleplayLoading={roleplayLoading}
              isUnlocking={isUnlocking}
              initiateRoleplay={initiateRoleplay}
              showTraditionalMissions={showTraditionalMissions}
              setShowTraditionalMissions={setShowTraditionalMissions}
              tab={tab}
              setTab={setTab}
              generating={generating}
              handleTriggerRegenerate={handleTriggerRegenerate}
              pending={pending}
              completedMissions={completedMissions}
              allTodayMissions={allTodayMissions}
              pastCompleted={pastCompleted}
              completeMission={completeMission}
              customSkill={customSkill}
              setCustomSkill={setCustomSkill}
              handleGenerateCustomQuests={handleGenerateCustomQuests}
              generatingSkill={generatingSkill}
            />
          ) : activeTab === 'language' ? (
            <MissionsLinguaLabWrapper streak={missionOnlyStreak} theme={theme} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {selectedHistoryRecord ? (
                <MissionsConclusionDetail
                  theme={theme}
                  record={selectedHistoryRecord}
                  onBack={() => setSelectedHistoryRecord(null)}
                />
              ) : (
                <MissionsHistoryTab
                  theme={theme}
                  socraticHistory={socraticHistory}
                  historySearchQuery={historySearchQuery}
                  setHistorySearchQuery={setHistorySearchQuery}
                  historyCategoryFilter={historyCategoryFilter}
                  setHistoryCategoryFilter={setHistoryCategoryFilter}
                  selectedHistoryRecord={selectedHistoryRecord}
                  setSelectedHistoryRecord={setSelectedHistoryRecord}
                />
              )}
            </div>
          )}
        </div>

        {/* Right Column: Mission Insights sidebar */}
        <MissionsStreakPanel
          theme={theme}
          xp={xp}
          missionOnlyStreak={missionOnlyStreak}
          completedCount={completed.length}
          gapClosurePct={gapClosurePct}
          onboardingAnswers={onboardingAnswers}
          user={user}
          hoveredQuadrant={hoveredQuadrant}
          setHoveredQuadrant={setHoveredQuadrant}
          selectedQuadrant={selectedQuadrant}
          setSelectedQuadrant={setSelectedQuadrant}
          hoveredRadarMetric={hoveredRadarMetric}
          setHoveredRadarMetric={setHoveredRadarMetric}
          setActiveTab={setActiveTab}
          teacher={teacher}
        />
      </div>
    </div>
  );
}

export default function MissionsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t1)' }}>Loading...</div>}>
      <MissionsPageInner />
    </Suspense>
  );
}
