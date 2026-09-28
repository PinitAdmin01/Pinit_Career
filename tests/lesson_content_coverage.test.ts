import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { parseQuestId, resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { getLongLesson } from '../src/lib/data/longLessons';

// The 1-month React course is being rewritten as long lessons; these days are not written yet.
// Remove days from this list as they are added to reactLongLessons.ts.
const PENDING_LONG_LESSONS = new Set(
  Array.from({ length: 20 }, (_, i) => `react-basics-lecture1-day-${i + 11}`)
);

// Every course lesson must load its written lesson plan. When the quest's course prefix has no
// entry in PILOT_DAY_SOURCES, the lesson page silently falls back to generic filler slides
// (fake "Verifying invariants" code and one repeated quiz question), which is what happened to
// Cloud, Quant, Accounting, Finance, Marketing and Soft Skills.
test('every course lesson resolves a written lesson plan or long lesson', () => {
  const missing: string[] = [];
  for (const course of COURSES_REGISTRY) {
    for (const quest of course.quests || []) {
      if (!/-lecture1-day-\d+$/.test(quest.id)) continue;
      if (PENDING_LONG_LESSONS.has(quest.id)) continue;
      const parsed = parseQuestId(quest.id);
      if (parsed && getLongLesson(parsed.prefix, parsed.dayNum)) continue;
      const plan = parsed ? resolvePilotDay(parsed.prefix, parsed.dayNum) : null;
      if (!plan || !Array.isArray(plan.blocks) || plan.blocks.length === 0) {
        missing.push(`${course.id}: ${quest.id}`);
      }
    }
  }
  assert.deepEqual(missing.slice(0, 10), [], `${missing.length} lessons fall back to filler slides`);
});
