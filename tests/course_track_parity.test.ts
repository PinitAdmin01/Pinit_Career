import test from 'node:test';
import assert from 'node:assert/strict';
import { ENABLED_COURSES, isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';

test('Block 3 Invariant: ENABLED_COURSES covers all released courses including IoT, systems and B.Com', () => {
  const requiredPrefixes = [
    'python',
    'sql-mastery',
    'dsa-py',
    'ai-py',
    'dist-py',
    'react-basics',
    'node-web',
    'dsa-optim',
    'devops',
    'cloud',
    'cyber',
    'iot_edge',
    'iot_sec',
    'bcom_ops',
    'bcom-accounting',
    'fullstack-js',
    'java-basics'
  ];

  for (const prefix of requiredPrefixes) {
    assert.ok(ENABLED_COURSES.includes(prefix), `ENABLED_COURSES must include "${prefix}"`);
    assert.strictEqual(isCourseVisualsEnabled(prefix), true, `isCourseVisualsEnabled("${prefix}") must be true`);
  }

  // Safety boundary
  assert.strictEqual(isCourseVisualsEnabled('unknown-prefix-999'), false, 'Unknown prefixes must remain disabled');
});

// [FIX-STAGE: wave1c-catalog-registry-parity] Updated catalog parity invariant from stale 37 -> exact 1:1 55-course match with COURSES_REGISTRY
test('Block 3 Invariant: COURSES_CATALOG has 55 masterclasses matching COURSES_REGISTRY with valid metadata', () => {
  assert.strictEqual(COURSES_CATALOG.length, 55, 'Catalog must contain 55 courses');
  assert.strictEqual(
    COURSES_CATALOG.length,
    COURSES_REGISTRY.length,
    `Catalog (${COURSES_CATALOG.length}) must match Registry (${COURSES_REGISTRY.length}) 1:1`
  );
  for (const course of COURSES_CATALOG) {
    assert.ok(course.id.startsWith('course-'), `Course ID "${course.id}" must start with course-`);
    assert.ok(course.title && course.title.trim().length > 0, `Course "${course.id}" must have a title`);
    assert.ok(course.desc && course.desc.trim().length > 0, `Course "${course.id}" must have a description`);
    assert.ok(course.durationWeeks > 0, `Course "${course.id}" must have positive duration`);
  }
});

test('Block 3 Invariant: COURSES_REGISTRY has all courses populated with block tests', () => {
  assert.ok(COURSES_REGISTRY.length >= 37, 'Registry must have at least 37 courses');
  for (const course of COURSES_REGISTRY) {
    assert.ok(course.quests && course.quests.length >= 30, `Course "${course.id}" must have at least 30 quests`);
  }
});

test('Block 159 (TASK-479): resolveTrackForCourse achieves 100% deterministic parity across all catalog and registry courses', async () => {
  const { resolveTrackForCourse } = await import('../src/lib/onboarding/trackResolver');

  // 1. All COURSES_CATALOG items resolve to a valid track
  for (const course of COURSES_CATALOG) {
    const track = resolveTrackForCourse(course.id);
    assert.ok(track, `Track for catalog course "${course.id}" must not be null/undefined`);
    assert.ok(track.targetRoleLabel && track.targetRoleLabel.length > 0, `Course "${course.id}" must have targetRoleLabel`);
    assert.ok(track.courseId && track.courseId.startsWith('course-'), `Course "${course.id}" resolved courseId must start with course-`);
    assert.ok(track.skillsList && track.skillsList.length > 0, `Course "${course.id}" must have non-empty skillsList`);
    assert.ok(Array.isArray(track.weakAreas) && track.weakAreas.length > 0, `Course "${course.id}" must have non-empty weakAreas`);
  }

  // 2. All COURSES_REGISTRY items resolve to a valid track
  for (const course of COURSES_REGISTRY) {
    const track = resolveTrackForCourse(course.id);
    assert.ok(track, `Track for registry course "${course.id}" must not be null/undefined`);
    assert.ok(track.targetRoleLabel && track.targetRoleLabel.length > 0, `Course "${course.id}" must have targetRoleLabel`);
    assert.ok(track.courseId && track.courseId.startsWith('course-'), `Course "${course.id}" resolved courseId must start with course-`);
    assert.ok(track.skillsList && track.skillsList.length > 0, `Course "${course.id}" must have non-empty skillsList`);
    assert.ok(Array.isArray(track.weakAreas) && track.weakAreas.length > 0, `Course "${course.id}" must have non-empty weakAreas`);
  }
});

test('Block 159 (TASK-479): matchTrackFromGoal and resolveTrackFromGoal deterministically map onboarding options, labels, and degree fallbacks', async () => {
  const { matchTrackFromGoal, resolveTrackFromGoal, TRACKS } = await import('../src/lib/onboarding/trackResolver');

  // Tech option IDs
  const frontend = matchTrackFromGoal('frontend_developer');
  assert.strictEqual(frontend?.targetRoleLabel, TRACKS.frontend.targetRoleLabel);

  const ai = matchTrackFromGoal('ai_ml_engineer');
  assert.strictEqual(ai?.targetRoleLabel, TRACKS.ai.targetRoleLabel);

  const cyber = matchTrackFromGoal('cybersecurity');
  assert.strictEqual(cyber?.targetRoleLabel, TRACKS.cyber.targetRoleLabel);

  const dataAnalyst = matchTrackFromGoal('data_analyst');
  assert.strictEqual(dataAnalyst?.targetRoleLabel, TRACKS.analytics.targetRoleLabel);

  // Commerce & Management option IDs
  const accounting = matchTrackFromGoal('accounting_finance');
  assert.strictEqual(accounting?.targetRoleLabel, TRACKS.accounting.targetRoleLabel);

  const banking = matchTrackFromGoal('banking_services');
  assert.strictEqual(banking?.targetRoleLabel, TRACKS.banking.targetRoleLabel);

  // Degree fallbacks
  const bcomFallback = resolveTrackFromGoal('', 'B.Com Accounting');
  assert.strictEqual(bcomFallback.targetRoleLabel, TRACKS.finance.targetRoleLabel);

  const mbaFallback = resolveTrackFromGoal('', 'MBA Operations');
  assert.strictEqual(mbaFallback.targetRoleLabel, TRACKS.operations.targetRoleLabel);

  const defaultFallback = resolveTrackFromGoal('', '');
  assert.strictEqual(defaultFallback.targetRoleLabel, TRACKS.java.targetRoleLabel);
});

