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
const data = JSON.parse(fs.readFileSync('scripts/block9_all_days.json', 'utf-8'));

let hasMismatch = false;

for (const dayObj of data) {
  console.log(`Checking Day ${dayObj.day}: ${dayObj.title}...`);
  for (let i = 0; i < 5; i++) {
    const part = dayObj.parts[i];
    const actual = runLikeSandbox(part.code);
    const expected = part.output;
    if (actual !== expected) {
      console.warn(`Mismatch in Day ${dayObj.day} Part ${i + 1} (${part.title})!`);
      console.warn('EXPECTED:\n', expected);
      console.warn('ACTUAL:\n', actual);
      part.output = actual;
      hasMismatch = true;
    }
  }
}

if (hasMismatch) {
  console.log('Writing back normalized outputs to scripts/block9_all_days.json...');
  fs.writeFileSync('scripts/block9_all_days.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('Outputs normalized successfully.');
} else {
  console.log('All 25 code snippets in Days 41-45 matched 100% on the first pass!');
}
