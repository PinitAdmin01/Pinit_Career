'use client';

import React from 'react';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { useCareerOS } from '@/lib/context/CareerOSContext';

interface QuestsStageCardsProps {
  trajectory: any;
  activeCourseId: string;
  onLaunchQuest: (quest: any, courseId?: string) => void;
  onOpenGateModal: (node: any) => void;
  onOpenNotesModalForCourse: (courseId: string) => void;
}

export function QuestsStageCards({
  trajectory,
  activeCourseId,
  onLaunchQuest,
  onOpenGateModal,
  onOpenNotesModalForCourse
}: QuestsStageCardsProps) {
  const { completedQuests } = useCareerOS();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {trajectory.nodes.map((node: any, idx: number) => {
        const cObj = COURSES_REGISTRY.find(c => c.id === node.courseId) || COURSES_REGISTRY[0];
        const qList = cObj?.quests || [];
        const clearedQuests = qList.filter(q => (completedQuests || []).includes(q.id));
        const clearedCount = clearedQuests.length;
        const totalCount = cObj?.quests?.length || 1;
        const progressPct = Math.min(100, Math.round((clearedCount / Math.max(1, totalCount)) * 100));
        const isFullyCleared = totalCount > 0 && clearedCount === totalCount;
        const nextQuestToSolve = qList.find(q => !(completedQuests || []).includes(q.id)) || qList[0];

        const isPreviousNodesCleared = trajectory.nodes.slice(0, idx).every((prevNode: any) => {
          const prevCourseObj = COURSES_REGISTRY.find(c => c.id === prevNode.courseId);
          const prevList = prevCourseObj?.quests || [];
          return prevList.every(q => completedQuests.includes(q.id));
        });

        const isLockedNode = idx > 0 && !isPreviousNodesCleared;

        return (
          <div
            key={node.nodeId}
            id={`node-card-${node.nodeId}`}
            className="glass-card-premium"
            style={{
              padding: 24,
              borderRadius: 20,
              border: `1.5px solid ${isFullyCleared ? 'rgba(16,185,129,0.3)' : isLockedNode ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
              background: isFullyCleared ? 'rgba(16,185,129,0.02)' : isLockedNode ? 'rgba(0,0,0,0.2)' : 'var(--bg2)',
              opacity: isLockedNode ? 0.65 : 1,
              transition: 'all 0.3s'
            }}
          >
            {/* Header & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{node.icon || cObj.icon}</span>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase' }}>
                    STAGE {idx + 1} OF {trajectory.nodes.length}
                  </span>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 2 }}>
                    {node.title}
                  </h3>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: 10.5,
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: isFullyCleared ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                  color: isFullyCleared ? 'var(--green)' : 'var(--accent)'
                }}>
                  {isFullyCleared ? 'STAGE CLEARED ✓' : `${progressPct}% COMPLETED`}
                </span>
                
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => onOpenNotesModalForCourse(cObj.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      fontSize: 10.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    📖 Course Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Skills */}
            <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 14 }}>
              {node.shortDesc}
            </p>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {node.skillsLearned.map((sk: string, i: number) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: 'var(--bg3)', color: 'var(--t2)' }}>
                  {sk}
                </span>
              ))}
            </div>

            {/* Launch Next Quest Handler Button */}
            {isLockedNode ? (
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t4)', padding: '10px 14px', borderRadius: 10, background: 'var(--bg3)', textAlign: 'center' }}>
                🔒 Complete Stage {idx} to unlock this module
              </div>
            ) : nextQuestToSolve ? (
              <button
                onClick={() => onLaunchQuest(nextQuestToSolve, cObj.id)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: isFullyCleared ? 'var(--bg3)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: isFullyCleared ? 'var(--t2)' : '#fff',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: isFullyCleared ? 'none' : '0 4px 14px rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>{isFullyCleared ? '🔁 Review / Re-solve Quests' : '⚡ Launch Next Quest'}</span>
                <span style={{ fontSize: 11, opacity: 0.8 }}>({nextQuestToSolve.title})</span>
              </button>
            ) : null}

            {/* Readiness Gate Trigger */}
            {node.gate && isFullyCleared && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)' }}>
                  🛡️ Readiness Audit Gate
                </span>
                <button
                  onClick={() => onOpenGateModal(node)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'rgba(234,179,8,0.15)',
                    color: '#eab308',
                    border: '1px solid rgba(234,179,8,0.3)',
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Audited & Verified ✓
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
