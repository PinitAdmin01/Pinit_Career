'use client';

import React from 'react';
import type { CareerTrajectory, TrajectoryNode } from '@/lib/data/careerTrajectories';
import type { Course } from '@/lib/data/coursesData';
import { toast } from '@/lib/store/useAppStore';
import {
  ExtraRoadmap,
  LearningPathMode,
  extraRoadmapMode
} from '@/lib/quests/extraRoadmaps';
import {
  Quest,
  QUEST_S_CURVE_PATH,
  playPopSound
} from './useQuestProgression';

export interface QuestPathViewProps {
  activeCourseId: string | null;
  setActiveCourseId: (id: string) => void;
  trajectory: CareerTrajectory;
  COURSES_REGISTRY: Course[];
  completedQuests: string[];
  setShowFullJourneyModal: (show: boolean) => void;
  learningPathMode: LearningPathMode;
  setLearningPathMode: (mode: LearningPathMode) => void;
  fusedCourseId?: string;
  extraRoadmaps: ExtraRoadmap[];
  closeExtraRoadmap: (id: string) => void;
  setShowRoadmapModal: (show: boolean) => void;
  isPlacementPrepFastTrack: boolean;
  setIsPlacementPrepFastTrack: (val: boolean) => void;
  setActiveGateModalNode: (node: TrajectoryNode | null) => void;
  handleLaunchQuest: (quest: Quest, courseId: string) => void;
  pinsHistory: any[];
  onboardingAnswers: any;
  historyFilter: 'all' | 'quests' | 'pins';
  setHistoryFilter: (filter: 'all' | 'quests' | 'pins') => void;
  activeSubTab: 'certification_passport' | 'custom_roadmap' | 'standalone' | 'language';
  router: any;
}

export const QuestPathView: React.FC<QuestPathViewProps> = ({
  activeCourseId,
  setActiveCourseId,
  trajectory,
  COURSES_REGISTRY,
  completedQuests,
  setShowFullJourneyModal,
  learningPathMode,
  setLearningPathMode,
  fusedCourseId,
  extraRoadmaps,
  closeExtraRoadmap,
  setShowRoadmapModal,
  isPlacementPrepFastTrack,
  setIsPlacementPrepFastTrack,
  setActiveGateModalNode,
  handleLaunchQuest,
  pinsHistory,
  onboardingAnswers,
  historyFilter,
  setHistoryFilter,
  activeSubTab,
  router
}) => {
  return (
    <>
      {/* ── MODE 2: Dynamic Goal-Based Snake Roadmap Path ───────────────── */}
      <div className="animate-fade-in" id="quest-roadmap-chart-section">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)', letterSpacing: '-0.3px' }}>
              🧭 Dynamic Career Roadmap ({COURSES_REGISTRY.find(c => c.id === activeCourseId)?.title.split('(')[0].trim() || onboardingAnswers?.role || trajectory.roleTitle})
            </h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
              Sequential milestone nodes. Single-click any node to launch its quests.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => setShowFullJourneyModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: '1.5px solid var(--success)',
                background: 'rgba(var(--success-rgb),0.15)',
                color: 'var(--success)',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(var(--success-rgb),0.2)',
                transition: 'all 0.2s'
              }}
            >
              📜 View Entire Detailed Journey ➔
            </button>
            <span style={{ fontSize: 11, background: 'rgba(var(--success-deep-rgb),0.1)', color: 'var(--green)', padding: '6px 12px', borderRadius: 20, fontWeight: 700 }}>
              ✓ Single-Click Active Node Execution
            </span>
          </div>
        </div>

        {/* 🔀 DUAL LEARNING MODE SWITCHER */}
        {activeSubTab === 'custom_roadmap' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderRadius: 20,
            background: 'var(--bg3)',
            border: '1.5px solid var(--border)',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: 'var(--shadow-md)'
          }}>
            <div role="tablist" aria-label="Learning roadmaps" style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center', overflowX: 'auto', paddingBottom: 4, maxWidth: '100%' }}>
              <button
                type="button"
                role="tab"
                aria-selected={learningPathMode === 'fused_roadmap'}
                onClick={() => {
                  playPopSound();
                  setLearningPathMode('fused_roadmap');
                  if (fusedCourseId) setActiveCourseId(fusedCourseId);
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px 12px 0 0',
                  border: `1.5px solid ${learningPathMode === 'fused_roadmap' ? 'var(--success)' : 'rgba(255,255,255,0.08)'}`,
                  borderBottom: learningPathMode === 'fused_roadmap' ? '1.5px solid transparent' : '1.5px solid rgba(255,255,255,0.08)',
                  background: learningPathMode === 'fused_roadmap' ? 'linear-gradient(135deg, rgba(var(--success-rgb),0.25), rgba(var(--success-deep-rgb),0.15))' : 'var(--bg2)',
                  color: learningPathMode === 'fused_roadmap' ? 'var(--success-bright)' : 'var(--t2)',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                  boxShadow: learningPathMode === 'fused_roadmap' ? '0 4px 16px rgba(var(--success-rgb),0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>🗺️ Fused Career Trajectory</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(var(--success-rgb),0.25)', padding: '2px 7px', borderRadius: 6, color: 'var(--success)' }}>
                  Roadmap 1
                </span>
              </button>

              {extraRoadmaps.map(rm => {
                const isOn = learningPathMode === extraRoadmapMode(rm.id);
                return (
                  <div
                    key={rm.id}
                    role="tab"
                    aria-selected={isOn}
                    onClick={() => {
                      playPopSound();
                      setLearningPathMode(extraRoadmapMode(rm.id));
                      setActiveCourseId(rm.courseId);
                    }}
                    onAuxClick={(e) => {
                      if (e.button === 1) {
                        e.preventDefault();
                        e.stopPropagation();
                        closeExtraRoadmap(rm.id);
                      }
                    }}
                    title={`${rm.goal} · close with × or middle-click`}
                    style={{
                      padding: '8px 8px 8px 16px',
                      borderRadius: '12px 12px 0 0',
                      border: `1.5px solid ${isOn ? 'var(--warning)' : 'rgba(255,255,255,0.08)'}`,
                      background: isOn ? 'linear-gradient(135deg, rgba(var(--warning-rgb),0.28), rgba(var(--warning-rgb),0.16))' : 'var(--bg2)',
                      color: isOn ? 'var(--warning-bright)' : 'var(--t2)',
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flexShrink: 0,
                      boxShadow: isOn ? '0 4px 16px rgba(var(--warning-rgb),0.25)' : 'none',
                      maxWidth: 220
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>🗺️ Roadmap {rm.number}</span>
                    <button
                      type="button"
                      aria-label={`Close Roadmap ${rm.number}`}
                      title="Close tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeExtraRoadmap(rm.id);
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: 'none',
                        background: isOn ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.06)',
                        color: isOn ? '#fff' : 'var(--t3)',
                        cursor: 'pointer',
                        fontSize: 13,
                        lineHeight: '20px',
                        padding: 0,
                        flexShrink: 0
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                title="New roadmap"
                onClick={() => {
                  playPopSound();
                  setShowRoadmapModal(true);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1.5px dashed rgba(var(--success-rgb),0.45)',
                  background: 'rgba(var(--success-rgb),0.08)',
                  color: 'var(--success-bright)',
                  fontSize: 20,
                  fontWeight: 800,
                  cursor: 'pointer',
                  flexShrink: 0,
                  lineHeight: 1
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* ── 40% / 60% SIDE-BY-SIDE SPLIT VIEW LAYOUT ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '38% 60%', gap: '2%', marginTop: 24, alignItems: 'flex-start' }}>

          {/* ── LEFT COLUMN (40% Width): Visual Horizontal / Winding Roadmap Chart ── */}
          <div className="glass-card-premium" style={{
            padding: '24px 20px',
            borderRadius: 24,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
                  🗺️ Visual Roadmap Chart
                </h3>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(var(--success-rgb),0.15)', color: 'var(--green)', padding: '3px 10px', borderRadius: 20 }}>
                Interactive Flow
              </span>
            </div>

            {/* ── PIXEL-PERFECT PURE CSS/SVG S-CURVE ROADMAP FRAMEWORK ── */}
            <div style={{ position: 'relative', width: '100%', minHeight: 780, padding: '20px 10px 40px 10px', overflow: 'hidden' }}>
              
              {/* 🎨 BACKGROUND CONTINUOUS SVG S-CURVE ROAD TRACK */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 320 780" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="scurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--danger)" />
                    <stop offset="14%" stopColor="var(--warning)" />
                    <stop offset="28%" stopColor="var(--success)" />
                    <stop offset="42%" stopColor="var(--accent-cyan)" />
                    <stop offset="56%" stopColor="var(--info)" />
                    <stop offset="70%" stopColor="var(--reward)" />
                    <stop offset="84%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="var(--warning)" />
                  </linearGradient>
                </defs>

                {/* Outer Thick Road Shadow / Border */}
                <path
                  d={QUEST_S_CURVE_PATH}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="34"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Main Colored Road Surface */}
                <path
                  d={QUEST_S_CURVE_PATH}
                  fill="none"
                  stroke="url(#scurveGradient)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dashed White Center Line — MUST use the same path as the road */}
                <path
                  d={QUEST_S_CURVE_PATH}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="10 9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* 🏁 TOP-LEFT STARTING AVATAR NODE */}
              <div style={{ position: 'absolute', top: 12, left: 24, zIndex: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--danger)',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(var(--danger-rgb),0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20
                }}>
                  🚀
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--danger)', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  START
                </span>
              </div>

              {/* 🏃‍♂️ ANIMATED AVATAR TRACK RUNNER GLIDING ALONG THE S-CURVE ROAD */}
              {(() => {
                const steps = [
                  { step: 1, top: 95, alignRight: true, color: 'var(--danger)' },
                  { step: 2, top: 175, alignRight: false, color: 'var(--warning)' },
                  { step: 3, top: 255, alignRight: true, color: 'var(--success)' },
                  { step: 4, top: 335, alignRight: false, color: 'var(--accent-cyan)' },
                  { step: 5, top: 415, alignRight: true, color: 'var(--info)' },
                  { step: 6, top: 495, alignRight: false, color: 'var(--reward)' },
                  { step: 7, top: 575, alignRight: true, color: '#ec4899' },
                  { step: 8, top: 655, alignRight: false, color: 'var(--warning)' },
                ];
                const activeStepIdx = steps.findIndex((s, idx) => {
                  const node = trajectory.nodes[idx];
                  return node && node.courseId === activeCourseId;
                });
                const currentStep = steps[activeStepIdx >= 0 ? activeStepIdx : 0];
                const posX = currentStep.alignRight ? 270 : 60;
                const posY = currentStep.top - 20;

                return (
                  <div style={{
                    position: 'absolute',
                    left: posX - 18,
                    top: posY - 28,
                    zIndex: 10,
                    pointerEvents: 'none',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: 8.5,
                      fontWeight: 900,
                      background: currentStep.color,
                      color: 'var(--text)',
                      padding: '2px 7px',
                      borderRadius: 10,
                      boxShadow: `0 4px 12px ${currentStep.color}66`,
                      whiteSpace: 'nowrap',
                      marginBottom: 2
                    }}>
                      YOU ARE HERE 📍
                    </div>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--text)',
                      border: `3px solid ${currentStep.color}`,
                      boxShadow: `0 0 0 4px ${currentStep.color}33, 0 6px 16px ${currentStep.color}88`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16
                    }}>
                      🧑‍💻
                    </div>
                  </div>
                );
              })()}

              {/* 🛣️ 8 STEP NODES & HORIZONTAL WHITE CARDS */}
              {[
                { step: 1, title: 'Sharpen Basics', icon: '📋', color: 'var(--danger)', top: 95, alignRight: true },
                { step: 2, title: 'Learn HTML, CSS', icon: '🎨', color: 'var(--warning)', top: 175, alignRight: false },
                { step: 3, title: 'Learn Javascript - ES6/7/8', icon: '⚡', color: 'var(--success)', top: 255, alignRight: true },
                { step: 4, title: 'Learn basic Nodejs and npm', icon: '🚀', color: 'var(--accent-cyan)', top: 335, alignRight: false },
                { step: 5, title: 'Learn basic React', icon: '⚛️', color: 'var(--info)', top: 415, alignRight: true },
                { step: 6, title: 'Learn Redux', icon: '🔄', color: 'var(--reward)', top: 495, alignRight: false },
                { step: 7, title: 'Dive into React Native', icon: '📱', color: '#ec4899', top: 575, alignRight: true },
                { step: 8, title: 'Learn React Navigation', icon: '🧭', color: 'var(--warning)', top: 655, alignRight: false },
              ].map((item, idx) => {
                const targetIdx = Math.min(idx, trajectory.nodes.length - 1);
                const targetNode = trajectory.nodes[targetIdx];
                const directNode = trajectory.nodes[idx];
                const dynamicTitle = directNode ? directNode.title : item.title;
                
                // Calculate live quest metrics for this step
                const nodeCourse = directNode ? COURSES_REGISTRY.find(c => c.id === directNode.courseId) : undefined;
                const nodeQuests = nodeCourse?.quests || [];
                const clearedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
                const isFullyCompleted = nodeQuests.length > 0 && clearedCount === nodeQuests.length;
                const isCurrentStep = (targetNode && targetNode.courseId === activeCourseId) || (idx === 0 && !trajectory.nodes.some(n => n.courseId === activeCourseId));

                return (
                  <div
                    key={item.step}
                    onClick={() => {
                      playPopSound();
                      if (targetNode) {
                        if (targetNode.courseId) {
                          setActiveCourseId(targetNode.courseId);
                        }
                        const el = document.getElementById(`node-card-${targetNode.nodeId}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          el.style.transition = 'all 0.3s ease';
                          el.style.boxShadow = `0 0 25px ${item.color}88`;
                          setTimeout(() => {
                            el.style.boxShadow = '';
                          }, 1200);
                        }
                      }
                    }}
                    className="card-hover"
                    style={{
                      position: 'absolute',
                      top: item.top,
                      left: item.alignRight ? undefined : 30,
                      right: item.alignRight ? 30 : undefined,
                      display: 'flex',
                      flexDirection: item.alignRight ? 'row' : 'row-reverse',
                      alignItems: 'center',
                      gap: 12,
                      zIndex: isCurrentStep ? 5 : 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Circle Step Badge ON Road Curve */}
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: isFullyCompleted ? 'linear-gradient(135deg, var(--success), var(--success-deep))' : 'var(--text)',
                      border: `4px solid ${isFullyCompleted ? 'var(--success-bright)' : item.color}`,
                      boxShadow: isCurrentStep
                        ? `0 0 0 6px ${item.color}33, 0 0 24px ${item.color}aa`
                        : isFullyCompleted
                        ? '0 0 16px rgba(var(--success-rgb),0.5)'
                        : `0 4px 14px ${item.color}55`,
                      transform: isCurrentStep ? 'scale(1.12)' : 'scale(1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isFullyCompleted ? '#ffffff' : '#1e293b',
                      fontWeight: 900,
                      fontSize: isFullyCompleted ? 20 : 19,
                      flexShrink: 0,
                      transition: 'all 0.3s ease'
                    }}>
                      {isFullyCompleted ? '✓' : item.icon}
                    </div>

                    {/* Crisp Horizontal White Pill Card */}
                    <div style={{
                      background: 'rgba(255,255,255,0.95)',
                      padding: '8px 14px',
                      borderRadius: '0 12px 12px 0',
                      boxShadow: isCurrentStep
                        ? `0 0 16px ${item.color}44, 0 4px 14px rgba(0,0,0,0.12)`
                        : '0 4px 14px rgba(0,0,0,0.08)',
                      borderTop: isCurrentStep ? `1px solid ${item.color}44` : 'none',
                      borderRight: isCurrentStep ? `1px solid ${item.color}44` : 'none',
                      borderBottom: isCurrentStep ? `1px solid ${item.color}44` : 'none',
                      borderLeft: `4px solid ${isFullyCompleted ? 'var(--success)' : item.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      maxWidth: 220,
                      transition: 'all 0.3s ease'
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: isFullyCompleted ? 'var(--success)' : item.color, textTransform: 'uppercase', flexShrink: 0 }}>
                        Step {item.step}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dynamicTitle}
                      </span>
                      {isCurrentStep && (
                        <span style={{ fontSize: 8.5, fontWeight: 900, background: `${item.color}22`, color: item.color, padding: '2px 5px', borderRadius: 4, textTransform: 'uppercase', flexShrink: 0 }}>
                          ACTIVE
                        </span>
                      )}
                      {isFullyCompleted && (
                        <span style={{ fontSize: 8.5, fontWeight: 900, background: 'rgba(var(--success-rgb),0.2)', color: 'var(--success)', padding: '2px 5px', borderRadius: 4, textTransform: 'uppercase', flexShrink: 0 }}>
                          CLEARED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 🏆 BOTTOM-RIGHT CELEBRATION GOAL NODE */}
              <div style={{ position: 'absolute', bottom: 10, right: 20, zIndex: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--warning)', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  CAREER GOAL REACHED
                </span>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--warning)',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(var(--warning-rgb),0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20
                }}>
                  🎉
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN (60% Width): Detailed Quest Stage Execution Cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ⚡ Placement Prep Fast-Track Toggle Banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isPlacementPrepFastTrack ? 'rgba(var(--warning-rgb), 0.08)' : 'rgba(255,255,255,0.03)',
              border: isPlacementPrepFastTrack ? '1px solid rgba(var(--warning-rgb), 0.35)' : '1px solid var(--border)',
              borderRadius: 14,
              padding: '10px 16px',
              marginBottom: -6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: isPlacementPrepFastTrack ? 'var(--warning)' : 'var(--t1)' }}>
                    Placement Prep Fast-Track Mode
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)' }}>
                    {isPlacementPrepFastTrack ? 'All stages unlocked for urgent interview & campus preparation.' : 'Stages unlock sequentially as you complete prerequisites.'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const nextVal = !isPlacementPrepFastTrack;
                  setIsPlacementPrepFastTrack(nextVal);
                  if (nextVal) {
                    toast.success('⚡ Placement Fast-Track Enabled', 'All stages are now unlocked for immediate review!');
                  } else {
                    toast.info('Standard Progression Restored', 'Prerequisite stage locks have been re-enabled.');
                  }
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 8,
                  background: isPlacementPrepFastTrack ? 'var(--warning)' : 'var(--bg3)',
                  color: isPlacementPrepFastTrack ? '#000000' : 'var(--t2)',
                  border: isPlacementPrepFastTrack ? '1px solid var(--warning)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isPlacementPrepFastTrack ? '⚡ Fast-Track Active' : '🔓 Unlock Fast-Track'}
              </button>
            </div>
            
            {trajectory.nodes.map((node, idx) => {
              const nodeCourse = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
              const nodeQuests = nodeCourse?.quests || [];
              const nodeCompletedCount = nodeQuests.filter(q => completedQuests.includes(q.id)).length;
              const nodeProgressPct = Math.min(100, Math.round((nodeCompletedCount / Math.max(1, nodeQuests.length)) * 100));
              const isNodeCompleted = nodeProgressPct === 100;
              const isCurrentActiveNode = node.courseId === activeCourseId;
              const isLocked = !isPlacementPrepFastTrack && idx > 0 && (
                (() => {
                  const prevNode = trajectory.nodes[idx - 1];
                  const prevCourse = COURSES_REGISTRY.find(c => c.id === prevNode.courseId);
                  const prevQuests = prevCourse?.quests || [];
                  const prevCleared = prevQuests.filter(q => completedQuests.includes(q.id)).length;
                  return prevCleared < prevQuests.length && prevQuests.length > 0;
                })()
              );

              const nextQuestInNode = nodeQuests.find(q => !completedQuests.includes(q.id)) || nodeQuests[0];
              const stepColors = ['var(--danger)', 'var(--warning)', 'var(--success)', 'var(--accent-cyan)', '#0d9488', 'var(--reward)', '#ec4899', 'var(--warning)'];
              const currentColor = stepColors[idx % stepColors.length];

              return (
                <div id={`node-card-${node.nodeId}`} key={node.nodeId} style={{ position: 'relative' }}>
                  
                  {/* Readiness Gate Checkpoint Banner before Node */}
                  {node.gate && (
                    <div
                      onClick={() => setActiveGateModalNode(node)}
                      style={{
                        marginBottom: 12,
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <div style={{
                        padding: '7px 14px',
                        background: 'rgba(var(--warning-rgb),0.08)',
                        border: '1px solid rgba(var(--warning-rgb),0.3)',
                        borderRadius: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--amber)',
                        cursor: 'pointer'
                      }} className="card-hover">
                        <span>🔒 Career Gate Checkpoint (Click to Audit):</span>
                        <span style={{ color: 'var(--t2)' }}>
                          {node.gate.minDsaScore ? `✓ DSA ≥ ${node.gate.minDsaScore}% ` : ''}
                          {node.gate.minCommunicationScore ? `✓ Soft Skills ≥ ${node.gate.minCommunicationScore}% ` : ''}
                          {node.gate.minAtsScore ? `✓ ATS Resume ≥ ${node.gate.minAtsScore}% ` : ''}
                          {node.gate.requireProjectVerification ? `✓ Capstone Verified` : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Detailed Stage Execution Card */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    position: 'relative'
                  }}>
                    {/* Step Circle Badge on Card */}
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${currentColor}, #090d16)`,
                      border: `3px solid ${currentColor}`,
                      boxShadow: `0 0 20px ${currentColor}55`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text)',
                      fontWeight: 900,
                      flexShrink: 0,
                      zIndex: 2
                    }}>
                      <span style={{ fontSize: 8.5, textTransform: 'uppercase', opacity: 0.9 }}>Step</span>
                      <span style={{ fontSize: 18, lineHeight: 1.1 }}>{idx + 1}</span>
                    </div>

                    {/* Main Interactive Stage Card */}
                    <div
                      onClick={() => {
                        if (!isLocked && nextQuestInNode) {
                          handleLaunchQuest(nextQuestInNode, node.courseId);
                        }
                      }}
                      className={`glass-card-premium ${isLocked ? '' : 'card-hover'}`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        padding: '20px 24px',
                        borderRadius: 22,
                        border: isCurrentActiveNode 
                          ? `2px solid ${currentColor}` 
                          : isNodeCompleted 
                          ? '1px solid var(--green)' 
                          : '1px solid var(--border)',
                        background: isCurrentActiveNode 
                          ? `linear-gradient(135deg, ${currentColor}15, var(--bg2))` 
                          : 'var(--bg2)',
                        boxShadow: isCurrentActiveNode ? `0 0 24px ${currentColor}33` : 'none',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.6 : 1
                      }}
                    >
                      {/* Icon Avatar */}
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: isNodeCompleted ? 'rgba(var(--success-deep-rgb),0.15)' : `${currentColor}22`,
                        border: `1px solid ${isNodeCompleted ? 'var(--green)' : currentColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        flexShrink: 0
                      }}>
                        {isNodeCompleted ? '✓' : isLocked ? '🔒' : node.icon}
                      </div>

                      {/* Info Text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 800, background: `${currentColor}22`, color: currentColor, padding: '2px 7px', borderRadius: 5, border: `1px solid ${currentColor}44` }}>
                            STAGE {idx + 1}
                          </span>
                          {(() => {
                            const getLevelBadge = (i: number) => {
                              if (i === 0) return { label: '🌱 Level 0: Zero Basics', color: 'var(--success)' };
                              if (i === 1) return { label: '🌱 Level 1: Foundations', color: 'var(--accent-cyan)' };
                              if (i === 2) return { label: '⚡ Level 2: Core Engineering', color: 'var(--info)' };
                              return { label: '🔥 Level 3: Pro Mastery', color: '#ec4899' };
                            };
                            const badge = getLevelBadge(idx);
                            return (
                              <span style={{ fontSize: 9.5, fontWeight: 900, background: `${badge.color}15`, color: badge.color, padding: '2px 7px', borderRadius: 5, border: `1px solid ${badge.color}33` }}>
                                {badge.label}
                              </span>
                            );
                          })()}
                          <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>{node.title}</h3>
                          <span style={{ fontSize: 9.5, fontWeight: 800, background: 'rgba(var(--success-deep-rgb),0.1)', color: 'var(--green)', padding: '2px 7px', borderRadius: 5 }}>
                            {node.careerImpact}
                          </span>
                        </div>

                        <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4, marginBottom: 6, lineHeight: 1.35 }}>
                          {node.shortDesc}
                        </p>

                        {/* Skills Learned Badges */}
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {node.skillsLearned.map(skill => (
                            <span key={skill} style={{ fontSize: 10, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 7px', borderRadius: 5, color: 'var(--t2)', fontWeight: 600 }}>
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Gauge & Button */}
                      <div style={{ minWidth: 140, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: isNodeCompleted ? 'var(--green)' : currentColor, fontFamily: 'var(--font-mono)' }}>
                          {nodeCompletedCount} / {nodeQuests.length || 30} Cleared ({nodeProgressPct}%)
                        </div>

                        <div style={{ width: 120, height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <div style={{ width: `${nodeProgressPct}%`, height: '100%', background: isNodeCompleted ? 'var(--green)' : currentColor }} />
                        </div>

                        <button
                          style={{
                            marginTop: 4,
                            background: isNodeCompleted ? 'rgba(var(--success-deep-rgb),0.1)' : isLocked ? 'var(--bg3)' : `linear-gradient(135deg, ${currentColor}, var(--success-deep))`,
                            border: isNodeCompleted ? '1px solid var(--green)' : 'none',
                            color: isNodeCompleted ? 'var(--green)' : isLocked ? 'var(--t4)' : 'var(--text)',
                            padding: '6px 14px',
                            borderRadius: 9,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: isLocked ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isNodeCompleted ? 'Completed ✓' : isLocked ? 'Locked 🔒' : 'Continue Quest ➔'}
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>

      {/* ── Quest & Learning Activity History Panel ── */}
      {activeSubTab !== 'language' && (
        <div className="glass-card-premium" style={{
          padding: '32px 28px',
          borderRadius: 24,
          marginTop: 40,
          marginBottom: 32,
          border: '1px solid var(--border)',
          background: 'var(--bg2)'
        }}>
          {/* Section Header & Metrics Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)' }}>
                <span>📜</span> Quest Completion & Learning Activity History
              </h3>
              <span style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4, display: 'block' }}>
                Verified record of completed syllabus lectures, passed coding exams, and earned reward milestones.
              </span>
            </div>

            {/* Metric Summary Badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(var(--success-rgb),0.1)', border: '1px solid rgba(var(--success-rgb),0.25)', fontSize: 12, fontWeight: 800, color: 'var(--success-bright)' }}>
                ✓ {completedQuests.length} Quests Cleared
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(var(--brand-rgb),0.1)', border: '1px solid rgba(var(--brand-rgb),0.25)', fontSize: 12, fontWeight: 800, color: 'var(--brand-bright)' }}>
                ⚡ +{completedQuests.length * 150} XP Accumulated
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 12, background: 'rgba(var(--warning-rgb),0.1)', border: '1px solid rgba(var(--warning-rgb),0.25)', fontSize: 12, fontWeight: 800, color: 'var(--warning-bright)' }}>
                🪙 +{completedQuests.length * 5} Pins Bonus
              </div>
            </div>
          </div>

          {/* Filter Navigation Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            {[
              { id: 'all', label: `🌐 All Activity (${completedQuests.length + (pinsHistory?.length || 0)})` },
              { id: 'quests', label: `🎓 Quests & Exams (${completedQuests.length})` },
              { id: 'pins', label: `🪙 Pins & Rewards (${pinsHistory?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setHistoryFilter(tab.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: `1.5px solid ${historyFilter === tab.id ? 'var(--success)' : 'transparent'}`,
                  background: historyFilter === tab.id ? 'rgba(var(--success-rgb),0.15)' : 'var(--bg3)',
                  color: historyFilter === tab.id ? 'var(--success-bright)' : 'var(--t2)',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Activity List */}
          {(() => {
            // Construct Quest History Items
            const questHistoryItems = completedQuests.map((qId, idx) => {
              let foundQuest: any = null;
              let foundCourseTitle = 'Career Trajectory';
              
              for (const c of COURSES_REGISTRY) {
                const q = (c.quests || []).find(item => item.id === qId);
                if (q) {
                  foundQuest = q;
                  foundCourseTitle = c.title.split('(')[0].trim();
                  break;
                }
              }

              const rawTimestampTag = onboardingAnswers?.completedQuestsTimestamps?.[idx];
              let displayDate = 'Recently Cleared';
              if (rawTimestampTag) {
                try {
                  const tsStr = rawTimestampTag.split('|')[0];
                  const d = new Date(tsStr);
                  if (!isNaN(d.getTime())) {
                    displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  }
                } catch {}
              }

              return {
                id: `history_quest_${qId}_${idx}`,
                type: 'quest',
                title: foundQuest?.title || qId.replace(/-/g, ' ').toUpperCase(),
                courseTitle: foundCourseTitle,
                desc: foundQuest?.desc || 'Successfully cleared syllabus lecture & technical evaluation.',
                date: displayDate,
                xp: 150,
                pins: 5,
                questId: qId,
                icon: qId.includes('exam') ? '🏆' : '🎓'
              };
            });

            // Construct Pin History Items
            const pinHistoryItems = (pinsHistory || []).map((p: any, pIdx: number) => ({
              id: `history_pin_${pIdx}`,
              type: 'pin',
              title: p.description || (p.amount > 0 ? 'Earned Bonus Pins' : 'Spent Pins'),
              courseTitle: 'PinIT Rewards',
              desc: `Transaction amount: ${p.amount > 0 ? `+${p.amount}` : p.amount} Pins`,
              date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent',
              xp: 0,
              pins: p.amount,
              questId: null,
              icon: '🪙'
            }));

            let displayItems = [];
            if (historyFilter === 'quests') displayItems = questHistoryItems;
            else if (historyFilter === 'pins') displayItems = pinHistoryItems;
            else displayItems = [...questHistoryItems, ...pinHistoryItems];

            if (displayItems.length === 0) {
              return (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'var(--bg3)',
                  borderRadius: 16,
                  border: '1px dashed var(--border)'
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', margin: '0 0 4px 0' }}>No Activity History Recorded Yet</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--t3)', margin: 0 }}>
                    Complete your first quest or pass a syllabus exam above to build your permanent learning history!
                  </p>
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 16,
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 14,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: item.type === 'quest' ? 'rgba(var(--success-rgb),0.12)' : 'rgba(var(--warning-rgb),0.12)',
                        border: `1px solid ${item.type === 'quest' ? 'rgba(var(--success-rgb),0.3)' : 'rgba(var(--warning-rgb),0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22
                      }}>
                        {item.icon}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{item.title}</span>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--success)', border: '1px solid var(--border)' }}>
                            {item.courseTitle}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--t3)', margin: '3px 0 0 0', lineHeight: 1.4 }}>{item.desc}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 700 }}>{item.date}</span>
                      
                      {item.xp > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-bright)', background: 'rgba(var(--brand-rgb),0.1)', padding: '4px 8px', borderRadius: 6 }}>
                          +{item.xp} XP
                        </span>
                      )}

                      {item.pins !== 0 && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--warning-bright)', background: 'rgba(var(--warning-rgb),0.1)', padding: '4px 8px', borderRadius: 6 }}>
                          {item.pins > 0 ? `+${item.pins}` : item.pins} Pins
                        </span>
                      )}

                      {item.questId && (
                        <button
                          onClick={() => router.push(`/quests/lesson?questId=${item.questId}`)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1px solid var(--border)',
                            background: 'var(--bg2)',
                            color: 'var(--t1)',
                            fontSize: 11.5,
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Revisit Lesson ➔
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};
