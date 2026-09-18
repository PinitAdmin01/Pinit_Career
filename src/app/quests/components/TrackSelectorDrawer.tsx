'use client';

import React from 'react';
import type { CareerTrajectory } from '@/lib/data/careerTrajectories';
import type { Course } from '@/lib/data/coursesData';
import { EnglishDashboard } from '@/components/language/EnglishDashboard';
import { CrashCoursePlanCards } from './CrashCoursePlanCards';
import { InternshipTimelineTracker } from './InternshipTimelineTracker';
import { PracticeTestReportModal } from './PracticeTestReportModal';
import CareerPathwayTimeline from '@/components/pathway/CareerPathwayTimeline';
import CompetencyRadarView from '@/components/pathway/CompetencyRadarView';
import {
  CompetencyMasteryStatus,
  DynamicRoleReadiness,
} from '@/lib/pathway/competencySchema';
import { LearningPathMode } from '@/lib/quests/extraRoadmaps';
import {
  CERTIFICATION_TRACKS,
  Module,
  playPopSound
} from './useQuestProgression';

export interface TrackSelectorDrawerProps {
  activeSubTab: 'certification_passport' | 'custom_roadmap' | 'standalone' | 'language';
  handleSubTabChange: (tab: 'certification_passport' | 'custom_roadmap' | 'standalone' | 'language') => void;
  selectedCertTrackId: string;
  setSelectedCertTrackId: (id: string) => void;
  setActiveCourseId: (id: string) => void;
  setShowQrModal: (show: boolean) => void;
  roleReadiness: DynamicRoleReadiness | null;
  getPassportStatusBadge: (status: any) => { bg: string; border: string; color: string; text: string };
  showPassportDetails: boolean;
  setShowPassportDetails: React.Dispatch<React.SetStateAction<boolean>>;
  passportView: 'timeline' | 'matrix';
  setPassportView: (view: 'timeline' | 'matrix') => void;
  passportSelectedProgramId: string;
  masteryMap: Map<string, CompetencyMasteryStatus>;
  passportSelectedCompId?: string;
  setPassportSelectedCompId: (id: string | undefined) => void;
  trajectory: CareerTrajectory;
  setShowRoadmapModal: (show: boolean) => void;
  selectedStandaloneCourseId: string;
  setSelectedStandaloneCourseId: (id: string) => void;
  setLearningPathMode: (mode: LearningPathMode) => void;
  COURSES_REGISTRY: Course[];
  activeCourseId: string | null;
  activeCourseIds: string[];
  completedQuests: string[];
  switchActiveCourse?: (id: string) => void;
  archiveActiveCourse?: (id: string) => void;
  showCourseLibrary: boolean;
  setShowCourseLibrary: (show: boolean) => void;
  modules: Module[];
  handleSelectCourseFromLibrary: (courseId: string) => void;
  setNotesModalState: React.Dispatch<React.SetStateAction<{ isOpen: boolean; courseId: string; courseTitle: string }>>;
}

export const TrackSelectorDrawer: React.FC<TrackSelectorDrawerProps> = ({

  activeSubTab,
  handleSubTabChange,
  selectedCertTrackId,
  setSelectedCertTrackId,
  setActiveCourseId,
  setShowQrModal,
  roleReadiness,
  getPassportStatusBadge,
  showPassportDetails,
  setShowPassportDetails,
  passportView,
  setPassportView,
  passportSelectedProgramId,
  masteryMap,
  passportSelectedCompId,
  setPassportSelectedCompId,
  trajectory,
  setShowRoadmapModal,
  selectedStandaloneCourseId,
  setSelectedStandaloneCourseId,
  setLearningPathMode,
  COURSES_REGISTRY,
  activeCourseId,
  activeCourseIds,
  completedQuests,
  switchActiveCourse,
  archiveActiveCourse,
  showCourseLibrary,
  setShowCourseLibrary,
  modules,
  handleSelectCourseFromLibrary,
  setNotesModalState
}) => {
  const [activeCrashPlanId, setActiveCrashPlanId] = React.useState<string>('plan-3m-accelerator');
  const [showPracticeTestModal, setShowPracticeTestModal] = React.useState<boolean>(false);
  const [practiceTestTitle, setPracticeTestTitle] = React.useState<string>('Full-Stack Architecture & API Practice Test');

  const handleSelectCrashPlan = (planId: string, track: 'web_fullstack' | 'python_ai', courseIdToActivate: string) => {
    setActiveCrashPlanId(planId);
    setActiveCourseId(courseIdToActivate);
  };

  const handleOpenPracticeReport = (title: string) => {
    setPracticeTestTitle(title);
    setShowPracticeTestModal(true);
  };

  return (
    <>
      {/* ── 🌟 4 PRIMARY SUB-TABS ───────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px',
        borderRadius: 16,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 20,
        overflowX: 'auto',
      }}>
        {/* Tab 1: Unified Certification & Skill Passport */}
        <button
          onClick={() => handleSubTabChange('certification_passport')}
          style={{
            flex: 1,
            minWidth: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 12,
            border: activeSubTab === 'certification_passport' ? '1.5px solid var(--accent)' : '1px solid transparent',
            background: activeSubTab === 'certification_passport'
              ? 'linear-gradient(135deg, rgba(var(--brand-rgb),0.22), rgba(var(--success-rgb),0.15))'
              : 'transparent',
            color: activeSubTab === 'certification_passport' ? 'var(--text)' : 'var(--t2)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: activeSubTab === 'certification_passport' ? '0 4px 14px rgba(var(--brand-rgb),0.25)' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 18 }}>🏆</span>
          <span>Certification & Skill Passport</span>
        </button>

        {/* Tab 2: Custom Roadmap */}
        <button
          onClick={() => handleSubTabChange('custom_roadmap')}
          style={{
            flex: 1,
            minWidth: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 12,
            border: activeSubTab === 'custom_roadmap' ? '1.5px solid var(--brand)' : '1px solid transparent',
            background: activeSubTab === 'custom_roadmap'
              ? 'linear-gradient(135deg, rgba(var(--brand-rgb),0.22), rgba(var(--reward-rgb),0.15))'
              : 'transparent',
            color: activeSubTab === 'custom_roadmap' ? 'var(--text)' : 'var(--t2)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: activeSubTab === 'custom_roadmap' ? '0 4px 14px rgba(var(--brand-rgb),0.25)' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 18 }}>🗺️</span>
          <span>Custom Roadmap</span>
        </button>

        {/* Tab 3: Standalone Course */}
        <button
          onClick={() => handleSubTabChange('standalone')}
          style={{
            flex: 1,
            minWidth: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 12,
            border: activeSubTab === 'standalone' ? '1.5px solid var(--info)' : '1px solid transparent',
            background: activeSubTab === 'standalone'
              ? 'linear-gradient(135deg, rgba(var(--info-rgb),0.22), rgba(var(--info-rgb),0.15))'
              : 'transparent',
            color: activeSubTab === 'standalone' ? 'var(--text)' : 'var(--t2)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: activeSubTab === 'standalone' ? '0 4px 14px rgba(var(--info-rgb),0.25)' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 18 }}>📦</span>
          <span>Standalone Course</span>
        </button>

        {/* Tab 4: Global Language Academy */}
        <button
          onClick={() => handleSubTabChange('language')}
          style={{
            flex: 1,
            minWidth: 170,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 12,
            border: activeSubTab === 'language' ? '1.5px solid var(--reward)' : '1px solid transparent',
            background: activeSubTab === 'language'
              ? 'linear-gradient(135deg, rgba(var(--reward-rgb),0.22), rgba(var(--reward-rgb),0.15))'
              : 'transparent',
            color: activeSubTab === 'language' ? 'var(--text)' : 'var(--t2)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: activeSubTab === 'language' ? '0 4px 14px rgba(var(--reward-rgb),0.25)' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 18 }}>🌐</span>
          <span>Language Academy</span>
        </button>
      </div>

      {/* ── SUB-TAB 4 VIEW: GLOBAL LANGUAGE ACADEMY ── */}
      {activeSubTab === 'language' && (
        <div style={{ marginBottom: 30 }}>
          <EnglishDashboard onBackToQuests={() => handleSubTabChange('certification_passport')} />
        </div>
      )}

      {/* ── UNIFIED SUB-TAB 1 VIEW: CERTIFICATION TRACKS & CAREER PASSPORT COMMAND CENTER ── */}
      {activeSubTab === 'certification_passport' && (
        <div style={{
          marginBottom: 18,
          padding: '20px 24px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(var(--brand-rgb),0.12) 0%, rgba(var(--success-rgb),0.08) 100%)',
          border: '1.5px solid rgba(var(--brand-rgb),0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {/* Top Row: Quick QR Share */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              onClick={() => setShowQrModal(true)}
              style={{
                fontSize: 12,
                color: 'var(--text)',
                fontWeight: 800,
                padding: '8px 16px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--success), var(--success-deep))',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(var(--success-rgb),0.3)'
              }}
            >
              <span>📲</span> Share & Verify Skill Passport (QR)
            </button>
          </div>

          {/* ── 1. CRASH COURSE PLAN CARDS (1M, 3M, 6M, 9M) ── */}
          <CrashCoursePlanCards
            currentPlanId={activeCrashPlanId}
            onSelectPlan={handleSelectCrashPlan}
            onOpenStandaloneCatalog={() => handleSubTabChange('standalone')}
            onOpenPracticeReport={handleOpenPracticeReport}
          />

          {/* ── 2. ACTIVE INTERNSHIP & PROGRAM TIMELINE TRACKER ── */}
          <InternshipTimelineTracker
            planId={activeCrashPlanId}
            completedQuestsCount={completedQuests.length}
            onOpenPracticeTest={() => handleOpenPracticeReport('Weekly Milestone Practice Test')}
          />

          {/* ── 3. PRACTICE TEST DIAGNOSTIC REPORT MODAL ── */}
          <PracticeTestReportModal
            isOpen={showPracticeTestModal}
            onClose={() => setShowPracticeTestModal(false)}
            testTitle={practiceTestTitle}
          />

          {/* Live Passport HUD & Expand/Collapse Toggle */}
          {roleReadiness && (
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
            }}>
              {/* Target Role & Readiness */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Target Role & Readiness
                </span>
                <div style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--t1)' }}>
                  {roleReadiness.targetRole}
                </div>
                {(() => {
                  const badge = getPassportStatusBadge(roleReadiness.status);
                  return (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      width: 'fit-content',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 10.5,
                      fontWeight: 800,
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      color: badge.color,
                    }}>
                      {badge.text}
                    </div>
                  );
                })()}
              </div>

              {/* Verified Gates & Freshness */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Verified Gates & Freshness
                </span>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>
                  {roleReadiness.verifiedCompetenciesCount} / {roleReadiness.totalRequiredCompetenciesCount} Verified
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                  Freshness: <strong>{roleReadiness.assessmentFreshnessDays === 0 ? 'Active (Today)' : `${roleReadiness.assessmentFreshnessDays}d ago`}</strong>
                </span>
              </div>

              {/* Demonstrated Learning Gain */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Learning Gain
                </span>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)' }}>
                  {roleReadiness.learningGain.currentCompositeScore}/100 Composite
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--success)' }}>
                  {roleReadiness.learningGain.pointsGained !== undefined && roleReadiness.learningGain.pointsGained > 0
                    ? `Gain: +${roleReadiness.learningGain.pointsGained} Points`
                    : 'Diagnostic Baseline: Ready'}
                </span>
              </div>

              {/* Capstone Oral Defense Review */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>
                  Oral Capstone Defense
                </span>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: roleReadiness.capstoneDefenseScore ? 'var(--success)' : 'var(--t3)' }}>
                  {roleReadiness.capstoneDefenseScore !== undefined
                    ? `Passed (${roleReadiness.capstoneDefenseScore}/100)`
                    : 'Pending Oral Defense'}
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>
                  Evaluator: {roleReadiness.capstoneDefenseEvaluator || 'Senior Engineer Board'}
                </span>
              </div>
            </div>
          )}

          {/* Expandable Full Evidence Transcript Toggle */}
          <div style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(var(--success-rgb), 0.06)',
            border: '1px solid rgba(var(--success-rgb), 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🎓</span>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--success)' }}>
                  {showPassportDetails ? 'Hide Competency Evidence Matrix' : 'Full Multi-Semester Competency Matrix & Evidence Transcript'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 8 }}>
                  (SHA-256 Verified Ledger)
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPassportDetails(prev => !prev)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: showPassportDetails ? 'var(--bg3)' : 'linear-gradient(135deg, var(--success), var(--success-deep))',
                color: 'var(--text)',
                fontSize: 11.5,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: showPassportDetails ? 'none' : '0 2px 8px rgba(var(--success-rgb),0.3)'
              }}
            >
              {showPassportDetails ? '▲ Collapse Matrix' : '▼ Expand Full Matrix & Radar'}
            </button>
          </div>

          {/* Expanded Passport Details (Timeline vs Matrix) */}
          {showPassportDetails && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 6 }} className="fade-in">
              <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <button
                  onClick={() => setPassportView('timeline')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: passportView === 'timeline' ? 'var(--accent)' : 'transparent',
                    color: passportView === 'timeline' ? '#fff' : 'var(--t3)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  📅 Multi-Semester Timeline
                </button>
                <button
                  onClick={() => setPassportView('matrix')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: passportView === 'matrix' ? 'var(--accent)' : 'transparent',
                    color: passportView === 'matrix' ? '#fff' : 'var(--t3)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  📊 Full Competency Evidence Matrix
                </button>
              </div>

              {passportView === 'timeline' ? (
                <CareerPathwayTimeline
                  activeProgramId={passportSelectedProgramId}
                  masteryMap={masteryMap}
                  onSelectCompetency={id => {
                    setPassportSelectedCompId(id);
                    setPassportView('matrix');
                  }}
                />
              ) : (
                <CompetencyRadarView
                  masteryMap={masteryMap}
                  selectedCompetencyId={passportSelectedCompId}
                  onSelectCompetency={setPassportSelectedCompId}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SUB-TAB 2 VIEW: CUSTOM ROADMAP HEADER ── */}
      {activeSubTab === 'custom_roadmap' && (
        <div style={{
          marginBottom: 18,
          padding: '16px 20px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(var(--success-rgb),0.12), rgba(var(--success-deep-rgb),0.06))',
          border: '1.5px solid rgba(var(--success-rgb),0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🗺️</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                Dynamic Career Roadmap ({trajectory.roleTitle})
              </h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0 0' }}>
              Personalized AI roadmap compiled from your target role, skill DNA, and diagnostic assessment.
            </p>
          </div>

          <button
            onClick={() => setShowRoadmapModal(true)}
            style={{
              background: 'linear-gradient(135deg, var(--success), var(--success-deep))',
              border: 'none',
              borderRadius: 10,
              padding: '8px 18px',
              color: 'var(--text)',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(var(--success-rgb),0.3)'
            }}
          >
            ✨ Generate Custom AI Roadmap
          </button>
        </div>
      )}

      {/* ── SUB-TAB 3 VIEW: STANDALONE COURSE HEADER ── */}
      {activeSubTab === 'standalone' && (
        <div style={{
          marginBottom: 18,
          padding: '16px 20px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(var(--info-rgb),0.12), rgba(var(--info-rgb),0.06))',
          border: '1.5px solid rgba(var(--info-rgb),0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>📚</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                Standalone Single-Course Learning
              </h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0 0' }}>
              Direct curriculum for focused language, library, or engineering tracks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)' }}>Select Standalone Course:</span>
            <select
              value={selectedStandaloneCourseId}
              onChange={e => {
                playPopSound();
                setSelectedStandaloneCourseId(e.target.value);
                setActiveCourseId(e.target.value);
                setLearningPathMode('single_course');
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: '1.5px solid var(--info)',
                background: '#090d16',
                color: 'var(--text)',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(var(--info-rgb),0.2)'
              }}
            >
              {COURSES_REGISTRY.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── MULTI-ROADMAP SWITCHER BAR (Max 3 Concurrent Tracks) ── */}
      {activeSubTab !== 'language' && (() => {
        const myActiveCourseIds = Array.from(new Set([activeCourseId, ...activeCourseIds].filter(Boolean))) as string[];
        const count = myActiveCourseIds.length;

        return (
          <div style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 14,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📍 My Active Roadmaps ({count}/3):
              </span>

              {myActiveCourseIds.map(id => {
                const cObj = COURSES_REGISTRY.find(c => c.id === id);
                if (!cObj) return null;
                const isCurrent = id === activeCourseId;
                const cCompleted = (cObj.quests || []).filter(q => completedQuests.includes(q.id)).length;
                const cProgressPct = Math.round((cCompleted / (cObj.quests?.length || 1)) * 100);
                const cActiveDay = Math.min(30, Math.ceil((cCompleted + 1) / 5));

                return (
                  <div
                    key={id}
                    onClick={() => {
                      if (!isCurrent) {
                        if (switchActiveCourse) switchActiveCourse(id);
                        else setActiveCourseId(id);
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${isCurrent ? 'var(--success)' : 'var(--border)'}`,
                      background: isCurrent ? 'rgba(var(--success-rgb),0.12)' : 'var(--bg3)',
                      color: isCurrent ? 'var(--success)' : 'var(--t1)',
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: isCurrent ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isCurrent ? '0 2px 8px rgba(var(--success-rgb),0.2)' : 'none'
                    }}
                  >
                    <span>{cObj.icon}</span>
                    <span>{cObj.title.split('(')[0].trim()}</span>
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 6, background: isCurrent ? 'var(--success)' : 'var(--bg4)', color: isCurrent ? '#fff' : 'var(--t3)' }}>
                      Day {cActiveDay} • {cProgressPct}%
                    </span>
                    {count > 1 && (
                      <span
                        title="Archive Roadmap (Progress is 100% saved)"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (archiveActiveCourse) archiveActiveCourse(id);
                          if (id === activeCourseId) {
                            const remaining = myActiveCourseIds.filter(cid => cid !== id);
                            if (remaining.length > 0) {
                              setActiveCourseId(remaining[0]);
                            }
                          }
                        }}
                        style={{ marginLeft: 4, color: 'var(--t4)', cursor: 'pointer', fontSize: 11 }}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {count < 3 ? (
              <button
                onClick={() => setShowRoadmapModal(true)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px dashed var(--success)',
                  background: 'rgba(var(--success-rgb),0.08)',
                  color: 'var(--success)',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                + Add Active Track ({count}/3)
              </button>
            ) : (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t4)' }}>
                📌 Max 3 Active Tracks Enrolled
              </span>
            )}
          </div>
        );
      })()}

      {/* ── MODE 1: Standalone Course Library View (Secondary Toggle) ──────── */}
      {activeSubTab !== 'language' && (showCourseLibrary ? (
        <div className="animate-fade-in">
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
              📚 All 20 Industry Learning Tracks
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
              Browse standalone 30-day curriculum tracks. Learning any course automatically updates your career skill heatmap!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20
          }}>
            {COURSES_REGISTRY.map((course) => {
              const isActive = activeCourseId === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourseFromLibrary(course.id)}
                  className="glass-card card-hover"
                  style={{
                    padding: '24px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 220
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: 32 }}>{course.icon}</span>
                      <span style={{
                        fontSize: 9.5,
                        background: course.difficulty === 'Beginner' ? 'rgba(var(--success-deep-rgb),0.1)' : 'rgba(var(--brand-rgb),0.1)',
                        color: course.difficulty === 'Beginner' ? 'var(--green)' : 'var(--accent)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontWeight: 800
                      }}>
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>{course.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>{course.desc}</p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--t4)' }}>⏱ 30 Days (3 Quests/day)</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotesModalState({
                            isOpen: true,
                            courseId: course.id,
                            courseTitle: course.title
                          });
                        }}
                        style={{
                          background: 'rgba(var(--info-rgb),0.12)',
                          border: '1px solid rgba(var(--info-rgb),0.3)',
                          borderRadius: 6,
                          padding: '3px 8px',
                          color: 'var(--info-bright)',
                          fontSize: 10.5,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        📖 Notes
                      </button>
                      <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800 }}>
                        {isActive ? 'Active Track ➔' : 'Select Track ➔'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : modules.length === 0 ? (
        /* ── MODE 2: Empty State Banner when no roadmap has been generated yet ── */
        <div className="glass-card-premium animate-modal-pop" style={{
          padding: '48px 32px',
          textAlign: 'center',
          margin: '20px 0',
          borderRadius: 24,
          border: '1.5px dashed rgba(var(--success-rgb),0.3)',
          background: 'linear-gradient(135deg, rgba(var(--success-rgb),0.04), rgba(var(--brand-rgb),0.03))'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(var(--success-rgb),0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(var(--success-rgb),0.2)' }}>
            🎯
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            Welcome to PinIT Career OS Quests!
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--t2)', maxWidth: 540, margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            No preloaded dummy data. Click the button below to generate your personalized dynamic AI roadmap tailored to your knowledge score, mindset archetype, and target career goal.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRoadmapModal(true)}
              className="btn-emerald-glow"
              style={{ padding: '14px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
            >
              ✨ Generate Custom AI Roadmap ➔
            </button>

            <button
              onClick={() => setShowCourseLibrary(true)}
              style={{
                padding: '14px 24px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📚 Browse Course Library
            </button>
          </div>
        </div>
      ) : null)}
    </>
  );
};
