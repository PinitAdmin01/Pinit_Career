'use client';

import React from 'react';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { useCareerOS } from '@/lib/context/CareerOSContext';

interface QuestsSCurveMapProps {
  trajectory: any;
  onScrollToNode: (nodeId: string) => void;
}

export function QuestsSCurveMap({ trajectory, onScrollToNode }: QuestsSCurveMapProps) {
  const { completedQuests } = useCareerOS();

  // Find active node index
  const activeNodeIdx = (trajectory?.nodes || []).findIndex((node: any) => {
    const cObj = COURSES_REGISTRY.find(c => c.id === node.courseId);
    const qList = cObj?.quests || [];
    const count = qList.filter(q => (completedQuests || []).includes(q.id)).length;
    return count < (cObj?.quests?.length || 1);
  });
  const nodesCount = trajectory?.nodes?.length || 1;
  const runnerIdx = activeNodeIdx === -1 ? nodesCount - 1 : activeNodeIdx;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 780, padding: '20px 10px 40px 10px', overflow: 'hidden' }}>
      
      {/* 🎨 BACKGROUND CONTINUOUS SVG S-CURVE ROAD TRACK */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 320 780" preserveAspectRatio="none">
        <defs>
          <linearGradient id="scurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="14%" stopColor="#f59e0b" />
            <stop offset="28%" stopColor="#10b981" />
            <stop offset="42%" stopColor="#06b6d4" />
            <stop offset="56%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#8b5cf6" />
            <stop offset="84%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Outer Thick Road Shadow / Border */}
        <path
          d="M 50,35 H 250 C 295,35 295,115 250,115 H 60 C 15,115 15,195 60,195 H 250 C 295,195 295,275 250,275 H 60 C 15,275 15,355 60,355 H 250 C 295,355 295,435 250,435 H 60 C 15,435 15,515 60,515 H 250 C 295,515 295,595 250,595 H 60 C 15,595 15,675 60,675 H 250 C 295,675 295,735 250,735 H 230"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="34"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Main Colored Road Surface */}
        <path
          d="M 50,35 H 250 C 295,35 295,115 250,115 H 60 C 15,115 15,195 60,195 H 250 C 295,195 295,275 250,275 H 60 C 15,275 15,355 60,355 H 250 C 295,355 295,435 250,435 H 60 C 15,435 15,515 60,515 H 250 C 295,515 295,595 250,595 H 60 C 15,595 15,675 60,675 H 250 C 295,675 295,735 250,735 H 230"
          fill="none"
          stroke="url(#scurveGradient)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dashed Center Lane Line */}
        <path
          d="M 50,35 H 250 C 295,35 295,115 250,115 H 60 C 15,115 15,195 60,195 H 250 C 295,195 295,275 250,275 H 60 C 15,275 15,355 60,355 H 250 C 295,355 295,435 250,435 H 60 C 15,435 15,515 60,515 H 250 C 295,515 295,595 250,595 H 60 C 15,595 15,675 60,675 H 250 C 295,675 295,735 250,735 H 230"
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="2.5"
          strokeDasharray="10 9"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* 🏁 START MARKER BADGE */}
      <div style={{
        position: 'absolute',
        top: 15,
        left: 20,
        zIndex: 5,
        background: '#f43f5e',
        color: '#fff',
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 4px 12px rgba(244,63,94,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span>🚩</span> START
      </div>

      {/* 📍 VISUAL MILESTONE NODE PILLS ALONG S-CURVE */}
      {[
        { step: 1, top: 115, align: 'right', left: 'auto', right: 20, color: '#f59e0b' },
        { step: 2, top: 195, align: 'left', left: 20, right: 'auto', color: '#10b981' },
        { step: 3, top: 275, align: 'right', left: 'auto', right: 20, color: '#06b6d4' },
        { step: 4, top: 355, align: 'left', left: 20, right: 'auto', color: '#3b82f6' },
        { step: 5, top: 435, align: 'right', left: 'auto', right: 20, color: '#8b5cf6' },
        { step: 6, top: 515, align: 'left', left: 20, right: 'auto', color: '#ec4899' },
        { step: 7, top: 595, align: 'right', left: 'auto', right: 20, color: '#f43f5e' },
        { step: 8, top: 675, align: 'left', left: 20, right: 'auto', color: '#eab308' }
      ].map((item, idx) => {
        const safeNodes = trajectory?.nodes || [];
        const targetIdx = Math.min(idx, Math.max(0, safeNodes.length - 1));
        const targetNode = safeNodes[targetIdx] || safeNodes[0] || { nodeId: 'fallback', title: 'Foundations' };
        const isCurrentRunnerPos = idx === runnerIdx;

        return (
          <div
            key={item.step}
            onClick={() => onScrollToNode(targetNode.nodeId)}
            style={{
              position: 'absolute',
              top: item.top - 18,
              left: item.left,
              right: item.right,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
            className="card-hover"
          >
            {/* Step Number Circle */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: item.color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              boxShadow: `0 4px 14px ${item.color}55`,
              border: '2px solid #fff'
            }}>
              {item.step}
            </div>

            {/* Title Pill */}
            <div style={{
              background: 'var(--bg2)',
              border: `1.5px solid ${item.color}`,
              borderRadius: 12,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--t1)',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: 180,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              <span>STEP {item.step}</span> {targetNode.title.split('—')[0].split('&')[0].trim()}
            </div>

            {/* YOU ARE HERE Avatar Marker */}
            {isCurrentRunnerPos && (
              <div style={{
                position: 'absolute',
                top: -32,
                left: item.align === 'left' ? 40 : 'auto',
                right: item.align === 'right' ? 40 : 'auto',
                zIndex: 20,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 10,
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                animation: 'bounce 1.5s infinite',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span>📍 YOU ARE HERE</span>
              </div>
            )}
          </div>
        );
      })}

      {/* 🚀 END GOAL ROCKET MARKER */}
      <div style={{
        position: 'absolute',
        top: 735,
        right: 20,
        zIndex: 5,
        background: 'linear-gradient(135deg, #eab308, #ca8a04)',
        color: '#fff',
        padding: '6px 16px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 4px 14px rgba(234,179,8,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span>🚀</span> CAREER GOAL
      </div>
    </div>
  );
}
