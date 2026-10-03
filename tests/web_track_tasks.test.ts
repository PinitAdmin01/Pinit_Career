import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';
import vm from 'node:vm';

import type { DayConfig } from '../src/lib/data/curriculumEnricher';
import { NODE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/nodeWeb30DayData';
import { SRE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/sreWeb30DayData';
import { STREAM_WEB_30_DAYS_CONFIGS } from '../src/lib/data/streamWeb30DayData';
import { findForbiddenJs } from '../src/lib/code/js/jsGuard';
import { compileTs } from '../src/lib/code/ts/compileTs';
import { executeTypeScriptTask, executeHtmlCssTask } from '../src/lib/code/runners/webTaskRunner';
import { buildJsTaskScript } from '../src/lib/code/runners/jsTaskScript';
import {
  extractFunctionNames,
  getFirstReturnValues,
  constantAnswer,
} from './js_practice_tasks.test';

export interface WebCourseTaskEntry {
  name: string;
  courseId: string;
  prefix?: string;
  configs: DayConfig[];
  solutions: string;
}

/**
 * Web-track courses whose reference answers are in tests/fixtures (not shipped to students).
 * Starts empty; each course adds itself in Phase 3 step b (SRS C6 / W-10).
 */
export const WEB_COURSES: WebCourseTaskEntry[] = [
  {
    name: 'Node.js & TypeScript Backend Engineering',
    courseId: 'course-node-web',
    prefix: 'node-web',
    configs: NODE_WEB_30_DAYS_CONFIGS,
    solutions: 'node_web_solutions.json',
  },
  {
    name: 'Multi-Cloud Reliability & SRE in TypeScript',
    courseId: 'course-sre-web',
    prefix: 'sre-web',
    configs: SRE_WEB_30_DAYS_CONFIGS,
    solutions: 'sre_web_solutions.json',
  },
  {
    name: 'High-Throughput Streaming in TypeScript',
    courseId: 'course-stream-web',
    prefix: 'stream-web',
    configs: STREAM_WEB_30_DAYS_CONFIGS,
    solutions: 'stream_web_solutions.json',
  },
];

/** Answers a student could guess without solving the task. */
export const LAZY_RETURNS = ['true', 'false', '0', '1', '-1', '[]', "''", 'null', '{}'];

type AcornNode = {
  type: string;
  start: number;
  end: number;
  id?: { name: string };
  kind?: string;
  declaration?: AcornNode;
  body?: any;
  value?: any;
};

/** Replaces function/method bodies with a return of `value`. */
export function lazyAnswer(starter: string, value: string): string {
  try {
    const ast = acorn.parse(starter, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
    const bodies: AcornNode[] = [];
    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration' && node.body) bodies.push(node.body);
      if (node.type === 'ClassDeclaration' && node.body) {
        for (const m of node.body.body ?? []) if (m.kind !== 'constructor' && m.value?.body) bodies.push(m.value.body);
      }
    }
    let out = starter;
    for (const b of bodies.sort((x, y) => y.start - x.start)) {
      out = out.slice(0, b.start) + `{ return ${value}; }` + out.slice(b.end);
    }
    return out;
  } catch {
    return starter.replace(/\{[\s\S]*\}$/, `{ return ${value}; }`);
  }
}

/**
 * Grades a web task in TypeScript, TSX, HTML, CSS, or JavaScript.
 */
export async function gradeWebTask(
  code: string,
  testSuite: string,
  language?: string
): Promise<{ passed: boolean; error?: string }> {
  const lang = (language || 'javascript').toLowerCase();

  if (lang === 'typescript' || lang === 'tsx') {
    const res = await executeTypeScriptTask(code, testSuite, 5000, lang as 'typescript' | 'tsx');
    return { passed: res.allPassed, error: res.terminalLogs?.join('\n') || undefined };
  }

  if (lang === 'html' || lang === 'css') {
    const res = await executeHtmlCssTask(code, testSuite, 5000, lang as 'html' | 'css');
    return { passed: res.allPassed, error: res.terminalLogs?.join('\n') || undefined };
  }

  // Pure JavaScript (or compile via compileTs if modern syntax)
  const compiled = await compileTs(code);
  if (!compiled.ok) {
    return { passed: false, error: compiled.message };
  }

  const context = vm.createContext({
    console: { log() {}, error() {}, warn() {} },
    setTimeout,
    clearTimeout,
    Promise,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    atob,
    btoa,
    crypto: globalThis.crypto,
  });

  try {
    const script = buildJsTaskScript(compiled.js, testSuite);
    const result = vm.runInContext(`(function () {\n${script}\n})()`, context, { timeout: 3000 });
    await result;
    return { passed: true };
  } catch (err: any) {
    return { passed: false, error: err?.message || String(err) };
  }
}

function loadSolutions(filename: string): Record<string, string> | [string, string][] {
  const filePath = path.join(__dirname, 'fixtures', path.basename(filename));
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getTaskSolution(
  solutions: Record<string, string> | [string, string][],
  dayIndex: number,
  taskType: 'exam' | 'assign',
  questId?: string
): string | undefined {
  if (Array.isArray(solutions)) {
    const pair = solutions[dayIndex];
    if (pair) return taskType === 'exam' ? pair[0] : pair[1];
  } else if (solutions && typeof solutions === 'object') {
    if (questId && questId in solutions) {
      return solutions[questId];
    }
    const fallbackKey = `${taskType}-day-${dayIndex + 1}`;
    if (fallbackKey in solutions) return solutions[fallbackKey];
  }
  return undefined;
}

test('WEB_COURSES registry export exists and has array shape', () => {
  assert.ok(Array.isArray(WEB_COURSES), 'WEB_COURSES must be an exported array');
});

test('gradeWebTask properly evaluates TypeScript tasks with type checking and execution', async () => {
  const code = 'function add(a: number, b: number): number { return a + b; }';
  const suite = 'if (add(2, 3) !== 5) throw new Error("2 + 3 !== 5");';
  const good = await gradeWebTask(code, suite, 'typescript');
  assert.equal(good.passed, true);

  const badCode = 'function add(a: number, b: number): number { return a * b; }';
  const bad = await gradeWebTask(badCode, suite, 'typescript');
  assert.equal(bad.passed, false);
});

test('gradeWebTask catches constant-answer cheats in TypeScript', async () => {
  const goodSuite = `
    if (multiply(2, 5) !== 10) throw new Error('2 * 5 !== 10');
    if (multiply(3, 4) !== 12) throw new Error('3 * 4 !== 12');
  `;
  const starter = 'function multiply(a: number, b: number): number {\n  return 0;\n}';
  const solution = 'function multiply(a: number, b: number): number {\n  return a * b;\n}';

  const compiledSolution = (await compileTs(solution)).js;
  const compiledStarter = (await compileTs(starter)).js;
  const fnNames = extractFunctionNames(compiledSolution);
  const firstReturns = await getFirstReturnValues(compiledSolution, goodSuite, fnNames);
  assert.equal(firstReturns.multiply, 10);

  const constCode = constantAnswer(compiledStarter, firstReturns);
  const constResult = await gradeWebTask(constCode, goodSuite, 'typescript');
  assert.equal(constResult.passed, false, 'Constant answer returning 10 must fail on 3 * 4 = 12');
});

for (const course of WEB_COURSES) {
  const solutions = loadSolutions(course.solutions);

  test(`${course.name}: 30 days, 60 practice tasks and reference answers`, () => {
    assert.equal(course.configs.length, 30, `${course.name} must have 30 day configs`);
    for (let i = 0; i < 30; i++) {
      const cfg = course.configs[i];
      const prefix = course.prefix || course.courseId.replace(/^course-/, '');
      const solE = getTaskSolution(solutions, i, 'exam', `${prefix}-exam-day-${i + 1}`);
      const solA = getTaskSolution(solutions, i, 'assign', `${prefix}-assign-day-${i + 1}`);
      assert.ok(solE && solE.trim().length > 0, `Day ${i + 1} Practice 1 (exam) missing reference answer`);
      assert.ok(solA && solA.trim().length > 0, `Day ${i + 1} Practice 2 (assign) missing reference answer`);
    }
  });

  test(`${course.name}: every reference answer passes, starter and lazy answers fail`, async () => {
    for (let i = 0; i < course.configs.length; i++) {
      const cfg = course.configs[i];
      const prefix = course.prefix || course.courseId.replace(/^course-/, '');
      const tasks = [
        {
          name: 'Practice 1',
          id: `${prefix}-exam-day-${i + 1}`,
          starter: cfg.eStarter || '',
          check: cfg.eTest || '',
          lang: cfg.eLanguage || 'typescript',
          solution: getTaskSolution(solutions, i, 'exam', `${prefix}-exam-day-${i + 1}`)!,
        },
        {
          name: 'Practice 2',
          id: `${prefix}-assign-day-${i + 1}`,
          starter: cfg.aStarter || '',
          check: cfg.aTest || '',
          lang: cfg.aLanguage || 'typescript',
          solution: getTaskSolution(solutions, i, 'assign', `${prefix}-assign-day-${i + 1}`)!,
        },
      ];

      for (const t of tasks) {
        const label = `${course.name} Day ${i + 1} ${t.name} (${t.id})`;

        // 1. Reference answer passes
        const good = await gradeWebTask(t.solution, t.check, t.lang);
        assert.ok(good.passed, `${label}: the reference answer fails:\n${good.error}`);

        // 2. Starter code fails
        const blank = await gradeWebTask(t.starter, t.check, t.lang);
        assert.ok(!blank.passed, `${label}: the starting code already passes`);

        // 3. Lazy answers fail
        if (t.lang !== 'html' && t.lang !== 'css') {
          for (const val of LAZY_RETURNS) {
            const lazy = await gradeWebTask(lazyAnswer(t.starter, val), t.check, t.lang);
            assert.ok(!lazy.passed, `${label}: passes when returning ${val}`);
          }
        }

        // 4. Constant answer fails
        if (t.lang !== 'html' && t.lang !== 'css') {
          const isJsx = t.lang === 'tsx';
          const compiledSolution = (await compileTs(t.solution, { jsx: isJsx })).js;
          const compiledStarter = (await compileTs(t.starter, { jsx: isJsx })).js;
          const fnNames = extractFunctionNames(compiledSolution);
          if (fnNames.length > 0) {
            const firstReturns = await getFirstReturnValues(compiledSolution, t.check, fnNames);
            const constCode = constantAnswer(compiledStarter || compiledSolution, firstReturns);
            const constResult = await gradeWebTask(constCode, t.check, t.lang);
            assert.ok(!constResult.passed, `${label}: passes with constant answer`);
          }
        }

        // 5. jsGuard finds nothing in answers or tests
        const forbiddenSolution = findForbiddenJs(t.solution);
        assert.equal(forbiddenSolution, null, `${label}: forbidden API found in solution: ${forbiddenSolution}`);
        const forbiddenCheck = findForbiddenJs(t.check);
        assert.equal(forbiddenCheck, null, `${label}: forbidden API found in check: ${forbiddenCheck}`);

        // 6. TS/TSX tasks compile
        if (t.lang === 'typescript' || t.lang === 'tsx') {
          const compiled = await compileTs(t.solution, { jsx: t.lang === 'tsx' });
          assert.ok(compiled.ok, `${label}: solution failed to compile TypeScript: ${compiled.message}`);
        }
      }
    }
  });
}
