'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { parseQuestId } from '@/lib/data/curriculumEnricher';
import type { Project } from '@/lib/data/projectData';
import { isStudentEngagedProject, computeHonestProjectProgress } from '@/lib/projects/savedProjects';

export interface JourneyLessonNode {
  lessonNum: number;
  label: string;
  state: 'done' | 'next' | 'locked';
}

export interface ActivityJourneyModel {
  completedLessons: number[];
  lessonNodes: JourneyLessonNode[];
  capstoneUnlockPercent: number;
  capstoneUnlocked: boolean;
  activeProjects: Array<{ id: string; name: string; progress: number; status: string }>;
  verifiedProjectsCount: number;
  stamps: Array<{ id: string; label: string; kind: 'lesson' | 'mission' | 'project' | 'repo' }>;
}

/**
 * Pure telemetry builder turning real student quest/mission/project data into
 * visual milestone nodes ("Done Lesson 1", "Lesson 2 · Next", etc.).
 * Strictly zero synthetic completion — empty history yields 0% and 0 stamps.
 */
export function buildActivityJourneyModel(input: {
  completedQuests?: string[];
  matchedCourseQuests?: string[];
  completedMissions?: string[];
  missionStreak?: number;
  projects?: Project[];
}): ActivityJourneyModel {
  const allQuests = Array.isArray(input.completedQuests) ? input.completedQuests : [];
  const courseQuests = Array.isArray(input.matchedCourseQuests) && input.matchedCourseQuests.length > 0
    ? input.matchedCourseQuests
    : allQuests;

  const lessonNumsSet = new Set<number>();
  let fallbackIndex = 1;
  for (const raw of courseQuests) {
    if (typeof raw !== 'string' || !raw.trim()) continue;
    const parsed = parseQuestId(raw.toLowerCase());
    if (parsed && parsed.dayNum > 0) {
      lessonNumsSet.add(parsed.dayNum);
      continue;
    }
    const rxMatch = raw.match(/(?:day|lesson|d|l|q)[-_]?(\d+)/i);
    if (rxMatch && Number(rxMatch[1]) > 0) {
      lessonNumsSet.add(Number(rxMatch[1]));
      continue;
    }
    while (lessonNumsSet.has(fallbackIndex)) fallbackIndex += 1;
    lessonNumsSet.add(fallbackIndex);
    fallbackIndex += 1;
  }

  const completedLessons = Array.from(lessonNumsSet).sort((a, b) => a - b);
  const highestCompleted = completedLessons.length > 0 ? completedLessons[completedLessons.length - 1] : 0;

  // Determine next logical lesson (first gap >= 1, else highest + 1)
  let nextLesson = 1;
  while (lessonNumsSet.has(nextLesson)) nextLesson += 1;

  // Build 5-node visual milestone window around the student's active frontier
  const windowStart = Math.max(1, highestCompleted >= 4 ? highestCompleted - 2 : 1);
  const lessonNodes: JourneyLessonNode[] = [];
  for (let i = 0; i < 5; i += 1) {
    const num = windowStart + i;
    const isDone = lessonNumsSet.has(num);
    const isNext = !isDone && num === nextLesson;
    lessonNodes.push({
      lessonNum: num,
      label: isDone ? `Done Lesson ${num}` : isNext ? `Lesson ${num}` : `Lesson ${num}`,
      state: isDone ? 'done' : isNext ? 'next' : 'locked',
    });
  }

  // Capstone gate unlocks at 3 distinct lessons completed
  const unlockTarget = 3;
  const capstoneUnlockPercent = Math.min(100, Math.round((completedLessons.length / unlockTarget) * 100));
  const capstoneUnlocked = completedLessons.length >= unlockTarget;

  const rawProjects = Array.isArray(input.projects) ? input.projects : [];
  const engaged = rawProjects.filter((p) => isStudentEngagedProject(p));
  const activeProjects = engaged.map((p) => ({
    id: p.id,
    name: p.name,
    progress: computeHonestProjectProgress(p),
    status: p.status,
  }));
  const verifiedProjectsCount = engaged.filter(
    (p) => p.status === 'Completed' || Boolean(p.authorshipVerified) || Boolean(p.certificateId)
  ).length;

  const stamps: ActivityJourneyModel['stamps'] = [];
  for (const num of completedLessons.slice(-4)) {
    stamps.push({ id: `lesson-${num}`, label: `Done Lesson ${num}`, kind: 'lesson' });
  }
  const missionsCount = Array.isArray(input.completedMissions) ? input.completedMissions.length : 0;
  if (missionsCount > 0) {
    stamps.push({
      id: 'missions',
      label: `${missionsCount} Daily ${missionsCount === 1 ? 'Mission' : 'Missions'} Done`,
      kind: 'mission',
    });
  }
  for (const proj of engaged.slice(0, 2)) {
    const pct = computeHonestProjectProgress(proj);
    stamps.push({
      id: `proj-${proj.id}`,
      label: proj.githubLink ? `Repo Linked · ${proj.name}` : `${proj.name} (${pct}%)`,
      kind: proj.githubLink ? 'repo' : 'project',
    });
  }

  return {
    completedLessons,
    lessonNodes,
    capstoneUnlockPercent,
    capstoneUnlocked,
    activeProjects,
    verifiedProjectsCount,
    stamps,
  };
}

interface ProjectActivityJourneyProps {
  courseTitle: string;
  completedQuests: string[];
  matchedCourseQuests: string[];
  completedMissions: string[];
  missionStreak: number;
  projects: Project[];
}

export const ProjectActivityJourney: React.FC<ProjectActivityJourneyProps> = ({
  courseTitle,
  completedQuests,
  matchedCourseQuests,
  completedMissions,
  missionStreak,
  projects,
}) => {
  const model = useMemo(
    () =>
      buildActivityJourneyModel({
        completedQuests,
        matchedCourseQuests,
        completedMissions,
        missionStreak,
        projects,
      }),
    [completedQuests, matchedCourseQuests, completedMissions, missionStreak, projects]
  );

  // SVG progress ring geometry
  const ringRadius = 28;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - model.capstoneUnlockPercent / 100);

  // Compute progress rail fill across the 5 visible lesson nodes
  const doneInWindow = model.lessonNodes.filter((n) => n.state === 'done').length;
  const railFillPct =
    doneInWindow === 0
      ? 0
      : Math.min(100, Math.round((doneInWindow / Math.max(model.lessonNodes.length - 1, 1)) * 100));

  return (
    <section
      data-testid="project-activity-journey"
      aria-label="Your Learning and Build Visual Journey"
      style={{
        background: 'var(--card)',
        backgroundImage:
          'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.08), transparent 42%), radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.09), transparent 48%)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: '20px 24px',
        marginBottom: 20,
        boxShadow: 'var(--shadow-sm, 0 4px 18px rgba(0, 0, 0, 0.08))',
      }}
    >
      {/* Header + SVG Milestone Ring */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 240 }}>
          {/* Circular SVG Progress Gauge */}
          <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
            <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="34"
                cy="34"
                r={ringRadius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="5.5"
              />
              <circle
                cx="34"
                cy="34"
                r={ringRadius}
                fill="none"
                stroke={model.capstoneUnlocked ? '#10b981' : '#38bdf8'}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 0.55s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)', lineHeight: 1 }}>
                {model.capstoneUnlockPercent}%
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', marginTop: 2, textTransform: 'uppercase' }}>
                Ready
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  color: model.completedLessons.length > 0 ? '#10b981' : 'var(--accent)',
                  background: model.completedLessons.length > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                  border: `1px solid ${model.completedLessons.length > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                {model.completedLessons.length > 0
                  ? `${model.completedLessons.length} ${model.completedLessons.length === 1 ? 'Lesson' : 'Lessons'} Cleared`
                  : 'Journey Baseline'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                {courseTitle}
              </span>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 2px', fontFamily: 'var(--font-display)' }}>
              Your Live Build &amp; Lesson Trail
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0 }}>
              {model.completedLessons.length > 0
                ? `Completed ${model.completedLessons.map((n) => `Lesson ${n}`).slice(-3).join(', ')}. Every verified lesson powers your capstone unlock.`
                : 'Complete Lesson 1 in Courses to light up your first milestone node and unlock project capstones.'}
            </p>
          </div>
        </div>

        {/* Live Compact Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontVariantNumeric: 'tabular-nums' }}>
          <div style={{ padding: '8px 12px', borderRadius: 11, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center', minWidth: 86 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: model.completedLessons.length > 0 ? '#10b981' : 'var(--t1)' }}>
              {model.completedLessons.length}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Lessons</div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 11, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center', minWidth: 86 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: model.activeProjects.length > 0 ? '#38bdf8' : 'var(--t1)' }}>
              {model.activeProjects.length}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Active Proj</div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 11, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center', minWidth: 86 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: missionStreak > 0 ? '#f59e0b' : 'var(--t1)' }}>
              {missionStreak}d
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Streak</div>
          </div>
        </div>
      </div>

      {/* Visual Lesson Milestone Rail (Done Lesson 1 -> Lesson 2 -> ... -> Capstone Gate) */}
      <div
        style={{
          position: 'relative',
          padding: '14px 12px 10px',
          borderRadius: 14,
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(108px, 1fr))',
            gap: 8,
            alignItems: 'start',
          }}
        >
          {/* Connecting Horizontal Rail behind nodes */}
          <div
            style={{
              position: 'absolute',
              top: 17,
              left: '8%',
              right: '8%',
              height: 3,
              background: 'var(--border)',
              borderRadius: 999,
              zIndex: 0,
            }}
          >
            <div
              style={{
                width: `${model.capstoneUnlocked ? 100 : Math.min(82, Math.round(railFillPct * 0.82))}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #38bdf8, #6366f1)',
                borderRadius: 999,
                transition: 'width 0.45s ease',
              }}
            />
          </div>

          {/* 5 Lesson Nodes */}
          {model.lessonNodes.map((node) => {
            const isDone = node.state === 'done';
            const isNext = node.state === 'next';
            return (
              <Link
                key={node.lessonNum}
                href="/quests"
                data-testid={`journey-lesson-node-${node.lessonNum}`}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 6,
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDone
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : isNext
                        ? 'rgba(56, 189, 248, 0.16)'
                        : 'var(--bg3)',
                    border: isDone
                      ? '2px solid #34d399'
                      : isNext
                        ? '2px solid #38bdf8'
                        : '1.5px solid var(--border)',
                    color: isDone ? '#ffffff' : isNext ? '#38bdf8' : 'var(--t3)',
                    boxShadow: isDone
                      ? '0 0 14px rgba(16, 185, 129, 0.35)'
                      : isNext
                        ? '0 0 12px rgba(56, 189, 248, 0.25)'
                        : 'none',
                    fontSize: 12,
                    fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {isDone ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    node.lessonNum
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: isDone ? '#10b981' : isNext ? 'var(--t1)' : 'var(--t3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isDone ? `Done Lesson ${node.lessonNum}` : `Lesson ${node.lessonNum}`}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>
                    {isDone ? 'Verified' : isNext ? 'Next Up' : 'Upcoming'}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Final Capstone Gate Node */}
          <div
            data-testid="journey-capstone-gate-node"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 6,
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: model.capstoneUnlocked
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'var(--bg3)',
                border: model.capstoneUnlocked ? '2px solid #a5b4fc' : '1.5px dashed var(--border)',
                color: model.capstoneUnlocked ? '#ffffff' : 'var(--t3)',
                boxShadow: model.capstoneUnlocked ? '0 0 16px rgba(99, 102, 241, 0.4)' : 'none',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: model.capstoneUnlocked ? '#a5b4fc' : 'var(--t3)', whiteSpace: 'nowrap' }}>
                Capstone Gate
              </div>
              <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>
                {model.capstoneUnlocked ? 'Unlocked' : `${Math.max(0, 3 - model.completedLessons.length)} left`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visual Proof Stamps Strip */}
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {model.stamps.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
              Verified Visual Log:
            </span>
            {model.stamps.map((stamp) => {
              const tone =
                stamp.kind === 'lesson'
                  ? { bg: 'rgba(16,185,129,0.12)', bd: 'rgba(16,185,129,0.3)', fg: '#10b981' }
                  : stamp.kind === 'mission'
                    ? { bg: 'rgba(245,158,11,0.12)', bd: 'rgba(245,158,11,0.3)', fg: '#f59e0b' }
                    : { bg: 'rgba(56,189,248,0.12)', bd: 'rgba(56,189,248,0.3)', fg: '#38bdf8' };
              return (
                <span
                  key={stamp.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: tone.bg,
                    border: `1px solid ${tone.bd}`,
                    color: tone.fg,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {stamp.label}
                </span>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--t3)' }}>
            <span>No verified stamps yet — finish Lesson 1 to mint your first visual badge.</span>
            <Link href="/quests" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'none' }}>
              Start Lesson 1 &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
