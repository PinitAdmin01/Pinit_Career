/**
 * Onboarding — 10 short, plain-language questions (owner decision 2026-09-28).
 *
 *   About you (3): what you study, what you want next, which work sounds fun (sets the career track).
 *   Daily life (6): everyday situations; every option shows one of the four traits.
 *   Tie-breaker (1): only when the two strongest traits are level after the six scenes.
 *
 * Every question is 5–7 words, every option 2–4 words, 2–4 options, no technical terms.
 *
 * How the persona is found: each daily-life answer is one piece of evidence for one trait
 * (Thinker = PH, Explorer = EX, Planner = ST, People Person = SIQ). Six different situations
 * (a broken phone, a trip, something new, an exam, a quarrel, a sudden change) keep one kind of
 * situation from deciding the result, and the tie-breaker is asked only when it changes the answer.
 * The result is scored with the same trade-off and roadmap rules as the full diagnostic
 * (diagnosticEngine.buildDiagnosticProfile), calibrated for six answers.
 */

import type { BehavioralDimension, DiagnosticContext } from './diagnosticRegistry';
import {
  buildDiagnosticProfile,
  DIMENSION_LABELS,
  type CompleteDiagnosticProfile,
  type DimensionMetric,
  type RawDiagnosticResponse,
} from './diagnosticEngine';

export type LifeStream = 'tech' | 'commerce' | 'business' | 'other';

export interface LifeOption {
  id: string;
  label: string;
  icon: string;
  /** About-you questions: the value saved (degree track, outcome or role id). */
  value?: string;
  /** Daily-life and tie-breaker questions: the trait this answer shows. */
  dimension?: BehavioralDimension;
}

export interface LifeQuestion {
  id: string;
  section: 'about' | 'life';
  text: string;
  options: LifeOption[];
  /** Daily-life scenes: the kind of situation (so the evidence covers several). */
  context?: DiagnosticContext;
}

export type LifeAnswer = RawDiagnosticResponse;

export const DIMENSIONS: BehavioralDimension[] = ['PH', 'EX', 'ST', 'SIQ'];

/** Plain names shown in onboarding (the saved profile keeps the original archetype names). */
export const PLAIN_TRAITS: Record<BehavioralDimension, { name: string; icon: string; line: string }> = {
  PH: { name: 'Thinker', icon: '🧠', line: 'You like to understand how things work.' },
  EX: { name: 'Explorer', icon: '🚀', line: 'You learn best by trying new things.' },
  ST: { name: 'Planner', icon: '📋', line: 'You like clear plans and finishing well.' },
  SIQ: { name: 'People Person', icon: '🤝', line: 'You do your best work with people.' },
};

/* ── About you ─────────────────────────────────────────────────────────── */

export const STUDY_QUESTION: LifeQuestion = {
  id: 'A1_STUDY',
  section: 'about',
  text: 'What are you studying right now?',
  options: [
    { id: 'study_tech', label: 'Computers or Engineering', icon: '💻', value: 'btech_bca_mca' },
    { id: 'study_commerce', label: 'Commerce or Accounts', icon: '📒', value: 'bcom_mcom' },
    { id: 'study_business', label: 'Business or Management', icon: '💼', value: 'bba_mba' },
    { id: 'study_other', label: 'Arts, Science, Other', icon: '🎨', value: 'other' },
  ],
};

export const NEXT_QUESTION: LifeQuestion = {
  id: 'A2_NEXT',
  section: 'about',
  text: 'What do you want most next?',
  options: [
    { id: 'next_job', label: 'A good job', icon: '🏢', value: 'full_time_job' },
    { id: 'next_internship', label: 'An internship', icon: '🎒', value: 'internship' },
    { id: 'next_studies', label: 'Higher studies', icon: '🎓', value: 'higher_studies' },
    { id: 'next_business', label: 'My own business', icon: '🚀', value: 'entrepreneurial' },
  ],
};

/** Values are role ids the track resolver already maps to a course (trackResolver OPTION_TRACK). */
const WORK_OPTIONS: Record<LifeStream, LifeOption[]> = {
  tech: [
    { id: 'work_apps', label: 'Making apps and websites', icon: '📱', value: 'full_stack_developer' },
    { id: 'work_smart', label: 'Teaching computers to think', icon: '🤖', value: 'ai_ml_engineer' },
    { id: 'work_data', label: 'Finding patterns in data', icon: '📊', value: 'data_analyst' },
    { id: 'work_safe', label: 'Keeping people safe online', icon: '🔒', value: 'cybersecurity' },
  ],
  commerce: [
    { id: 'work_accounts', label: 'Keeping accounts and taxes', icon: '🧾', value: 'accounting_finance' },
    { id: 'work_bank', label: 'Working in a bank', icon: '🏦', value: 'banking_services' },
    { id: 'work_invest', label: 'Investing and growing money', icon: '📈', value: 'investment_markets' },
    { id: 'work_sell', label: 'Selling and promoting products', icon: '🛍️', value: 'marketing_sales' },
  ],
  business: [
    { id: 'work_brand', label: 'Growing a brand online', icon: '📣', value: 'marketing_growth' },
    { id: 'work_clients', label: 'Selling to new clients', icon: '🤝', value: 'sales_bizdev' },
    { id: 'work_people', label: 'Hiring and guiding people', icon: '🧑‍🤝‍🧑', value: 'human_resources' },
    { id: 'work_smooth', label: 'Making things run smoothly', icon: '⚙️', value: 'operations_supplychain' },
  ],
  other: [
    { id: 'work_teach', label: 'Teaching and explaining things', icon: '🧑‍🏫', value: 'education' },
    { id: 'work_create', label: 'Creating designs or videos', icon: '🎬', value: 'creative' },
    { id: 'work_health', label: "Caring for people's health", icon: '🩺', value: 'healthcare' },
    { id: 'work_research', label: 'Researching how things work', icon: '🔬', value: 'research' },
  ],
};

export function streamOf(degreeTrack: string | undefined): LifeStream {
  const t = (degreeTrack || '').toLowerCase();
  if (t.includes('bcom') || t.includes('mcom') || t.includes('commerce')) return 'commerce';
  if (t.includes('bba') || t.includes('mba') || t.includes('management') || t.includes('business')) return 'business';
  if (t.includes('other') || t.includes('general') || t.includes('non-tech')) return 'other';
  return 'tech';
}

export function workQuestion(degreeTrack: string | undefined): LifeQuestion {
  return { id: 'A3_WORK', section: 'about', text: 'Which work sounds most fun?', options: WORK_OPTIONS[streamOf(degreeTrack)] };
}

/** The words the student picked for a role id (e.g. "Making apps and websites"), if it came from these questions. */
export function workLabelFor(role: string | undefined): string | undefined {
  if (!role) return undefined;
  for (const list of Object.values(WORK_OPTIONS)) {
    const hit = list.find((o) => o.value === role);
    if (hit) return hit.label;
  }
  return undefined;
}

/** A plain one-line tip for the student's main growth area (diagnosticEngine trade-off types). */
export const PLAIN_TIPS: Record<string, string> = {
  exploration_vs_execution: 'You love starting new things. We will help you finish them too.',
  analysis_vs_shipping: 'You think things through deeply. We will help you act a little sooner.',
  independent_isolation_vs_alignment: 'You like working things out alone. We will help you ask for help early.',
  rigid_execution_vs_adaptation: 'You follow plans very well. We will help you adjust when things change.',
  communication_vs_investigation: 'You are great with people. We will help you think things through first.',
};
export const BALANCED_TIP = 'You have a balanced style. Your plan will stay balanced too.';

/** How the rest of the app names each stream (useOnboardingWizard studentType). */
export const STUDENT_TYPE: Record<LifeStream, string> = {
  tech: 'Computer Science / Engineering',
  commerce: 'Commerce & Finance',
  business: 'Business & Management',
  other: 'General & Interdisciplinary',
};

/* ── Daily life ────────────────────────────────────────────────────────── */

export const LIFE_SCENES: LifeQuestion[] = [
  {
    id: 'L1_PHONE', section: 'life', context: 'debugging',
    text: 'Your phone stops working. What first?',
    options: [
      { id: 'l1_ph', label: 'Find the real cause', icon: '🔍', dimension: 'PH' },
      { id: 'l1_ex', label: 'Try quick fixes', icon: '⚡', dimension: 'EX' },
      { id: 'l1_st', label: 'Follow the help steps', icon: '📋', dimension: 'ST' },
      { id: 'l1_siq', label: 'Ask a friend', icon: '🙋', dimension: 'SIQ' },
    ],
  },
  {
    id: 'L2_TRIP', section: 'life', context: 'collaboration',
    text: 'Friends plan a trip. Your part?',
    options: [
      { id: 'l2_st', label: 'Make the plan', icon: '🗓️', dimension: 'ST' },
      { id: 'l2_ex', label: 'Find new places', icon: '🗺️', dimension: 'EX' },
      { id: 'l2_ph', label: 'Compare the options', icon: '⚖️', dimension: 'PH' },
      { id: 'l2_siq', label: 'Keep everyone happy', icon: '😊', dimension: 'SIQ' },
    ],
  },
  {
    id: 'L3_NEW_THING', section: 'life', context: 'learning',
    text: 'You buy something new. What first?',
    options: [
      { id: 'l3_ph', label: 'Learn how it works', icon: '🧩', dimension: 'PH' },
      { id: 'l3_ex', label: 'Start using it', icon: '🎮', dimension: 'EX' },
      { id: 'l3_st', label: 'Read the guide', icon: '📖', dimension: 'ST' },
      { id: 'l3_siq', label: 'Show it to friends', icon: '📸', dimension: 'SIQ' },
    ],
  },
  {
    id: 'L4_EXAM', section: 'life', context: 'delivery',
    text: 'Exam is tomorrow. How do you study?',
    options: [
      { id: 'l4_ph', label: 'Understand the basics', icon: '💡', dimension: 'PH' },
      { id: 'l4_ex', label: 'Try practice questions', icon: '✍️', dimension: 'EX' },
      { id: 'l4_st', label: 'Follow a timetable', icon: '⏰', dimension: 'ST' },
      { id: 'l4_siq', label: 'Study with friends', icon: '👥', dimension: 'SIQ' },
    ],
  },
  {
    id: 'L5_ARGUE', section: 'life', context: 'feedback',
    text: 'Two friends argue. What do you do?',
    options: [
      { id: 'l5_siq', label: 'Hear both sides', icon: '👂', dimension: 'SIQ' },
      { id: 'l5_ph', label: 'Find what went wrong', icon: '🔎', dimension: 'PH' },
      { id: 'l5_st', label: 'Suggest a fair rule', icon: '🤝', dimension: 'ST' },
      { id: 'l5_ex', label: 'Do something fun together', icon: '🎉', dimension: 'EX' },
    ],
  },
  {
    id: 'L6_PLAN_CHANGE', section: 'life', context: 'uncertainty',
    text: 'Plans change suddenly. What do you do?',
    options: [
      { id: 'l6_ex', label: 'Enjoy the surprise', icon: '🎲', dimension: 'EX' },
      { id: 'l6_st', label: 'Make a new plan', icon: '📝', dimension: 'ST' },
      { id: 'l6_ph', label: 'Think it through', icon: '🤔', dimension: 'PH' },
      { id: 'l6_siq', label: 'Check with others', icon: '💬', dimension: 'SIQ' },
    ],
  },
];

type Pair = `${BehavioralDimension}_${BehavioralDimension}`;

/** One two-option question for every pair of traits (keys in DIMENSIONS order). */
export const TIE_BREAKERS: Record<Pair, LifeQuestion> = {} as Record<Pair, LifeQuestion>;
const tie = (a: BehavioralDimension, b: BehavioralDimension, text: string, aLabel: string, aIcon: string, bLabel: string, bIcon: string) => {
  const key = `${a}_${b}` as Pair;
  TIE_BREAKERS[key] = {
    id: `T_${key}`,
    section: 'life',
    text,
    options: [
      { id: `t_${key.toLowerCase()}_${a.toLowerCase()}`, label: aLabel, icon: aIcon, dimension: a },
      { id: `t_${key.toLowerCase()}_${b.toLowerCase()}`, label: bLabel, icon: bIcon, dimension: b },
    ],
  };
};
tie('PH', 'EX', 'Free Sunday. What sounds better?', 'Learn how things work', '🧠', 'Try something new', '🚀');
tie('PH', 'ST', 'A new hobby. How do you start?', 'Understand it deeply', '📚', 'Practice every day', '📅');
tie('PH', 'SIQ', 'Stuck on a problem. What next?', 'Figure it out alone', '🧩', 'Talk it over', '🗣️');
tie('EX', 'ST', 'Your weekend. What sounds better?', 'A surprise adventure', '🎒', 'A planned day', '🗓️');
tie('EX', 'SIQ', 'Free evening. What sounds better?', 'Explore a new place', '🧭', 'Meet my friends', '🍕');
tie('ST', 'SIQ', 'Group work. What do you prefer?', 'Clear tasks, deadlines', '✅', 'Lots of teamwork', '🙌');

/* ── Scoring ───────────────────────────────────────────────────────────── */

/**
 * The answer given to a question as it is shown now (the last one if answered twice). An answer whose
 * option is not among the question's options (e.g. the work answer for a study answer since changed)
 * does not count.
 */
export function answerFor(answers: LifeAnswer[], question: LifeQuestion): LifeOption | undefined {
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].questionId === question.id) return question.options.find((o) => o.id === answers[i].optionId);
  }
  return undefined;
}

/** Votes per trait from the six daily-life scenes (not the tie-breaker). */
export function sceneVotes(answers: LifeAnswer[]): Record<BehavioralDimension, number> {
  const votes: Record<BehavioralDimension, number> = { PH: 0, EX: 0, ST: 0, SIQ: 0 };
  for (const scene of LIFE_SCENES) {
    const dim = answerFor(answers, scene)?.dimension;
    if (dim) votes[dim] += 1;
  }
  return votes;
}

/** Traits ordered by votes (ties keep DIMENSIONS order). */
const ranked = (votes: Record<BehavioralDimension, number>) => [...DIMENSIONS].sort((a, b) => votes[b] - votes[a]);

/** The tie-breaker to ask after the six scenes, or null when the strongest trait is already clear. */
export function tieBreakerFor(answers: LifeAnswer[]): LifeQuestion | null {
  if (LIFE_SCENES.some((scene) => !answerFor(answers, scene))) return null;
  const votes = sceneVotes(answers);
  const [first, second] = ranked(votes);
  if (votes[first] !== votes[second]) return null;
  const [a, b] = DIMENSIONS.filter((d) => d === first || d === second);
  return TIE_BREAKERS[`${a}_${b}` as Pair];
}

/** The questions to show, in order, given the answers so far (the work options follow the study answer). */
export function questionSequence(answers: LifeAnswer[]): LifeQuestion[] {
  const degreeTrack = answerFor(answers, STUDY_QUESTION)?.value;
  const list = [STUDY_QUESTION, NEXT_QUESTION, workQuestion(degreeTrack), ...LIFE_SCENES];
  const tb = tieBreakerFor(answers);
  return tb ? [...list, tb] : list;
}

/** The most questions anyone is asked (3 about you + 6 scenes + 1 tie-breaker). */
export const MAX_QUESTIONS = 10;

export function isComplete(answers: LifeAnswer[]): boolean {
  return questionSequence(answers).every((q) => Boolean(answerFor(answers, q)));
}

export interface LifeOnboardingResult {
  degreeTrack: string;
  studentType: string;
  outcome: string;
  role: string;
  /** Saved as onboarding diagnosticGoal (the fields the old goal questions filled, with defaults for the ones no longer asked). */
  goal: {
    degreeTrack: string;
    outcome: string;
    role: string;
    specialization: string;
    secondaryRoles: string[];
    horizonMonths: number;
    motivation: string[];
    exposureLevels: string[];
    capabilitySelfRating: string;
    dailyMinutes: number;
    primaryConstraints: string[];
  };
  profile: CompleteDiagnosticProfile;
}

/**
 * Scores a finished set of answers. Each scene answer is +2 evidence for its trait (as in the full
 * diagnostic); the tie-breaker is +1. Calibrated for six scenes: 3+ answers for a trait is "strong",
 * 2 is "moderate".
 */
export function evaluateLifeOnboarding(answers: LifeAnswer[], selectedMentor?: 'priya' | 'anish'): LifeOnboardingResult {
  const study = answerFor(answers, STUDY_QUESTION);
  const degreeTrack = study?.value || 'btech_bca_mca';
  const stream = streamOf(degreeTrack);
  const outcome = answerFor(answers, NEXT_QUESTION)?.value || 'internship';
  const role = answerFor(answers, workQuestion(degreeTrack))?.value || WORK_OPTIONS[stream][0].value || 'full_stack_developer';

  const evidence: Record<BehavioralDimension, number> = { PH: 0, EX: 0, ST: 0, SIQ: 0 };
  const observations: Record<BehavioralDimension, number> = { PH: 0, EX: 0, ST: 0, SIQ: 0 };
  const contexts: Record<BehavioralDimension, Set<string>> = { PH: new Set(), EX: new Set(), ST: new Set(), SIQ: new Set() };
  for (const scene of LIFE_SCENES) {
    const dim = answerFor(answers, scene)?.dimension;
    if (!dim) continue;
    evidence[dim] += 2;
    observations[dim] += 1;
    if (scene.context) contexts[dim].add(scene.context);
  }
  const tb = tieBreakerFor(answers);
  const tbDim = tb ? answerFor(answers, tb)?.dimension : undefined;
  if (tbDim) {
    evidence[tbDim] += 1;
    observations[tbDim] += 1;
  }

  const metrics = {} as Record<BehavioralDimension, DimensionMetric>;
  for (const dim of DIMENSIONS) {
    const e = evidence[dim];
    metrics[dim] = {
      dimension: dim,
      label: DIMENSION_LABELS[dim],
      evidence: e,
      normalizedScore: Math.min(100, Math.max(10, Math.round((e / 12) * 100))),
      band: e >= 6 ? 'strong' : e >= 4 ? 'moderate' : 'developing',
      confidence: Math.min(0.95, Math.max(0.4, Number((0.45 + observations[dim] * 0.08 + contexts[dim].size * 0.03).toFixed(2)))),
      observationsCount: observations[dim],
      contextsCount: contexts[dim].size,
      matrixAverage: 0,
    };
  }

  const goal = {
    degreeTrack,
    outcome,
    role,
    specialization: '',
    secondaryRoles: [] as string[],
    horizonMonths: 6,
    motivation: [] as string[],
    exposureLevels: [] as string[],
    capabilitySelfRating: 'guided_builder',
    dailyMinutes: 60,
    primaryConstraints: [] as string[],
  };
  const timed = answers.filter((a) => (a.responseTimeMs || 0) > 0);
  const profile = buildDiagnosticProfile(metrics, {
    goal,
    experience: { exposureLevels: [], capabilitySelfRating: goal.capabilitySelfRating },
    constraints: { dailyMinutes: goal.dailyMinutes, primaryConstraints: [] },
    selectedMentor,
    diagnosticVersion: 'v3_daily_life_10q',
    counts: { sjtCount: LIFE_SCENES.length + (tb ? 1 : 0), matrixCount: 0, tradeoffCount: 0 },
    averageLatencyMs: timed.length ? Math.round(timed.reduce((s, a) => s + (a.responseTimeMs || 0), 0) / timed.length) : 0,
  });

  return { degreeTrack, studentType: STUDENT_TYPE[stream], outcome, role, goal, profile };
}

/** The student's two strongest traits in plain words, strongest first. */
export function plainPersona(profile: CompleteDiagnosticProfile): { top: BehavioralDimension; second: BehavioralDimension } {
  const bp = profile.behaviorProfile;
  const sorted = [...DIMENSIONS].sort((a, b) => bp[b].evidence - bp[a].evidence);
  return { top: sorted[0], second: sorted[1] };
}
