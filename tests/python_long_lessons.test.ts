import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPyodide, type PyodideInterface } from 'pyodide';

import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { estimateSpokenMinutes, getLongLessonLanguage } from '../src/lib/data/longLessons';

/**
 * Runs a sample the way the lesson page does (public/python-worker.js + useLessonEngine):
 * Pyodide, a fresh namespace named __main__, and on an error the last traceback line as "[Error] ...".
 */
async function runLikeLessonPage(pyodide: PyodideInterface, code: string): Promise<string> {
  const out: string[] = [];
  pyodide.setStdout({ batched: (line: string) => out.push(line) });
  pyodide.setStderr({ batched: (line: string) => out.push(line) });
  const globals = pyodide.globals.get('dict')();
  globals.set('__name__', '__main__');
  let error = '';
  try {
    await pyodide.runPythonAsync(code, { globals });
  } catch (err) {
    const lines = String((err as Error).message).trim().split('\n');
    error = lines[lines.length - 1];
  } finally {
    globals.destroy();
  }
  return [out.join('\n'), error ? `[Error] ${error}` : ''].filter(Boolean).join('\n');
}

test('every Python long lesson code sample shows exactly its stated output in the browser runner', async () => {
  const pyodide = await loadPyodide();
  for (const lesson of PYTHON_LONG_LESSONS) {
    for (const [i, part] of lesson.parts.entries()) {
      if (!part.code) continue;
      const where = `Day ${lesson.day} part ${i + 1} (${part.title})`;
      assert.ok(part.output !== undefined, `${where}: code has no output`);
      assert.ok(!/\binput\(/.test(part.code), `${where}: input() cannot run in the browser`);
      assert.equal(await runLikeLessonPage(pyodide, part.code), part.output, where);
    }
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
