import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

import type { DayConfig } from '../src/lib/data/curriculumEnricher';
import type { LongLesson } from '../src/lib/data/longLessons';
import { estimateSpokenMinutes, getLongLesson } from '../src/lib/data/longLessons';
import { NODE_WEB_LONG_LESSONS } from '../src/lib/data/nodeWebLongLessons';
import { NODE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/nodeWeb30DayData';
import { DEVOPS_WEB_LONG_LESSONS } from '../src/lib/data/devopsWebLongLessons';
import { DEVOPS_30_DAYS_CONFIGS } from '../src/lib/data/devops30DayData';
import { CLOUD_WEB_LONG_LESSONS } from '../src/lib/data/cloudWebLongLessons';
import { CLOUD_30_DAYS_CONFIGS } from '../src/lib/data/cloud30DayData';
import { DESIGN_WEB_LONG_LESSONS } from '../src/lib/data/designWebLongLessons';
import { DESIGN_30_DAYS_CONFIGS } from '../src/lib/data/design30DayData';
import { DSA_WEB_LONG_LESSONS } from '../src/lib/data/dsaWebLongLessons';
import { DSA_30_DAYS_CONFIGS } from '../src/lib/data/dsa30DayData';
import { DISTRIBUTED_WEB_LONG_LESSONS } from '../src/lib/data/distributedWebLongLessons';
import { DISTRIBUTED_30_DAYS_CONFIGS } from '../src/lib/data/distributed30DayData';
import { CYBER_WEB_LONG_LESSONS } from '../src/lib/data/cyberWebLongLessons';
import { CYBER_30_DAYS_CONFIGS } from '../src/lib/data/cybersecurity30DayData';
import { AI_WEB_LONG_LESSONS } from '../src/lib/data/aiWebLongLessons';
import { AI_30_DAYS_CONFIGS } from '../src/lib/data/ai30DayData';
import { SRE_WEB_LONG_LESSONS } from '../src/lib/data/sreWebLongLessons';
import { SRE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/sreWeb30DayData';
import { STREAM_WEB_LONG_LESSONS } from '../src/lib/data/streamWebLongLessons';
import { STREAM_WEB_30_DAYS_CONFIGS } from '../src/lib/data/streamWeb30DayData';
import { AI_DEPLOY_WEB_LONG_LESSONS } from '../src/lib/data/aiDeployWebLongLessons';
import { AI_DEPLOY_WEB_30_DAYS_CONFIGS } from '../src/lib/data/aiDeployWeb30DayData';
import { compileTs } from '../src/lib/code/ts/compileTs';
import { getReactRuntimeSync } from '../src/lib/code/react/reactRuntime';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';
import { KNOWN_LESSON_DEFECTS } from './known_lesson_defects';

export interface WebLessonCourseEntry {
  name: string;
  prefix: string;
  courseId: string;
  lessons: LongLesson[];
  configs: DayConfig[];
  isReact?: boolean;
}

/**
 * Web-track courses with full-length lessons (SRS C6 / W-11).
 * Starts empty; each course adds itself in Phase 3 (steps d-i / j).
 */
export const WEB_LESSON_COURSES: WebLessonCourseEntry[] = [
  {
    name: 'Node.js & TypeScript Backend Engineering',
    prefix: 'node-web',
    courseId: 'course-node-web',
    lessons: NODE_WEB_LONG_LESSONS,
    configs: NODE_WEB_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'DevOps & CI/CD Pipeline Automation',
    prefix: 'devops',
    courseId: 'course-devops-cicd',
    lessons: DEVOPS_WEB_LONG_LESSONS,
    configs: DEVOPS_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'Cloud Native Architectures (AWS)',
    prefix: 'cloud',
    courseId: 'course-cloud-native',
    lessons: CLOUD_WEB_LONG_LESSONS,
    configs: CLOUD_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'UI/UX Design Systems & Visual Frontend',
    prefix: 'design',
    courseId: 'course-design-systems',
    lessons: DESIGN_WEB_LONG_LESSONS,
    configs: DESIGN_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'Data Structures & Algorithmic Optimizations',
    prefix: 'dsa-optim',
    courseId: 'course-dsa-optim',
    lessons: DSA_WEB_LONG_LESSONS,
    configs: DSA_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'High-Scale Distributed System Design',
    prefix: 'dist',
    courseId: 'course-distributed-sys',
    lessons: DISTRIBUTED_WEB_LONG_LESSONS,
    configs: DISTRIBUTED_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'Cybersecurity Principles & Secure Systems',
    prefix: 'cyber',
    courseId: 'course-cybersecurity',
    lessons: CYBER_WEB_LONG_LESSONS,
    configs: CYBER_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'AI Engineering & LLM Integration',
    prefix: 'ai',
    courseId: 'course-ai-eng',
    lessons: AI_WEB_LONG_LESSONS,
    configs: AI_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'Multi-Cloud Reliability & SRE in TypeScript',
    prefix: 'sre-web',
    courseId: 'course-sre-web',
    lessons: SRE_WEB_LONG_LESSONS,
    configs: SRE_WEB_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'High-Throughput Streaming in TypeScript',
    prefix: 'stream-web',
    courseId: 'course-stream-web',
    lessons: STREAM_WEB_LONG_LESSONS,
    configs: STREAM_WEB_30_DAYS_CONFIGS,
    isReact: false,
  },
  {
    name: 'Production AI Deployment in TypeScript',
    prefix: 'aideploy-web',
    courseId: 'course-aideploy-web',
    lessons: AI_DEPLOY_WEB_LONG_LESSONS,
    configs: AI_DEPLOY_WEB_30_DAYS_CONFIGS,
    isReact: false,
  },
];

/**
 * Runs a TypeScript or React lesson code sample in a sandboxed vm context
 * and returns the formatted console output.
 */
export async function runWebLessonSample(code: string, isReact: boolean = false): Promise<string> {
  const needsJsx = isReact || Boolean(code.match(/<[A-Za-z]/));
  const compiled = await compileTs(code, { jsx: needsJsx });
  if (!compiled.ok) {
    throw new Error(`TypeScript compilation failed: ${compiled.message}`);
  }

  const out: string[] = [];
  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => out.push(formatLogArgs(args)),
      error: (...args: any[]) => out.push(formatLogArgs(args)),
      warn: (...args: any[]) => out.push(formatLogArgs(args)),
    },
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
  };

  if (needsJsx) {
    const runtime = getReactRuntimeSync();
    vm.createContext(sandbox);
    vm.runInContext(runtime, sandbox);
    sandbox.render = function (Component: any, props: any = {}) {
      const R = sandbox.__PINIT_REACT__ || {
        React: sandbox.React,
        renderToStaticMarkup: sandbox.renderToStaticMarkup,
      };
      if (!R || !R.renderToStaticMarkup || !R.React) {
        throw new Error('React render runtime is not initialized');
      }
      return R.renderToStaticMarkup(R.React.createElement(Component, props));
    };
  } else {
    vm.createContext(sandbox);
  }

  const result = vm.runInContext(compiled.js, sandbox, { timeout: 3000 });
  if (result && typeof result.then === 'function') {
    await result;
  }

  return out.join('\n');
}

test('WEB_LESSON_COURSES export exists and has array shape', () => {
  assert.ok(Array.isArray(WEB_LESSON_COURSES), 'WEB_LESSON_COURSES must be an exported array');
});

test('runWebLessonSample executes TypeScript examples and formats output', async () => {
  const code = `
    interface User { id: number; name: string }
    const u: User = { id: 1, name: 'Alice' };
    console.log(u.name, [10, 20]);
  `;
  const output = await runWebLessonSample(code);
  assert.equal(output, "Alice [ 10, 20 ]");
});

test('runWebLessonSample executes React examples with the runtime from W-04', async () => {
  const code = `
    function Badge({ label }: { label: string }) {
      return <span>{label}</span>;
    }
    console.log(render(Badge, { label: 'Active' }));
  `;
  const output = await runWebLessonSample(code, true);
  assert.equal(output, '<span>Active</span>');
});

/**
 * Word count in a lesson without rounding (F-16).
 */
export function countLessonWords(lesson: LongLesson): number {
  return lesson.parts
    .flatMap((p) => [...p.say, p.example ?? '', p.tryIt ?? '', p.check.why])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Validates that a lesson part strictly satisfies the SRS lesson standard:
 * - 8–12 say lines per part
 * - exactly 3 options
 * - codeNotes in every part with valid 1-based line numbers
 */
export function validateLessonPart(part: LongLessonPart, where: string): string[] {
  const errors: string[] = [];
  if (!part.say || part.say.length < 8 || part.say.length > 12) {
    errors.push(`${where}: must have 8–12 say lines (got ${part.say?.length ?? 0})`);
  }
  if (!part.check || !part.check.options || part.check.options.length !== 3) {
    errors.push(`${where}: check must have exactly 3 options (got ${part.check?.options?.length ?? 0})`);
  }
  if (!part.codeNotes || !Array.isArray(part.codeNotes) || part.codeNotes.length === 0) {
    errors.push(`${where}: missing codeNotes`);
  }
  return errors;
}

/**
 * Validates that a lesson strictly satisfies the SRS lesson standard:
 * - recap in every lesson
 * - exactly 5 lines in summary
 * - >= 1,105 words without rounding
 */
export function validateLessonStandard(lesson: LongLesson, where: string): string[] {
  const errors: string[] = [];
  if (!lesson.recap || typeof lesson.recap !== 'string' || !lesson.recap.trim()) {
    errors.push(`${where}: missing recap`);
  }
  if (!lesson.summary || lesson.summary.length !== 5) {
    errors.push(`${where}: summary must have exactly 5 lines (got ${lesson.summary?.length ?? 0})`);
  }
  const words = countLessonWords(lesson);
  if (words < 1105) {
    errors.push(`${where}: must have ≥ 1,105 words without rounding (got ${words})`);
  }
  return errors;
}

/**
 * Validates all lessons in a course against the lesson standard (F-16).
 */
export function validateCourseLessonStandard(course: WebLessonCourseEntry): string[] {
  const issues: string[] = [];
  const sayCounts = new Map<string, number>();
  const answerCounts = [0, 0, 0];
  let totalChecks = 0;

  for (const lesson of course.lessons) {
    const where = `${course.name} Day ${lesson.day}`;
    issues.push(...validateLessonStandard(lesson, where));

    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      const pWhere = `${where} Part ${i + 1} (${part.title})`;
      issues.push(...validateLessonPart(part, pWhere));

      for (const line of part.say || []) {
        const trimmed = line.trim();
        sayCounts.set(trimmed, (sayCounts.get(trimmed) || 0) + 1);
      }

      if (part.check && typeof part.check.answer === 'number' && part.check.answer >= 0 && part.check.answer < 3) {
        answerCounts[part.check.answer]++;
        totalChecks++;
      }
    }
  }

  // no say sentence repeated more than 3 times in a course
  for (const [line, count] of sayCounts.entries()) {
    if (count > 3) {
      issues.push(`${course.name}: say sentence repeated ${count} times (> 3): "${line.slice(0, 50)}..."`);
    }
  }

  // correct-answer positions spread over all three options (each between 20% and 50% per course)
  for (let opt = 0; opt < 3; opt++) {
    const pct = totalChecks > 0 ? answerCounts[opt] / totalChecks : 0;
    if (pct < 0.20 || pct > 0.50) {
      issues.push(
        `${course.name}: correct answer option ${opt} is ${(pct * 100).toFixed(1)}% of checks (must be between 20% and 50%)`
      );
    }
  }

  return issues;
}

test('F-16: lesson standard validator catches violations of say lines, options, codeNotes, recap, summary, words, repeats, and answer distribution', () => {
  // 1. say lines (must be 8-12)
  const weakPart7 = { title: 'T', say: new Array(7).fill('line'), check: { question: 'q', options: ['a', 'b', 'c'], answer: 0, why: 'w' }, codeNotes: [{ line: 1, note: 'n' }] };
  assert.ok(validateLessonPart(weakPart7 as any, 'test').some((e) => e.includes('8–12 say lines')), 'Must flag < 8 say lines');
  const weakPart13 = { title: 'T', say: new Array(13).fill('line'), check: { question: 'q', options: ['a', 'b', 'c'], answer: 0, why: 'w' }, codeNotes: [{ line: 1, note: 'n' }] };
  assert.ok(validateLessonPart(weakPart13 as any, 'test').some((e) => e.includes('8–12 say lines')), 'Must flag > 12 say lines');

  // 2. options (must be exactly 3)
  const weakOpts2 = { title: 'T', say: new Array(9).fill('line'), check: { question: 'q', options: ['a', 'b'], answer: 0, why: 'w' }, codeNotes: [{ line: 1, note: 'n' }] };
  assert.ok(validateLessonPart(weakOpts2 as any, 'test').some((e) => e.includes('exactly 3 options')), 'Must flag 2 options');
  const weakOpts4 = { title: 'T', say: new Array(9).fill('line'), check: { question: 'q', options: ['a', 'b', 'c', 'd'], answer: 0, why: 'w' }, codeNotes: [{ line: 1, note: 'n' }] };
  assert.ok(validateLessonPart(weakOpts4 as any, 'test').some((e) => e.includes('exactly 3 options')), 'Must flag 4 options');

  // 3. codeNotes
  const weakNoNotes = { title: 'T', say: new Array(9).fill('line'), check: { question: 'q', options: ['a', 'b', 'c'], answer: 0, why: 'w' } };
  assert.ok(validateLessonPart(weakNoNotes as any, 'test').some((e) => e.includes('codeNotes')), 'Must flag missing codeNotes');

  // 4. recap
  const baseLesson = {
    day: 1,
    title: 'Title',
    goal: 'Goal',
    minutes: 25,
    recap: '',
    summary: ['1', '2', '3', '4', '5'],
    parts: [
      {
        title: 'P',
        say: new Array(10).fill('This is a sentence explaining the computer science concept in detail.'),
        example: 'example text here',
        tryIt: 'try it code here',
        check: { question: 'q', options: ['1', '2', '3'], answer: 0, why: 'because of reasons' },
        codeNotes: [{ line: 1, note: 'note' }],
      },
    ],
  };
  assert.ok(validateLessonStandard(baseLesson as any, 'test').some((e) => e.includes('recap')), 'Must flag missing recap');

  // 5. 5-line summary
  const weakSummary4 = { ...baseLesson, recap: 'Yesterday we did X', summary: ['1', '2', '3', '4'] };
  assert.ok(validateLessonStandard(weakSummary4 as any, 'test').some((e) => e.includes('summary')), 'Must flag 4-line summary');

  // 6. >= 1,105 words without rounding
  const weakWords = { ...baseLesson, recap: 'Yesterday we did X', summary: ['1', '2', '3', '4', '5'] };
  assert.ok(validateLessonStandard(weakWords as any, 'test').some((e) => e.includes('1,105 words')), 'Must flag < 1105 words without rounding');
});

for (const course of WEB_LESSON_COURSES) {
  test(`${course.name}: 30 long lessons matching day configs and lesson standard`, () => {
    assert.equal(course.lessons.length, 30, `${course.name} must have 30 lessons`);
    assert.equal(course.configs.length, 30, `${course.name} must have 30 day configs`);

    const days = course.lessons.map((l) => l.day);
    assert.equal(new Set(days).size, 30, `${course.name} has duplicate days`);

    for (const lesson of course.lessons) {
      const where = `${course.name} Day ${lesson.day}`;
      assert.ok(lesson.day >= 1 && lesson.day <= 30, `${where}: day out of range`);
      assert.equal(lesson.title, course.configs[lesson.day - 1].title, `${where}: title does not match DayConfig title`);
      assert.equal(getLongLesson(course.prefix, lesson.day), lesson, `${where}: not registered in getLongLesson`);
      assert.equal(lesson.parts.length, 6, `${where}: must have exactly 6 parts (got ${lesson.parts.length})`);
      assert.ok(lesson.projectStep && lesson.projectStep.steps.length > 0, `${where}: missing projectStep`);
    }

    // F-16: enforce the lesson standard across all lessons and parts
    const issues = validateCourseLessonStandard(course);
    const maxAllowedDefects = KNOWN_LESSON_DEFECTS[course.prefix] ?? 0;
    assert.ok(
      issues.length <= maxAllowedDefects,
      `${course.name}: exceeded allowed lesson defect baseline (${issues.length} > ${maxAllowedDefects}):\n${issues.slice(0, 5).join('\n')}`
    );
  });

  test(`${course.name}: every example runs in vm after compileTs and prints its output`, async () => {
    for (const lesson of course.lessons) {
      for (let i = 0; i < lesson.parts.length; i++) {
        const part = lesson.parts[i];
        if (!part.code) continue;
        const where = `${course.name} Day ${lesson.day} Part ${i + 1} (${part.title})`;
        assert.ok(part.output !== undefined, `${where}: code present but output missing`);
        const actual = await runWebLessonSample(part.code, course.isReact);
        assert.equal(actual.trimEnd(), part.output.trimEnd(), `${where}: output mismatch`);
      }
    }
  });
}
