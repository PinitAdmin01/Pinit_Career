import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import {
  COURSE_COMPETENCY_MATRIX,
  getCompetenciesForCourse,
  mapQuestToCompetencyEvidence,
  normalizeCourseId
} from '../src/lib/pathway/competencyMatrix';
import { CAREER_PROGRAMS_CATALOG } from '../src/lib/pathway/programEngine';
import { CERTIFICATION_TRACKS } from '../src/app/quests/components/useQuestProgression';
import { parseQuestId } from '../src/lib/data/curriculumEnricher';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';

test('competency matrix courses all exist in COURSES_REGISTRY', () => {
  const registeredIds = new Set(COURSES_REGISTRY.map(c => c.id));
  const missingFromRegistry: string[] = [];

  for (const mapping of COURSE_COMPETENCY_MATRIX) {
    if (!registeredIds.has(mapping.courseId)) {
      missingFromRegistry.push(mapping.courseId);
    }
  }

  assert.deepEqual(
    missingFromRegistry,
    [],
    `The following course IDs in COURSE_COMPETENCY_MATRIX do not exist in COURSES_REGISTRY: ${missingFromRegistry.join(', ')}`
  );
});

test('career programs catalog stages only reference registered course IDs', () => {
  const registeredIds = new Set(COURSES_REGISTRY.map(c => c.id));
  const missingFromCatalog: { programId: string; stageId: string; missingId: string }[] = [];

  for (const prog of CAREER_PROGRAMS_CATALOG) {
    for (const stage of prog.stages) {
      for (const courseId of stage.courseModuleIds) {
        if (!registeredIds.has(courseId)) {
          missingFromCatalog.push({
            programId: prog.id,
            stageId: stage.id,
            missingId: courseId
          });
        }
      }
    }
  }

  assert.deepEqual(
    missingFromCatalog,
    [],
    `CAREER_PROGRAMS_CATALOG stages contain un-registered course IDs: ${JSON.stringify(missingFromCatalog, null, 2)}`
  );
});

test('certification tracks only reference registered course IDs', () => {
  const registeredIds = new Set(COURSES_REGISTRY.map(c => c.id));
  const missingFromTracks: { trackId: string; courseId: string }[] = [];

  for (const track of CERTIFICATION_TRACKS) {
    if (!registeredIds.has(track.courseId)) {
      missingFromTracks.push({
        trackId: track.id,
        courseId: track.courseId
      });
    }
  }

  assert.deepEqual(
    missingFromTracks,
    [],
    `CERTIFICATION_TRACKS reference non-existent course IDs: ${JSON.stringify(missingFromTracks, null, 2)}`
  );
});

test('alias normalization correctly resolves legacy shorthand IDs', () => {
  assert.equal(normalizeCourseId('course-java'), 'course-java-logic');
  assert.equal(normalizeCourseId('course-python'), 'course-python-backend');
  assert.equal(normalizeCourseId('course-dsa'), 'course-dsa-optim');
  assert.equal(normalizeCourseId('course-database'), 'course-database-eng');
  assert.equal(normalizeCourseId('course-fullstack'), 'course-fullstack-js');
  assert.equal(normalizeCourseId('course-distributed'), 'course-distributed-sys');
  assert.equal(normalizeCourseId('course-devops'), 'course-devops-cicd');
  assert.equal(normalizeCourseId('course-ai'), 'course-ai-eng');
  assert.equal(normalizeCourseId('course-soft-skills'), 'course-softskills-communication');
  assert.equal(normalizeCourseId('course-fullstack-dev'), 'course-fullstack-js');
  assert.equal(normalizeCourseId('course-cloud-devops'), 'course-cloud-native');
  assert.equal(normalizeCourseId('course-data-science'), 'course-database-eng');
});

test('core technical courses produce valid competency mappings across days', () => {
  const coreCourseIds = [
    'course-java-logic',
    'course-python-backend',
    'course-dsa-optim',
    'course-database-eng',
    'course-fullstack-js',
    'course-distributed-sys',
    'course-devops-cicd',
    'course-ai-eng'
  ];

  for (const courseId of coreCourseIds) {
    const comps = getCompetenciesForCourse(courseId);
    assert.ok(comps.length > 0, `Course ${courseId} must have at least one registered competency`);

    // Test Day 1, Day 15, Day 30 mapping
    for (const day of [1, 15, 30]) {
      const mapping = mapQuestToCompetencyEvidence(courseId, day, `${courseId}-exam-day-${day}`);
      assert.ok(mapping !== null, `Expected valid competency mapping for ${courseId} on Day ${day}`);
      assert.ok(mapping.competencyId.length > 0, `Expected competencyId on Day ${day}`);
      assert.ok(mapping.evidenceClass.length > 0, `Expected evidenceClass on Day ${day}`);
    }
  }
});

test('authoritative quest day parsing and 3-quests-per-day pacing', () => {
  // Test parseQuestId
  const parsed1 = parseQuestId('java-basics-lecture1-day-1');
  assert.deepEqual(parsed1, { prefix: 'java-basics', dayNum: 1 });

  const parsed15 = parseQuestId('dsa-optim-exam-day-15');
  assert.deepEqual(parsed15, { prefix: 'dsa-optim', dayNum: 15 });

  const parsed30 = parseQuestId('python-assign-day-30');
  assert.deepEqual(parsed30, { prefix: 'python', dayNum: 30 });

  // Index 0, 1, 2 should map to Day 1
  assert.equal(Math.floor(0 / 3) + 1, 1);
  assert.equal(Math.floor(1 / 3) + 1, 1);
  assert.equal(Math.floor(2 / 3) + 1, 1);
  // Index 3, 4, 5 should map to Day 2
  assert.equal(Math.floor(3 / 3) + 1, 2);
  assert.equal(Math.floor(4 / 3) + 1, 2);
  assert.equal(Math.floor(5 / 3) + 1, 2);
});

test('generateDynamicStudentRoadmap generates quests with attached competencyTag', async () => {
  const modules = await generateDynamicStudentRoadmap({
    courseId: 'course-java-logic',
    durationDays: 30,
    dailyPace: 3,
    qt1: 65,
    qt2: 70
  });

  assert.ok(modules.length > 0, 'Roadmap must generate modules');
  const allQuests = modules.flatMap(m => m.quests);
  assert.ok(allQuests.length > 0, 'Roadmap must contain quests');

  // Verify that quests carry non-null competencyTag
  const questsWithCompTag = allQuests.filter(q => q.competencyTag !== undefined);
  assert.ok(
    questsWithCompTag.length > 0,
    `Quests in course-java-logic must carry competencyTag metadata (got ${questsWithCompTag.length} / ${allQuests.length})`
  );

  const firstTag = questsWithCompTag[0].competencyTag;
  assert.ok(firstTag?.competencyId, 'competencyId must be defined on competencyTag');
  assert.ok(firstTag?.evidenceClass, 'evidenceClass must be defined on competencyTag');
  assert.ok(firstTag?.difficulty, 'difficulty must be defined on competencyTag');
});
