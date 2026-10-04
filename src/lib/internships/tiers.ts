import type { InternshipTier } from '../data/crashPlansData';

export type InternshipTrack = 'python_ai' | 'web_fullstack';

/**
 * Static configuration for one internship tier. Names and rules live here
 * so they can change in one place (see owner decision D3).
 */
export interface TierConfig {
  /** Display name shown to students (C2/C5). */
  name: string;
  /** Name printed on the internship certificate (C7). */
  certificateName: string;
  /** True for tiers 1–2 (simulated company); false for tiers 3–5 (real company). */
  simulated: boolean;
  /** Calendar length of the internship in days. */
  lengthDays: number;
  /** Number of AI-generated task tickets. 0 for project/industry tiers. */
  taskCount: number;
  /** [min, max] team members (solo = [1, 1]). */
  teamSize: [number, number];
  /** Track-specific course ids whose skills this tier draws on. */
  courseIds: readonly string[];
  /** Plain-English skill list drawn from the courses. */
  skills: readonly string[];
  /** Whether the tier requires a human mentor (D1). */
  needsMentor: boolean;
  /** Whether the tier requires a partner company (D2). */
  needsPartner: boolean;
}

/**
 * Per-track configuration for each internship tier.
 * Keys are 'python_ai' and 'web_fullstack', then 'InternshipTier'.
 */
export const INTERNSHIP_TIERS: Record<InternshipTrack, Record<InternshipTier, TierConfig>> = {
  python_ai: {
    t1_job_sim: {
      name: 'Python Job Simulation',
      certificateName: 'Python Job Simulation Certificate',
      simulated: true,
      lengthDays: 14,
      taskCount: 5,
      teamSize: [1, 1],
      courseIds: ['course-python-backend'],
      skills: ['Python', 'FastAPI', 'Pydantic', 'pytest', 'Git'],
      needsMentor: false,
      needsPartner: false,
    },
    t2_virtual_team: {
      name: 'Virtual Internship – Backend',
      certificateName: 'Virtual Internship – Backend Certificate',
      simulated: true,
      lengthDays: 28,
      taskCount: 8,
      teamSize: [3, 4],
      courseIds: ['course-python-backend', 'course-dsa-python', 'course-database-eng'],
      skills: ['Python', 'FastAPI', 'DSA', 'PostgreSQL', 'SQL', 'Git'],
      needsMentor: true,
      needsPartner: false,
    },
    t3_project: {
      name: 'Project Internship – AI Services',
      certificateName: 'Project Internship – AI Services Certificate',
      simulated: false,
      lengthDays: 56,
      taskCount: 0,
      teamSize: [1, 1],
      courseIds: [
        'course-python-backend', 'course-dsa-python', 'course-database-eng',
        'course-ai-python', 'course-distributed-python', 'course-cloud-python',
      ],
      skills: ['Python', 'FastAPI', 'DSA', 'PostgreSQL', 'Machine Learning', 'Distributed Systems', 'Cloud (AWS)'],
      needsMentor: true,
      needsPartner: true,
    },
    t4_industry: {
      name: 'Verified Industry Internship',
      certificateName: 'Verified Industry Internship Certificate',
      simulated: false,
      lengthDays: 84,
      taskCount: 0,
      teamSize: [1, 1],
      courseIds: [
        'course-python-backend', 'course-dsa-python', 'course-database-eng',
        'course-ai-python', 'course-distributed-python', 'course-cloud-python',
        'course-nlp-python', 'course-quant-python', 'course-ai-prompt-python',
      ],
      skills: [
        'Python', 'FastAPI', 'DSA', 'PostgreSQL', 'Machine Learning',
        'Distributed Systems', 'Cloud (AWS)', 'NLP', 'Quantitative Analytics', 'AI Agents',
      ],
      needsMentor: false,
      needsPartner: true,
    },
    t5_fellowship: {
      name: 'Verified Fellowship + Placement',
      certificateName: 'Verified Fellowship + Placement Certificate',
      simulated: false,
      lengthDays: 180,
      taskCount: 0,
      teamSize: [1, 1],
      courseIds: [
        'course-python-backend', 'course-dsa-python', 'course-database-eng',
        'course-ai-python', 'course-distributed-python', 'course-cloud-python',
        'course-nlp-python', 'course-quant-python', 'course-ai-prompt-python',
        'course-train-python', 'course-vector-python', 'course-safety-python',
      ],
      skills: [
        'Python', 'FastAPI', 'DSA', 'PostgreSQL', 'Machine Learning',
        'Distributed Systems', 'Cloud (AWS)', 'NLP', 'Quantitative Analytics',
        'AI Agents', 'Distributed Training', 'Vector Search', 'AI Safety',
      ],
      needsMentor: false,
      needsPartner: true,
    },
  },
  web_fullstack: {
    t1_job_sim: {
      name: 'Web Developer Job Simulation',
      certificateName: 'Web Developer Job Simulation Certificate',
      simulated: true,
      lengthDays: 14,
      taskCount: 5,
      teamSize: [1, 1],
      courseIds: ['course-react-web'],
      skills: ['React', 'TypeScript', 'JSX', 'Vitest', 'Git'],
      needsMentor: false,
      needsPartner: false,
    },
    t2_virtual_team: {
      name: 'Virtual Internship – Full-Stack',
      certificateName: 'Virtual Internship – Full-Stack Certificate',
      simulated: true,
      lengthDays: 28,
      taskCount: 8,
      teamSize: [3, 4],
      courseIds: ['course-react-web', 'course-node-web', 'course-database-eng'],
      skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'SQL', 'Git'],
      needsMentor: true,
      needsPartner: false,
    },
    t3_project: {
      name: 'Project Internship – Web Products',
      certificateName: 'Project Internship – Web Products Certificate',
      simulated: false,
      lengthDays: 56,
      taskCount: 0,
      teamSize: [1, 1],
      courseIds: [
        'course-react-web', 'course-node-web', 'course-database-eng',
        'course-devops-cicd', 'course-cloud-native', 'course-design-systems',
      ],
      skills: ['React', 'Node.js', 'PostgreSQL', 'DevOps', 'Cloud', 'Design Systems'],
      needsMentor: true,
      needsPartner: true,
    },
    t4_industry: {
      name: 'Verified Industry Internship',
      certificateName: 'Verified Industry Internship Certificate',
      simulated: false,
      lengthDays: 84,
      taskCount: 0,
      teamSize: [1, 1],
      courseIds: [
        'course-react-web', 'course-node-web', 'course-database-eng',
        'course-dsa-optim', 'course-devops-cicd', 'course-cloud-native',
        'course-distributed-sys', 'course-cybersecurity', 'course-ai-eng',
      ],
      skills: [
        'React', 'Node.js', 'PostgreSQL', 'DSA', 'DevOps',
        'Cloud', 'Distributed Systems', 'Security', 'AI Integration',
      ],
      needsMentor: false,
      needsPartner: true,
    },
    t5_fellowship: {
      name: 'Verified Fellowship + Placement',
      certificateName: 'Verified Fellowship + Placement Certificate',
      simulated: false,
      lengthDays: 180,
      taskCount: 0,
      teamSize: [1, 1],
      courseIds: [
        'course-react-web', 'course-node-web', 'course-database-eng',
        'course-dsa-optim', 'course-devops-cicd', 'course-cloud-native',
        'course-distributed-sys', 'course-cybersecurity', 'course-ai-eng',
        'course-sre-web', 'course-stream-web', 'course-aideploy-web',
      ],
      skills: [
        'React', 'Node.js', 'PostgreSQL', 'DSA', 'DevOps', 'Cloud',
        'Distributed Systems', 'Security', 'AI Integration', 'SRE', 'Streaming', 'AI Deployment',
      ],
      needsMentor: false,
      needsPartner: true,
    },
  },
};

/**
 * Helper to get tier configuration safely with fallback.
 */
export function getTierConfig(tier: InternshipTier, track: string = 'python_ai'): TierConfig {
  const tKey = (track === 'web_fullstack' ? 'web_fullstack' : 'python_ai') as InternshipTrack;
  return INTERNSHIP_TIERS[tKey][tier];
}

/**
 * Owner Decision D1: Default is no human mentors.
 * AI review + admin spot-check alone can approve Tier 2 sprints until mentors exist.
 */
export const MENTOR_REVIEW_REQUIRED = false;
