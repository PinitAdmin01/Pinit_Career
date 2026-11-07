'use client';

import React from 'react';
import { Project } from '@/lib/data/projectData';

interface CourseProjectProgressBarProps {
  courseName?: string;
  careerGoal?: string;
  projects?: Project[];
  courseProgressPercent?: number;
  onStartCustomProject?: () => void;
  onSelectProject?: (project: Project) => void;
}

export const CourseProjectProgressBar: React.FC<CourseProjectProgressBarProps> = ({
  courseName = 'Cloud & Distributed Systems Engineering',
  careerGoal = 'Full Stack Engineer',
  projects = [],
  courseProgressPercent = 0,
  onStartCustomProject,
  onSelectProject,
}) => {
  const totalRequired = Math.max(projects.length, 3);
  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const inProgressProjects = projects.filter((p) => p.status === 'In Progress');
  const completedCount = completedProjects.length;
  const projectProgressPct = Math.min(100, Math.round((completedCount / totalRequired) * 100));

  const milestones = [
    {
      level: 'Beginner',
      title: 'Milestone 1: Foundation Capstone',
      desc: 'Architecture baseline, data contracts & core logic',
      status: projects.find((p) => p.level === 'Beginner')?.status || 'Not Started',
    },
    {
      level: 'Intermediate',
      title: 'Milestone 2: Distributed Integration',
      desc: 'Microservices, database pool & API latency SLA',
      status: projects.find((p) => p.level === 'Intermediate' || p.level === 'Advanced')?.status || 'Not Started',
    },
    {
      level: 'Enterprise',
      title: 'Milestone 3: Production Defense',
      desc: 'Live telemetry, zero-trust security & viva jury defense',
      status: projects.find((p) => p.level === 'Enterprise' || p.level === 'Future-Tech')?.status || 'Not Started',
    },
  ];

  return (
    <div
      data-testid="course-project-progress-card"
      style={{
        background: 'var(--card)',
        backgroundImage: 'linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 28,
        boxShadow: 'var(--shadow-md, 0 8px 24px rgba(0, 0, 0, 0.08))',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Top Meta Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: '1 1 320px', minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                background: 'var(--accent-light, rgba(99, 102, 241, 0.12))',
                border: '1px solid var(--border2)',
                padding: '3px 9px',
                borderRadius: 6,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              Academic Curriculum Pathway
            </span>
            <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 600 }}>Target: {careerGoal}</span>
          </div>

          <h2 style={{ fontSize: 23, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.3 }}>
            {courseName}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--t2)', margin: '6px 0 0', lineHeight: 1.5 }}>
            Complete your verified course capstones to earn accredited industry credential certifications.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {onStartCustomProject && (
            <button
              onClick={onStartCustomProject}
              data-testid="start-own-project-btn"
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: 'var(--accent-light, rgba(99, 102, 241, 0.12))',
                border: '1.5px solid var(--accent)',
                color: 'var(--accent)',
                fontSize: 13.5,
                fontWeight: 800,
                fontFamily: 'var(--font-display, inherit)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <span>+</span>
              <span>Start Your Own Project</span>
            </button>
          )}

          <div
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              background: projectProgressPct === 100 ? 'rgba(34, 197, 94, 0.12)' : 'var(--bg3)',
              border: `1px solid ${projectProgressPct === 100 ? 'rgba(34, 197, 94, 0.35)' : 'var(--border2)'}`,
              textAlign: 'right',
              minWidth: 160,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: projectProgressPct === 100 ? '#16a34a' : 'var(--accent)',
                letterSpacing: '0.4px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {projectProgressPct === 100 ? '✓ Certification Ready' : 'Capstone Progress'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)', marginTop: 2 }}>
              {completedCount} / {totalRequired} Completed ({projectProgressPct}%)
            </div>
          </div>
        </div>
      </div>

      {/* Main Animated Progress Bar */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            height: 12,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 999,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            data-testid="course-progress-fill"
            style={{
              width: `${projectProgressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 50%, #10b981 100%)',
              borderRadius: 999,
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12.5,
            color: 'var(--t2)',
            marginTop: 8,
            fontWeight: 600,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span>Course Quests Progress: {courseProgressPercent}%</span>
          <span>
            {inProgressProjects.length > 0
              ? `${inProgressProjects.length} project in active development`
              : completedCount === 0
              ? 'Select a course capstone below to begin'
              : `${totalRequired - completedCount} project remaining for certificate`}
          </span>
        </div>
      </div>

      {/* 3-Milestone Stage Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {milestones.map((m, idx) => {
          const isDone = m.status === 'Completed';
          const isInProgress = m.status === 'In Progress';
          const matchingProj = projects.find((p) => p.level === m.level || (idx === 1 && p.level === 'Advanced'));

          return (
            <div
              key={idx}
              onClick={() => matchingProj && onSelectProject?.(matchingProj)}
              style={{
                background: isDone
                  ? 'rgba(34, 197, 94, 0.08)'
                  : isInProgress
                  ? 'rgba(56, 189, 248, 0.08)'
                  : 'var(--bg2)',
                border: isDone
                  ? '1px solid rgba(34, 197, 94, 0.35)'
                  : isInProgress
                  ? '1.5px solid var(--accent)'
                  : '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 18px',
                cursor: matchingProj ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: isDone ? '#16a34a' : isInProgress ? 'var(--accent)' : 'var(--t2)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  Stage {idx + 1} • {m.level}
                </span>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: isDone
                      ? 'rgba(34, 197, 94, 0.15)'
                      : isInProgress
                      ? 'rgba(56, 189, 248, 0.15)'
                      : 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: isDone ? '#16a34a' : isInProgress ? 'var(--accent)' : 'var(--t3)',
                  }}
                >
                  {isDone ? '✓ Verified' : isInProgress ? '⏳ In Progress' : 'Not Started'}
                </span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginBottom: 5, lineHeight: 1.35 }}>
                {matchingProj ? matchingProj.name : m.title}
              </div>

              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.45 }}>
                {matchingProj ? matchingProj.description : m.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
