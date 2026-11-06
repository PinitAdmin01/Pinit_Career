import fs from 'node:fs';
import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function runSnippet(code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math,
    Map,
    Set,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON,
    Date
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n').trim();
}

async function main() {
  const snippets = JSON.parse(fs.readFileSync('scripts/devops_block8_snippets.json', 'utf-8'));
  let passed = 0;
  for (const s of snippets) {
    try {
      const actual = await runSnippet(s.code);
      if (actual === s.expectedOutput.trim()) {
        console.log(`Day ${s.day} Part ${s.part}: PASS`);
        passed++;
      } else {
        console.error(`Day ${s.day} Part ${s.part}: FAIL\n  Expected: ${s.expectedOutput}\n  Actual:   ${actual}`);
      }
    } catch (err) {
      console.error(`Day ${s.day} Part ${s.part}: ERROR`, err);
    }
  }
  console.log(`Total Passed: ${passed}/${snippets.length}`);
}

main();
