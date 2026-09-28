import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { parseQuestId, resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { getLongLesson } from '../src/lib/data/longLessons';

// Every course lesson must load its written lesson plan. When the quest's course prefix has no
// entry in PILOT_DAY_SOURCES, the lesson page silently falls back to generic filler slides
// (fake "Verifying invariants" code and one repeated quiz question), which is what happened to
// Cloud, Quant, Accounting, Finance, Marketing and Soft Skills.
test('every course lesson resolves a written lesson plan or long lesson', () => {
  const missing: string[] = [];
  for (const course of COURSES_REGISTRY) {
    for (const quest of course.quests || []) {
      if (!/-lecture1-day-\d+$/.test(quest.id)) continue;
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
