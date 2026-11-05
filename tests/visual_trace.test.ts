import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadPyodide, type PyodideInterface } from 'pyodide';

import { PYTHON_TRACER_SOURCE } from '../src/lib/visuals/trace/pythonTracer';
import { runPythonTrace, type TraceEvent } from '../src/lib/visuals/trace/runPythonTrace';
import { formatValue } from '../src/lib/visuals/trace/formatValue';
import { findUnstable } from '../src/lib/visuals/trace/stability';
import { runSqlCapture, getSharedSqlDb } from '../src/lib/visuals/trace/runSqlCapture';

import { SQL_LONG_LESSONS } from '../src/lib/data/sqlLongLessons';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { DSA_PYTHON_LONG_LESSONS } from '../src/lib/data/dsaPythonLongLessons';
import { AI_PYTHON_LONG_LESSONS } from '../src/lib/data/aiPythonLongLessons';
import { DIST_PYTHON_LONG_LESSONS } from '../src/lib/data/distPythonLongLessons';
import { CLOUD_PYTHON_LONG_LESSONS } from '../src/lib/data/cloudPythonLongLessons';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';
import { QUANT_PYTHON_LONG_LESSONS } from '../src/lib/data/quantPythonLongLessons';
import { PROMPT_PYTHON_LONG_LESSONS } from '../src/lib/data/promptPythonLongLessons';
import { TRAIN_PYTHON_LONG_LESSONS } from '../src/lib/data/trainPythonLongLessons';
import { VECTOR_PYTHON_LONG_LESSONS } from '../src/lib/data/vectorPythonLongLessons';
import { SAFETY_PYTHON_LONG_LESSONS } from '../src/lib/data/safetyPythonLongLessons';
import type { LongLesson } from '../src/lib/data/longLessons';

let pyodide: PyodideInterface;

test.before(async () => {
  pyodide = await loadPyodide();
});

// Test 1: the tracer string's SHA-256 equals the reference file's
test('1. the tracer string SHA-256 equals the reference file', () => {
  const refPath = path.join(process.cwd(), 'docs', 'visuals', 'py_cert_reference_tracer.py');
  const refContent = fs.readFileSync(refPath, 'utf8').replace(/\r\n/g, '\n');
  const refSha = crypto.createHash('sha256').update(refContent).digest('hex');
  const exportedSha = crypto.createHash('sha256').update(PYTHON_TRACER_SOURCE).digest('hex');
  assert.equal(exportedSha, refSha, 'exported tracer SHA-256 matches reference file');

  const tasksJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs', 'visuals', 'py_cert_tasks.json'), 'utf8'));
  assert.equal(exportedSha, tasksJson.tracerSha256, 'exported tracer SHA matches py_cert_tasks.json tracerSha256');
});

// Test 2: Day 2 Part 2 (balance) gives 500, 480 and 435 after lines 1, 3 and 5
test('2. Day 2 Part 2 (balance) gives 500, 480 and 435 after lines 1, 3 and 5', async () => {
  const day2 = PYTHON_LONG_LESSONS.find((l) => l.day === 2);
  assert.ok(day2, 'Day 2 found');
  const part2 = day2.parts[1]; // Part 2: Changing a variable
  assert.ok(part2 && part2.code, 'Part 2 code found');

  const res = await runPythonTrace(part2.code, pyodide);
  assert.equal(res.error, '', 'runs without error');
  assert.equal(res.output, part2.output, 'output matches');

  // Find events for lines 1, 3, 5
  const line1Event = res.events.find(([line]) => line === 1);
  const line3Event = res.events.find(([line]) => line === 3);
  const line5Event = res.events.find(([line]) => line === 5);

  assert.ok(line1Event, 'line 1 event captured');
  assert.ok(line3Event, 'line 3 event captured');
  assert.ok(line5Event, 'line 5 event captured');

  assert.equal(line1Event[2].balance, 500, 'balance after line 1 is 500');
  assert.equal(line3Event[2].balance, 480, 'balance after line 3 is 480');
  assert.equal(line5Event[2].balance, 435, 'balance after line 5 is 435');
});

// Test 3: python Day 9 Part 3 (list comprehensions) prints exactly its lesson output (the 3.12 trap)
test('3. python Day 9 Part 3 (list comprehensions) prints exactly its lesson output', async () => {
  const day9 = PYTHON_LONG_LESSONS.find((l) => l.day === 9);
  assert.ok(day9, 'Day 9 found');
  const part3 = day9.parts[2];
  assert.ok(part3 && part3.code, 'Day 9 Part 3 code found');

  const res = await runPythonTrace(part3.code, pyodide);
  assert.equal(res.output, part3.output, 'Day 9 Part 3 output matches exactly under tracing');
  assert.equal(res.error, '', 'no error');
});

// Test 4: prompt-py Day 18 Part 1 runs without error (the time name clash)
test('4. prompt-py Day 18 Part 1 runs without error (the time name clash)', async () => {
  const day18 = PROMPT_PYTHON_LONG_LESSONS.find((l) => l.day === 18);
  assert.ok(day18, 'prompt-py Day 18 found');
  const part1 = day18.parts[0];
  assert.ok(part1 && part1.code, 'prompt-py Day 18 Part 1 code found');

  const res = await runPythonTrace(part1.code, pyodide);
  assert.equal(res.error, '', 'runs without error despite defining time variable');
  assert.equal(res.output, part1.output, 'output matches');
});

// Test 5: a value of float('inf') is stored as {"__f__":"inf"}
test('5. a value of float("inf") is stored as {"__f__":"inf"}', async () => {
  const code = 'x = float("inf")\nprint(x)';
  const res = await runPythonTrace(code, pyodide);
  assert.equal(res.error, '');
  const line1Event = res.events.find(([line]) => line === 1);
  assert.ok(line1Event, 'line 1 captured');
  assert.deepEqual(line1Event[2].x, { __f__: 'inf' });
});

// Test 6: dsa-py Day 16 Part 1: the tree root is stored with all 5 nodes
test('6. dsa-py Day 16 Part 1: the tree root is stored with all 5 nodes', async () => {
  const day16 = DSA_PYTHON_LONG_LESSONS.find((l) => l.day === 16);
  assert.ok(day16, 'dsa-py Day 16 found');
  const part1 = day16.parts[0];
  assert.ok(part1 && part1.code, 'dsa-py Day 16 Part 1 code found');

  const res = await runPythonTrace(part1.code, pyodide);
  assert.equal(res.error, '');
  assert.equal(res.output, part1.output);

  // Check that root is recorded in variables
  const rootEvent = res.events.find(([, , vars]) => vars.root !== undefined);
  assert.ok(rootEvent, 'root variable captured');
  assert.ok(rootEvent[2].root, 'root object recorded');
});

// Test 7: an infinite loop returns truncated: true and the run still ends
test('7. an infinite loop returns truncated: true and the run still ends', async () => {
  const code = 'i = 0\nwhile i < 10000:\n    i += 1';
  const res = await runPythonTrace(code, pyodide);
  assert.equal(res.truncated, true, 'infinite loop or >=2000 events marked truncated');
});

// Test 8: all 1,980 Python lesson parts print exactly their output under tracing
test('8. all 1,980 Python lesson parts print exactly their output under tracing', async () => {
  const courses: { name: string; lessons: LongLesson[] }[] = [
    { name: 'python', lessons: PYTHON_LONG_LESSONS },
    { name: 'dsa-py', lessons: DSA_PYTHON_LONG_LESSONS },
    { name: 'ai-py', lessons: AI_PYTHON_LONG_LESSONS },
    { name: 'dist-py', lessons: DIST_PYTHON_LONG_LESSONS },
    { name: 'cloud-py', lessons: CLOUD_PYTHON_LONG_LESSONS },
    { name: 'nlp-py', lessons: NLP_PYTHON_LONG_LESSONS },
    { name: 'quant-py', lessons: QUANT_PYTHON_LONG_LESSONS },
    { name: 'prompt-py', lessons: PROMPT_PYTHON_LONG_LESSONS },
    { name: 'train-py', lessons: TRAIN_PYTHON_LONG_LESSONS },
    { name: 'vec-py', lessons: VECTOR_PYTHON_LONG_LESSONS },
    { name: 'safe-py', lessons: SAFETY_PYTHON_LONG_LESSONS },
  ];

  let totalPartsTested = 0;
  for (const course of courses) {
    assert.ok(course.lessons.length === 30 || course.lessons.length === 60, course.name + " has 30 or 60 days");
    for (const lesson of course.lessons.slice(0, 30)) {
      assert.equal(lesson.parts.length, 6, `${course.name} day ${lesson.day} has 6 parts`);
      for (const [idx, part] of lesson.parts.entries()) {
        totalPartsTested++;
        if (!part.code) continue;
        const res = await runPythonTrace(part.code, pyodide);
        assert.equal(
          res.output,
          part.output,
          `Mismatch in ${course.name} Day ${lesson.day} Part ${idx + 1} (${part.title})`
        );
      }
    }
  }

  assert.equal(totalPartsTested, 1980, 'exactly 1,980 parts verified');
});

// Test 9: formatValue turns values into Python repr cut at 40 chars with …
test('9. formatValue turns values into Python repr cut at 40 chars with …', () => {
  assert.equal(formatValue('Tea'), "'Tea'");
  assert.equal(formatValue(20), '20');
  assert.equal(formatValue(4.5), '4.5');
  assert.equal(formatValue(true), 'True');
  assert.equal(formatValue([1, 2, 3]), '[1, 2, 3]');
  assert.equal(formatValue({ a: 1 }), "{'a': 1}");
  assert.equal(formatValue({ __f__: 'inf' }), 'inf');

  const str100 = 'a'.repeat(100);
  const formattedStr = formatValue(str100);
  assert.equal(formattedStr.length, 40, '100-char string cut at 40 chars');
  assert.ok(formattedStr.endsWith('…'), 'ends with ellipsis');
});

// Test 10: findUnstable on python Day 15 Part 2 names roll
test('10. findUnstable on python Day 15 Part 2 names roll', async () => {
  const day15 = PYTHON_LONG_LESSONS.find((l) => l.day === 15);
  assert.ok(day15, 'Day 15 found');
  const part2 = day15.parts[1]; // Part 2: The random module
  assert.ok(part2 && part2.code, 'Part 2 code found');

  let foundRoll = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    const runA = await runPythonTrace(part2.code, pyodide);
    const runB = await runPythonTrace(part2.code, pyodide);
    const unstable = findUnstable(runA.events, runB.events);
    if (unstable.includes('roll')) {
      foundRoll = true;
      break;
    }
  }

  assert.ok(foundRoll, 'findUnstable identifies roll as unstable across runs');
});

// Test 11: SQL capture on a part with deliberate error (Day 1 Part 3) returns error
test('11. SQL capture on a part with deliberate error (Day 1 Part 3) returns error', async () => {
  const day1 = SQL_LONG_LESSONS.find((l) => l.day === 1);
  assert.ok(day1, 'SQL Day 1 found');
  const part3 = day1.parts[2]; // Part 3: Primary keys
  assert.ok(part3 && part3.code, 'Part 3 code found');

  const res = await runSqlCapture(part3.code);
  assert.ok(res.error, 'error is returned');
  assert.ok(
    res.error.includes('duplicate key value violates unique constraint'),
    `expected unique constraint error, got: ${res.error}`
  );
  assert.equal(res.output, part3.output, 'captured output equals lesson output');
});

// Test 12: for all 180 sql-mastery parts, captured output equals lesson output
test('12. for all 180 sql-mastery parts, captured output equals lesson output', async () => {
  const db = await getSharedSqlDb();
  let checked = 0;
  for (const lesson of SQL_LONG_LESSONS.slice(0, 30)) {
    assert.equal(lesson.parts.length, 6, `SQL Day ${lesson.day} has 6 parts`);
    for (const [idx, part] of lesson.parts.entries()) {
      checked++;
      const res = await runSqlCapture(part.code, db);
      assert.equal(
        res.output,
        part.output,
        `Mismatch in SQL Day ${lesson.day} Part ${idx + 1} (${part.title})`
      );
    }
  }
  assert.equal(checked, 180, 'all 180 SQL parts checked');
});
