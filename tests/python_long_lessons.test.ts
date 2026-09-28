import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { estimateSpokenMinutes, getLongLessonLanguage } from '../src/lib/data/longLessons';

const hasPython = spawnSync('python3', ['--version']).status === 0;

/** Runs a sample in a fresh Python, like the lesson page does (a fresh namespace per run). */
function runPython(code: string): string {
  const r = spawnSync('python3', ['-c', code], { encoding: 'utf8', timeout: 10000 });
  return `${r.stdout}${r.stderr}`.replace(/\n$/, '');
}

test('every Python long lesson code sample prints exactly its stated output', { skip: !hasPython && 'python3 not installed' }, () => {
  for (const lesson of PYTHON_LONG_LESSONS) {
    lesson.parts.forEach((part, i) => {
      if (!part.code) return;
      const where = `Day ${lesson.day} part ${i + 1} (${part.title})`;
      assert.ok(part.output !== undefined, `${where}: code has no output`);
      assert.ok(!/\binput\(/.test(part.code), `${where}: input() cannot run in the browser`);
      assert.equal(runPython(part.code), part.output, where);
    });
  }
});

test('Python long lessons are complete, full-length classes', () => {
  assert.equal(getLongLessonLanguage('python'), 'python');
  const days = PYTHON_LONG_LESSONS.map((l) => l.day);
  assert.equal(new Set(days).size, days.length, 'a day is written twice');
  for (const lesson of PYTHON_LONG_LESSONS) {
    const where = `Day ${lesson.day}`;
    assert.ok(lesson.day >= 1 && lesson.day <= PYTHON_30_DAYS_CONFIGS.length, `${where}: day out of range`);
    assert.equal(PYTHON_30_DAYS_CONFIGS[lesson.day - 1].title, lesson.title, `${where}: title differs from the course day`);
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
