'use client';

import React from 'react';
import { trackKeyForGoal } from './useQuestProgression';
import type { TrajectoryNode, CareerTrajectory } from '@/lib/data/careerTrajectories';
import type { Course } from '@/lib/data/coursesData';
import { COURSES_REGISTRY as DEFAULT_COURSES } from '@/lib/data/coursesData';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { QRCodeSVG } from 'qrcode.react';
import { CourseNotesModal } from '@/components/CourseNotesModal';
import { nextRoadmapNumber } from '@/lib/quests/extraRoadmaps';

export interface CareerGateModalProps {
  node: TrajectoryNode | null;
  onClose: () => void;
  completedQuests?: string[];
  COURSES_REGISTRY?: Course[];
  commScore?: number;
  atsScore?: number;
  isProjectVerified?: boolean;
}

export const CareerGateModal: React.FC<CareerGateModalProps> = ({
  node,
  onClose,
  completedQuests,
  COURSES_REGISTRY,
  commScore,
  atsScore,
  isProjectVerified
}) => {
  const cOS = useCareerOS();
  if (!node) return null;

  const effectiveCompletedQuests = completedQuests || cOS.completedQuests || [];
  const courses = COURSES_REGISTRY || DEFAULT_COURSES;
  const course = courses.find(c => c.id === node.courseId);
  const totalQuests = course?.quests?.length || 0;
  const clearedQuests = course?.quests?.filter(q => effectiveCompletedQuests.includes(q.id)).length || 0;
  const actualCompletionPct = totalQuests > 0 ? Math.round((clearedQuests / totalQuests) * 100) : 0;
  const requiredCompletionPct = node.gate?.minCourseCompletionPct ?? 100;
  const isTechPassed = actualCompletionPct >= requiredCompletionPct;

  const requiredCommScore = node.gate?.minCommunicationScore ?? 70;
  const actualComm = commScore ?? (cOS.groupPanelPassed ? 85 : 0);
  const isCommPassed = actualComm >= requiredCommScore;

  const requiredAtsScore = node.gate?.minAtsScore ?? 80;
  const actualAts = atsScore ?? (cOS.onboardingAnswers?.atsScore || cOS.onboardingAnswers?.ats_score || (cOS.resumeGenerated ? 75 : 0));
  const isAtsPassed = actualAts >= requiredAtsScore;

  const requiredCapstone = node.gate?.requireProjectVerification !== false;
  const hasCapstonePassed = isProjectVerified ?? (cOS.javaTestPassed || (totalQuests > 0 && clearedQuests === totalQuests));
  const isCapstonePassed = !requiredCapstone || hasCapstonePassed;

  const isGateCleared = isTechPassed && isCommPassed && isAtsPassed && isCapstonePassed;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{
        maxWidth: 500, width: '100%', background: 'var(--bg2)',
        border: `1px solid ${isGateCleared ? 'rgba(var(--success-rgb), 0.4)' : 'rgba(var(--warning-rgb), 0.4)'}`,
        borderRadius: 24, padding: 32,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{
            fontSize: 11, fontWeight: 800,
            color: isGateCleared ? 'var(--green)' : 'var(--amber)',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            {isGateCleared ? '✓ Career Gate Cleared' : '🔒 Career Gate Audit Checkpoint'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginBottom: 6 }}>
          {node.title} Readiness
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 20 }}>
          {isGateCleared
            ? 'All prerequisite competency thresholds and project requirements have been verified.'
            : 'Multi-dimensional gate check evaluating technical completion, communication lab, ATS score, and project verification against required standards.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {/* 1. Technical Quests */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--t1)' }}>📚 Technical Quests Completion</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                {clearedQuests} of {totalQuests} quests completed (Required: {requiredCompletionPct}%)
              </div>
            </div>
            <span style={{ color: isTechPassed ? 'var(--green)' : 'var(--danger)', fontWeight: 800 }}>
              {isTechPassed ? `✓ ${actualCompletionPct}% Cleared` : `✗ ${actualCompletionPct}% (Pending)`}
            </span>
          </div>

          {/* 2. Soft Skills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--t1)' }}>🗣️ Soft Skills / Communication Lab</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                Required score: ≥ {requiredCommScore}%
              </div>
            </div>
            <span style={{ color: isCommPassed ? 'var(--green)' : 'var(--danger)', fontWeight: 800 }}>
              {isCommPassed ? `✓ ${actualComm}% Cleared` : (actualComm > 0 ? `✗ ${actualComm}% (Below ${requiredCommScore}%)` : `✗ Not Attempted`)}
            </span>
          </div>

          {/* 3. ATS Resume */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--t1)' }}>📄 ATS Resume Match Score</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                Target role threshold: ≥ {requiredAtsScore}%
              </div>
            </div>
            <span style={{ color: isAtsPassed ? 'var(--green)' : 'var(--danger)', fontWeight: 800 }}>
              {isAtsPassed ? `✓ ${actualAts}% Cleared` : (actualAts > 0 ? `✗ ${actualAts}% (Below ${requiredAtsScore}%)` : `✗ Resume Not Analyzed`)}
            </span>
          </div>

          {/* 4. Capstone */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 12, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--t1)' }}>💻 Verified Capstone Project</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                {requiredCapstone ? 'Requires automated code and integrity audit' : 'Optional for this stage'}
              </div>
            </div>
            <span style={{ color: isCapstonePassed ? 'var(--green)' : 'var(--amber)', fontWeight: 800 }}>
              {isCapstonePassed ? '✓ Code Verified' : '⏳ Verification Pending'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px',
            background: isGateCleared ? 'var(--green)' : 'var(--accent)',
            border: 'none', borderRadius: 12, color: 'var(--text)', fontWeight: 800,
            fontSize: 13, cursor: 'pointer'
          }}
        >
          {isGateCleared ? 'Continue Journey ➔' : 'Close Readiness Audit ➔'}
        </button>
      </div>
    </div>
  );
};

export interface MasterJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  trajectory: CareerTrajectory;
  COURSES_REGISTRY: Course[];
  completedQuests: string[];
  onSelectQuest: (questId: string) => void;
}

export const MasterJourneyModal: React.FC<MasterJourneyModalProps> = ({
  isOpen,
  onClose,
  trajectory,
  COURSES_REGISTRY,
  completedQuests,
  onSelectQuest
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{
        maxWidth: 840, width: '100%', maxHeight: '90vh',
        background: 'var(--bg2)', border: '1px solid rgba(var(--success-rgb),0.3)',
        borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🗺️ Master Syllabus & Full Journey Breakdown
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 0 0' }}>
              {trajectory.roleTitle} — Every Quest Lined Up
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {trajectory.nodes.map((node, nodeIdx) => {
            const nodeCourse = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
            const nodeQuests = nodeCourse.quests || [];
            const nodeCompletedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
            const isFullyCompleted = nodeQuests.length > 0 && nodeCompletedCount === nodeQuests.length;

            return (
              <div key={node.nodeId} style={{
                padding: '20px',
                borderRadius: 16,
                background: 'var(--bg3)',
                border: `1px solid ${isFullyCompleted ? 'var(--success)' : 'var(--border)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, background: isFullyCompleted ? 'var(--success)' : 'var(--brand)', color: 'var(--text)', padding: '3px 9px', borderRadius: 12 }}>
                      Step {nodeIdx + 1}
                    </span>
                    <h4 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                      {node.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isFullyCompleted ? 'var(--success)' : 'var(--t3)' }}>
                    {nodeCompletedCount} / {nodeQuests.length} Quests Cleared
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {nodeQuests.map((q, qIdx) => {
                    const isDone = completedQuests.includes(q.id);
                    return (
                      <div key={q.id} style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'var(--bg2)',
                        border: `1px solid ${isDone ? 'rgba(var(--success-rgb),0.3)' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: isDone ? 'rgba(var(--success-rgb),0.2)' : 'var(--bg3)',
                            color: isDone ? 'var(--success)' : 'var(--t3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 900
                          }}>
                            {isDone ? '✓' : qIdx + 1}
                          </span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>
                              {q.title}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                              {q.desc || 'Dissect syntax, concepts, and production implementation.'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectQuest(q.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 8,
                            border: 'none',
                            background: isDone ? 'rgba(var(--success-rgb),0.15)' : 'var(--brand)',
                            color: isDone ? 'var(--success)' : 'var(--text)',
                            fontSize: 11.5,
                            fontWeight: 800,
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          {isDone ? 'Revisit ➔' : 'Start Quest ➔'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  userId,
  copiedLink,
  onCopyLink
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(var(--success-rgb), 0.15)', color: 'var(--success-bright)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
          <span>🛡️</span> Cryptographic Proof
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 800, color: '#f8fafc' }}>
          Verifiable Skill Passport QR
        </h3>
        <p style={{ margin: '0 0 20px 0', fontSize: 12, color: 'var(--text-muted)' }}>
          Recruiters and universities can scan this code to independently verify your SHA-256 evidence chain and oral viva defense.
        </p>

        {(() => {
          const verifyUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/verify/${userId}`
            : `https://careeros.pinit.in/verify/${userId}`;
          return (
            <div style={{ width: 180, height: 180, margin: '0 auto 20px auto', background: '#ffffff', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              <QRCodeSVG
                value={verifyUrl}
                size={156}
                level="H"
                includeMargin={false}
              />
            </div>
          );
        })()}

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8, fontSize: 11, fontFamily: 'monospace', color: 'var(--info-bright)', wordBreak: 'break-all', marginBottom: 16 }}>
          {typeof window !== 'undefined' ? `${window.location.origin}/verify/${userId}` : `/verify/${userId}`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onCopyLink}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--brand), var(--reward))',
              border: 'none',
              color: 'var(--text)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {copiedLink ? '✓ Copied to Clipboard!' : '🔗 Copy Verification URL'}
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};

export interface CustomRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  generationStep: number;
  selectedDuration: number;
  setSelectedDuration: (days: number) => void;
  selectedPace: number;
  setSelectedPace: (pace: number) => void;
  selectedTrack: string;
  setSelectedTrack: (track: string) => void;
  customGoal: string;
  setCustomGoal: (goal: string) => void;
  extraRoadmaps: any[];
  qt1: number;
  archetype: string;
  activeCourseTitle: string;
  onSubmit: () => void;
  trajectory: CareerTrajectory;
  COURSES_REGISTRY: Course[];
}

export const CustomRoadmapModal: React.FC<CustomRoadmapModalProps> = ({
  isOpen,
  onClose,
  isGenerating,
  generationStep,
  selectedDuration,
  setSelectedDuration,
  selectedPace,
  setSelectedPace,
  selectedTrack,
  setSelectedTrack,
  customGoal,
  setCustomGoal,
  extraRoadmaps,
  qt1,
  archetype,
  activeCourseTitle,
  onSubmit,
  trajectory,
  COURSES_REGISTRY,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        maxWidth: 580, width: '100%',
        borderRadius: 24, padding: 32,
        position: 'relative'
      }} className="animate-modal-pop glass-card-premium">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(var(--success-rgb),0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              ✨
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                Configure Custom AI Roadmap
              </h3>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                Opens as a new tab next to Standalone (Roadmap {nextRoadmapNumber(extraRoadmaps)}). Close extra tabs anytime.
              </div>
            </div>
          </div>
          <button onClick={() => !isGenerating && onClose()} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {isGenerating ? (
          <div style={{ padding: '30px 10px', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid rgba(var(--success-rgb),0.2)', borderTopColor: 'var(--success)', margin: '0 auto 20px auto', animation: 'spin 1s linear infinite' }} />
            
            <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>
              Generating {selectedDuration}-Day Personalized Trajectory...
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420, margin: '20px auto 0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: generationStep >= 1 ? 'rgba(var(--success-rgb),0.1)' : 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t1)' }}>
                <span>{generationStep > 1 ? '✅' : '🧠'}</span>
                <span>Step 1: Analyzing Target Role & Skill Gap</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: generationStep >= 2 ? 'rgba(var(--success-rgb),0.1)' : 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t1)' }}>
                <span>{generationStep > 2 ? '✅' : '📅'}</span>
                <span>Step 2: Structuring {selectedDuration}-Day Day-by-Day Milestone Plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: generationStep >= 3 ? 'rgba(var(--success-rgb),0.1)' : 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--t1)' }}>
                <span>{generationStep >= 3 ? '⚡' : '⏳'}</span>
                <span>Step 3: Compiling Socratic Lectures, Coding Quests & Vivas</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
              fontSize: 11.5,
              fontWeight: 800
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--t4)' }}>⚡ QT1 Knowledge:</span>
                <span style={{ color: 'var(--success)' }}>{qt1}/100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--t4)' }}>🧠 Mindset:</span>
                <span style={{ color: 'var(--purple)' }}>{archetype}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--t4)' }}>🎓 Active Course:</span>
                <span style={{ color: 'var(--t1)' }}>{activeCourseTitle}</span>
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(var(--success-rgb),0.1), rgba(var(--brand-rgb),0.06))',
              border: '2px solid var(--success)',
              boxShadow: '0 4px 18px rgba(var(--success-rgb),0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 900, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🎯 Target Career Goal & Mixed Specialization (Editable)
                </label>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 8, background: 'var(--success)', color: 'var(--text)' }}>
                  ⭐ High-Priority Input
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--t2)', marginBottom: 10, lineHeight: 1.4 }}>
                Type your specific career goal! Combine Tech + Non-Tech skills (e.g. <i>"Full-Stack Developer launching an E-Commerce Business"</i>).
              </p>
              <input
                type="text"
                value={customGoal}
                onChange={e => {
                  const val = e.target.value;
                  setCustomGoal(val);
                  // Same whole-word matching as onboarding ("email" is not AI, "syntax" is not tax).
                  const track = trackKeyForGoal(val);
                  if (track) setSelectedTrack(track);
                }}
                placeholder="e.g., Full-Stack AI Engineer launching an E-Commerce Business"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '2px solid var(--success)',
                  background: '#090d16',
                  color: 'var(--text)',
                  fontSize: 13.5,
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📅 Roadmap Duration (Min 30 Days - Max 1 Year)
                </label>
                <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--success-bright)', fontFamily: 'var(--font-mono)' }}>
                  {selectedDuration} Days ({selectedDuration === 365 ? '1 Year' : `${Math.round(selectedDuration / 30 * 10) / 10} Months`})
                </span>
              </div>

              <input
                type="range"
                min={30}
                max={365}
                step={5}
                value={selectedDuration}
                onChange={e => setSelectedDuration(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--success)', cursor: 'pointer', marginBottom: 12 }}
              />

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { days: 30, label: '30 Days (1 Mo)' },
                  { days: 60, label: '60 Days (2 Mo)' },
                  { days: 90, label: '90 Days (1 Qtr)' },
                  { days: 180, label: '180 Days (6 Mo)' },
                  { days: 365, label: '365 Days (1 Year)' }
                ].map(p => (
                  <button
                    key={p.days}
                    onClick={() => setSelectedDuration(p.days)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: `1.5px solid ${selectedDuration === p.days ? 'var(--success)' : 'rgba(255,255,255,0.12)'}`,
                      background: selectedDuration === p.days ? 'rgba(var(--success-rgb),0.2)' : '#121824',
                      color: selectedDuration === p.days ? 'var(--success-bright)' : '#e0e7ff',
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onSubmit}
              className="btn-emerald-glow"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: 14,
                fontWeight: 900,
                borderRadius: 14,
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              🚀 Generate {selectedDuration}-Day AI Roadmap Now ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
