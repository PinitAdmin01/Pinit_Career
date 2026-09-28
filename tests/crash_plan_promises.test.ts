import test from 'node:test';
import assert from 'node:assert/strict';

import { getCrashPlanById } from '../src/lib/data/crashPlansData';
import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { CAPSTONE_SPRINTS, getCapstoneSprints } from '../src/lib/courses/capstoneSprints';

// The 1-month plan's React track must only promise a capstone the course prepares students for.
// It used to promise a Next.js 14 / TypeScript / Redis chat engine that the course never taught.
test('the 1-month React capstone only uses technology the course teaches', () => {
  const plan = getCrashPlanById('plan-1m-sprint');
  assert.ok(plan, 'plan-1m-sprint not found');
  const courseText = JSON.stringify(REACT_LONG_LESSONS).toLowerCase();
  const untaught = plan.flagshipBuildByTrack.web_fullstack.tech.filter((t) => !courseText.includes(t.toLowerCase()));
  assert.deepEqual(untaught, [], `capstone lists technology the React course never teaches: ${untaught.join(', ')}`);
});

// The same for the Python track: it used to promise an async ingestion engine with Redis and rate limiting.
test('the 1-month Python capstone only uses technology the course teaches', () => {
  const plan = getCrashPlanById('plan-1m-sprint');
  assert.ok(plan, 'plan-1m-sprint not found');
  const courseText = JSON.stringify(PYTHON_LONG_LESSONS).toLowerCase();
  const untaught = plan.flagshipBuildByTrack.python_ai.tech.filter((t) => !courseText.includes(t.toLowerCase()));
  assert.deepEqual(untaught, [], `capstone lists technology the Python course never teaches: ${untaught.join(', ')}`);
});

test('capstone sprints use the plan wording for its track and the generic wording otherwise', () => {
  const plan = getCrashPlanById('plan-1m-sprint');
  const web = getCapstoneSprints(plan, 'web_fullstack');
  assert.equal(web.length, 4);
  assert.equal(web[0].title, 'Sprint 1: Plan & Repository');
  assert.equal(web[1].field?.label, 'Components');
  assert.equal(web[2].title, CAPSTONE_SPRINTS[2].title, 'sprint 3 keeps the generic title');
  assert.equal(web[2].check, CAPSTONE_SPRINTS[2].check, 'checks the plan does not reword stay the same');

  const python = getCapstoneSprints(plan, 'python_ai');
  assert.equal(python[0].title, 'Sprint 1: Plan & Repository');
  assert.equal(python[1].field?.label, 'API code');
  assert.equal(python[2].title, CAPSTONE_SPRINTS[2].title, 'sprint 3 keeps the generic title');
  assert.deepEqual(getCapstoneSprints(undefined, undefined).map((s) => s.title), CAPSTONE_SPRINTS.map((s) => s.title));
});
