'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CourseNotesModal } from '@/components/CourseNotesModal';
import { useQuestProgression, type Quest } from './components/useQuestProgression';
import { TrackSelectorDrawer } from './components/TrackSelectorDrawer';
import { QuestPathView } from './components/QuestPathView';
import { RoadmapCompleteBanner } from './components/RoadmapCompleteBanner';
import {
  CareerGateModal,
  MasterJourneyModal,
  QrModal,
  CustomRoadmapModal
} from './components/QuestDetailModal';

function QuestsPageContent() {
  const prog = useQuestProgression();
  const searchParams = useSearchParams();
  const autostartLessonHandledRef = useRef(false);
  const [voiceLaunchQuest, setVoiceLaunchQuest] = useState<Quest | null>(null);
  const handleLaunchQuestRef = useRef(prog.handleLaunchQuest);
  handleLaunchQuestRef.current = prog.handleLaunchQuest;

  // Voice action deep-link: `/quests?autostart=lesson`
  // Auto-launches immediately if the next lesson is already initiated or unlocked (0 Pins);
  // otherwise opens a ready-to-confirm modal so Pins are never spent silently.
  useEffect(() => {
    const autostart = searchParams?.get('autostart');
    if (autostart !== 'lesson') {
      autostartLessonHandledRef.current = false;
      return;
    }
    if (autostartLessonHandledRef.current) return;
    if (!prog.nextUncompletedQuest || prog.modules.length === 0) return;

    autostartLessonHandledRef.current = true;
    const nextQuest = prog.nextUncompletedQuest;
    prog.setShowCourseLibrary(false);
    if (prog.activeSubTab === 'certification_passport') {
      prog.setActiveSubTab('custom_roadmap');
    }

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('autostart');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch {}
    }

    const initiated: string[] = Array.isArray(prog.onboardingAnswers?.initiatedQuests)
      ? prog.onboardingAnswers.initiatedQuests
      : [];
    const isAlreadyFree =
      initiated.includes(nextQuest.id) || Boolean(prog.isItemUnlocked?.(`quest:${nextQuest.id}`));

    if (isAlreadyFree) {
      void handleLaunchQuestRef.current(nextQuest);
    } else {
      setVoiceLaunchQuest(nextQuest);
    }
  }, [searchParams, prog]);

  return (
    <div data-testid="quests-page-root" className="quests-page" style={{ paddingBottom: 60 }}>
      {/* ── TRACK SELECTOR & COURSE DRAWER COMMAND CENTER ─────────── */}
      <TrackSelectorDrawer
        activeSubTab={prog.activeSubTab}
        handleSubTabChange={prog.handleSubTabChange}
        selectedCertTrackId={prog.selectedCertTrackId}
        setSelectedCertTrackId={prog.setSelectedCertTrackId}
        setActiveCourseId={prog.setActiveCourseId}
        setShowQrModal={prog.setShowQrModal}
        roleReadiness={prog.roleReadiness}
        getPassportStatusBadge={prog.getPassportStatusBadge}
        showPassportDetails={prog.showPassportDetails}
        setShowPassportDetails={prog.setShowPassportDetails}
        passportView={prog.passportView}
        setPassportView={prog.setPassportView}
        passportSelectedProgramId={prog.passportSelectedProgramId}
        masteryMap={prog.masteryMap}
        passportSelectedCompId={prog.passportSelectedCompId}
        setPassportSelectedCompId={prog.setPassportSelectedCompId}
        trajectory={prog.trajectory}
        setShowRoadmapModal={prog.setShowRoadmapModal}
        selectedStandaloneCourseId={prog.selectedStandaloneCourseId}
        setSelectedStandaloneCourseId={prog.setSelectedStandaloneCourseId}
        setLearningPathMode={prog.setLearningPathMode}
        COURSES_REGISTRY={prog.COURSES_REGISTRY}
        activeCourseId={prog.activeCourseId}
        activeCourseIds={prog.activeCourseIds}
        completedQuests={prog.completedQuests}
        switchActiveCourse={prog.switchActiveCourse}
        archiveActiveCourse={prog.archiveActiveCourse}
        showCourseLibrary={prog.showCourseLibrary}
        setShowCourseLibrary={prog.setShowCourseLibrary}
        modules={prog.modules}
        handleSelectCourseFromLibrary={prog.handleSelectCourseFromLibrary}
        setNotesModalState={prog.setNotesModalState}
        handleLaunchQuest={prog.handleLaunchQuest}
      />

      {/* ── ROADMAP COMPLETE → CAPSTONE PROJECT (custom roadmap only) ── */}
      {!prog.showCourseLibrary && prog.isOwnRoadmapView && (
        <RoadmapCompleteBanner
          progress={prog.roadmapProgress}
          onStartProject={() => prog.router.push('/projects?from=roadmap')}
        />
      )}

      {/* ── DYNAMIC GOAL ROADMAP & PROGRESSION PATH (Tab 1 uses Vertical Checkpoint Stepper) ── */}
      {!prog.showCourseLibrary && prog.activeSubTab !== 'certification_passport' && (
        <QuestPathView
          activeCourseId={prog.activeCourseId}
          setActiveCourseId={prog.setActiveCourseId}
          trajectory={prog.trajectory}
          COURSES_REGISTRY={prog.COURSES_REGISTRY}
          completedQuests={prog.completedQuests}
          modules={prog.modules}
          setShowFullJourneyModal={prog.setShowFullJourneyModal}
          learningPathMode={prog.learningPathMode}
          setLearningPathMode={prog.setLearningPathMode}
          fusedCourseId={prog.fusedCourseRef?.current || undefined}
          extraRoadmaps={prog.extraRoadmaps}
          closeExtraRoadmap={prog.closeExtraRoadmap}
          setShowRoadmapModal={prog.setShowRoadmapModal}
          isPlacementPrepFastTrack={prog.isPlacementPrepFastTrack}
          setIsPlacementPrepFastTrack={prog.setIsPlacementPrepFastTrack}
          setActiveGateModalNode={prog.setActiveGateModalNode}
          handleLaunchQuest={prog.handleLaunchQuest}
          pinsHistory={prog.pinsHistory}
          onboardingAnswers={prog.onboardingAnswers}
          historyFilter={prog.historyFilter}
          setHistoryFilter={prog.setHistoryFilter}
          activeSubTab={prog.activeSubTab}
          router={prog.router}
        />
      )}

      {/* ── MODALS & DETAILS OVERLAYS ─────────────────────────────── */}
      {prog.activeGateModalNode && (
        <CareerGateModal
          node={prog.activeGateModalNode}
          onClose={() => prog.setActiveGateModalNode(null)}
          completedQuests={prog.completedQuests}
          COURSES_REGISTRY={prog.COURSES_REGISTRY}
        />
      )}

      <MasterJourneyModal
        isOpen={prog.showFullJourneyModal}
        onClose={() => prog.setShowFullJourneyModal(false)}
        trajectory={prog.trajectory}
        COURSES_REGISTRY={prog.COURSES_REGISTRY}
        completedQuests={prog.completedQuests}
        onSelectQuest={(questId) => {
          prog.setShowFullJourneyModal(false);
          prog.router.push(`/quests/lesson?questId=${questId}`);
        }}
      />

      <QrModal
        isOpen={prog.showQrModal}
        onClose={() => prog.setShowQrModal(false)}
        userId={prog.userId}
        copiedLink={prog.copiedPassportLink}
        onCopyLink={() => {
          if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(`${window.location.origin}/verify/${prog.userId}`);
            prog.setCopiedPassportLink(true);
            setTimeout(() => prog.setCopiedPassportLink(false), 2000);
          }
        }}
      />

      <CourseNotesModal
        isOpen={prog.notesModalState.isOpen}
        onClose={() => prog.setNotesModalState(prev => ({ ...prev, isOpen: false }))}
        courseId={prog.notesModalState.courseId}
        courseTitle={prog.notesModalState.courseTitle}
      />

      <CustomRoadmapModal
        isOpen={prog.showRoadmapModal}
        onClose={() => prog.setShowRoadmapModal(false)}
        isGenerating={prog.isGeneratingRoadmap}
        generationStep={prog.generationStep}
        selectedDuration={prog.selectedDuration}
        setSelectedDuration={prog.setSelectedDuration}
        selectedPace={prog.selectedPace}
        setSelectedPace={prog.setSelectedPace}
        selectedTrack={prog.selectedTrack}
        setSelectedTrack={prog.setSelectedTrack}
        customGoal={prog.customGoal}
        setCustomGoal={prog.setCustomGoal}
        extraRoadmaps={prog.extraRoadmaps}
        qt1={prog.qt1}
        archetype={prog.archetype}
        activeCourseTitle={prog.activeCourse?.title || prog.trajectory.roleTitle}
        onSubmit={prog.handleCreateCustomRoadmap}
        trajectory={prog.trajectory}
        COURSES_REGISTRY={prog.COURSES_REGISTRY}
      />

      {voiceLaunchQuest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Next Lesson Launch"
          data-testid="quests-voice-launch-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(2, 6, 23, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setVoiceLaunchQuest(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              background: 'var(--bg2)',
              border: '1.5px solid var(--accent)',
              borderRadius: 20,
              padding: 26,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🎙️ Voice Launch Ready
              </span>
              <button
                type="button"
                onClick={() => setVoiceLaunchQuest(null)}
                aria-label="Close modal"
                style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 900, color: 'var(--t1)' }}>
              Start Next Lesson?
            </h3>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
              {voiceLaunchQuest.title}
            </p>
            <p style={{ margin: '0 0 18px', fontSize: 13, lineHeight: 1.5, color: 'var(--t2)' }}>
              Course: <strong>{prog.activeCourse?.title || prog.trajectory.roleTitle}</strong>. Confirm to open your interactive lesson workspace.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setVoiceLaunchQuest(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)',
                  color: 'var(--t2)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Later
              </button>
              <button
                type="button"
                data-testid="quests-voice-confirm-launch-btn"
                onClick={() => {
                  const target = voiceLaunchQuest;
                  setVoiceLaunchQuest(null);
                  void prog.handleLaunchQuest(target);
                }}
                className="btn-primary"
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ▶ Start Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestsPage() {
  return (
    <Suspense fallback={<div data-testid="quests-page-loading" style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Quests & Career Passport...</div>}>
      <QuestsPageContent />
    </Suspense>
  );
}
