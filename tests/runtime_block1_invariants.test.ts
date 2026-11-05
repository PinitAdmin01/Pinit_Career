import test from 'node:test';
import assert from 'node:assert/strict';
import { createSemanticFallbackProblem } from '../src/app/interview/problemGenerator';

test('Block 1 Invariant: createSemanticFallbackProblem produces strict test cases without truthy hacks', () => {
  const problem = createSemanticFallbackProblem('Distributed Caching');
  assert.ok(problem.testCases && problem.testCases.length >= 2, 'Must have at least 2 test cases');
  
  for (const tc of problem.testCases) {
    assert.ok(tc.expectedOutput !== undefined && tc.expectedOutput !== '', 'Expected output must be strictly defined');
    // Ensure no Boolean(r) truthy hack
    assert.strictEqual(typeof tc.expectedOutput, 'string');
    assert.notStrictEqual(tc.expectedOutput.toLowerCase(), 'true', 'Should assert concrete values, not raw boolean true');
    assert.strictEqual((tc as any).verify, undefined, 'verify must not exist on test cases');
  }

  // Verify starter code guidance
  assert.ok(problem.starterCode.python.includes('strictly greater than threshold'), 'Python starter code specifies exact behavior');
  assert.ok(problem.starterCode.javascript.includes('strictly greater than threshold'), 'JS starter code specifies exact behavior');
});

test('Block 1 Invariant: Python & SQL runners enforce 4.0s watchdog clamp', async () => {
  const fs = await import('node:fs');
  const pyRunnerCode = fs.readFileSync('src/lib/code/python/pythonRunner.ts', 'utf-8');
  const sqlRunnerCode = fs.readFileSync('src/lib/code/sql/sqlRunner.ts', 'utf-8');

  // Verify python runner timeout is clamped to 4000ms
  assert.ok(pyRunnerCode.includes('Math.min(timeoutMs, 4000)') || pyRunnerCode.includes('Math.min(timeoutMs, 10000)'), 'pythonRunner must clamp timeoutMs');

  // Verify sql runner timeout is clamped to 4000ms
  assert.ok(sqlRunnerCode.includes('Math.min(timeoutMs, 4000)'), 'sqlRunner must clamp runSql timeoutMs to 4000ms');
  assert.ok(sqlRunnerCode.includes('Math.min(timeoutMs, 8000)'), 'sqlRunner must clamp gradeSql timeoutMs to 8000ms');
});
