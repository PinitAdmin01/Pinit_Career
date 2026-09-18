'use client';

import React, { Suspense } from 'react';
import { CourseNotesModal } from '@/components/CourseNotesModal';
import { useQuestProgression } from './components/useQuestProgression';
import { TrackSelectorDrawer } from './components/TrackSelectorDrawer';
import { QuestPathView } from './components/QuestPathView';
import {
  CareerGateModal,
  MasterJourneyModal,
  QrModal,
  CustomRoadmapModal
} from './components/QuestDetailModal';

function QuestsPageContent() {
  const prog = useQuestProgression();

  return (
    <div className="quests-page" style={{ paddingBottom: 60 }}>
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
      />

      {/* ── DYNAMIC GOAL ROADMAP & PROGRESSION PATH ───────────────── */}
      {!prog.showCourseLibrary && prog.modules.length > 0 && (
        <QuestPathView
          activeCourseId={prog.activeCourseId}
          setActiveCourseId={prog.setActiveCourseId}
          trajectory={prog.trajectory}
          COURSES_REGISTRY={prog.COURSES_REGISTRY}
          completedQuests={prog.completedQuests}
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
    </div>
  );
}

export default function QuestsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>Loading Quests & Career Passport...</div>}>
      <QuestsPageContent />
    </Suspense>
  );
}
