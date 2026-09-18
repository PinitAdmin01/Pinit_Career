export interface MatchStudentProfile {
  id: string;
  name: string;
  headline?: string;
  avatar?: string;
  college: string;
  course: string;
  skills: string[];
  careerGoal?: string;
  online?: boolean;
  careerScore?: number;
  xp?: number;
  arenaWins?: number;
  projectsCount?: number;
}

export interface MatchBreakdown {
  overallMatch: number; // 60 - 98%
  skillScore: number;   // 0 - 100%
  collegeScore: number; // 0 - 100%
  courseScore: number;  // 0 - 100%
  goalScore: number;    // 0 - 100%
  commonSkills: string[];
  complementarySkills: string[];
  reasonTag: string;
  icebreakers: string[];
}

export interface RankedStudentMatch {
  student: MatchStudentProfile;
  match: MatchBreakdown;
}

// Current logged in student baseline for peer comparison
export const CURRENT_STUDENT_PROFILE: MatchStudentProfile = {
  id: 'current_user',
  name: 'Vinay N',
  headline: 'Full Stack & Distributed Systems Enthusiast',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  college: 'Bangalore University',
  course: 'BCA',
  careerGoal: 'Full Stack Cloud Architect',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Next.js', 'UI/UX'],
  online: true,
  careerScore: 94,
  xp: 3450,
  arenaWins: 22,
  projectsCount: 5
};

const COMPLEMENTARY_PAIRS: Array<[string[], string[]]> = [
  // Frontend <-> Backend / ML
  [['react', 'vue', 'frontend', 'ui/ux', 'design', 'figma'], ['python', 'ai/ml', 'node.js', 'fastapi', 'postgresql', 'mongodb']],
  // Fullstack <-> Cloud / DevOps
  [['fullstack', 'react', 'next.js', 'node.js'], ['cybersecurity', 'linux', 'cloud', 'docker', 'devops']],
  // Data Science <-> Algorithms / DSA
  [['data science', 'machine learning', 'opencv'], ['dsa', 'java', 'c++', 'problem solving']]
];

export function computeStudentMatch(
  current: MatchStudentProfile,
  target: MatchStudentProfile
): MatchBreakdown {
  const currentSkillsLower = (current.skills || []).map(s => s.toLowerCase());
  const targetSkillsLower = (target.skills || []).map(s => s.toLowerCase());

  // 1. Common Skills
  const commonSkills = (target.skills || []).filter(ts =>
    currentSkillsLower.includes(ts.toLowerCase())
  );

  // 2. Complementary Skills
  const complementarySkills: string[] = [];
  COMPLEMENTARY_PAIRS.forEach(([groupA, groupB]) => {
    const hasA = currentSkillsLower.some(s => groupA.some(ga => s.includes(ga)));
    const targetHasB = targetSkillsLower.filter(s => groupB.some(gb => s.includes(gb)));
    if (hasA && targetHasB.length > 0) {
      targetHasB.forEach(b => {
        const orig = (target.skills || []).find(s => s.toLowerCase() === b);
        if (orig && !complementarySkills.includes(orig) && !commonSkills.includes(orig)) {
          complementarySkills.push(orig);
        }
      });
    }
  });

  // 3. College Match Score
  let collegeScore = 50;
  if (current.college.toLowerCase() === target.college.toLowerCase()) {
    collegeScore = 100;
  } else if (
    current.college.toLowerCase().includes('bangalore') ||
    target.college.toLowerCase().includes('bangalore') ||
    target.college.toLowerCase().includes('rvce') ||
    target.college.toLowerCase().includes('christ')
  ) {
    collegeScore = 80; // Nearby regional campus
  }

  // 4. Course Match Score
  let courseScore = 50;
  if (current.course.toLowerCase() === target.course.toLowerCase()) {
    courseScore = 95;
  } else if (
    (current.course.includes('BCA') && target.course.includes('B.Tech')) ||
    (current.course.includes('B.Tech') && target.course.includes('BCA'))
  ) {
    courseScore = 75; // Tech degrees
  }

  // 5. Skill Compatibility Score
  const overlapRatio = current.skills.length > 0 ? commonSkills.length / Math.min(current.skills.length, 4) : 0;
  const compBonus = Math.min(complementarySkills.length * 15, 30);
  const skillScore = Math.min(Math.round(overlapRatio * 70 + compBonus), 100);

  // 6. Career Goal Synergy
  let goalScore = 60;
  if (current.careerGoal && target.careerGoal) {
    const currGoalTokens = current.careerGoal.toLowerCase().split(/\s+/);
    const targetGoalTokens = target.careerGoal.toLowerCase().split(/\s+/);
    const commonTokens = currGoalTokens.filter(t => targetGoalTokens.includes(t) && t.length > 3);
    if (commonTokens.length > 0) goalScore = 90;
    else if (target.careerGoal.toLowerCase().includes('developer') || target.careerGoal.toLowerCase().includes('engineer')) goalScore = 75;
  }

  // 7. Weighted Total Score (65 - 96%)
  const weighted = Math.round(
    skillScore * 0.35 +
    collegeScore * 0.25 +
    courseScore * 0.20 +
    goalScore * 0.20
  );
  const overallMatch = Math.max(68, Math.min(96, weighted));

  // 8. Generate Dynamic Reason Tag
  let reasonTag = '⚡ Common Engineering Interests';
  if (collegeScore === 100 && commonSkills.length > 0) {
    reasonTag = `🏫 Same College • ${commonSkills.length} shared skill${commonSkills.length > 1 ? 's' : ''}`;
  } else if (courseScore >= 90 && commonSkills.length > 0) {
    reasonTag = `🏫 Same Course • ${commonSkills.length} common skills`;
  } else if (complementarySkills.length > 0) {
    reasonTag = `🤝 Complementary Skills: ${complementarySkills[0]} & ${current.skills[0]}`;
  } else if (goalScore >= 85) {
    reasonTag = `🎯 Shared Goal: ${target.careerGoal || 'Software Leadership'}`;
  } else if (collegeScore >= 80) {
    reasonTag = `📍 Nearby Campus: ${target.college}`;
  }

  // 9. Conversational Icebreakers
  const icebreakers: string[] = [
    `Hey ${target.name.split(' ')[0]}, I noticed you're exploring ${target.skills[0] || 'tech'}. Want to collaborate?`,
    `Would you be up for a 1v1 Arena challenge on ${commonSkills[0] || target.skills[0] || 'algorithms'}?`
  ];
  if (commonSkills.length > 0) {
    icebreakers.push(`Saw your experience in ${commonSkills.join(' & ')}! Are you building any squad projects right now?`);
  }

  return {
    overallMatch,
    skillScore,
    collegeScore,
    courseScore,
    goalScore,
    commonSkills,
    complementarySkills,
    reasonTag,
    icebreakers
  };
}

export function rankAndFilterStudents(
  current: MatchStudentProfile,
  candidates: MatchStudentProfile[],
  filter: 'all' | 'college' | 'skills' | 'course' | 'nearby' | 'goals' = 'all'
): RankedStudentMatch[] {
  const scored = candidates.map(student => ({
    student,
    match: computeStudentMatch(current, student)
  }));

  // Apply Filter
  const filtered = scored.filter(item => {
    switch (filter) {
      case 'college':
        return item.match.collegeScore >= 85;
      case 'skills':
        return item.match.commonSkills.length > 0 || item.match.complementarySkills.length > 0;
      case 'course':
        return item.match.courseScore >= 85;
      case 'nearby':
        return item.match.collegeScore >= 75;
      case 'goals':
        return item.match.goalScore >= 75;
      case 'all':
      default:
        return true;
    }
  });

  // Sort descending by overall match %
  return filtered.sort((a, b) => b.match.overallMatch - a.match.overallMatch);
}