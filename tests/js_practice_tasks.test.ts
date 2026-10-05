import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import * as acorn from 'acorn';
import fs from 'node:fs';
import path from 'node:path';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { resolveQuestLanguage } from '../src/components/quests/workspace/useWorkspaceState';
import { buildJsTaskScript } from '../src/lib/code/runners/jsTaskScript';
import { getReactRuntimeSync } from '../src/lib/code/react/reactRuntime';
import { compileTsSync } from '../src/lib/code/ts/compileTs';

type Quest = { id: string; category?: string; starterCode?: string; testSuite?: string; language?: string };

/** Runs a JavaScript/TSX practice task the way the sandbox worker does (new Function(script)(), then waits). */
async function gradeJs(code: string, testSuite: string, language?: string): Promise<{ passed: boolean; error?: string }> {
  let executableCode = code;
  const isTsx = language === 'tsx' || /<[A-Za-z]/.test(code) || /render\(/.test(testSuite);
  const isTs = isTsx || language === 'typescript' || /:\s*[a-zA-Z]/.test(code);

  if (isTs) {
    const comp = compileTsSync(executableCode, { jsx: isTsx });
    if (!comp.ok) {
      return { passed: false, error: comp.message };
    }
    executableCode = comp.js;
  }

  // The browser worker has these too.
  const context = vm.createContext({
    console: { log() {}, error() {} },
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

  if (isTsx) {
    const runtime = getReactRuntimeSync();
    vm.runInContext(runtime, context);
    (context as any).render = function (Component: any, props: any = {}) {
      const R = (context as any).__PINIT_REACT__ || {
        React: (context as any).React,
        renderToStaticMarkup: (context as any).renderToStaticMarkup,
      };
      if (!R || !R.renderToStaticMarkup || !R.React) {
        throw new Error('React render runtime is not initialized');
      }
      return R.renderToStaticMarkup(R.React.createElement(Component, props));
    };
  }

  try {
    const runnableJs = executableCode
      .replace(/\bexport\s+default\s+/g, '')
      .replace(/\bexport\s+(?=(?:async\s+)?function|const|let|var|class)\b/g, '');
    const result = vm.runInContext(`(function () {\n${buildJsTaskScript(runnableJs, testSuite)}\n})()`, context, { timeout: 3000 });
    await result;
    return { passed: true };
  } catch (err) {
    return { passed: false, error: String((err as Error)?.message ?? err) };
  }
}

function tasks(courseId: string): Quest[] {
  const course = (COURSES_REGISTRY as { id: string; quests: Quest[] }[]).find((c) => c.id === courseId);
  assert.ok(course, `${courseId} not found`);
  return course.quests.filter((q) => q.testSuite && String(q.testSuite).trim());
}

test('a correct JavaScript answer passes and a wrong one fails with the check message', async () => {
  const suite = "if (isGoodSalary(500000) !== true) throw new Error('500000 should be true');\nif (isGoodSalary(300000) !== false) throw new Error('300000 should be false');";
  assert.deepEqual(await gradeJs('function isGoodSalary(salary) { return salary >= 500000; }', suite), { passed: true });
  assert.deepEqual(await gradeJs('function isGoodSalary(salary) { return true; }', suite), { passed: false, error: '300000 should be false' });
  assert.equal((await gradeJs('function isGoodSalary(salary) {', suite)).passed, false);
});

test('checks that use await are waited for', async () => {
  const suite = "const v = await load();\nif (v !== 7) throw new Error('load() must resolve to 7');";
  assert.equal((await gradeJs('async function load() { return 7; }', suite)).passed, true);
  const wrong = await gradeJs('async function load() { return 6; }', suite);
  assert.deepEqual(wrong, { passed: false, error: 'load() must resolve to 7' });
});

test('the checks can reuse the student\'s variable names', async () => {
  const suite = "const total = sum([1, 2]);\nif (total !== 3) throw new Error('sum must add');";
  assert.equal((await gradeJs('const total = 0;\nfunction sum(a) { return a.reduce((x, y) => x + y, total); }', suite)).passed, true);
});

test('tasks written in JavaScript go to the JavaScript checker, other languages keep theirs', () => {
  for (const q of tasks('course-react-web')) {
    const lang = resolveQuestLanguage(q, q.id);
    assert.ok(lang === 'javascript' || lang === 'tsx', `${q.id} unexpected lang: ${lang}`);
  }
  for (const id of ['course-dsa-optim', 'course-devops-cicd', 'course-quant-systems', 'course-cloud-native', 'course-ai-eng', 'course-nlp']) {
    for (const q of tasks(id)) assert.equal(resolveQuestLanguage(q, q.id), 'javascript', q.id);
  }
  for (const q of tasks('course-python-backend')) assert.equal(resolveQuestLanguage(q, q.id), 'python', q.id);
  for (const q of tasks('course-database-eng')) assert.equal(resolveQuestLanguage(q, q.id), 'sql', q.id);
  for (const q of tasks('course-java-logic')) assert.equal(resolveQuestLanguage(q, q.id), 'java', q.id);
});

test('every React practice task fails when the student has not written the answer yet', async () => {
  const react = tasks('course-react-web');
  assert.equal(react.length, 60);
  const tsxTasks = react.filter((q) => (q as any).language === 'tsx');
  assert.ok(tsxTasks.length >= 10, `Expected at least 10 TSX tasks in course-react-web, got ${tsxTasks.length}`);
  for (const q of react) {
    const result = await gradeJs(String(q.starterCode || ''), String(q.testSuite), (q as any).language);
    assert.equal(result.passed, false, `${q.id}: the starter code already passes`);
  }
});

/** Reference answers, kept out of the app so students never download them. */
const SOLUTIONS: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/practice_solutions.json'), 'utf8'));
for (const f of fs.readdirSync(path.join(__dirname, 'fixtures'))) {
  if (f.endsWith('_solutions.json')) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', f), 'utf8'));
      Object.assign(SOLUTIONS, data);
    } catch {}
  }
}

/** Answers a student could guess without solving the task. */
const LAZY_RETURNS = ['true', 'false', '0', '1', '-1', '[]', "''", 'null', '{}'];

/** Recall questions whose right answer is one fixed value (for example "greedy decoding uses temperature 0"). */
const RECALL_TASKS = new Set(['nlp-assign-day-6', 'nlp-assign-day-27']);

/** The starting code with every function and method (except constructors) returning `value`. */
function lazyAnswer(starter: string, value: string): string {
  let codeToParse = starter;
  let ast: { body: AcornNode[] } | null = null;
  try {
    ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
  } catch {
    const res = compileTsSync(starter, { jsx: true });
    if (res.ok) {
      codeToParse = res.js;
      try {
        ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
      } catch {}
    }
  }
  if (!ast) return starter;
  const bodies: AcornNode[] = [];
  for (const node of ast.body) {
    if (node.type === 'FunctionDeclaration' && node.body) bodies.push(node.body);
    if (node.type === 'ClassDeclaration' && node.body) {
      for (const m of node.body.body ?? []) if (m.kind !== 'constructor' && m.value?.body) bodies.push(m.value.body);
    }
  }
  let out = codeToParse;
  for (const b of bodies.sort((x, y) => y.start - x.start)) out = out.slice(0, b.start) + `{ return ${value}; }` + out.slice(b.end);
  return out;
}
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

export function extractFunctionNames(code: string): string[] {
  const names: string[] = [];
  let codeToParse = code;
  let ast: { body: AcornNode[] } | null = null;
  try {
    ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
  } catch {
    const res = compileTsSync(code, { jsx: true });
    if (res.ok) {
      codeToParse = res.js;
      try {
        ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
      } catch {}
    }
  }
  if (!ast) return names;
  for (const node of ast.body) {
    if (node.type === 'FunctionDeclaration' && node.id?.name) {
      names.push(node.id.name);
    } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
      if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id?.name) {
        names.push(node.declaration.id.name);
      }
    }
  }
  return names;
}

export async function getFirstReturnValues(solution: string, testSuite: string, fnNames: string[], language?: string): Promise<Record<string, any>> {
  if (fnNames.length === 0) return {};
  const isTsx = language === 'tsx' || /<[A-Za-z]/.test(solution) || /render\(/.test(testSuite);
  let codeToRun = solution;
  if (isTsx || language === 'typescript' || /:\s*[a-zA-Z]/.test(solution)) {
    const comp = compileTsSync(solution, { jsx: isTsx });
    if (comp.ok) {
      codeToRun = comp.js;
    }
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

  if (isTsx) {
    const runtime = getReactRuntimeSync();
    vm.runInContext(runtime, context);
    (context as any).render = function (Component: any, props: any = {}) {
      const R = (context as any).__PINIT_REACT__ || {
        React: (context as any).React,
        renderToStaticMarkup: (context as any).renderToStaticMarkup,
      };
      if (!R || !R.renderToStaticMarkup || !R.React) {
        throw new Error('React render runtime is not initialized');
      }
      return R.renderToStaticMarkup(R.React.createElement(Component, props));
    };
  }

  const spyWrappers = fnNames
    .map(
      (name) => `
    if (typeof ${name} === 'function') {
      const __orig_${name} = ${name};
      let __called_${name} = false;
      ${name} = function(...args) {
        const res = __orig_${name}.apply(this, args);
        if (!__called_${name}) {
          __called_${name} = true;
          try {
            __first_returns__[${JSON.stringify(name)}] = res;
          } catch {}
        }
        return res;
      };
    }
  `
    )
    .join('\n');

  const harness = `
    const __first_returns__ = {};
    ${codeToRun}
    ${spyWrappers}
    (async () => {
      try {
        ${testSuite}
      } catch {}
      return __first_returns__;
    })()
  `;

  try {
    const res = await vm.runInContext(harness, context, { timeout: 3000 });
    return res || {};
  } catch {
    return {};
  }
}

export function constantAnswer(starter: string, firstReturns: Record<string, any>): string {
  let codeToParse = starter;
  let ast: { body: AcornNode[] } | null = null;
  try {
    ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
  } catch {
    const res = compileTsSync(starter, { jsx: true });
    if (res.ok) {
      codeToParse = res.js;
      try {
        ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
      } catch {}
    }
  }
  if (!ast) return starter;
  try {
    const replacements: { start: number; end: number; name: string }[] = [];

    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration' && node.id?.name && node.body) {
        replacements.push({ start: node.body.start, end: node.body.end, name: node.id.name });
      } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id?.name && node.declaration.body) {
          replacements.push({
            start: node.declaration.body.start,
            end: node.declaration.body.end,
            name: node.declaration.id.name,
          });
        }
      }
    }

    let out = codeToParse;
    for (const rep of replacements.sort((a, b) => b.start - a.start)) {
      const val = firstReturns[rep.name];
      const serialized = typeof val === 'undefined' ? 'undefined' : JSON.stringify(val);
      out = out.slice(0, rep.start) + `{ return ${serialized}; }` + out.slice(rep.end);
    }
    return out;
  } catch {
    return starter;
  }
}

/**
 * Tasks known to return a constant answer in existing courses (W-09).
 * This list must shrink to empty by the end of Phase 3 as each course is upgraded.
 */
export const KNOWN_CONSTANT_TASKS = new Set<string>([
  // course-fullstack-js (48 tasks)
  'fullstack-js-assign-day-1', 'fullstack-js-exam-day-10', 'fullstack-js-assign-day-10', 'fullstack-js-assign-day-11',
  'fullstack-js-exam-day-12', 'fullstack-js-assign-day-12', 'fullstack-js-assign-day-13', 'fullstack-js-assign-day-14',
  'fullstack-js-assign-day-15', 'fullstack-js-assign-day-17', 'fullstack-js-exam-day-18', 'fullstack-js-assign-day-20',
  'fullstack-js-assign-day-21', 'fullstack-js-assign-day-22', 'fullstack-js-exam-day-23', 'fullstack-js-assign-day-23',
  'fullstack-js-assign-day-24', 'fullstack-js-exam-day-26', 'fullstack-js-assign-day-26', 'fullstack-js-assign-day-27',
  'fullstack-js-assign-day-28', 'fullstack-js-assign-day-29', 'fullstack-js-assign-day-33', 'fullstack-js-assign-day-34',
  'fullstack-js-assign-day-35', 'fullstack-js-assign-day-41', 'fullstack-js-assign-day-42', 'fullstack-js-assign-day-43',
  'fullstack-js-assign-day-44', 'fullstack-js-assign-day-48', 'fullstack-js-assign-day-51', 'fullstack-js-assign-day-56',
  'fullstack-js-exam-day-60', 'fullstack-js-assign-day-69', 'fullstack-js-exam-day-71', 'fullstack-js-assign-day-74',
  'fullstack-js-assign-day-75', 'fullstack-js-assign-day-76', 'fullstack-js-assign-day-80', 'fullstack-js-assign-day-85',
  'fullstack-js-assign-day-90', 'fullstack-js-assign-day-91', 'fullstack-js-exam-day-97', 'fullstack-js-exam-day-98',
  'fullstack-js-exam-day-107', 'fullstack-js-exam-day-111', 'fullstack-js-exam-day-117', 'fullstack-js-exam-day-120',
  // course-react-web (19 tasks)
  'react-basics-exam-day-2', 'react-basics-exam-day-4', 'react-basics-assign-day-4',
  'react-basics-exam-day-5', 'react-basics-assign-day-5', 'react-basics-exam-day-6', 'react-basics-assign-day-6',
  'react-basics-exam-day-7', 'react-basics-assign-day-7',
  'react-basics-assign-day-14', 'react-basics-exam-day-15', 'react-basics-assign-day-15', 'react-basics-assign-day-22',
  'react-basics-exam-day-23', 'react-basics-assign-day-23', 'react-basics-exam-day-25',
  'react-basics-exam-day-27', 'react-basics-assign-day-29', 'react-basics-assign-day-30',
  // course-cloud-native: 0 tasks (all 60 tasks non-constant and verified)
  // course-devops-cicd: 0 tasks (all 60 tasks non-constant and verified)
  // course-quant-systems (24 tasks)
  'quant-systems-assign-day-2', 'quant-systems-assign-day-3', 'quant-systems-assign-day-4', 'quant-systems-assign-day-5',
  'quant-systems-exam-day-9', 'quant-systems-exam-day-10', 'quant-systems-assign-day-11', 'quant-systems-assign-day-14',
  'quant-systems-assign-day-15', 'quant-systems-exam-day-16', 'quant-systems-assign-day-16', 'quant-systems-assign-day-17',
  'quant-systems-assign-day-18', 'quant-systems-exam-day-19', 'quant-systems-assign-day-20', 'quant-systems-assign-day-21',
  'quant-systems-assign-day-22', 'quant-systems-assign-day-23', 'quant-systems-assign-day-24', 'quant-systems-assign-day-25',
  'quant-systems-assign-day-26', 'quant-systems-exam-day-28', 'quant-systems-assign-day-28', 'quant-systems-assign-day-29',
  // course-dsa-optim: 0 tasks (all 60 tasks non-constant and verified)
  // course-design-systems: 0 tasks (all 60 tasks non-constant and verified)
  // course-ai-eng: 0 tasks (all 60 tasks non-constant and verified)
  // course-distributed-sys: 0 tasks (all 60 tasks non-constant and verified)
  // course-cybersecurity: 0 tasks (all 60 tasks non-constant and verified)
  // course-nlp (48 tasks)
  'nlp-exam-day-1', 'nlp-assign-day-1', 'nlp-assign-day-2', 'nlp-assign-day-3',
  'nlp-exam-day-4', 'nlp-assign-day-4', 'nlp-exam-day-5', 'nlp-assign-day-5',
  'nlp-assign-day-6', 'nlp-exam-day-7', 'nlp-assign-day-7', 'nlp-exam-day-8',
  'nlp-assign-day-8', 'nlp-assign-day-9', 'nlp-exam-day-10', 'nlp-assign-day-10',
  'nlp-assign-day-11', 'nlp-exam-day-12', 'nlp-assign-day-12', 'nlp-exam-day-13',
  'nlp-assign-day-13', 'nlp-exam-day-14', 'nlp-assign-day-14', 'nlp-exam-day-15',
  'nlp-assign-day-15', 'nlp-assign-day-16', 'nlp-exam-day-17', 'nlp-assign-day-17',
  'nlp-exam-day-18', 'nlp-assign-day-18', 'nlp-assign-day-19', 'nlp-assign-day-20',
  'nlp-exam-day-21', 'nlp-assign-day-21', 'nlp-exam-day-22', 'nlp-assign-day-22',
  'nlp-exam-day-23', 'nlp-assign-day-23', 'nlp-assign-day-24', 'nlp-exam-day-25',
  'nlp-assign-day-25', 'nlp-assign-day-26', 'nlp-exam-day-27', 'nlp-assign-day-27',
  'nlp-assign-day-28', 'nlp-exam-day-29', 'nlp-assign-day-29', 'nlp-assign-day-30',
  // course-ai-prompt-literacy (34 tasks)
  'ai_prompt-assign-day-1', 'ai_prompt-assign-day-2', 'ai_prompt-assign-day-3', 'ai_prompt-exam-day-4',
  'ai_prompt-assign-day-4', 'ai_prompt-exam-day-5', 'ai_prompt-assign-day-5', 'ai_prompt-assign-day-6',
  'ai_prompt-assign-day-7', 'ai_prompt-assign-day-8', 'ai_prompt-assign-day-9', 'ai_prompt-assign-day-10',
  'ai_prompt-assign-day-11', 'ai_prompt-assign-day-12', 'ai_prompt-assign-day-13', 'ai_prompt-assign-day-14',
  'ai_prompt-exam-day-15', 'ai_prompt-assign-day-15', 'ai_prompt-assign-day-16', 'ai_prompt-assign-day-17',
  'ai_prompt-assign-day-18', 'ai_prompt-assign-day-19', 'ai_prompt-assign-day-20', 'ai_prompt-exam-day-21',
  'ai_prompt-assign-day-21', 'ai_prompt-assign-day-22', 'ai_prompt-assign-day-23', 'ai_prompt-assign-day-24',
  'ai_prompt-assign-day-25', 'ai_prompt-assign-day-26', 'ai_prompt-assign-day-27', 'ai_prompt-assign-day-28',
  'ai_prompt-assign-day-29', 'ai_prompt-assign-day-30',
]);

const CHECKED_COURSES = ['course-fullstack-js', 'course-react-web', 'course-cloud-native', 'course-devops-cicd', 'course-quant-systems', 'course-dsa-optim', 'course-design-systems', 'course-ai-eng', 'course-distributed-sys', 'course-cybersecurity', 'course-nlp', 'course-ai-prompt-literacy'];

test('every practice task in the checked courses: the reference answer passes, the starting code fails', async () => {
  // A check that forgets to wait for async code can throw after the test ends; count it as a failure there instead.
  let late = 0;
  const onLate = () => { late++; };
  process.on('unhandledRejection', onLate);
  try {
    for (const courseId of CHECKED_COURSES) {
      const list = tasks(courseId);
      assert.equal(list.length, courseId === 'course-fullstack-js' ? 240 : 60, courseId);
      for (const q of list) {
        const lang = (q as any).language;
        const solution = SOLUTIONS[q.id];
        assert.ok(solution, `${q.id}: no reference answer in tests/fixtures/practice_solutions.json`);
        const right = await gradeJs(solution, String(q.testSuite), lang);
        assert.equal(right.passed, true, `${q.id}: the reference answer fails: ${right.error}`);
        const blank = await gradeJs(String(q.starterCode || ''), String(q.testSuite), lang);
        assert.equal(blank.passed, false, `${q.id}: the starting code already passes`);
        assert.ok(!String(q.starterCode).includes(solution.trim()), `${q.id}: the starting code contains the answer`);
        if (RECALL_TASKS.has(q.id)) continue;
        for (const value of LAZY_RETURNS) {
          const lazy = await gradeJs(lazyAnswer(String(q.starterCode || ''), value), String(q.testSuite), lang);
          assert.equal(lazy.passed, false, `${q.id}: passes when every function just returns ${value}`);
        }
      }
    }
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(late, 0, 'a check threw after the task finished (missing await)');
  } finally {
    process.off('unhandledRejection', onLate);
  }
});

test('checks never require a made-up code the student is not told about', () => {
  for (const courseId of CHECKED_COURSES) {
    for (const q of tasks(courseId) as (Quest & { desc?: string; hint?: string })[]) {
      const visible = `${q.desc} ${q.starterCode} ${q.hint || ''}`;
      const suite = String(q.testSuite);
      for (const m of suite.matchAll(/[!=]==\s*'([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)'/g)) {
        // A value the check itself passes in as input (for example a stage name) is not hidden.
        const usedAsInput = suite.split(`'${m[1]}'`).length - 1 > suite.split(new RegExp(`[!=]==\\s*'${m[1]}'`)).length - 1;
        assert.ok(visible.includes(m[1]) || usedAsInput, `${q.id}: the check needs '${m[1]}' but the task never mentions it`);
      }
      for (const m of suite.matchAll(/assert\.strictEqual\([^,]+,\s*'([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)'/g)) {
        const usedAsInput = suite.split(`'${m[1]}'`).length - 1 > suite.split(new RegExp(`,\\s*'${m[1]}'`)).length - 1;
        assert.ok(visible.includes(m[1]) || usedAsInput, `${q.id}: the check needs '${m[1]}' but the task never mentions it`);
      }
      for (const m of suite.matchAll(/includes\('([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)'\)/g)) {
        const usedAsInput = suite.split(`'${m[1]}'`).length - 1 > suite.split(`includes('${m[1]}')`).length - 1;
        assert.ok(visible.includes(m[1]) || usedAsInput, `${q.id}: the check needs '${m[1]}' but the task never mentions it`);
      }
    }
  }
});

test('W-09: constant-answer detector catches lazy constant solutions', async () => {
  const goodSuite = `
    if (doubleNum(2) !== 4) throw new Error('2 -> 4');
    if (doubleNum(3) !== 6) throw new Error('3 -> 6');
  `;
  const goodSolution = 'function doubleNum(n) { return n * 2; }';
  const fnNames = extractFunctionNames(goodSolution);
  const firstReturns = await getFirstReturnValues(goodSolution, goodSuite, fnNames);
  assert.equal(firstReturns.doubleNum, 4);

  const constCode = constantAnswer(goodSolution, firstReturns);
  const result = await gradeJs(constCode, goodSuite);
  assert.equal(result.passed, false, 'Constant answer returning 4 must fail on 3 -> 6');

  const constantSuite = `
    if (getConstant() !== "fixed") throw new Error('must be fixed');
  `;
  const constantSolution = 'function getConstant() { return "fixed"; }';
  const constFns = extractFunctionNames(constantSolution);
  const constFirst = await getFirstReturnValues(constantSolution, constantSuite, constFns);
  const constResult = await gradeJs(constantAnswer(constantSolution, constFirst), constantSuite);
  assert.equal(constResult.passed, true, 'Constant task passes constant answer');
});

test('F-14: constant-answer gate enforces that passing-with-constant tasks equals KNOWN_CONSTANT_TASKS across all web courses', async () => {
  const WEB_COURSES = [
    'course-react-web',
    'course-node-web',
    'course-dsa-optim',
    'course-devops-cicd',
    'course-cloud-native',
    'course-distributed-sys',
    'course-cybersecurity',
    'course-ai-eng',
    'course-sre-web',
    'course-stream-web',
    'course-aideploy-web',
    'course-design-systems',
    'course-fullstack-js',
  ];

  const detected: string[] = [];
  for (const courseId of WEB_COURSES) {
    const course = (COURSES_REGISTRY as any[]).find((c) => c.id === courseId);
    if (!course) continue;
    const taskList = course.quests.filter((q: any) => q.testSuite && String(q.testSuite).trim());
    for (const q of taskList) {
      const sol = SOLUTIONS[q.id];
      if (!sol) continue;
      const fnNames = extractFunctionNames(sol);
      if (fnNames.length === 0) continue;
      const lang = (q as any).language;
      const firstReturns = await getFirstReturnValues(sol, String(q.testSuite), fnNames, lang);
      if (Object.keys(firstReturns).length === 0) continue;
      const constCode = constantAnswer(sol, firstReturns);
      const res = await gradeJs(constCode, String(q.testSuite), lang);
      if (res.passed) {
        detected.push(q.id);
      }
    }
  }

  const expectedKnownWeb = Array.from(KNOWN_CONSTANT_TASKS).filter((id: string) => {
    return WEB_COURSES.some((c) => {
      const prefix = c.replace('course-', '');
      return (
        id.startsWith(prefix) ||
        (c === 'course-react-web' && id.startsWith('react-')) ||
        (c === 'course-fullstack-js' && id.startsWith('fullstack-')) ||
        (c === 'course-design-systems' && id.startsWith('design-')) ||
        (c === 'course-ai-eng' && id.startsWith('ai-'))
      );
    });
  });

  assert.deepEqual(
    detected.sort(),
    expectedKnownWeb.sort(),
    'Detected constant tasks must exactly match KNOWN_CONSTANT_TASKS (gate enforced)'
  );
});
