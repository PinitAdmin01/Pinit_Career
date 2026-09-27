import { COURSES_REGISTRY, CourseQuest } from './coursesData';
import { recommendCareerTrajectory } from './careerTrajectories';
import { mapQuestToCompetencyEvidence } from '../pathway/competencyMatrix';
import { MasteryState } from '../pathway/competencySchema';
import { parseQuestId } from './curriculumEnricher';
import { getRoadmapCourseIds } from '../roadmap/roadmapCourses';
import {
  CompleteDiagnosticProfile,
  DetectedTradeoff,
  RoadmapStrategyResult
} from '../onboarding/diagnosticEngine';

export interface DynamicRoadmapParams {
  qt1?: number; // Technical Knowledge Score (0-100)
  qt2?: number; // Mindset/Behavioral Score (0-100)
  archetype?: string; // e.g. "Pattern Hunter", "Execution Sprinter", "Deep Thinker"
  goal?: string; // Target Career Role / Goal
  courseId: string; // The student's main course (the roadmap starts from it)
  durationDays?: number; // 30, 60, 90, 180, 365 — one complete course per 30 days (lib/roadmap/roadmapCourses)
  dailyPace?: number; // Quests per day (e.g. 1, 2, 3, 5)
  programId?: string; // Active Career Program ID
  stageId?: string; // Active Stage ID
  competencyMasteryStates?: Record<string, MasteryState>; // Live mastery ledger state
  diagnosticProfile?: CompleteDiagnosticProfile | null;
  tradeoffs?: DetectedTradeoff[];
  roadmapStrategy?: RoadmapStrategyResult;
  weakAreas?: string[];
}

export interface DynamicRoadmapModule {
  id: string;
  /** The course this module's lessons come from. */
  courseId?: string;
  title: string;
  desc: string;
  difficulty: string;
  estimatedWeeks: number;
  personalizedPaceTag: string;
  knowledgeAdaptationTag: string;
  tradeoffInterventions?: string[];
  allocationsTag?: string;
  associatedCompetencyIds?: string[];
  isPreliminaryRoadmap?: boolean;
  diagnosticNotice?: string;
  quests: (CourseQuest & {
    fastTracked?: boolean;
    reinforcementNeeded?: boolean;
    personalizedHint?: string;
    competencyTag?: {
      competencyId: string;
      evidenceClass: string;
      difficulty: string;
      masteryState?: MasteryState;
    };
  })[];
}

/**
 * Dynamic Student Roadmap Engine
 * Formula: Roadmap = QT1 (Knowledge) + QT2 (Mindset) + Goal + the courses of the student's
 * career path (one complete course per 30 days of the chosen duration; see roadmapCourses.ts).
 */
export function generateDynamicStudentRoadmap(params: DynamicRoadmapParams): DynamicRoadmapModule[] {
  const isDefaultQT1 = params.qt1 === undefined || params.qt1 === null;
  const isDefaultQT2 = params.qt2 === undefined || params.qt2 === null;
  const isPreliminaryRoadmap = isDefaultQT1 || isDefaultQT2;
  const diagnosticNotice = isPreliminaryRoadmap
    ? '⚠️ Missing diagnostic assessment scores: calibrated to beginner baseline (40/100). Take diagnostic assessment to personalize.'
    : undefined;

  const {
    qt1 = 40,
    qt2 = 40,
    archetype = 'Pattern Hunter',
    goal = '',
    courseId,
    durationDays = 30,
    dailyPace = 3
  } = params;

  // 1. Resolve the roadmap's courses (main course + career path + foundations, by duration)
  const courseObj = COURSES_REGISTRY.find(c => c.id === courseId) || COURSES_REGISTRY[0];
  const roadmapCourses = getRoadmapCourseIds(courseObj.id, durationDays)
    .map((id) => COURSES_REGISTRY.find((c) => c.id === id))
    .filter((c): c is (typeof COURSES_REGISTRY)[number] => Boolean(c));
  const seenQuestIds = new Set<string>();
  const rawQuests: Array<CourseQuest & { sourceCourseId: string }> = [];
  for (const course of roadmapCourses) {
    for (const q of course.quests || []) {
      if (!q?.id || seenQuestIds.has(q.id)) continue;
      seenQuestIds.add(q.id);
      rawQuests.push({ ...q, sourceCourseId: course.id });
    }
  }

  // 2. Resolve Career Trajectory & Mixed Goal Fusion
  const trajectory = recommendCareerTrajectory(goal || courseObj.title, qt1, qt2, archetype);
  const targetRole = goal ? goal.trim() : trajectory.roleTitle;
  const isMixedGoal = Boolean(goal && goal.trim().length > 0);

  // 3. Knowledge Adaptation (QT1 Rules) & Decision Engine Trade-Off Fusing
  // High QT1 (>=75): Fast-track early foundation quests
  // Moderate QT1 (50-74): Standard progression
  // Low QT1 (<50): Reinforcement mode with expanded hints
  const isHighKnowledge = qt1 >= 75;
  const isLowKnowledge = qt1 < 50;

  const tradeoffs: DetectedTradeoff[] = params.tradeoffs || params.diagnosticProfile?.tradeoffs || [];
  const roadmapStrategy: RoadmapStrategyResult | undefined = params.roadmapStrategy || params.diagnosticProfile?.roadmapStrategy;

  let adaptedQuests = rawQuests.map(({ sourceCourseId, ...q }, idx) => {
    let fastTracked = false;
    let reinforcementNeeded = false;
    let personalizedHint = q.hint || '';

    // Days 1 & 2 Quests (First 6 quests)
    if (idx < 6) {
      if (isHighKnowledge) {
        fastTracked = true;
        personalizedHint = `⚡ Fast-Tracked (QT1: ${qt1}/100): Advanced concept review — ${q.hint || ''}`;
      } else if (isLowKnowledge) {
        reinforcementNeeded = true;
        personalizedHint = `💡 Reinforcement Warmup (QT1: ${qt1}/100): Key prerequisite focus — ${q.hint || ''}`;
      }
    } else if (isLowKnowledge && q.category === 'assignment') {
      reinforcementNeeded = true;
      personalizedHint = `🔍 Guided Step-by-Step Assignment (QT1: ${qt1}/100): Take your time to review starter code — ${q.hint || ''}`;
    } else if (isHighKnowledge && q.category === 'exam') {
      personalizedHint = `🏆 Advanced Fast-Paced Mastery Check — ${q.hint || ''}`;
    }

    // Trade-off specific coaching intervention
    if (tradeoffs.length > 0) {
      const topTradeoff = tradeoffs[0];
      if (idx % 2 === 1) {
        personalizedHint = `${personalizedHint ? personalizedHint + ' | ' : ''}🎯 Strategy Focus (${topTradeoff.type.replace(/_/g, ' ')}): ${topTradeoff.roadmapRecommendation}`;
      }
    }

    // Attach Competency Mapping (authoritative day resolution: 3 quests per day)
    const parsedDay = parseQuestId(q.id)?.dayNum;
    const dayNumber = parsedDay ?? (Math.floor(idx / 3) + 1);
    const compMapping = mapQuestToCompetencyEvidence(sourceCourseId, dayNumber, q.id);
    const compTag = compMapping ? {
      competencyId: compMapping.competencyId,
      evidenceClass: compMapping.evidenceClass,
      difficulty: compMapping.difficulty,
      masteryState: params.competencyMasteryStates ? params.competencyMasteryStates[compMapping.competencyId] : undefined,
    } : undefined;

    return {
      ...q,
      fastTracked,
      reinforcementNeeded,
      personalizedHint,
      competencyTag: compTag,
      sourceCourseId,
    };
  });

  // Fast-Track Compression: For high QT1 (>=75), compress early basic syntax quests (indices 1-4) into 1 accelerated quest
  if (isHighKnowledge && adaptedQuests.length > 5) {
    adaptedQuests = [
      {
        ...adaptedQuests[0],
        title: `⚡ Fast-Track Jump: ${adaptedQuests[0].title.replace('Learning: ', '')} (Basics Compressed)`,
        desc: `Compressed 5-in-1 basic syntax summary for high QT1 (${qt1}/100) score. Jumping directly to your present skill level!`,
        fastTracked: true
      },
      ...adaptedQuests.slice(5)
    ];
  }

  // 4. Mindset Adaptation (QT2 / Archetype Rules)
  let mindsetTag = '⚡ Balanced Learner';
  if (archetype.toLowerCase().includes('sprinter') || archetype.toLowerCase().includes('pattern')) {
    mindsetTag = '🚀 Fast-Paced Action & Practical Scenario Focus';
  } else if (archetype.toLowerCase().includes('thinker') || archetype.toLowerCase().includes('architect')) {
    mindsetTag = '🧠 Deep Strategic Frameworks & Analytical Mastery';
  }

  let knowledgeTag = `📊 Knowledge Level: Standard (${qt1}/100)`;
  if (isHighKnowledge) {
    knowledgeTag = `🚀 Fast-Tracked Prerequisites (High QT1: ${qt1}/100)`;
  } else if (isLowKnowledge) {
    knowledgeTag = `💡 Guided Prerequisite Warmups (QT1: ${qt1}/100)`;
  }

  // 5. Dynamic Module Packaging: each course of the roadmap in up to 4 phases, in study order.
  const effectivePace = Math.max(1, Math.min(3, dailyPace));
  const tradeoffInterventions = tradeoffs.map(t => `${t.type}: ${t.roadmapRecommendation}`);
  const allocationsTag = roadmapStrategy?.allocations
    ? `Allocations: ${roadmapStrategy.allocations.explorationPct}% Spike | ${roadmapStrategy.allocations.executionPct}% Build | ${roadmapStrategy.allocations.communicationPct}% Align | ${roadmapStrategy.allocations.technicalGapPct}% Remediation`
    : undefined;
  const courseCount = roadmapCourses.length;
  const modules: DynamicRoadmapModule[] = [];
  let moduleCount = 1;

  for (const course of roadmapCourses) {
    const courseQuests = adaptedQuests.filter((q) => q.sourceCourseId === course.id);
    const questsPerModule = Math.max(10, Math.ceil(courseQuests.length / 4));
    for (let start = 0; start < courseQuests.length; start += questsPerModule) {
      const chunk = courseQuests.slice(start, start + questsPerModule).map(({ sourceCourseId: _source, ...q }) => q);
      modules.push({
        id: `${course.id}-dynamic-mod-${moduleCount}`,
        courseId: course.id,
        title: `Phase ${moduleCount}: ${targetRole} — ${course.title.split('(')[0].trim()}`,
        desc: `${isMixedGoal ? '🔀 Fused Goal Trajectory: ' : ''}Personalized ${durationDays}-Day Roadmap for "${targetRole}"${courseCount > 1 ? ` across ${courseCount} courses` : ''}. Paced at ${dailyPace} quests/day. Tailored for ${archetype} archetype with QT1: ${qt1}/100 & QT2: ${qt2}/100.`,
        difficulty: isHighKnowledge ? 'Advanced' : isLowKnowledge ? 'Foundational' : 'Intermediate',
        estimatedWeeks: Math.max(1, Math.ceil(chunk.length / (effectivePace * 7))),
        personalizedPaceTag: allocationsTag || (isMixedGoal ? `🎯 Target Goal: ${targetRole}` : mindsetTag),
        knowledgeAdaptationTag: knowledgeTag,
        tradeoffInterventions: tradeoffInterventions.length > 0 ? tradeoffInterventions : undefined,
        allocationsTag,
        isPreliminaryRoadmap,
        diagnosticNotice,
        quests: chunk
      });
      moduleCount++;
    }
  }
  return modules;
}

/**
 * Records a student's runtime code error / misconception into their diagnostic profile
 * and updates the feedback loop telemetry.
 */
export function recordRuntimeMisconception(
  profile: CompleteDiagnosticProfile,
  misconceptionId: string
): CompleteDiagnosticProfile {
  const currentHooks = profile.systemMetadata.misconceptionFeedbackHooks;
  const currentMisconceptions = new Set(currentHooks.observedMisconceptions || []);
  currentMisconceptions.add(misconceptionId);

  return {
    ...profile,
    systemMetadata: {
      ...profile.systemMetadata,
      misconceptionFeedbackHooks: {
        lastUpdated: Date.now(),
        observedMisconceptions: Array.from(currentMisconceptions),
        adaptiveInterventionsCount: currentHooks.adaptiveInterventionsCount + 1
      }
    }
  };
}
