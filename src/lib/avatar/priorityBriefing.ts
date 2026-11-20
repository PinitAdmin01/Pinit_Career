// src/lib/avatar/priorityBriefing.ts
/**
 * Professional Executive Priority & Diagnostic Briefing Engine.
 * Synthesizes 100% verified student progress, strengths, weak areas,
 * unresolved AI mistakes, and ranked priority next steps (zero synthetic data).
 */

import { getSavedCareerProjects, isStudentEngagedProject } from '@/lib/projects/savedProjects';

export interface LearningMistakeItem {
  id: string;
  type: string;
  module: string;
  description: string;
}

export interface PriorityActionItem {
  rank: number;
  title: string;
  reason: string;
  href: string;
  ctaLabel: string;
}

export interface PriorityDiagnosticInput {
  studentName?: string;
  targetRole?: string;
  activeCourseTitle?: string;
  completedQuests?: string[];
  completedMissions?: string[];
  missionStreak?: number;
  careerScore?: number;
  trustScore?: number;
  xp?: number;
  atsScore?: number;
  vaultCount?: number;
  interviewsDone?: number;
  weakAreas?: string[];
  strongAreas?: string[];
  skillTags?: string[];
  jdMissingSkills?: string[];
  learningMistakes?: unknown[];
  onboardingAnswers?: Record<string, unknown> | null;
}

export interface PriorityDiagnosticReport {
  studentName: string;
  targetRole: string;
  activeCourseTitle: string;
  metrics: {
    completedLessons: number;
    completedMissions: number;
    activeProjects: number;
    verifiedProjects: number;
    missionStreak: number;
    careerScore: number;
    trustScore: number;
    xp: number;
    atsScore: number;
    vaultCount: number;
  };
  strongAreas: string[];
  weakAreas: string[];
  mistakes: LearningMistakeItem[];
  priorities: PriorityActionItem[];
  spokenBriefing: string;
  chatSummary: string;
}

/**
 * Detects priority, progress diagnostic, and mistakes queries — tolerant of
 * Indian-English phrasing & broken sentence formation (e.g., "what are my priority",
 * "what i want to do", "show my mistakes", "where am i weak").
 */
export function isPriorityDiagnosticQuery(transcript: unknown): boolean {
  if (typeof transcript !== 'string') return false;
  const cleaned = transcript.toLowerCase().replace(/[.,!?;:'"]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return false;

  const patterns = [
    /\b(?:what\s+(?:are|is)\s+my|show\s+my|tell\s+me\s+my|my)\s+priorit(?:y|ies)\b/i,
    /\bwhat\s+(?:should\s+i|do\s+i|i\s+want\s+to|i\s+need\s+to|to)\s+do(?:\s+next|\s+today|\s+now)?\b/i,
    /\bwhat\s+next\b/i,
    /\b(?:show|tell|check|review|list)\s+(?:my\s+)?(?:mistakes|weak\s+areas?|weakness(?:es)?|strong\s+areas?|strengths?|progress|performance|diagnostic|briefing|report)\b/i,
    /\bwhere\s+(?:am\s+i\s+weak|do\s+i\s+stand|should\s+i\s+focus)\b/i,
    /\b(?:my\s+mistakes|my\s+weak\s+areas?|my\s+strong\s+areas?|my\s+progress\s+report|executive\s+briefing)\b/i,
    /\bwhat\s+should\s+i\s+(?:study|focus\s+on|work\s+on)\b/i,
    /\bguide\s+me\b/i,
    /\brecommend\s+(?:my\s+)?(?:next|tasks?|actions?|priorit(?:y|ies))\b/i,
  ];

  return patterns.some((rx) => rx.test(cleaned));
}

function normalizeStringList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const val = typeof raw === 'string' ? raw.trim() : '';
    if (!val) continue;
    const key = val.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(val);
    }
  }
  return out;
}

function normalizeMistakes(rawList: unknown): LearningMistakeItem[] {
  if (!Array.isArray(rawList)) return [];
  const out: LearningMistakeItem[] = [];
  rawList.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const rec = item as Record<string, unknown>;
    const moduleName = String(rec.module || rec.topic || rec.area || 'Core Concept').trim();
    const description = String(rec.description || rec.detail || rec.message || 'Needs concept review').trim();
    const type = String(rec.type || rec.category || 'Gap').trim();
    const id = String(rec.id || `mistake-${idx + 1}`);
    out.push({ id, type, module: moduleName, description });
  });
  return out;
}

export function buildPriorityDiagnosticReport(input: PriorityDiagnosticInput): PriorityDiagnosticReport {
  const firstNameRaw = (input.studentName || '').trim().split(/\s+/)[0] || '';
  const studentName = firstNameRaw && !/^candidate$/i.test(firstNameRaw)
    ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)
    : 'Candidate';

  const targetRole = (input.targetRole || '').trim() || 'Not Yet Selected';
  const activeCourseTitle = (input.activeCourseTitle || '').trim() || 'No Active Course Enrolled';

  const completedLessons = Array.isArray(input.completedQuests) ? input.completedQuests.length : 0;
  const completedMissions = Array.isArray(input.completedMissions) ? input.completedMissions.length : 0;
  const missionStreak = Math.max(0, Number(input.missionStreak) || 0);
  const careerScore = Math.max(0, Number(input.careerScore) || 0);
  const trustScore = Math.max(0, Number(input.trustScore) || 0);
  const xp = Math.max(0, Number(input.xp) || 0);
  const atsScore = Math.max(0, Number(input.atsScore) || 0);
  const vaultCount = Math.max(0, Number(input.vaultCount) || 0);

  const savedProjs = getSavedCareerProjects(input.onboardingAnswers as any);
  const engagedProjects = savedProjs.filter((p) => isStudentEngagedProject(p));
  const activeProjects = engagedProjects.length;
  const verifiedProjects = engagedProjects.filter(
    (p) => p.status === 'Completed' || Boolean(p.authorshipVerified) || Boolean(p.certificateId)
  ).length;

  const rawMistakes =
    Array.isArray(input.learningMistakes) && input.learningMistakes.length > 0
      ? input.learningMistakes
      : (input.onboardingAnswers as any)?.learning_mistakes;
  const mistakes = normalizeMistakes(rawMistakes);

  // Derive verified Strong Areas (strictly from real signals)
  const strongAreas = normalizeStringList([
    ...(input.strongAreas || []),
    ...(input.skillTags || []),
  ]);
  if (trustScore >= 85 && !strongAreas.some((s) => /trust|integrity/i.test(s))) {
    strongAreas.push(`Academic Integrity (Trust ${trustScore})`);
  }
  if (missionStreak >= 3 && !strongAreas.some((s) => /consistency|streak/i.test(s))) {
    strongAreas.push(`Execution Consistency (${missionStreak}-day streak)`);
  }
  if (verifiedProjects > 0 && !strongAreas.some((s) => /capstone|project/i.test(s))) {
    strongAreas.push(`Verified Project Delivery (${verifiedProjects} shipped)`);
  }
  if (completedLessons >= 3 && !strongAreas.some((s) => /curriculum|lessons/i.test(s))) {
    strongAreas.push(`Curriculum Foundations (${completedLessons} lessons cleared)`);
  }

  // Derive verified Weak Areas / Gaps (strictly from real gaps, mistakes, and zero-baselines)
  const weakAreas = normalizeStringList([
    ...(input.weakAreas || []),
    ...(input.jdMissingSkills || []),
    ...mistakes.map((m) => m.module),
  ]);
  if (atsScore === 0 && !weakAreas.some((w) => /resume|ats/i.test(w))) {
    weakAreas.push('Resume ATS Optimization (0/100)');
  }
  if (completedLessons === 0 && !weakAreas.some((w) => /course|lesson/i.test(w))) {
    weakAreas.push('Core Curriculum Progress (0 lessons completed)');
  }
  if (activeProjects === 0 && !weakAreas.some((w) => /project|capstone/i.test(w))) {
    weakAreas.push('Applied Proof-of-Work (0 active projects)');
  }
  if (vaultCount === 0 && !weakAreas.some((w) => /credential|vault/i.test(w))) {
    weakAreas.push('Verified Proof Vault Credentials (0 minted)');
  }

  // Build ranked Top-3 Priority Actions
  const priorities: PriorityActionItem[] = [];
  if (mistakes.length > 0) {
    priorities.push({
      rank: priorities.length + 1,
      title: `Remediate ${mistakes.length} Unresolved ${mistakes.length === 1 ? 'Mistake' : 'Mistakes'}`,
      reason: `Start with "${mistakes[0].module}": ${mistakes[0].description}`,
      href: '/mirror?tab=twin',
      ctaLabel: 'Open Skill Gaps',
    });
  }
  if (completedLessons === 0) {
    priorities.push({
      rank: priorities.length + 1,
      title: 'Complete Lesson 1 in Courses',
      reason: 'Establishes your active learning track, Career Score, and visual milestone trail.',
      href: '/quests',
      ctaLabel: 'Start Lesson 1',
    });
  } else {
    priorities.push({
      rank: priorities.length + 1,
      title: `Continue Curriculum (${completedLessons} Completed)`,
      reason: 'Advance to your next lesson to unlock and verify your course capstone.',
      href: '/quests',
      ctaLabel: 'Resume Courses',
    });
  }
  if (completedMissions === 0 || missionStreak === 0) {
    priorities.push({
      rank: priorities.length + 1,
      title: 'Complete Today’s Daily Mission',
      reason: 'Builds your consistency streak and sharpens real-world decision making.',
      href: '/missions',
      ctaLabel: 'Launch Mission',
    });
  }
  if (priorities.length < 3 && atsScore < 60) {
    priorities.push({
      rank: priorities.length + 1,
      title: 'Audit Resume & Skill Gaps in Digital Studio',
      reason: `Current ATS readiness is ${atsScore}/100. Map exact role keywords and gaps.`,
      href: '/mirror',
      ctaLabel: 'Open Digital Studio',
    });
  }
  if (priorities.length < 3 && activeProjects === 0) {
    priorities.push({
      rank: priorities.length + 1,
      title: 'Initialize Your First Capstone Project',
      reason: 'Link a real GitHub repository to generate verifiable recruiter proof-of-work.',
      href: '/projects',
      ctaLabel: 'Open Projects',
    });
  }
  const topPriorities = priorities.slice(0, 3).map((p, i) => ({ ...p, rank: i + 1 }));

  // Build professional spoken briefing (concise, authoritative, 100% factual)
  const completedClause = `Here is your executive performance briefing, ${studentName}. You have completed ${completedLessons} ${completedLessons === 1 ? 'lesson' : 'lessons'}, ${completedMissions} daily ${completedMissions === 1 ? 'mission' : 'missions'}, and ${activeProjects} active ${activeProjects === 1 ? 'project' : 'projects'}, with a Career Score of ${careerScore} and a ${missionStreak}-day streak.`;
  const strongClause = strongAreas.length > 0
    ? `Your verified strengths are ${strongAreas.slice(0, 2).join(' and ')}.`
    : `You do not have benchmarked strengths logged yet — clearing your first lab will establish your baseline.`;
  const weakClause = weakAreas.length > 0
    ? `Your primary improvement areas are ${weakAreas.slice(0, 2).join(' and ')}.`
    : `No critical skill gaps are currently flagged.`;
  const mistakesClause = mistakes.length > 0
    ? `You also have ${mistakes.length} unresolved ${mistakes.length === 1 ? 'mistake' : 'mistakes'}, starting with ${mistakes[0].module}, which I have displayed on screen.`
    : `You currently have zero unresolved mistakes on record.`;
  const nextClause = topPriorities[0]
    ? `Your number one priority right now is to ${topPriorities[0].title.toLowerCase()}.`
    : `Open Courses or Daily Missions to continue advancing.`;

  const spokenBriefing = `${completedClause} ${strongClause} ${weakClause} ${mistakesClause} ${nextClause}`;

  const chatSummary = [
    `Executive Diagnostic Briefing — ${studentName}`,
    `• Completed: ${completedLessons} lessons · ${completedMissions} missions · ${activeProjects} active projects · Career Score ${careerScore} · Trust ${trustScore}`,
    `• Strong Areas: ${strongAreas.length > 0 ? strongAreas.slice(0, 3).join(', ') : 'None benchmarked yet'}`,
    `• Weak Areas / Gaps: ${weakAreas.length > 0 ? weakAreas.slice(0, 3).join(', ') : 'None flagged'}`,
    `• Unresolved Mistakes: ${mistakes.length > 0 ? mistakes.slice(0, 3).map((m) => `${m.module} (${m.type})`).join('; ') : '0 unresolved mistakes'}`,
    `• Top Priority: ${topPriorities[0]?.title || 'Start Lesson 1 in Courses'}`,
  ].join('\n');

  return {
    studentName,
    targetRole,
    activeCourseTitle,
    metrics: {
      completedLessons,
      completedMissions,
      activeProjects,
      verifiedProjects,
      missionStreak,
      careerScore,
      trustScore,
      xp,
      atsScore,
      vaultCount,
    },
    strongAreas,
    weakAreas,
    mistakes,
    priorities: topPriorities,
    spokenBriefing,
    chatSummary,
  };
}
