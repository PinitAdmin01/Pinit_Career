import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { estimateSpokenMinutes } from '../src/lib/data/longLessons';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

function runLikeSandbox(code: string): string {
  const out: string[] = [];
  const sandbox = { console: { log: (...args: unknown[]) => out.push(formatLogArgs(args)) } };
  vm.runInNewContext(code, sandbox, { timeout: 2000 });
  return out.join('\n');
}

test('every React long lesson code sample prints exactly its stated output', () => {
  for (const lesson of REACT_LONG_LESSONS) {
    lesson.parts.forEach((part, i) => {
      if (!part.code) return;
      const where = `Day ${lesson.day} part ${i + 1} (${part.title})`;
      assert.ok(part.output !== undefined, `${where}: code has no output`);
      assert.equal(runLikeSandbox(part.code), part.output, where);
    });
  }
});

test('React long lessons are complete, full-length classes', () => {
  const days = REACT_LONG_LESSONS.map((l) => l.day);
  assert.equal(new Set(days).size, days.length, 'a day is written twice');
  for (const lesson of REACT_LONG_LESSONS) {
    const where = `Day ${lesson.day}`;
    assert.ok(lesson.day >= 1 && lesson.day <= REACT_30_DAYS_CONFIGS.length, `${where}: day out of range`);
    assert.ok(lesson.parts.length >= 5 && lesson.parts.length <= 7, `${where}: needs 5 to 7 parts`);
    assert.ok(estimateSpokenMinutes(lesson) >= 9, `${where}: only ${estimateSpokenMinutes(lesson)} minutes of teaching`);
    assert.ok(lesson.summary.length >= 3, `${where}: summary too short`);
    assert.ok(lesson.projectStep && lesson.projectStep.steps.length > 0, `${where}: missing project step`);
    for (const part of lesson.parts) {
      assert.ok(part.say.length >= 3, `${where} "${part.title}": teacher explanation too short`);
      const { options, answer } = part.check;
      assert.ok(options.length >= 2 && answer >= 0 && answer < options.length, `${where} "${part.title}": bad check question`);
    }
  }
});

test('the course day title matches the long lesson title', () => {
  for (const lesson of REACT_LONG_LESSONS) {
    assert.equal(REACT_30_DAYS_CONFIGS[lesson.day - 1].title, lesson.title, `Day ${lesson.day}`);
  }
});
