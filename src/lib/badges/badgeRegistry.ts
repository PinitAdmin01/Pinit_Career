/**
 * Authoritative Server-Side Badge & Prestige Milestone Registry.
 *
 * Prevents arbitrary badge and XP minting loops by establishing an immutable
 * canonical registry of all valid badges, their associated milestone keys,
 * reward amounts, and prerequisite verification criteria.
 */

export interface MilestoneDefinition {
  badgeId: string;
  milestoneKey: string;
  name: string;
  description: string;
  xpBonus: number;
  category: 'trust' | 'streak' | 'quest' | 'interview' | 'academic' | 'special';
  verify: (userProfile: any) => { eligible: boolean; reason?: string };
}

export const PRESTIGE_MILESTONE_REGISTRY: Record<string, MilestoneDefinition> = {
  trust_score_99: {
    badgeId: 'trust_sentinel_99',
    milestoneKey: 'trust_score_99',
    name: 'Trust Sentinel 99',
    description: 'Achieved an extraordinary Trust Score of 99 or higher through verified proofs and rigorous peer endorsement.',
    xpBonus: 500,
    category: 'trust',
    verify: (user) => {
      const score = Number(user?.trust_score ?? 0);
      if (score >= 99) return { eligible: true };
      return { eligible: false, reason: `Trust score of at least 99 required. Current trust score: ${score}` };
    },
  },
  trust_score_90: {
    badgeId: 'trust_sentinel_90',
    milestoneKey: 'trust_score_90',
    name: 'Trust Guardian 90',
    description: 'Maintained a high-integrity Trust Score of 90 or higher.',
    xpBonus: 500,
    category: 'trust',
    verify: (user) => {
      const score = Number(user?.trust_score ?? 0);
      if (score >= 90) return { eligible: true };
      return { eligible: false, reason: `Trust score of at least 90 required. Current trust score: ${score}` };
    },
  },
  mission_streak_7: {
    badgeId: 'streak_master_7',
    milestoneKey: 'mission_streak_7',
    name: '7-Day Streak Master',
    description: 'Maintained an unbroken 7-day daily mission streak.',
    xpBonus: 500,
    category: 'streak',
    verify: (user) => {
      const streak = Number(user?.mission_streak ?? user?.streak ?? 0);
      if (streak >= 7) return { eligible: true };
      return { eligible: false, reason: `Mission streak of at least 7 required. Current streak: ${streak}` };
    },
  },
  mission_streak_30: {
    badgeId: 'streak_champion_30',
    milestoneKey: 'mission_streak_30',
    name: '30-Day Streak Champion',
    description: 'Maintained an unbroken 30-day daily mission streak.',
    xpBonus: 500,
    category: 'streak',
    verify: (user) => {
      const streak = Number(user?.mission_streak ?? user?.streak ?? 0);
      if (streak >= 30) return { eligible: true };
      return { eligible: false, reason: `Mission streak of at least 30 required. Current streak: ${streak}` };
    },
  },
  first_quest: {
    badgeId: 'quest_pioneer_1',
    milestoneKey: 'first_quest',
    name: 'Quest Pioneer',
    description: 'Completed your very first career quest.',
    xpBonus: 500,
    category: 'quest',
    verify: (user) => {
      const quests = Array.isArray(user?.completed_quests) ? user.completed_quests : [];
      if (quests.length >= 1) return { eligible: true };
      return { eligible: false, reason: 'At least 1 completed quest required.' };
    },
  },
  quests_completed_25: {
    badgeId: 'quest_veteran_25',
    milestoneKey: 'quests_completed_25',
    name: 'Quest Veteran 25',
    description: 'Mastered and completed 25 career quests.',
    xpBonus: 500,
    category: 'quest',
    verify: (user) => {
      const quests = Array.isArray(user?.completed_quests) ? user.completed_quests : [];
      if (quests.length >= 25) return { eligible: true };
      return { eligible: false, reason: `At least 25 completed quests required. Current: ${quests.length}` };
    },
  },
  quests_completed_100: {
    badgeId: 'quest_legend_100',
    milestoneKey: 'quests_completed_100',
    name: 'Quest Legend 100',
    description: 'Completed 100 career quests across multiple tracks.',
    xpBonus: 500,
    category: 'quest',
    verify: (user) => {
      const quests = Array.isArray(user?.completed_quests) ? user.completed_quests : [];
      if (quests.length >= 100) return { eligible: true };
      return { eligible: false, reason: `At least 100 completed quests required. Current: ${quests.length}` };
    },
  },
  interviews_completed_5: {
    badgeId: 'interview_ace_5',
    milestoneKey: 'interviews_completed_5',
    name: 'Interview Ace 5',
    description: 'Successfully completed 5 AI mock technical interviews.',
    xpBonus: 500,
    category: 'interview',
    verify: (user) => {
      const count = Number(user?.interviews_done ?? 0);
      if (count >= 5) return { eligible: true };
      return { eligible: false, reason: `At least 5 completed interviews required. Current: ${count}` };
    },
  },
};

// Map badgeId to MilestoneDefinition for quick O(1) reverse lookup
export const BADGE_TO_MILESTONE_MAP: Record<string, MilestoneDefinition> = Object.values(
  PRESTIGE_MILESTONE_REGISTRY
).reduce((acc: Record<string, MilestoneDefinition>, item) => {
  acc[item.badgeId] = item;
  return acc;
}, {} as Record<string, MilestoneDefinition>);

export function getRegisteredMilestone(milestoneKey: string): MilestoneDefinition | undefined {
  if (!milestoneKey || typeof milestoneKey !== 'string') return undefined;
  return PRESTIGE_MILESTONE_REGISTRY[milestoneKey.trim()];
}

export function getRegisteredBadge(badgeId: string): MilestoneDefinition | undefined {
  if (!badgeId || typeof badgeId !== 'string') return undefined;
  return BADGE_TO_MILESTONE_MAP[badgeId.trim()];
}

export function isRegisteredBadge(badgeId: string): boolean {
  return Boolean(getRegisteredBadge(badgeId));
}

export function isRegisteredMilestone(milestoneKey: string): boolean {
  return Boolean(getRegisteredMilestone(milestoneKey));
}

export function verifyMilestoneEligibility(
  milestoneKey: string,
  userProfile: any
): { eligible: boolean; reason?: string } {
  const milestone = getRegisteredMilestone(milestoneKey);
  if (!milestone) {
    return { eligible: false, reason: `Milestone '${milestoneKey}' is not registered.` };
  }
  return milestone.verify(userProfile);
}
