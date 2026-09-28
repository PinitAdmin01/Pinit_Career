/**
 * Onboarding — 10 plain daily-life questions (owner rules, 2026-09-28):
 * questions 5–7 words, options 2–4 words, 2–4 options, no technical terms, at most 10 questions,
 * persona from daily-life answers, career track from the "which work sounds fun" answer.
 *
 *   npx tsx scripts/tests/test_onboarding_life_questions.ts
 */
import {
  STUDY_QUESTION, NEXT_QUESTION, LIFE_SCENES, TIE_BREAKERS, DIMENSIONS, MAX_QUESTIONS,
  workQuestion, questionSequence, tieBreakerFor, isComplete, evaluateLifeOnboarding, plainPersona,
  type LifeAnswer, type LifeQuestion,
} from '../../src/lib/onboarding/lifeQuestions';
import { matchTrackFromGoal } from '../../src/lib/onboarding/trackResolver';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => true | string) {
  try {
    const r = fn();
    if (r === true) { passed++; console.log('  ✓ ' + name); } else { failed++; console.log('  ✗ ' + name + ' — ' + r); }
  } catch (e) { failed++; console.log('  ✗ ' + name + ' — threw ' + ((e as Error).stack || e)); }
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const ALL_WORK = ['btech_bca_mca', 'bcom_mcom', 'bba_mba', 'other'].map(workQuestion);
const ALL: LifeQuestion[] = [STUDY_QUESTION, NEXT_QUESTION, ...ALL_WORK, ...LIFE_SCENES, ...Object.values(TIE_BREAKERS)];
const TECH_WORDS = [
  'code', 'coding', 'coder', 'debug', 'bug', 'software', 'api', 'database', 'framework', 'algorithm', 'deploy',
  'stack', 'frontend', 'backend', 'prototype', 'stakeholder', 'stakeholders', 'metrics', 'sql', 'python', 'java',
  'react', 'devops', 'ui', 'ux', 'ai', 'ml', 'kpi', 'roi', 'mvp', 'agile', 'sprint', 'architecture', 'deliverable',
  'deliverables', 'benchmark', 'diagnostic', 'trajectory', 'calibrate', 'paradigm', 'optimize', 'workflow',
];

const answer = (questionId: string, optionId: string, responseTimeMs = 1500): LifeAnswer => ({ questionId, optionId, timestamp: Date.now(), responseTimeMs });
/** Answers the 3 about-you questions, then one scene answer per entry of dims (in scene order). */
function answersFor(study: string, work: string, dims: string[]): LifeAnswer[] {
  const list = [answer('A1_STUDY', study), answer('A2_NEXT', 'next_internship'), answer('A3_WORK', work)];
  LIFE_SCENES.forEach((scene, i) => {
    const opt = scene.options.find((o) => o.dimension === dims[i]);
    if (opt) list.push(answer(scene.id, opt.id));
  });
  return list;
}

console.log('\nOnboarding: 10 plain daily-life questions\n');

test('every question is 5–7 words', () => {
  const bad = ALL.filter((q) => words(q.text) < 5 || words(q.text) > 7).map((q) => `${q.id}: "${q.text}" (${words(q.text)})`);
  return bad.length ? bad.join('; ') : true;
});

test('every question has 2–4 options of 2–4 words', () => {
  const bad: string[] = [];
  for (const q of ALL) {
    if (q.options.length < 2 || q.options.length > 4) bad.push(`${q.id} has ${q.options.length} options`);
    for (const o of q.options) if (words(o.label) < 2 || words(o.label) > 4) bad.push(`${q.id}: "${o.label}" (${words(o.label)})`);
  }
  return bad.length ? bad.join('; ') : true;
});

test('no technical terms in any question or option', () => {
  const bad: string[] = [];
  for (const q of ALL) {
    for (const text of [q.text, ...q.options.map((o) => o.label)]) {
      const tokens = text.toLowerCase().split(/[^a-z']+/).filter(Boolean);
      const hit = tokens.find((t) => TECH_WORDS.includes(t));
      if (hit) bad.push(`"${text}" (${hit})`);
    }
  }
  return bad.length ? bad.join('; ') : true;
});

test('at most 10 questions; 9 when the strongest trait is clear', () => {
  const clear = answersFor('study_tech', 'work_apps', ['PH', 'PH', 'PH', 'EX', 'ST', 'SIQ']);
  const tied = answersFor('study_tech', 'work_apps', ['PH', 'PH', 'EX', 'EX', 'ST', 'SIQ']);
  const nClear = questionSequence(clear).length;
  const nTied = questionSequence(tied).length;
  return nClear === 9 && nTied === 10 && MAX_QUESTIONS === 10 ? true : `clear ${nClear}, tied ${nTied}`;
});

test('each daily-life scene offers all four traits once', () => {
  const bad = LIFE_SCENES.filter((s) => DIMENSIONS.some((d) => s.options.filter((o) => o.dimension === d).length !== 1)).map((s) => s.id);
  const contexts = new Set(LIFE_SCENES.map((s) => s.context));
  return bad.length ? bad.join(', ') : contexts.size === LIFE_SCENES.length ? true : 'two scenes share a kind of situation';
});

test('a tie-breaker exists for every pair of traits and offers exactly that pair', () => {
  const bad: string[] = [];
  for (let i = 0; i < DIMENSIONS.length; i++) for (let j = i + 1; j < DIMENSIONS.length; j++) {
    const q = (TIE_BREAKERS as Record<string, LifeQuestion>)[`${DIMENSIONS[i]}_${DIMENSIONS[j]}`];
    if (!q || q.options.length !== 2 || q.options[0].dimension !== DIMENSIONS[i] || q.options[1].dimension !== DIMENSIONS[j]) bad.push(`${DIMENSIONS[i]}_${DIMENSIONS[j]}`);
  }
  return bad.length ? bad.join(', ') : true;
});

test('the tie-breaker asks about the two traits that are level', () => {
  const tb = tieBreakerFor(answersFor('study_tech', 'work_apps', ['EX', 'SIQ', 'EX', 'SIQ', 'PH', 'ST']));
  return tb?.id === 'T_EX_SIQ' ? true : String(tb?.id);
});

test('the tie-breaker decides the strongest trait', () => {
  const base = answersFor('study_tech', 'work_apps', ['EX', 'SIQ', 'EX', 'SIQ', 'PH', 'ST']);
  const pickSiq = evaluateLifeOnboarding([...base, answer('T_EX_SIQ', 't_ex_siq_siq')]);
  const pickEx = evaluateLifeOnboarding([...base, answer('T_EX_SIQ', 't_ex_siq_ex')]);
  const a = plainPersona(pickSiq.profile).top; const b = plainPersona(pickEx.profile).top;
  return a === 'SIQ' && b === 'EX' && pickSiq.profile.behaviorProfile.dominantArchetype === 'Social IQ' ? true : `${a} / ${b}`;
});

test('a clear persona: mostly "understand it" answers make a strong Thinker', () => {
  const r = evaluateLifeOnboarding(answersFor('study_tech', 'work_apps', ['PH', 'PH', 'PH', 'PH', 'ST', 'EX']));
  const bp = r.profile.behaviorProfile;
  return bp.dominantArchetype === 'Pattern Hunter' && bp.PH.band === 'strong' && bp.ST.band === 'developing' && bp.SIQ.normalizedScore === 10
    ? true : JSON.stringify({ dom: bp.dominantArchetype, ph: bp.PH.band, st: bp.ST.band });
});

test('the persona drives the roadmap strategy (explorer who rarely plans → finish-first plan)', () => {
  const r = evaluateLifeOnboarding(answersFor('study_tech', 'work_apps', ['EX', 'EX', 'EX', 'PH', 'SIQ', 'PH']));
  const t = r.profile.tradeoffs.map((x) => x.type);
  return t.includes('exploration_vs_execution') && r.profile.roadmapStrategy.primaryIntervention === 'execution_consistency' ? true : JSON.stringify(t);
});

test('every "fun work" option leads to a real course track', () => {
  const bad: string[] = [];
  for (const q of ALL_WORK) for (const o of q.options) if (!matchTrackFromGoal(o.value)) bad.push(`${o.label} → ${o.value}`);
  return bad.length ? bad.join('; ') : true;
});

test('the study answer picks the work options; commerce students see commerce work', () => {
  const seq = questionSequence([answer('A1_STUDY', 'study_commerce')]);
  const work = seq.find((q) => q.id === 'A3_WORK');
  return work?.options.some((o) => o.id === 'work_accounts') && !work.options.some((o) => o.id === 'work_apps') ? true : JSON.stringify(work?.options.map((o) => o.id));
});

test('changing the study answer clears the old work answer', () => {
  const list = answersFor('study_tech', 'work_apps', ['PH', 'PH', 'PH', 'EX', 'ST', 'SIQ']);
  const changed = [...list, answer('A1_STUDY', 'study_commerce')];
  return isComplete(list) && !isComplete(changed) && isComplete([...changed, answer('A3_WORK', 'work_bank')]) ? true : 'completion did not follow the study change';
});

test('the result carries what the rest of the app reads', () => {
  const r = evaluateLifeOnboarding(answersFor('study_business', 'work_people', ['SIQ', 'SIQ', 'ST', 'SIQ', 'ST', 'PH']), 'anish');
  const p = r.profile;
  const ok = r.degreeTrack === 'bba_mba' && r.studentType === 'Business & Management' && r.role === 'human_resources'
    && r.outcome === 'internship' && p.goal.role === 'human_resources' && p.systemMetadata.diagnosticVersion === 'v3_daily_life_10q'
    && p.systemMetadata.routerConfig.selectedMentor === 'anish' && matchTrackFromGoal(r.role)?.courseId
    && typeof p.roadmapStrategy.allocations.executionPct === 'number';
  return ok ? true : JSON.stringify({ track: r.degreeTrack, type: r.studentType, role: r.role, v: p.systemMetadata.diagnosticVersion });
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
