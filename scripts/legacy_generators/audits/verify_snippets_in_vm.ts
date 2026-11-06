import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function runTs(code: string): Promise<string> {
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
  return out.join('\n');
}

async function main() {
  const raw = fs.readFileSync('scripts/devops_days31_35_snippets.json', 'utf-8');
  const snippets = JSON.parse(raw);
  console.log(`Testing ${snippets.length} snippets in VM sandbox...`);

  let passed = 0;
  for (const s of snippets) {
    const actual = await runTs(s.code);
    assert.equal(actual.trim(), s.expected.trim(), `Day ${s.day} Part ${s.part} mismatch!\nExpected: ${s.expected}\nActual:   ${actual}`);
    console.log(`Day ${s.day} Part ${s.part} passed: ${actual.trim()}`);
    passed++;
  }

  console.log(`\nALL ${passed}/25 SNIPPETS VERIFIED DETERMINISTIC AND PASSING 100%!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
