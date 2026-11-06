import vm from 'node:vm';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';
import fs from 'node:fs';

function runLikeSandbox(code: string): string {
  const out: string[] = [];
  const sandbox = { console: { log: (...args: unknown[]) => out.push(formatLogArgs(args)) }, URLSearchParams };
  vm.runInNewContext(code, sandbox, { timeout: 2000 });
  return out.join('\n');
}

// Read json export from python
const data = JSON.parse(fs.readFileSync('scripts/block8_all_days.json', 'utf-8'));

for (const dayObj of data) {
  console.log(`Checking Day ${dayObj.day}: ${dayObj.title}...`);
  for (let i = 0; i < 5; i++) {
    const part = dayObj.parts[i];
    const actual = runLikeSandbox(part.code);
    const expected = part.output;
    if (actual !== expected) {
      console.error(`MISMATCH Day ${dayObj.day} Part ${i + 1}!`);
      console.error('EXPECTED:\n', expected);
      console.error('ACTUAL:\n', actual);
      process.exit(1);
    }
  }
  console.log(`Day ${dayObj.day} sandbox outputs 100% matched!`);
}
console.log('All Days 36-40 sandbox verification passed!');
