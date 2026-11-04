'use client';

import React from 'react';
import { Project } from '@/lib/data/projectData';

interface CourseProjectProgressBarProps {
  courseName?: string;
  careerGoal?: string;
  projects: Project[];
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
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 28,
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
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
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              Academic Curriculum Pathway
            </span>
            <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>Target: {careerGoal}</span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', margin: 0, letterSpacing: '-0.3px' }}>
            {courseName}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--t2)', margin: '4px 0 0' }}>
            Complete your verified course capstones to earn accredited industry credential certifications.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {onStartCustomProject && (
            <button
              onClick={onStartCustomProject}
              data-testid="start-own-project-btn"
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(129, 140, 248, 0.4)',
                color: '#818cf8',
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              + Start Your Own Project
            </button>
          )}

          <div
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              background: projectProgressPct === 100 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.12)',
              border: `1px solid ${projectProgressPct === 100 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(56, 189, 248, 0.25)'}`,
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: projectProgressPct === 100 ? '#22c55e' : '#38bdf8',
                letterSpacing: '0.4px',
              }}
            >
              {projectProgressPct === 100 ? '✓ Certification Ready' : 'Capstone Progress'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--t1)' }}>
              {completedCount} / {totalRequired} Completed ({projectProgressPct}%)
            </div>
          </div>
        </div>
      </div>

      {/* Main Animated Progress Bar */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            height: 12,
            background: 'rgba(255, 255, 255, 0.08)',
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
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.5)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--t3)',
            marginTop: 6,
            fontWeight: 600,
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
                  : 'rgba(255, 255, 255, 0.03)',
                border: isDone
                  ? '1px solid rgba(34, 197, 94, 0.35)'
                  : isInProgress
                  ? '1.5px solid #38bdf8'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: '14px 16px',
                cursor: matchingProj ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: isDone ? '#22c55e' : isInProgress ? '#38bdf8' : 'var(--t3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  Stage {idx + 1} • {m.level}
                </span>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: isDone
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isInProgress
                      ? 'rgba(56, 189, 248, 0.2)'
                      : 'rgba(255, 255, 255, 0.06)',
                    color: isDone ? '#22c55e' : isInProgress ? '#38bdf8' : 'var(--t3)',
                  }}
                >
                  {isDone ? '✓ Verified' : isInProgress ? '⏳ In Progress' : 'Not Started'}
                </span>
              </div>

              <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
                {matchingProj ? matchingProj.name : m.title}
              </div>

              <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                {matchingProj ? matchingProj.description : m.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
