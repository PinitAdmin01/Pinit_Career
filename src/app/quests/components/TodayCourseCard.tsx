'use client';

import React from 'react';
import type { TodaySummary } from '@/lib/courses/todaySummary';

interface TodayCourseCardProps {
  planTitle: string;
  summary: TodaySummary;
  onStart: () => void;
  onOpenProject: () => void;
}

const KIND_ICON: Record<string, string> = { Lesson: '🎓', Practice: '💻', Test: '📝' };

/** The first thing an enrolled student sees: the next task, progress, next test and final project. */
export function TodayCourseCard({ planTitle, summary, onStart, onOpenProject }: TodayCourseCardProps) {
  const { next, day, totalDays, tasksDone, tasksTotal, percent, nextTest, project, tasksLeftBeforeProject } = summary;

  return (
    <section
      aria-labelledby="today-course-title"
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--t3)' }}>{planTitle}</span>
        {day !== null && totalDays > 0 && (
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>Day {day} of {totalDays}</span>
        )}
      </div>

      {next ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: '1 1 260px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t3)', marginBottom: 4 }}>
              {KIND_ICON[next.kind]} Next: {next.kind}
            </div>
            <h3 id="today-course-title" style={{ fontSize: 19, fontWeight: 900, color: 'var(--t1)', margin: 0, lineHeight: 1.3 }}>
              {next.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onStart}
            data-testid="btn-today-start"
            style={{
              padding: '12px 26px',
              borderRadius: 12,
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 15.5,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Start ▶
          </button>
        </div>
      ) : (
        <h3 id="today-course-title" style={{ fontSize: 19, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
          🎉 All lessons, practice and tests are done
        </h3>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>
          <span>{tasksDone} of {tasksTotal} tasks done</span>
          <span>{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course progress"
          style={{ height: 8, borderRadius: 8, background: 'var(--bg3)', overflow: 'hidden' }}
        >
          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--accent)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg1)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t3)' }}>📝 Next test</div>
          <div style={{ fontSize: 14.5, color: 'var(--t1)', marginTop: 2 }}>
            {nextTest
              ? nextTest.tasksBefore === 0
                ? `${nextTest.title}: ready now`
                : `${nextTest.title}: after ${nextTest.tasksBefore} more task${nextTest.tasksBefore === 1 ? '' : 's'}`
              : 'All tests passed'}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg1)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t3)' }}>🚀 Final project</div>
          {project === 'locked' ? (
            <div style={{ fontSize: 14.5, color: 'var(--t1)', marginTop: 2 }}>
              Opens after all tasks ({tasksLeftBeforeProject} left)
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenProject}
              style={{ marginTop: 4, padding: 0, border: 'none', background: 'none', color: 'var(--accent)', fontSize: 14.5, fontWeight: 800, cursor: 'pointer' }}
            >
              {project === 'done' ? 'Done: see your certificate →' : 'Open your final project →'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
