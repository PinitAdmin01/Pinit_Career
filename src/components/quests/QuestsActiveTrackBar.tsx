'use client';

import React from 'react';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { useCareerOS } from '@/lib/context/CareerOSContext';

interface QuestsActiveTrackBarProps {
  myActiveCourseIds: string[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
  onOpenRoadmapModal: () => void;
}

export function QuestsActiveTrackBar({
  myActiveCourseIds,
  activeCourseId,
  onSelectCourse,
  onOpenRoadmapModal
}: QuestsActiveTrackBarProps) {
  const { completedQuests, archiveActiveCourse } = useCareerOS();
  const count = myActiveCourseIds.length;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      borderRadius: 14,
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      marginBottom: 20,
      flexWrap: 'wrap',
      gap: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>
          Active Enrolled Tracks ({count}/3):
        </span>
        {myActiveCourseIds.map(id => {
          const cObj = COURSES_REGISTRY.find(c => c.id === id);
          if (!cObj) return null;
          const isCurrent = id === activeCourseId;

          const cQuests = cObj?.quests || [];
          const cCleared = cQuests.filter(q => (completedQuests || []).includes(q.id)).length;
          const cProgressPct = Math.min(100, Math.round((cCleared / Math.max(1, cObj?.quests?.length || 1)) * 100));
          const cActiveDay = Math.min(30, Math.floor(cCleared / 3) + 1);

          return (
            <div
              key={id}
              onClick={() => onSelectCourse(id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 10,
                border: `1.5px solid ${isCurrent ? '#10b981' : 'var(--border)'}`,
                background: isCurrent ? 'rgba(16,185,129,0.12)' : 'var(--bg3)',
                color: isCurrent ? '#10b981' : 'var(--t1)',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: isCurrent ? 'default' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isCurrent ? '0 2px 8px rgba(16,185,129,0.2)' : 'none'
              }}
            >
              <span>{cObj.icon}</span>
              <span>{cObj.title.split('(')[0].trim()}</span>
              <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 6, background: isCurrent ? '#10b981' : 'var(--bg4)', color: isCurrent ? '#fff' : 'var(--t3)' }}>
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
                        onSelectCourse(remaining[0]);
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
          onClick={onOpenRoadmapModal}
          style={{
            padding: '5px 10px',
            borderRadius: 8,
            border: '1px dashed #10b981',
            background: 'rgba(16,185,129,0.08)',
            color: '#10b981',
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
}
