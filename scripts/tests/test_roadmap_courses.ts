/**
 * Custom roadmap = the student's main course + the next courses of their career path, one complete
 * course per 30 days of the chosen duration (audit 2.2, T13; owner decision "duration decides",
 * first roadmap after onboarding stays 30 days). Runs on the real course data:
 *
 *   npx tsx scripts/tests/test_roadmap_courses.ts
 */
import fs from 'fs';
import path from 'path';
import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { generateDynamicStudentRoadmap } from '../../src/lib/data/roadmapFuser';
import { mapQuestToCompetencyEvidence } from '../../src/lib/pathway/competencyMatrix';
import { parseQuestId } from '../../src/lib/data/curriculumEnricher';
import { getAllRoadmapCourseIds, getRoadmapCourseIds } from '../../src/lib/roadmap/roadmapCourses';

const ROOT = path.resolve(__dirname, '../..');
const short = (ids: string[]) => ids.map((id) => id.replace('course-', '')).join(',');
const questsOf = (courseId: string) => new Set((COURSES_REGISTRY.find((c) => c.id === courseId)?.quests || []).map((q) => q.id));

let pass = 0;
let fail = 0;
function test(name: string, fn: () => true | string) {
  let why: true | string;
  try { why = fn(); } catch (e) { why = `threw: ${e instanceof Error ? e.message : e}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name} — ${why}`); }
}
const expect = (cases: Array<[string, number, string]>) => {
  const bad = cases.find(([main, days, want]) => short(getRoadmapCourseIds(main, days)) !== want);
  return bad ? `${bad[0]} ${bad[1]}d → ${short(getRoadmapCourseIds(bad[0], bad[1]))} (want ${bad[2]})` : true;
};

console.log('Roadmap courses\n');

test('30 days = the main course only; each extra 30 days adds the next course of the path', () => expect([
  ['course-java-logic', 30, 'java-logic'],
  ['course-java-logic', 60, 'java-logic,dsa-optim'],
  ['course-java-logic', 90, 'java-logic,dsa-optim,database-eng'],
  ['course-java-logic', 120, 'java-logic,dsa-optim,database-eng,distributed-sys'],
  ['course-java-logic', 180, 'java-logic,dsa-optim,database-eng,distributed-sys,git-version-control,computer-fundamentals'],
]));

test('prerequisites are studied first even when the main course comes later in the path', () => expect([
  ['course-ai-eng', 30, 'ai-eng'],
  ['course-ai-eng', 60, 'python-backend,ai-eng'],
  ['course-ai-eng', 90, 'python-backend,dsa-optim,ai-eng'],
  ['course-cloud-native', 60, 'cloud-native,devops-cicd'],
]));

test('tracks without a longer path add their stream\'s foundation courses', () => expect([
  ['course-finance-investment', 30, 'finance-investment'],
  ['course-finance-investment', 60, 'finance-investment,excel-data-viz'],
  ['course-marketing-branding', 120, 'marketing-branding,excel-data-viz,softskills-communication,ai-prompt-literacy'],
  ['course-design-systems', 60, 'design-systems,git-version-control'],
  ['course-finance-investment', 365, 'finance-investment,excel-data-viz,softskills-communication,ai-prompt-literacy'],
]));

test('every roadmap course exists in the course library', () => {
  const missing = COURSES_REGISTRY.flatMap((c) => getAllRoadmapCourseIds(c.id)).filter((id) => !COURSES_REGISTRY.some((c) => c.id === id));
  return missing.length === 0 ? true : `unknown courses: ${Array.from(new Set(missing)).join(', ')}`;
});

test('a 30-day roadmap is exactly the main course (same as before)', () => {
  const modules = generateDynamicStudentRoadmap({ courseId: 'course-java-logic', durationDays: 30, dailyPace: 2, qt1: 60, qt2: 60 });
  const ids = modules.flatMap((m) => m.quests.map((q) => q.id));
  const java = questsOf('course-java-logic');
  if (ids.length !== java.size || ids.some((id) => !java.has(id))) return `${ids.length} quests, ${ids.filter((id) => !java.has(id)).length} from other courses`;
  return modules.every((m) => m.courseId === 'course-java-logic') && modules.length === 4 ? true : `${modules.length} modules`;
});

test('a 60-day roadmap contains both courses completely, in order, with phases per course', () => {
  const modules = generateDynamicStudentRoadmap({ courseId: 'course-java-logic', durationDays: 60, dailyPace: 3, qt1: 60, qt2: 60 });
  const java = questsOf('course-java-logic');
  const dsa = questsOf('course-dsa-optim');
  const ids = modules.flatMap((m) => m.quests.map((q) => q.id));
  if (ids.length !== java.size + dsa.size || new Set(ids).size !== ids.length) return `${ids.length} quests (${new Set(ids).size} unique)`;
  const firstDsa = ids.findIndex((id) => dsa.has(id));
  if (ids.slice(0, firstDsa).some((id) => !java.has(id)) || ids.slice(firstDsa).some((id) => !dsa.has(id))) return 'courses interleaved';
  const wrongModule = modules.find((m) => m.quests.some((q) => !questsOf(m.courseId || '').has(q.id)));
  if (wrongModule) return `module ${wrongModule.id} holds quests of another course`;
  const titles = modules.map((m) => m.title);
  if (!titles[0].startsWith('Phase 1:') || !titles[titles.length - 1].startsWith(`Phase ${modules.length}:`)) return 'phases not numbered across the roadmap';
  return modules.filter((m) => m.courseId === 'course-dsa-optim').length === 4 ? true : 'DSA not split into phases';
});

test('lessons from the second course are tagged with that course\'s competencies', () => {
  const modules = generateDynamicStudentRoadmap({ courseId: 'course-java-logic', durationDays: 60, qt1: 60, qt2: 60 });
  const dsaQuests = modules.filter((m) => m.courseId === 'course-dsa-optim').flatMap((m) => m.quests);
  const mismatch = dsaQuests.find((q, idx) => {
    const day = parseQuestId(q.id)?.dayNum ?? (Math.floor((idx) / 3) + 1);
    const want = mapQuestToCompetencyEvidence('course-dsa-optim', day, q.id)?.competencyId;
    return (q.competencyTag?.competencyId ?? undefined) !== want;
  });
  return mismatch ? `quest ${mismatch.id} tagged ${mismatch.competencyTag?.competencyId}` : true;
});

test('the first roadmap made at onboarding stays 30 days (main course only)', () => {
  const ctx = fs.readFileSync(path.join(ROOT, 'src/lib/context/UserProgressContext.tsx'), 'utf8');
  return /durationDays = 30,/.test(ctx) ? true : 'generateFusedRoadmap no longer defaults to 30 days';
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
