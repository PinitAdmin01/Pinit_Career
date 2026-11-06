// scripts/test_devops_days41_45_snippets.ts
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

interface Snippet {
  day: number;
  part: number;
  title: string;
  code: string;
  expectedOutput: string;
}

const snippets: Snippet[] = JSON.parse(
  fs.readFileSync('scripts/devops_days41_45_snippets.json', 'utf-8')
);

console.log(`Verifying ${snippets.length} snippets in VM sandbox...`);

let passed = 0;
let failed = 0;

for (const s of snippets) {
  const transpiled = ts.transpileModule(s.code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  let captured = '';
  const sandbox = {
    console: {
      log: (...args: any[]) => {
        captured += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
      },
      error: (...args: any[]) => {
        captured += args.join(' ') + '\n';
      },
    },
    Buffer,
    setTimeout,
    clearTimeout,
  };

  try {
    vm.createContext(sandbox);
    vm.runInContext(transpiled, sandbox, { timeout: 3000 });

    const trimmedActual = captured.replace(/\r\n/g, '\n').trim();
    const trimmedExpected = s.expectedOutput.replace(/\r\n/g, '\n').trim();

    if (trimmedActual === trimmedExpected) {
      console.log(`[PASS] Day ${s.day} Part ${s.part}: ${s.title.slice(0, 45)}...`);
      passed++;
    } else {
      console.error(`[FAIL] Day ${s.day} Part ${s.part}: ${s.title}`);
      console.error(`  Expected: ${JSON.stringify(trimmedExpected)}`);
      console.error(`  Actual:   ${JSON.stringify(trimmedActual)}`);
      failed++;
    }
  } catch (err: any) {
    console.error(`[ERROR] Day ${s.day} Part ${s.part}: ${s.title}`);
    console.error(`  Execution Error:`, err.message);
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${snippets.length}`);
if (failed > 0) {
  process.exit(1);
}
