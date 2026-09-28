/**
 * "Start my plan": the result of the 10 daily-life questions, saved through the real
 * POST /api/auth/onboarding route (fake database, no real account). Checks the saved row counts
 * as finished onboarding, keeps the persona and goal, and names the course track the student picked.
 *
 *   npx tsx scripts/tests/test_onboarding_save_route.ts
 */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { evaluateLifeOnboarding, LIFE_SCENES, type LifeAnswer } from '../../src/lib/onboarding/lifeQuestions';
import { resolveTrackFromGoal } from '../../src/lib/onboarding/trackResolver';
import { isOnboardingComplete, onboardingSignalsOf } from '../../src/lib/onboarding/onboardingStatus';

const ROOT = path.join(__dirname, '..', '..');
const ROUTE = path.join(ROOT, 'src/app/api/auth/onboarding/route.ts');

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<true | string>) {
  try {
    const r = await fn();
    if (r === true) { passed++; console.log('  ✓ ' + name); } else { failed++; console.log('  ✗ ' + name + ' — ' + r); }
  } catch (e) { failed++; console.log('  ✗ ' + name + ' — threw ' + ((e as Error).stack || e)); }
}

type Row = Record<string, any>;
/** users table with the calls the route makes: select/eq/maybeSingle, update/eq/select/maybeSingle, upsert/select/maybeSingle. */
function createDb(rows: Row[]) {
  const writes: Row[] = [];
  const from = (table: string) => {
    if (table !== 'users') throw new Error('unexpected table ' + table);
    const q: { eq?: [string, unknown]; patch?: Row; upsert?: Row } = {};
    const exec = () => {
      if (q.upsert) {
        writes.push(q.upsert);
        const existing = rows.find((r) => r.id === q.upsert!.id);
        if (existing) Object.assign(existing, q.upsert); else rows.push({ ...q.upsert });
        return { data: rows.find((r) => r.id === q.upsert!.id), error: null };
      }
      const row = rows.find((r) => q.eq && r[q.eq[0]] === q.eq[1]);
      if (q.patch) {
        if (!row) return { data: null, error: null };
        writes.push(q.patch);
        Object.assign(row, JSON.parse(JSON.stringify(q.patch)));
      }
      return { data: row ? JSON.parse(JSON.stringify(row)) : null, error: null };
    };
    const chain: any = {
      select() { return chain; },
      eq(c: string, v: unknown) { q.eq = [c, v]; return chain; },
      update(p: Row) { q.patch = p; return chain; },
      upsert(p: Row) { q.upsert = p; return chain; },
      maybeSingle() { return Promise.resolve(exec()); },
    };
    return chain;
  };
  return { from, writes, rows };
}

function loadRoute(db: ReturnType<typeof createDb>) {
  const src = fs.readFileSync(ROUTE, 'utf8');
  const js = ts.transpileModule(src, { fileName: ROUTE, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const json = (body: unknown, init: { status?: number } = {}) => ({ status: init.status || 200, body });
  const mocks: Record<string, unknown> = {
    'next/server': { NextResponse: { json } },
    '@/lib/server/requireAuth': {
      requireUserFromRequest: async (req: any) => (req.userId
        ? { user: { id: req.userId, email: 'student@x' }, error: null }
        : { user: null, error: json({ error: 'UNAUTHORIZED' }, { status: 401 }) }),
      getBearerToken: () => 'token',
      getAuthoritativeSupabaseClient: () => db,
    },
    '@supabase/supabase-js': { createClient: () => { throw new Error('service client not expected in this test'); } },
  };
  const mod: { exports: any } = { exports: {} };
  const req = (spec: string) => { if (spec in mocks) return mocks[spec]; throw new Error('unexpected import ' + spec); };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, req);
  return mod.exports as { POST: (req: any) => Promise<{ status: number; body: any }> };
}

const request = (userId: string | null, body: unknown) => ({ userId, json: async () => body, headers: { get: () => null } });

/** The body useOnboardingWizard.handleOnboardingComplete sends after the 10 questions. */
function wizardPayload(answers: LifeAnswer[]) {
  const result = evaluateLifeOnboarding(answers, 'priya');
  const track = resolveTrackFromGoal(result.role, result.studentType);
  const tradeoffTypes = result.profile.tradeoffs.map((t) => t.type);
  return {
    result,
    track,
    body: {
      guidanceMentorId: 'priya',
      onboardingStep: 3,
      target_role: track.targetRoleLabel,
      career_goal: track.targetRoleLabel,
      onboardingAnswers: {
        role: track.targetRoleLabel,
        career_goal: track.targetRoleLabel,
        target_goal: result.role,
        education: result.studentType,
        degreeTrack: result.degreeTrack,
        specialization: '',
        diagnosticGoal: result.goal,
        skills: `Archetype: ${result.profile.behaviorProfile.blendTitle}. Skills: ${track.skillsList}`,
        hasCompleted: true,
        diagnosticProfile: result.profile,
        behaviorProfile: result.profile.behaviorProfile,
        tradeoffs: result.profile.tradeoffs,
        roadmapStrategy: result.profile.roadmapStrategy,
        systemMetadata: result.profile.systemMetadata,
        weak_areas: Array.from(new Set([...track.weakAreas, ...tradeoffTypes])),
        mindset_archetype: result.profile.behaviorProfile.dominantArchetype,
      },
      roadmapGenerated: true,
    },
  };
}

const answer = (questionId: string, optionId: string): LifeAnswer => ({ questionId, optionId, timestamp: Date.now(), responseTimeMs: 1200 });
function answersFor(study: string, work: string, dims: string[]): LifeAnswer[] {
  const list = [answer('A1_STUDY', study), answer('A2_NEXT', 'next_job'), answer('A3_WORK', work)];
  LIFE_SCENES.forEach((scene, i) => {
    const opt = scene.options.find((o) => o.dimension === dims[i]);
    if (opt) list.push(answer(scene.id, opt.id));
  });
  return list;
}

(async () => {
  console.log('\nOnboarding: "Start my plan" saves through the real route\n');
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const U = '11111111-1111-1111-1111-111111111111';

  await test('the student is marked as finished, with the course track they picked', async () => {
    const db = createDb([{ id: U, email: 'student@x', role: 'student', onboarding_step: 1, onboarding_answers: {} }]);
    const { body, track } = wizardPayload(answersFor('study_tech', 'work_data', ['PH', 'PH', 'EX', 'PH', 'ST', 'SIQ']));
    const res = await loadRoute(db).POST(request(U, body));
    const row = db.rows[0];
    if (res.status !== 200) return 'status ' + res.status + ' ' + JSON.stringify(res.body);
    if (row.onboarding_step !== 3 || row.roadmap_generated !== true) return `step ${row.onboarding_step}, roadmap ${row.roadmap_generated}`;
    if (row.target_role !== track.targetRoleLabel || track.courseId !== 'course-business-analytics') return `role ${row.target_role}, course ${track.courseId}`;
    return isOnboardingComplete(onboardingSignalsOf(row)) ? true : 'not counted as finished';
  });

  await test('the persona and the answers are saved (not replaced by an older copy)', async () => {
    const db = createDb([{ id: U, email: 'student@x', role: 'student', onboarding_answers: { extra_roadmaps: ['kept'] } }]);
    const { body, result } = wizardPayload(answersFor('study_commerce', 'work_accounts', ['SIQ', 'SIQ', 'ST', 'SIQ', 'ST', 'PH']));
    await loadRoute(db).POST(request(U, body));
    const a = db.rows[0].onboarding_answers;
    const ok = a.hasCompleted === true && a.behaviorProfile?.dominantArchetype === result.profile.behaviorProfile.dominantArchetype
      && a.diagnosticGoal?.role === 'accounting_finance' && a.diagnosticGoal?.degreeTrack === 'bcom_mcom'
      && a.systemMetadata?.diagnosticVersion === 'v3_daily_life_10q' && a.extra_roadmaps?.[0] === 'kept';
    return ok ? true : JSON.stringify({ done: a.hasCompleted, arch: a.behaviorProfile?.dominantArchetype, goal: a.diagnosticGoal, v: a.systemMetadata?.diagnosticVersion });
  });

  await test('the main growth area from the persona is saved as a weak area', async () => {
    const db = createDb([{ id: U, email: 'student@x', role: 'student', onboarding_answers: {} }]);
    const { body, result } = wizardPayload(answersFor('study_tech', 'work_apps', ['EX', 'EX', 'EX', 'PH', 'SIQ', 'PH']));
    await loadRoute(db).POST(request(U, body));
    const types = result.profile.tradeoffs.map((t) => t.type);
    return types.includes('exploration_vs_execution') && db.rows[0].weak_areas.includes('exploration_vs_execution') ? true : JSON.stringify(db.rows[0].weak_areas);
  });

  await test('every stream saves a role that leads to a course', async () => {
    const bad: string[] = [];
    for (const [study, work] of [['study_tech', 'work_safe'], ['study_commerce', 'work_bank'], ['study_business', 'work_people'], ['study_other', 'work_teach']]) {
      const db = createDb([{ id: U, email: 'student@x', role: 'student', onboarding_answers: {} }]);
      const { body, track } = wizardPayload(answersFor(study, work, ['PH', 'EX', 'ST', 'SIQ', 'PH', 'PH']));
      const res = await loadRoute(db).POST(request(U, body));
      if (res.status !== 200 || db.rows[0].target_role !== track.targetRoleLabel || !track.courseId) bad.push(`${study}/${work}`);
    }
    return bad.length ? bad.join(', ') : true;
  });

  await test('a first-time student (no row yet) is created as a student, finished', async () => {
    const db = createDb([]);
    const { body } = wizardPayload(answersFor('study_other', 'work_create', ['EX', 'EX', 'SIQ', 'EX', 'ST', 'PH']));
    const res = await loadRoute(db).POST(request(U, body));
    const row = db.rows[0];
    return res.status === 200 && row?.role === 'student' && isOnboardingComplete(onboardingSignalsOf(row)) ? true : JSON.stringify(row);
  });

  await test('signed out: nothing is saved', async () => {
    const db = createDb([{ id: U, email: 'student@x', role: 'student', onboarding_answers: {} }]);
    const { body } = wizardPayload(answersFor('study_tech', 'work_apps', ['PH', 'PH', 'PH', 'PH', 'PH', 'PH']));
    const res = await loadRoute(db).POST(request(null, body));
    return res.status === 401 && db.writes.length === 0 ? true : `status ${res.status}, ${db.writes.length} write(s)`;
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
})();
