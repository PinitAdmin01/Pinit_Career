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
import { compileTs } from '../src/lib/code/ts/compileTs';
import { getReactRuntimeSync } from '../src/lib/code/react/reactRuntime';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

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

for (const course of WEB_LESSON_COURSES) {
  test(`${course.name}: 30 long lessons matching day configs`, () => {
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
      const spokenMinutes = estimateSpokenMinutes(lesson);
      assert.ok(spokenMinutes >= 9.2, `${where}: spoken minutes (${spokenMinutes}) is less than 9.2`);
      assert.ok(lesson.summary && lesson.summary.length >= 3, `${where}: summary too short`);
      assert.ok(lesson.projectStep && lesson.projectStep.steps.length > 0, `${where}: missing projectStep`);

      for (const part of lesson.parts) {
        assert.ok(part.say && part.say.length >= 3, `${where} "${part.title}": teacher explanation too short`);
        assert.ok(part.example, `${where} "${part.title}": missing example`);
        assert.ok(part.tryIt, `${where} "${part.title}": missing tryIt`);
        const { options, answer } = part.check;
        assert.ok(options.length >= 2, `${where} "${part.title}": check must have at least 2 options`);
        assert.ok(answer >= 0 && answer < options.length, `${where} "${part.title}": invalid answer index`);
        assert.equal(new Set(options).size, options.length, `${where} "${part.title}": duplicate options`);
      }
    }
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
