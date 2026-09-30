import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPyodide, type PyodideInterface } from 'pyodide';

import type { LongLesson } from '../src/lib/data/longLessons';
import { estimateLessonMinutes, estimateSpokenMinutes, getLongLesson } from '../src/lib/data/longLessons';
import { DSA_PYTHON_LONG_LESSONS } from '../src/lib/data/dsaPythonLongLessons';
import { DSA_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/dsaPython30DayData';
import { AI_PYTHON_LONG_LESSONS } from '../src/lib/data/aiPythonLongLessons';
import { AI_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/aiPython30DayData';
import { DIST_PYTHON_LONG_LESSONS } from '../src/lib/data/distPythonLongLessons';
import { DIST_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/distPython30DayData';
import { CLOUD_PYTHON_LONG_LESSONS } from '../src/lib/data/cloudPythonLongLessons';
import { CLOUD_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/cloudPython30DayData';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';
import { NLP_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/nlpPython30DayData';
import { QUANT_PYTHON_LONG_LESSONS } from '../src/lib/data/quantPythonLongLessons';
import { QUANT_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/quantPython30DayData';
import { PROMPT_PYTHON_LONG_LESSONS } from '../src/lib/data/promptPythonLongLessons';
import { PROMPT_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/promptPython30DayData';
import { CYBER_PYTHON_LONG_LESSONS } from '../src/lib/data/cyberPythonLongLessons';
import { CYBER_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/cyberPython30DayData';
import { TRAIN_PYTHON_LONG_LESSONS } from '../src/lib/data/trainPythonLongLessons';
import { TRAIN_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/trainPython30DayData';
import type { DayConfig } from '../src/lib/data/curriculumEnricher';

/** Python-track courses with full-length lessons (the days written so far). */
const COURSES: { name: string; prefix: string; lessons: LongLesson[]; configs: DayConfig[] }[] = [
  { name: 'DSA in Python', prefix: 'dsa-py', lessons: DSA_PYTHON_LONG_LESSONS, configs: DSA_PYTHON_30_DAYS_CONFIGS },
  { name: 'AI Engineering in Python', prefix: 'ai-py', lessons: AI_PYTHON_LONG_LESSONS, configs: AI_PYTHON_30_DAYS_CONFIGS },
  { name: 'Distributed Systems in Python', prefix: 'dist-py', lessons: DIST_PYTHON_LONG_LESSONS, configs: DIST_PYTHON_30_DAYS_CONFIGS },
  { name: 'Cloud Engineering in Python', prefix: 'cloud-py', lessons: CLOUD_PYTHON_LONG_LESSONS, configs: CLOUD_PYTHON_30_DAYS_CONFIGS },
  { name: 'NLP in Python', prefix: 'nlp-py', lessons: NLP_PYTHON_LONG_LESSONS, configs: NLP_PYTHON_30_DAYS_CONFIGS },
  { name: 'Quantitative Trading Systems in Python', prefix: 'quant-py', lessons: QUANT_PYTHON_LONG_LESSONS, configs: QUANT_PYTHON_30_DAYS_CONFIGS },
  { name: 'Everyday AI & Prompt Engineering in Python', prefix: 'prompt-py', lessons: PROMPT_PYTHON_LONG_LESSONS, configs: PROMPT_PYTHON_30_DAYS_CONFIGS },
  { name: 'Cybersecurity in Python', prefix: 'cyber-py', lessons: CYBER_PYTHON_LONG_LESSONS, configs: CYBER_PYTHON_30_DAYS_CONFIGS },
  { name: 'Distributed Model Training in Python', prefix: 'train-py', lessons: TRAIN_PYTHON_LONG_LESSONS, configs: TRAIN_PYTHON_30_DAYS_CONFIGS },
];

/** Runs a sample the way the lesson page does: Pyodide, a fresh __main__ namespace, the last error line. */
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

for (const course of COURSES) {
  test(`${course.name}: every long lesson code sample prints exactly its output in the browser runner`, async () => {
    const pyodide = await loadPyodide();
    for (const lesson of course.lessons) {
      for (const [i, part] of lesson.parts.entries()) {
        if (!part.code) continue;
        const where = `Day ${lesson.day} part ${i + 1} (${part.title})`;
        assert.equal(await runLikeLessonPage(pyodide, part.code), part.output, where);
        const lines = part.code.split('\n').length;
        for (const note of part.codeNotes || []) assert.ok(note.line >= 1 && note.line <= lines, `${where}: note for line ${note.line}`);
      }
    }
  });

  test(`${course.name}: long lessons are full 20-30 minute classes that replace the short ones`, () => {
    for (const lesson of course.lessons) {
      const where = `Day ${lesson.day}`;
      assert.equal(lesson.title, course.configs[lesson.day - 1].title, `${where}: title differs from the course day`);
      assert.equal(getLongLesson(course.prefix, lesson.day), lesson, `${where}: not used by the lesson page`);
      assert.ok(lesson.parts.length >= 5 && lesson.parts.length <= 7, `${where}: needs 5 to 7 parts`);
      const minutes = estimateLessonMinutes(lesson);
      assert.ok(minutes >= 20 && minutes <= 30, `${where}: ${minutes} minutes, not 20-30`);
      assert.ok(estimateSpokenMinutes(lesson) >= 9, `${where}: too little teaching`);
      assert.ok(lesson.summary.length >= 3 && lesson.projectStep && lesson.projectStep.steps.length > 0, `${where}: summary or project step missing`);
      for (const part of lesson.parts) {
        assert.ok(part.say.length >= 3 && part.example && part.code && part.tryIt, `${where} "${part.title}": incomplete part`);
        assert.doesNotMatch(part.code!, /console\.log|\bconst |=>|\bfunction\s+\w+\s*\(/, `${where} "${part.title}": JavaScript in a Python lesson`);
        const { options, answer } = part.check;
        assert.ok(options.length >= 2 && answer >= 0 && answer < options.length, `${where} "${part.title}": bad check question`);
        assert.equal(new Set(options).size, options.length, `${where} "${part.title}": repeated option`);
      }
    }
  });
}
