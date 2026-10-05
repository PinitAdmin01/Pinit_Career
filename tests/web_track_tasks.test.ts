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
import { AI_DEPLOY_WEB_30_DAYS_CONFIGS } from '../src/lib/data/aiDeployWeb30DayData';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { CLOUD_30_DAYS_CONFIGS } from '../src/lib/data/cloud30DayData';
import { DEVOPS_30_DAYS_CONFIGS } from '../src/lib/data/devops30DayData';
import { DESIGN_30_DAYS_CONFIGS } from '../src/lib/data/design30DayData';
import { DSA_30_DAYS_CONFIGS } from '../src/lib/data/dsa30DayData';
import { CYBER_30_DAYS_CONFIGS } from '../src/lib/data/cybersecurity30DayData';
import { DISTRIBUTED_30_DAYS_CONFIGS } from '../src/lib/data/distributed30DayData';
import { AI_30_DAYS_CONFIGS } from '../src/lib/data/ai30DayData';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';

import { findForbiddenJs } from '../src/lib/code/js/jsGuard';
import { compileTsSync } from '../src/lib/code/ts/compileTs';
import { executeTypeScriptTask, executeHtmlCssTask } from '../src/lib/code/runners/webTaskRunner';
import { buildJsTaskScript } from '../src/lib/code/runners/jsTaskScript';
import { KNOWN_CONSTANT_TASKS } from './known_constant_tasks';
import { KNOWN_LOW_INPUT_TASKS } from './known_low_input_tasks';

export interface WebCourseTaskEntry {
  name: string;
  courseId: string;
  prefix: string;
  configs: DayConfig[];
  solutions: string;
}

/**
 * All 13 web-track courses whose reference answers are in tests/fixtures (F-15).
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
  {
    name: 'Production AI Deployment in TypeScript',
    courseId: 'course-aideploy-web',
    prefix: 'aideploy-web',
    configs: AI_DEPLOY_WEB_30_DAYS_CONFIGS,
    solutions: 'ai_deploy_web_solutions.json',
  },
  {
    name: 'React & Frontend Web Engineering',
    courseId: 'course-react-web',
    prefix: 'react-basics',
    configs: REACT_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Cloud Native & Microservices',
    courseId: 'course-cloud-native',
    prefix: 'cloud',
    configs: CLOUD_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'DevOps & CI/CD Pipelines',
    courseId: 'course-devops-cicd',
    prefix: 'devops',
    configs: DEVOPS_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Design Systems & Component Libraries',
    courseId: 'course-design-systems',
    prefix: 'design',
    configs: DESIGN_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Data Structures & Algorithms Optimization',
    courseId: 'course-dsa-optim',
    prefix: 'dsa-optim',
    configs: DSA_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Cybersecurity & Web Security Engineering',
    courseId: 'course-cybersecurity',
    prefix: 'cyber',
    configs: CYBER_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Distributed Systems Architecture',
    courseId: 'course-distributed-sys',
    prefix: 'dist',
    configs: DISTRIBUTED_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Production AI Engineering & RAG Systems',
    courseId: 'course-ai-eng',
    prefix: 'ai',
    configs: AI_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
  },
  {
    name: 'Full-Stack JavaScript Engineering',
    courseId: 'course-fullstack-js',
    prefix: 'fullstack-js',
    configs: FULLSTACK_30_DAYS_CONFIGS,
    solutions: 'practice_solutions.json',
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
  declarations?: any[];
  key?: { name: string };
  body?: any;
  value?: any;
};

/** Replaces function/method bodies with a return of `value`, built from compiled code. */
export function lazyAnswer(starter: string, value: string, isJsx = false): string {
  const comp = compileTsSync(starter, { jsx: isJsx });
  const codeToParse = comp.ok ? comp.js : starter;
  try {
    const ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
    const bodies: { start: number; end: number }[] = [];
    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration' && node.body) {
        bodies.push(node.body);
      } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.body) {
          bodies.push(node.declaration.body);
        } else if (node.declaration.type === 'ClassDeclaration' && node.declaration.body) {
          for (const m of node.declaration.body.body ?? []) {
            if (m.kind !== 'constructor' && m.value?.body) bodies.push(m.value.body);
          }
        }
      } else if (node.type === 'ClassDeclaration' && node.body) {
        for (const m of node.body.body ?? []) {
          if (m.kind !== 'constructor' && m.value?.body) bodies.push(m.value.body);
        }
      } else if (node.type === 'VariableDeclaration') {
        for (const decl of node.declarations ?? []) {
          if (decl.init && (decl.init.type === 'FunctionExpression' || decl.init.type === 'ArrowFunctionExpression')) {
            if (decl.init.body.type === 'BlockStatement') bodies.push(decl.init.body);
          }
        }
      }
    }
    let out = codeToParse;
    for (const b of bodies.sort((x, y) => y.start - x.start)) {
      out = out.slice(0, b.start) + `{ return ${value}; }` + out.slice(b.end);
    }
    return out;
  } catch {
    return codeToParse.replace(/\{[\s\S]*\}$/, `{ return ${value}; }`);
  }
}

/** Extracts function names and class definitions with methods from compiled code. */
export function extractFunctionAndClassInfo(compiledCode: string): {
  fnNames: string[];
  classes: { name: string; methods: string[] }[];
} {
  const fnNames: string[] = [];
  const classes: { name: string; methods: string[] }[] = [];
  let ast: { body: AcornNode[] } | null = null;
  try {
    ast = acorn.parse(compiledCode, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
  } catch {
    return { fnNames, classes };
  }

  for (const node of ast.body) {
    if (node.type === 'FunctionDeclaration' && node.id?.name) {
      fnNames.push(node.id.name);
    } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
      if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id?.name) {
        fnNames.push(node.declaration.id.name);
      } else if (node.declaration.type === 'ClassDeclaration' && node.declaration.id?.name) {
        const clsName = node.declaration.id.name;
        const methods: string[] = [];
        for (const m of node.declaration.body?.body ?? []) {
          if (m.kind !== 'constructor' && m.key?.name) methods.push(m.key.name);
        }
        classes.push({ name: clsName, methods });
      }
    } else if (node.type === 'ClassDeclaration' && node.id?.name) {
      const clsName = node.id.name;
      const methods: string[] = [];
      for (const m of node.body?.body ?? []) {
        if (m.kind !== 'constructor' && m.key?.name) methods.push(m.key.name);
      }
      classes.push({ name: clsName, methods });
    } else if (node.type === 'VariableDeclaration') {
      for (const decl of node.declarations ?? []) {
        if (decl.id?.name && decl.init && (decl.init.type === 'FunctionExpression' || decl.init.type === 'ArrowFunctionExpression')) {
          fnNames.push(decl.id.name);
        }
      }
    }
  }
  return { fnNames, classes };
}

/** Runs reference solution against testSuite, awaiting async returns and handling class methods. */
export async function getFirstReturnValues(
  solution: string,
  testSuite: string,
  fnNames: string[],
  classes: { name: string; methods: string[] }[] = [],
  language?: string
): Promise<Record<string, any>> {
  if (fnNames.length === 0 && classes.length === 0) return {};
  const isTsx = language === 'tsx';
  const comp = compileTsSync(solution, { jsx: isTsx });
  const codeToRun = comp.ok ? comp.js : solution;

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

  const fnSpies = fnNames
    .map(
      (name) => `
    if (typeof ${name} === 'function') {
      const __orig_${name} = ${name};
      let __called_${name} = false;
      ${name} = function(...args) {
        const res = __orig_${name}.apply(this, args);
        if (!__called_${name}) {
          __called_${name} = true;
          if (res && typeof res.then === 'function') {
            res.then(val => {
              try { __first_returns__[${JSON.stringify(name)}] = val; } catch {}
            }).catch(() => {});
          } else {
            try { __first_returns__[${JSON.stringify(name)}] = res; } catch {}
          }
        }
        return res;
      };
    }
  `
    )
    .join('\n');

  const classSpies = classes
    .map(
      (cls) => `
    if (typeof ${cls.name} === 'function' && ${cls.name}.prototype) {
      ${cls.methods
        .map(
          (m) => `
        if (typeof ${cls.name}.prototype[${JSON.stringify(m)}] === 'function') {
          const __orig_${cls.name}_${m} = ${cls.name}.prototype[${JSON.stringify(m)}];
          let __called_${cls.name}_${m} = false;
          ${cls.name}.prototype[${JSON.stringify(m)}] = function(...args) {
            const res = __orig_${cls.name}_${m}.apply(this, args);
            if (!__called_${cls.name}_${m}) {
              __called_${cls.name}_${m} = true;
              const k = ${JSON.stringify(`${cls.name}.${m}`)};
              if (res && typeof res.then === 'function') {
                res.then(val => {
                  try { __first_returns__[k] = val; } catch {}
                }).catch(() => {});
              } else {
                try { __first_returns__[k] = res; } catch {}
              }
            }
            return res;
          };
        }
      `
        )
        .join('\n')}
    }
  `
    )
    .join('\n');

  const harness = `
    const __first_returns__ = {};
    ${codeToRun}
    ${fnSpies}
    ${classSpies}
    (async () => {
      try {
        ${testSuite}
      } catch {}
      await new Promise(r => setTimeout(r, 60));
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

/** Builds constant answer from compiled code, stubbing functions and class methods. */
export function constantAnswer(
  starter: string,
  firstReturns: Record<string, any>,
  isJsx = false
): string {
  const comp = compileTsSync(starter, { jsx: isJsx });
  const codeToParse = comp.ok ? comp.js : starter;
  let ast: { body: AcornNode[] } | null = null;
  try {
    ast = acorn.parse(codeToParse, { ecmaVersion: 'latest', sourceType: 'module' }) as unknown as { body: AcornNode[] };
  } catch {
    return codeToParse;
  }
  if (!ast) return codeToParse;

  try {
    const replacements: { start: number; end: number; val: any }[] = [];

    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration' && node.id?.name && node.body) {
        if (node.id.name in firstReturns) {
          replacements.push({ start: node.body.start, end: node.body.end, val: firstReturns[node.id.name] });
        }
      } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id?.name && node.declaration.body) {
          if (node.declaration.id.name in firstReturns) {
            replacements.push({ start: node.declaration.body.start, end: node.declaration.body.end, val: firstReturns[node.declaration.id.name] });
          }
        } else if (node.declaration.type === 'ClassDeclaration' && node.declaration.id?.name) {
          const clsName = node.declaration.id.name;
          for (const m of node.declaration.body?.body ?? []) {
            if (m.kind !== 'constructor' && m.key?.name && m.value?.body) {
              const k = `${clsName}.${m.key.name}`;
              if (k in firstReturns) {
                replacements.push({ start: m.value.body.start, end: m.value.body.end, val: firstReturns[k] });
              }
            }
          }
        }
      } else if (node.type === 'ClassDeclaration' && node.id?.name) {
        const clsName = node.id.name;
        for (const m of node.body?.body ?? []) {
          if (m.kind !== 'constructor' && m.key?.name && m.value?.body) {
            const k = `${clsName}.${m.key.name}`;
            if (k in firstReturns) {
              replacements.push({ start: m.value.body.start, end: m.value.body.end, val: firstReturns[k] });
            }
          }
        }
      } else if (node.type === 'VariableDeclaration') {
        for (const decl of node.declarations ?? []) {
          if (decl.id?.name && decl.init && (decl.init.type === 'FunctionExpression' || decl.init.type === 'ArrowFunctionExpression')) {
            if (decl.id.name in firstReturns && decl.init.body.type === 'BlockStatement') {
              replacements.push({ start: decl.init.body.start, end: decl.init.body.end, val: firstReturns[decl.id.name] });
            }
          }
        }
      }
    }

    let out = codeToParse;
    for (const rep of replacements.sort((a, b) => b.start - a.start)) {
      const serialized = typeof rep.val === 'undefined' ? 'undefined' : JSON.stringify(rep.val);
      out = out.slice(0, rep.start) + `{ return ${serialized}; }` + out.slice(rep.end);
    }
    return out;
  } catch {
    return codeToParse;
  }
}

/** Counts distinct inputs passed to tested functions in a test suite. */
export function countDistinctInputs(testSuite: string): number {
  let ast: any;
  try {
    ast = acorn.parse(testSuite, { ecmaVersion: 'latest', sourceType: 'module' });
  } catch {
    try {
      ast = acorn.parse(testSuite, { ecmaVersion: 'latest', sourceType: 'script' });
    } catch {
      return 0;
    }
  }

  const calls: { callee: string; args: string }[] = [];
  function walk(node: any) {
    if (!node) return;
    if (node.type === 'CallExpression') {
      let calleeName: string | null = null;
      if (node.callee.type === 'Identifier') {
        calleeName = node.callee.name;
      } else if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier') {
        calleeName = node.callee.property.name;
      }
      
      const argsSrc = node.arguments.map((arg: any) => testSuite.slice(arg.start, arg.end).trim()).join(', ');
      if (calleeName) calls.push({ callee: calleeName, args: argsSrc });
    }
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (Array.isArray(child)) {
        for (const c of child) if (c && typeof c === 'object' && c.type) walk(c);
      } else if (child && typeof child === 'object' && child.type) {
        walk(child);
      }
    }
  }

  walk(ast);

  const ignored = new Set([
    'describe', 'it', 'test', 'expect', 'assert', 'log', 'error', 'warn', 'info',
    'stringify', 'indexOf', 'includes', 'join', 'split', 'slice', 'push', 'pop',
    'shift', 'unshift', 'forEach', 'map', 'filter', 'reduce', 'trim', 'toLowerCase',
    'toUpperCase', 'replace', 'match', 'has', 'get', 'set', 'add', 'clear', 'keys',
    'values', 'entries', 'round', 'floor', 'ceil', 'max', 'min', 'abs', 'Boolean',
    'Number', 'String', 'Array', 'Object', 'Error', 'TypeError', 'RangeError',
    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'render'
  ]);

  const byCallee = new Map<string, Set<string>>();
  for (const c of calls) {
    if (ignored.has(c.callee)) continue;
    if (!byCallee.has(c.callee)) byCallee.set(c.callee, new Set<string>());
    byCallee.get(c.callee)!.add(c.args);
  }

  let maxInputs = 0;
  for (const set of byCallee.values()) {
    if (set.size > maxInputs) {
      maxInputs = set.size;
    }
  }
  return maxInputs;
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

  const compiled = compileTsSync(code);
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

function loadSolutions(filename: string): Record<string, string> {
  const filePath = path.join(process.cwd(), 'tests/fixtures', path.basename(filename));
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('WEB_COURSES registry export exists and contains all 13 web courses', () => {
  assert.ok(Array.isArray(WEB_COURSES), 'WEB_COURSES must be an exported array');
  assert.equal(WEB_COURSES.length, 13, 'WEB_COURSES must include all 13 courses');
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

test('gradeWebTask catches constant-answer cheats in TypeScript and awaits async returns', async () => {
  const goodSuite = `
    if (multiply(2, 5) !== 10) throw new Error('2 * 5 !== 10');
    if (multiply(3, 4) !== 12) throw new Error('3 * 4 !== 12');
  `;
  const starter = 'function multiply(a: number, b: number): number {\n  return 0;\n}';
  const solution = 'function multiply(a: number, b: number): number {\n  return a * b;\n}';

  const compiledSolution = compileTsSync(solution).js;
  const compiledStarter = compileTsSync(starter).js;
  const { fnNames, classes } = extractFunctionAndClassInfo(compiledSolution);
  const firstReturns = await getFirstReturnValues(compiledSolution, goodSuite, fnNames, classes);
  assert.equal(firstReturns.multiply, 10);

  const constCode = constantAnswer(compiledStarter, firstReturns);
  const constResult = await gradeWebTask(constCode, goodSuite, 'typescript');
  assert.equal(constResult.passed, false, 'Constant answer returning 10 must fail on 3 * 4 = 12');
});

test('verify sre-web-assign-day-6 rejects junk dummy array', async () => {
  const day6 = SRE_WEB_30_DAYS_CONFIGS[5];
  assert.ok(day6, 'sre-web day 6 config must exist');
  const junk = 'function topologicalResourceSort(d: any): string[] { return ["dummy1", "dummy2"]; }';
  const res = await gradeWebTask(junk, day6.aTest, 'typescript');
  assert.equal(res.passed, false, 'sre-web-assign-day-6 must reject junk array ["dummy1", "dummy2"]');
});

test('task checks with fewer than 3 distinct inputs fail gate unless in KNOWN_LOW_INPUT_TASKS', () => {
  // 1. Verify gate catches synthetic check with fewer than 3 inputs
  const weakCheck = `
    if (calcSum(1, 2) !== 3) throw new Error('fail 1');
    if (calcSum(2, 3) !== 5) throw new Error('fail 2');
  `;
  assert.equal(countDistinctInputs(weakCheck), 2);
  assert.ok(countDistinctInputs(weakCheck) < 3, 'Must flag checks with fewer than 3 distinct inputs');

  // 2. Scan all courses to enforce that low-input tasks equal the KNOWN_LOW_INPUT_TASKS set
  const detectedLow: string[] = [];
  for (const course of WEB_COURSES) {
    for (let i = 0; i < course.configs.length; i++) {
      const cfg = course.configs[i];
      if (cfg.eLanguage !== 'html' && cfg.eLanguage !== 'css') {
        const id = `${course.prefix}-exam-day-${i + 1}`;
        if (countDistinctInputs(cfg.eTest || '') < 3) detectedLow.push(id);
      }
      if (cfg.aLanguage !== 'html' && cfg.aLanguage !== 'css') {
        const id = `${course.prefix}-assign-day-${i + 1}`;
        if (countDistinctInputs(cfg.aTest || '') < 3) detectedLow.push(id);
      }
    }
  }

  assert.deepEqual(
    detectedLow.sort(),
    Array.from(KNOWN_LOW_INPUT_TASKS).sort(),
    'Set of tasks with < 3 distinct inputs must exactly equal KNOWN_LOW_INPUT_TASKS (gate enforced)'
  );
});

for (const course of WEB_COURSES) {
  const solutions = loadSolutions(course.solutions);

  test(`${course.name}: expected days, practice tasks and reference answers`, () => {
    const expectedDays = course.courseId === 'course-fullstack-js' ? 120 : 30;
    assert.equal(course.configs.length, expectedDays, `${course.name} must have ${expectedDays} day configs`);
    for (let i = 0; i < course.configs.length; i++) {
      const solE = solutions[`${course.prefix}-exam-day-${i + 1}`];
      const solA = solutions[`${course.prefix}-assign-day-${i + 1}`];
      assert.ok(solE && solE.trim().length > 0, `Day ${i + 1} Practice 1 (exam) missing reference answer`);
      assert.ok(solA && solA.trim().length > 0, `Day ${i + 1} Practice 2 (assign) missing reference answer`);
    }
  });

  test(`${course.name}: every reference answer passes, starter and lazy answers fail`, async () => {
    for (let i = 0; i < course.configs.length; i++) {
      const cfg = course.configs[i];
      const tasks = [
        {
          name: 'Practice 1',
          id: `${course.prefix}-exam-day-${i + 1}`,
          starter: cfg.eStarter || '',
          check: cfg.eTest || '',
          lang: cfg.eLanguage || 'typescript',
          solution: solutions[`${course.prefix}-exam-day-${i + 1}`]!,
        },
        {
          name: 'Practice 2',
          id: `${course.prefix}-assign-day-${i + 1}`,
          starter: cfg.aStarter || '',
          check: cfg.aTest || '',
          lang: cfg.aLanguage || 'typescript',
          solution: solutions[`${course.prefix}-assign-day-${i + 1}`]!,
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

        // 3. Lazy answers fail (built from compiled code)
        if (t.lang !== 'html' && t.lang !== 'css') {
          for (const val of LAZY_RETURNS) {
            const lazyCode = lazyAnswer(t.starter, val, t.lang === 'tsx');
            const lazy = await gradeWebTask(lazyCode, t.check, t.lang);
            assert.ok(!lazy.passed, `${label}: passes when returning ${val}`);
          }
        }

        // 4. Constant answer fails (exempt tasks known to be constant until F-18)
        if (t.lang !== 'html' && t.lang !== 'css') {
          const isJsx = t.lang === 'tsx';
          const compSol = compileTsSync(t.solution, { jsx: isJsx });
          const { fnNames, classes } = extractFunctionAndClassInfo(compSol.js);
          if (fnNames.length > 0 || classes.length > 0) {
            const firstReturns = await getFirstReturnValues(t.solution, t.check, fnNames, classes, t.lang);
            if (Object.keys(firstReturns).length > 0) {
              const constCode = constantAnswer(t.starter || t.solution, firstReturns, isJsx);
              const constResult = await gradeWebTask(constCode, t.check, t.lang);
              if (!KNOWN_CONSTANT_TASKS.has(t.id)) {
                assert.ok(!constResult.passed, `${label}: passes with constant answer`);
              }
            }
          }
        }

        // 5. Input count check: fail if task check uses fewer than 3 distinct inputs
        if (t.lang !== 'html' && t.lang !== 'css') {
          const distinctInputs = countDistinctInputs(t.check);
          if (!KNOWN_LOW_INPUT_TASKS.has(t.id) && distinctInputs < 3) {
            assert.fail(`${label}: uses only ${distinctInputs} distinct inputs (requires >= 3)`);
          }
        }

        // 6. jsGuard check
        const forbiddenSolution = findForbiddenJs(t.solution);
        assert.equal(forbiddenSolution, null, `${label}: forbidden API found in solution: ${forbiddenSolution}`);
        const forbiddenCheck = findForbiddenJs(t.check);
        assert.equal(forbiddenCheck, null, `${label}: forbidden API found in check: ${forbiddenCheck}`);

        // 7. TS/TSX tasks compile
        if (t.lang === 'typescript' || t.lang === 'tsx') {
          const compiled = compileTsSync(t.solution, { jsx: t.lang === 'tsx' });
          assert.ok(compiled.ok, `${label}: solution failed to compile TypeScript: ${compiled.message}`);
        }
      }
    }
  });
}
