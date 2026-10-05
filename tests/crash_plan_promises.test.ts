import test from 'node:test';
import assert from 'node:assert/strict';

import { getCrashPlanById } from '../src/lib/data/crashPlansData';
import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { CAPSTONE_SPRINTS, getCapstoneSprints } from '../src/lib/courses/capstoneSprints';

// The 1-month plan's React track must only promise a capstone the course prepares students for.
// Must appear in a day title or syllabus (E-23 / F-17), not merely a word search across narration text.
test('the 1-month React capstone only uses technology the course teaches', () => {
  const plan = getCrashPlanById('plan-1m-sprint');
  assert.ok(plan, 'plan-1m-sprint not found');
  const courseText = [
    ...REACT_30_DAYS_CONFIGS.map((d) => [d.title, d.desc, ...(d.syllabus ?? [])].join(' ')),
    ...REACT_LONG_LESSONS.map((l) => [l.title, ...l.parts.map((p) => p.title)].join(' ')),
  ].join(' ').toLowerCase();
  const untaught = plan.flagshipBuildByTrack.web_fullstack.tech.filter((t) => !courseText.includes(t.toLowerCase()));
  assert.deepEqual(untaught, [], `capstone lists technology the React course never teaches: ${untaught.join(', ')}`);
});

// The same for the Python track: must appear in a day title or syllabus.
test('the 1-month Python capstone only uses technology the course teaches', () => {
  const plan = getCrashPlanById('plan-1m-sprint');
  assert.ok(plan, 'plan-1m-sprint not found');
  const courseText = [
    ...PYTHON_30_DAYS_CONFIGS.map((d) => [d.title, d.desc, ...(d.syllabus ?? [])].join(' ')),
    ...PYTHON_LONG_LESSONS.map((l) => [l.title, ...l.parts.map((p) => p.title)].join(' ')),
  ].join(' ').toLowerCase();
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

// Every month that uses the SQL course must only list skills the SQL course teaches.
// It used to promise Redis, MongoDB, Prisma, ETL and "Big Data" under Month 3.
test('plan months that use the SQL course only list skills the SQL course teaches', async () => {
  const { CRASH_COURSE_PLANS } = await import('../src/lib/data/crashPlansData');
  const { DATABASE_30_DAYS_CONFIGS } = await import('../src/lib/data/database30DayData');
  // The syllabus, not the lesson text: Day 29 mentions Redis and MongoDB only to compare them.
  const courseText = DATABASE_30_DAYS_CONFIGS.map((d) => [d.title, d.desc, ...(d.syllabus ?? [])].join(' ')).join(' ').toLowerCase();
  for (const plan of CRASH_COURSE_PLANS) {
    for (const track of ['web_fullstack', 'python_ai'] as const) {
      for (const m of plan.modulesByTrack[track].filter((x) => x.courseId === 'course-database-eng' && x.month === 3)) {
        // Day 29 names Redis and MongoDB only to compare them; the course does not teach using them.
        const comparedOnly = ['redis', 'mongodb'];
        const untaught = m.skills.filter((skill) => !courseText.includes(skill.toLowerCase()) || comparedOnly.includes(skill.toLowerCase()));
        assert.deepEqual(untaught, [], `${plan.id} ${track} month 3 lists untaught skills: ${untaught.join(', ')}`);
      }
    }
  }
});

test('every web plan capstone only uses technology its courses teach', () => {
  const { getLongLesson } = require('../src/lib/data/longLessons');
  const { REACT_30_DAYS_CONFIGS } = require('../src/lib/data/react30DayData');
  const { NODE_WEB_30_DAYS_CONFIGS } = require('../src/lib/data/nodeWeb30DayData');
  const { DATABASE_30_DAYS_CONFIGS } = require('../src/lib/data/database30DayData');
  const { DEVOPS_30_DAYS_CONFIGS } = require('../src/lib/data/devops30DayData');
  const { CLOUD_30_DAYS_CONFIGS } = require('../src/lib/data/cloud30DayData');
  const { DESIGN_30_DAYS_CONFIGS } = require('../src/lib/data/design30DayData');
  const { DSA_30_DAYS_CONFIGS } = require('../src/lib/data/dsa30DayData');
  const { DISTRIBUTED_30_DAYS_CONFIGS } = require('../src/lib/data/distributed30DayData');
  const { CYBER_30_DAYS_CONFIGS } = require('../src/lib/data/cybersecurity30DayData');
  const { AI_30_DAYS_CONFIGS } = require('../src/lib/data/ai30DayData');
  const { SRE_WEB_30_DAYS_CONFIGS } = require('../src/lib/data/sreWeb30DayData');
  const { STREAM_WEB_30_DAYS_CONFIGS } = require('../src/lib/data/streamWeb30DayData');
  const { AI_DEPLOY_WEB_30_DAYS_CONFIGS } = require('../src/lib/data/aiDeployWeb30DayData');

  const COURSE_CONFIGS: Record<string, any[]> = {
    'course-react-web': REACT_30_DAYS_CONFIGS,
    'course-node-web': NODE_WEB_30_DAYS_CONFIGS,
    'course-database-eng': DATABASE_30_DAYS_CONFIGS,
    'course-devops-cicd': DEVOPS_30_DAYS_CONFIGS,
    'course-cloud-native': CLOUD_30_DAYS_CONFIGS,
    'course-design-systems': DESIGN_30_DAYS_CONFIGS,
    'course-dsa-optim': DSA_30_DAYS_CONFIGS,
    'course-distributed-sys': DISTRIBUTED_30_DAYS_CONFIGS,
    'course-cybersecurity': CYBER_30_DAYS_CONFIGS,
    'course-ai-eng': AI_30_DAYS_CONFIGS,
    'course-sre-web': SRE_WEB_30_DAYS_CONFIGS,
    'course-stream-web': STREAM_WEB_30_DAYS_CONFIGS,
    'course-aideploy-web': AI_DEPLOY_WEB_30_DAYS_CONFIGS,
  };

  const PREFIX_MAP: Record<string, string> = {
    'course-react-web': 'react-basics',
    'course-node-web': 'node-web',
    'course-database-eng': 'sql-mastery',
    'course-dsa-optim': 'dsa-optim',
    'course-devops-cicd': 'devops',
    'course-cloud-native': 'cloud',
    'course-distributed-sys': 'dist',
    'course-cybersecurity': 'cyber',
    'course-ai-eng': 'ai',
    'course-sre-web': 'sre-web',
    'course-stream-web': 'stream-web',
    'course-aideploy-web': 'aideploy-web',
    'course-design-systems': 'design',
  };

  const planIds = ['plan-1m-sprint', 'plan-3m-accelerator', 'plan-6m-pro', 'plan-9m-master', 'plan-12m-fellow'];
  for (const id of planIds) {
    const plan = getCrashPlanById(id);
    assert.ok(plan, `${id} not found`);
    const courseTitlesAndSyllabus: string[] = [];
    for (const m of plan.modulesByTrack.web_fullstack) {
      const prefix = PREFIX_MAP[m.courseId] || m.courseId.replace(/^course-/, '');
      const configs = COURSE_CONFIGS[m.courseId] || [];
      for (const d of configs) {
        if (d.title) courseTitlesAndSyllabus.push(d.title);
        if (d.desc) courseTitlesAndSyllabus.push(d.desc);
        if (d.syllabus) courseTitlesAndSyllabus.push(...d.syllabus);
      }
      for (let day = 1; day <= 30; day++) {
        const l = getLongLesson(prefix, day);
        if (l) {
          if (l.title) courseTitlesAndSyllabus.push(l.title);
          if (l.parts) courseTitlesAndSyllabus.push(...l.parts.map((p: any) => p.title));
        }
      }
    }
    // Technology must appear in a day title or syllabus (E-23 / F-17), not merely in lesson narration text.
    const courseText = courseTitlesAndSyllabus.join(' ').toLowerCase();
    const untaught = plan.flagshipBuildByTrack.web_fullstack.tech.filter((t) => !courseText.includes(t.toLowerCase()));
    assert.deepEqual(untaught, [], `${id} web capstone lists technology the courses never teach: ${untaught.join(', ')}`);
  }
});

test('every web plan from 1m to 12m has custom capstone sprint wording for web_fullstack', () => {
  const planIds = ['plan-1m-sprint', 'plan-3m-accelerator', 'plan-6m-pro', 'plan-9m-master', 'plan-12m-fellow'];
  for (const id of planIds) {
    const plan = getCrashPlanById(id);
    assert.ok(plan, `${id} not found`);
    const web = getCapstoneSprints(plan, 'web_fullstack');
    assert.equal(web.length, 4, `${id} must have 4 sprints`);
    assert.ok(web[0].title.startsWith('Sprint 1'), `${id} sprint 1 title`);
    assert.ok(web[0].field?.label, `${id} sprint 1 has custom design field label`);
    assert.ok(web[1].field?.label, `${id} sprint 2 has custom code field label`);
    // Compare against the generic sprint text and fail when they are equal (E-23 / F-17)
    for (let i = 0; i < 4; i++) {
      assert.notEqual(
        web[i].description,
        CAPSTONE_SPRINTS[i].description,
        `${id} sprint ${i + 1} must use custom wording and not generic sprint description`
      );
    }
  }

  // Generic fallback must equal generic description (demonstrating the check fails when equal)
  const genericFallback = getCapstoneSprints(undefined, undefined);
  assert.equal(genericFallback[0].description, CAPSTONE_SPRINTS[0].description, 'fallback must equal generic description');
});

