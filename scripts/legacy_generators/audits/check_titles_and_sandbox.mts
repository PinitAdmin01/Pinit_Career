import vm from 'node:vm';
import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

function runLikeSandbox(code: string): string {
  const out: string[] = [];
  const sandbox = { console: { log: (...args: unknown[]) => out.push(formatLogArgs(args)) }, URLSearchParams };
  vm.runInNewContext(code, sandbox, { timeout: 2000 });
  return out.join('\n');
}

console.log('--- CHECKING TITLES ---');
for (let d = 46; d <= 50; d++) {
  const lesson = REACT_LONG_LESSONS.find(l => l.day === d);
  const cfg = REACT_30_DAYS_CONFIGS[d - 1];
  console.log(`Day ${d}:`);
  console.log('  Lesson:', lesson?.title);
  console.log('  Config:', cfg?.title);
  console.log('  Match:', lesson?.title === cfg?.title);
}

console.log('\n--- CHECKING SANDBOX CODE OUTPUTS ---');
for (let d = 46; d <= 50; d++) {
  const lesson = REACT_LONG_LESSONS.find(l => l.day === d);
  if (!lesson) continue;
  for (let i = 0; i < 5; i++) {
    const p = lesson.parts[i];
    const actual = runLikeSandbox(p.code);
    const expected = p.output;
    if (actual !== expected) {
      console.log(`MISMATCH Day ${d} Part ${i + 1}:`);
      console.log('Actual:\n', actual);
      console.log('Expected:\n', expected);
    } else {
      console.log(`MATCH Day ${d} Part ${i + 1}`);
    }
  }
}
