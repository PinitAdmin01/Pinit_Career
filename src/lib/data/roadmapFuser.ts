import { COURSES_REGISTRY, CourseQuest } from './coursesData';
import { recommendCareerTrajectory } from './careerTrajectories';
import { mapQuestToCompetencyEvidence } from '../pathway/competencyMatrix';
import { MasteryState } from '../pathway/competencySchema';

export interface DynamicRoadmapParams {
  qt1?: number; // Technical Knowledge Score (0-100)
  qt2?: number; // Mindset/Behavioral Score (0-100)
  archetype?: string; // e.g. "Pattern Hunter", "Execution Sprinter", "Deep Thinker"
  goal?: string; // Target Career Role / Goal
  courseId: string; // Active Academic Course ID
  durationDays?: number; // 30, 60, 90, 180, 365
  dailyPace?: number; // Quests per day (e.g. 1, 2, 3, 5)
  programId?: string; // Active Career Program ID
  stageId?: string; // Active Stage ID
  competencyMasteryStates?: Record<string, MasteryState>; // Live mastery ledger state
}

export interface DynamicRoadmapModule {
  id: string;
  title: string;
  desc: string;
  difficulty: string;
  estimatedWeeks: number;
  personalizedPaceTag: string;
  knowledgeAdaptationTag: string;
  associatedCompetencyIds?: string[];
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
 * Formula: Roadmap = QT1 (Knowledge) + QT2 (Mindset) + Goal + Academic Course
 */
export function generateDynamicStudentRoadmap(params: DynamicRoadmapParams): DynamicRoadmapModule[] {
  const {
    qt1 = 75,
    qt2 = 80,
    archetype = 'Pattern Hunter',
    goal = '',
    courseId,
    durationDays = 30,
    dailyPace = 3
  } = params;

  // 1. Resolve Course & Quests Repository
  const courseObj = COURSES_REGISTRY.find(c => c.id === courseId) || COURSES_REGISTRY[0];
  const rawQuests: CourseQuest[] = courseObj.quests || [];

  // 2. Resolve Career Trajectory & Mixed Goal Fusion
  const trajectory = recommendCareerTrajectory(goal || courseObj.title, qt1, qt2, archetype);
  const targetRole = goal ? goal.trim() : trajectory.roleTitle;
  const isMixedGoal = Boolean(goal && goal.trim().length > 0);

  // 3. Knowledge Adaptation (QT1 Rules)
  // High QT1 (>=75): Fast-track early foundation quests
  // Moderate QT1 (50-74): Standard progression
  // Low QT1 (<50): Reinforcement mode with expanded hints
  const isHighKnowledge = qt1 >= 75;
  const isLowKnowledge = qt1 < 50;

  let adaptedQuests = rawQuests.map((q, idx) => {
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

    // Attach Competency Mapping
    const dayNumber = Math.floor(idx / 5) + 1;
    const compMapping = mapQuestToCompetencyEvidence(courseId, dayNumber, q.id);
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

  // 5. Dynamic Module Packaging
  // Calculate module chunk size based on duration and daily pace
  const questsPerWeek = dailyPace * 7;
  const totalWeeks = Math.ceil(durationDays / 7);
  const questsPerModule = Math.max(10, Math.ceil(adaptedQuests.length / Math.max(1, Math.min(4, Math.floor(durationDays / 7)))));

  const modules: DynamicRoadmapModule[] = [];
  let currentQuestIdx = 0;
  let moduleCount = 1;

  while (currentQuestIdx < adaptedQuests.length) {
    const chunk = adaptedQuests.slice(currentQuestIdx, currentQuestIdx + questsPerModule);
    const moduleDaysStart = (moduleCount - 1) * Math.ceil(durationDays / 4) + 1;
    const moduleDaysEnd = Math.min(durationDays, moduleCount * Math.ceil(durationDays / 4));

    modules.push({
      id: `${courseId}-dynamic-mod-${moduleCount}`,
      title: `Phase ${moduleCount}: ${targetRole} — ${courseObj.title.split('(')[0].trim()}`,
      desc: `${isMixedGoal ? '🔀 Fused Goal Trajectory: ' : ''}Personalized ${durationDays}-Day Roadmap for "${targetRole}". Paced at ${dailyPace} quests/day. Tailored for ${archetype} archetype with QT1: ${qt1}/100 & QT2: ${qt2}/100.`,
      difficulty: isHighKnowledge ? 'Advanced' : isLowKnowledge ? 'Foundational' : 'Intermediate',
      estimatedWeeks: Math.ceil((moduleDaysEnd - moduleDaysStart + 1) / 7),
      personalizedPaceTag: isMixedGoal ? `🎯 Target Goal: ${targetRole}` : mindsetTag,
      knowledgeAdaptationTag: knowledgeTag,
      quests: chunk
    });

    currentQuestIdx += questsPerModule;
    moduleCount++;
  }

  return modules;
}
