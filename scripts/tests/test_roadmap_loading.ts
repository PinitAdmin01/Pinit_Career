/**
 * Roadmap loading, storage and generate inputs (audit 2.5, 4b.7, 4b.8; T17):
 * - the quests page loads the student's own roadmap (profile, then this course's copy; the shared
 *   copy only if it is this course's) and never saves a stand-in roadmap as the student's;
 * - extra roadmaps follow the student to other devices (kept on the profile);
 * - the roadmap modal and the generate API pick courses the same way onboarding does.
 *
 *   npx tsx scripts/tests/test_roadmap_loading.ts
 */
import fs from 'fs';
import path from 'path';
import { trackKeyForGoal } from '../../src/app/quests/components/useQuestProgression';
import { POST as generate } from '../../src/app/api/career-builder/generate/route';

const ROOT = path.resolve(__dirname, '../..');
const hook = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/useQuestProgression.ts'), 'utf8').replace(/\r\n/g, '\n');
const modal = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/QuestDetailModal.tsx'), 'utf8');

let pass = 0;
let fail = 0;
async function test(name: string, fn: () => Promise<true | string> | true | string) {
  let why: true | string;
  try { why = await fn(); } catch (e) { why = `threw: ${e instanceof Error ? e.message : e}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name} — ${why}`); }
}

const loader = hook.slice(hook.indexOf('const loadModules = useCallback'), hook.indexOf('}, [userId, activeCourseId, activeSubTab'));

(async () => {
  console.log('Roadmap loading and inputs\n');

  await test('this course\'s saved roadmap is read before the shared copy; the shared copy must be this course\'s', () => {
    const courseRead = loader.indexOf('roadmap_modules_${activeCourseId}');
    const generalRead = loader.indexOf('readSaved(`pinit_${effectiveUserId}_roadmap_modules`)');
    if (courseRead < 0 || generalRead < 0) return 'saved-roadmap reads not found';
    if (courseRead > generalRead) return 'shared copy still read first';
    return /belongsToCourse\(generalSaved, activeCourseId\)/.test(loader) ? true : 'shared copy used for any course';
  });

  await test('no saved roadmap: a preview from the student\'s own track, not saved or marked as generated', () => {
    const fallback = loader.slice(loader.indexOf('// 3. No roadmap saved anywhere'));
    if (!fallback) return 'fallback not found';
    if (/setRoadmapGenerated\(true\)/.test(fallback)) return 'the stand-in roadmap is still marked as generated (saved to the profile)';
    if (/localStorage\.setItem/.test(fallback)) return 'the stand-in roadmap is still saved as the student\'s roadmap';
    if (/'course-java-logic'/.test(fallback)) return 'still falls back to a fixed Java roadmap';
    return /resolveTrackFromGoal\(/.test(fallback) ? true : 'fallback does not use the student\'s track';
  });

  await test('extra roadmaps are kept on the profile (created, closed, and read back on another device)', () => {
    const create = hook.slice(hook.indexOf('const handleCreateCustomRoadmap'), hook.indexOf('const currentRole ='));
    const close = hook.slice(hook.indexOf('const closeExtraRoadmap'), hook.indexOf('const closeExtraRoadmap') + 600);
    if (!/saveExtrasToProfile\(nextExtras\)/.test(create)) return 'a new roadmap is saved only in this browser';
    if (!/saveExtrasToProfile\(next\)/.test(close)) return 'closing a roadmap is not saved to the profile';
    if (!/setOnboarding\(\{ \.\.\.onboardingAnswers, extra_roadmaps: list \}, false\)/.test(hook)) return 'profile write missing';
    return /Array\.isArray\(profileExtras\)[\s\S]{0,200}setExtraRoadmaps/.test(hook) ? true : 'profile list not read back';
  });

  await test('the modal no longer suggests a fixed goal; an empty goal uses the student\'s own role', () => {
    if (/useState<string>\('Full-Stack AI Engineer launching an E-Commerce Business'\)/.test(hook)) return 'hard-coded default goal still set';
    return /customGoal\.trim\(\) \|\| ownRole \|\| config\.role/.test(hook) ? true : 'empty goal does not use the student\'s role';
  });

  await test('typing a goal in the modal picks the track by whole words (like onboarding)', () => {
    if (/lower\.includes\('ai'\)/.test(modal)) return 'modal still matches substrings';
    const cases: Array<[string, string | null]> = [
      ['email marketing specialist', 'marketing'], ['retail maintenance', null], ['syntax and grammar', null],
      ['Python ML engineer', 'ai'], ['react developer', 'fullstack'], ['DSA', 'dsa'], ['tax consultant', 'accounting'],
      ['AWS devops', 'devops'], ['digital marketing', 'digital_marketing'], ['supply chain', 'operations'],
    ];
    const bad = cases.find(([goal, want]) => trackKeyForGoal(goal) !== want);
    return bad ? `"${bad[0]}" → ${trackKeyForGoal(bad[0])} (want ${bad[1]})` : true;
  });

  await test('generate API: an unknown course follows the target role; the stated level sets the starting score', async () => {
    const call = async (body: Record<string, unknown>) => {
      const res = await generate(new Request('http://localhost/api/career-builder/generate', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
      }) as never);
      return res.json() as Promise<{ courseId: string; modules: Array<{ knowledgeAdaptationTag: string }> }>;
    };
    const role = await call({ targetRole: 'Digital Marketing & Growth Strategist', courseId: 'no-such-course' });
    if (role.courseId !== 'course-digital-marketing') return `unknown course → ${role.courseId}`;
    const advanced = await call({ targetRole: 'Java Backend SDE', courseId: 'course-java-logic', experienceLevel: 'advanced' });
    const beginner = await call({ targetRole: 'Java Backend SDE', courseId: 'course-java-logic', experienceLevel: 'beginner' });
    if (!/QT1: 80\/100/.test(advanced.modules[0].knowledgeAdaptationTag)) return `advanced → ${advanced.modules[0].knowledgeAdaptationTag}`;
    return /QT1: 40\/100/.test(beginner.modules[0].knowledgeAdaptationTag) ? true : `beginner → ${beginner.modules[0].knowledgeAdaptationTag}`;
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
