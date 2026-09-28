import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { parseQuestId, resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { parseTestQuestId, getTestQuestions, getLessonCheck } from '../src/lib/data/courseTests';
import { REACT_30_DAYS_QUESTS } from '../src/lib/data/react30DayData';
import { getAuthoritativeQuest, isAuthoritativeExam } from '../src/lib/quests/questRegistry';

const react = () => COURSES_REGISTRY.find((c) => c.id === 'course-react-web')!;

test('React course: a test after every 5 days, placed after that day\'s practice', () => {
  const ids = react().quests.map((q) => q.id);
  const tests = ids.filter((id) => parseTestQuestId(id));
  assert.deepEqual(tests, [5, 10, 15, 20, 25, 30].map((d) => `react-basics-test-days-${d - 4}-${d}`));
  for (const id of tests) {
    const { end } = parseTestQuestId(id)!;
    assert.equal(ids[ids.indexOf(id) - 1], `react-basics-assign-day-${end}`, `${id} must follow day ${end}'s last practice`);
  }
});

test('each React test has 10 valid questions from its 5 lessons', () => {
  for (let start = 1; start <= 26; start += 5) {
    const questions = getTestQuestions('react-basics', start, start + 4);
    assert.equal(questions.length, 10, `days ${start}-${start + 4}`);
    for (const q of questions) {
      assert.ok(q.question && q.options.length >= 2, `bad question in days ${start}-${start + 4}`);
      assert.ok(q.answerIndex >= 0 && q.answerIndex < q.options.length, `bad answer index: ${q.question}`);
    }
  }
});

test('daily tasks are practice, not exams, and keep their ids', () => {
  const quests = react().quests;
  for (const q of quests) {
    if (parseTestQuestId(q.id)) {
      assert.equal(q.category, 'exam');
      continue;
    }
    assert.ok(!/exam/i.test(q.title), `"${q.title}" is still called an exam`);
    if (/-(exam|assign)-day-/.test(q.id)) assert.equal(q.category, 'assignment', q.id);
  }
  // No original quest id was lost.
  const ids = new Set(quests.map((q) => q.id));
  for (const q of REACT_30_DAYS_QUESTS) assert.ok(ids.has(q.id), `missing ${q.id}`);
});

test('the server treats tests as exams and daily practice as practice', () => {
  assert.equal(getAuthoritativeQuest('react-basics-test-days-1-5')?.category, 'exam');
  assert.equal(isAuthoritativeExam('react-basics-test-days-1-5'), true);
  assert.equal(isAuthoritativeExam('react-basics-exam-day-1'), false);
});

test('every day-based course has a test for each block of 5 days', () => {
  const missing: string[] = [];
  for (const course of COURSES_REGISTRY) {
    const days = course.quests.map((q) => parseQuestId(q.id)?.dayNum).filter((d): d is number => typeof d === 'number');
    if (days.length === 0) continue;
    const expected = Math.ceil(Math.max(...days) / 5);
    const found = course.quests.filter((q) => parseTestQuestId(q.id)).length;
    if (found !== expected) missing.push(`${course.id}: ${found}/${expected}`);
  }
  assert.deepEqual(missing, []);
});

test('test questions offer real wrong answers, not undefined/null filler', () => {
  const filler = ['undefined', 'null', 'An error'];
  let total = 0;
  let withFiller = 0;
  for (const course of COURSES_REGISTRY) {
    for (const quest of course.quests) {
      const parsed = parseTestQuestId(quest.id);
      if (!parsed) continue;
      for (const q of getTestQuestions(parsed.prefix, parsed.start, parsed.end)) {
        total++;
        assert.equal(new Set(q.options).size, q.options.length, `repeated choice in "${q.question}"`);
        if (!filler.includes(q.options[q.answerIndex]) && q.options.some((o) => filler.includes(o))) withFiller++;
      }
    }
  }
  // Filler is only a last resort for a course with almost no other outputs to borrow from.
  assert.ok(withFiller <= total * 0.01, `${withFiller} of ${total} questions still use filler choices`);
});

test('lesson checks show the written question, and the right answer is not always first', () => {
  const positions = new Set<number>();
  for (let day = 1; day <= 30; day++) {
    const plan = resolvePilotDay('dsa-optim', day);
    plan.blocks.forEach((block: any, i: number) => {
      const check = getLessonCheck('dsa-optim', day, i)!;
      const d = block.diagnosticCheck;
      assert.equal(check.question, d.question, block.id);
      const right = d.options ? d.options[d.correctIndex] : d.expectedStringOutput;
      assert.equal(check.options[check.answerIndex], right, block.id);
      assert.equal(new Set(check.options).size, check.options.length, `${block.id}: repeated choice`);
      assert.ok(!check.options.includes('undefined') || right === 'undefined', `${block.id}: filler choice`);
      positions.add(check.answerIndex);
    });
  }
  assert.ok(positions.size >= 3, 'the right answer moves between positions');
});
