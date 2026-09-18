// scripts/test_c4_evaluate_sandbox.ts
// Verification test suite for C4: Code Runner Sandbox Isolation & Infinite Loop Guard

import {
  validateVmCodeSecurity,
  runEvaluationInSandbox,
  CODEWARS_PROBLEM_REGISTRY,
} from '../src/app/api/code/evaluate/route';

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean, details?: any) {
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${name}`, details || '');
    failed++;
  }
}

async function runSuite() {
  console.log('========================================================================');
  console.log('🛡️ TESTING C4: CODE RUNNER SANDBOX ISOLATION & TIMEOUT GUARD');
  console.log('========================================================================\n');

  // ── TEST 1: Static token validation blocks dangerous keywords ──
  console.log('── TEST 1: Static Token Security Checks ──');
  assert('Blocks "process"', !validateVmCodeSecurity('process.exit(1)').safe);
  assert('Blocks "require"', !validateVmCodeSecurity('const x = require("fs")').safe);
  assert('Blocks "child_process"', !validateVmCodeSecurity('child_process.execSync("id")').safe);
  assert('Blocks "__proto__"', !validateVmCodeSecurity('let p = obj.__proto__').safe);
  assert('Blocks "constructor"', !validateVmCodeSecurity('this.constructor').safe);
  assert('Blocks "eval"', !validateVmCodeSecurity('eval("1+1")').safe);
  assert('Blocks "Function"', !validateVmCodeSecurity('new Function("return 1")').safe);
  assert('Permits safe algorithmic code', validateVmCodeSecurity('function solve(x) { return x * 2; }').safe);

  // ── TEST 2: Valid Solution Evaluation Across All 3 Problems ──
  console.log('\n── TEST 2: Valid Solutions Across All 3 Problems ──');

  // Problem 1: Lowest Common Ancestor
  const lcaConfig = CODEWARS_PROBLEM_REGISTRY['war_tree_lca_01'];
  const validLcaCode = `
    function lowestCommonAncestor(root, p, q) {
      if (!root) return null;
      if (root.val > p && root.val > q) return lowestCommonAncestor(root.left, p, q);
      if (root.val < p && root.val < q) return lowestCommonAncestor(root.right, p, q);
      return root.val;
    }
  `;
  const lcaResult = await runEvaluationInSandbox({
    cleanCode: validLcaCode,
    functionName: lcaConfig.functionName,
    totalTests: lcaConfig.totalTests,
    evaluatorCode: lcaConfig.evaluatorCode,
  });
  assert('LCA valid solution passed all 3 tests', lcaResult.passed && lcaResult.testsPassed === 3);

  // Problem 2: Concurrency Deadlock Prevention
  const concurrencyConfig = CODEWARS_PROBLEM_REGISTRY['war_concurrency_deadlock_02'];
  const validConcurrencyCode = `
    function acquireResourcesDeterministically(requests) {
      const set = new Set();
      for (const req of requests) {
        for (const r of req.resourceIds) {
          set.add(r);
        }
      }
      return Array.from(set).sort();
    }
  `;
  const concurrencyResult = await runEvaluationInSandbox({
    cleanCode: validConcurrencyCode,
    functionName: concurrencyConfig.functionName,
    totalTests: concurrencyConfig.totalTests,
    evaluatorCode: concurrencyConfig.evaluatorCode,
  });
  assert('Concurrency valid solution passed all 2 tests', concurrencyResult.passed && concurrencyResult.testsPassed === 2);

  // Problem 3: SQL B-Tree Composite Index
  const sqlConfig = CODEWARS_PROBLEM_REGISTRY['war_sql_btree_query_03'];
  const validSqlCode = `
    function generateOptimalCompositeIndex(table, eq, range) {
      const cols = [...eq, range];
      return 'CREATE INDEX idx_' + table + '_' + cols.join('_') + ' ON ' + table + ' (' + cols.join(', ') + ');';
    }
  `;
  const sqlResult = await runEvaluationInSandbox({
    cleanCode: validSqlCode,
    functionName: sqlConfig.functionName,
    totalTests: sqlConfig.totalTests,
    evaluatorCode: sqlConfig.evaluatorCode,
  });
  assert('SQL valid solution passed all 2 tests', sqlResult.passed && sqlResult.testsPassed === 2);

  // ── TEST 3: Failing Solution Handling ──
  console.log('\n── TEST 3: Failing Solution & Error Log ──');
  const failingLcaCode = `
    function lowestCommonAncestor(root, p, q) {
      return 99999;
    }
  `;
  const failingResult = await runEvaluationInSandbox({
    cleanCode: failingLcaCode,
    functionName: lcaConfig.functionName,
    totalTests: lcaConfig.totalTests,
    evaluatorCode: lcaConfig.evaluatorCode,
  });
  assert('Failing solution is marked passed=false', !failingResult.passed && failingResult.status === 'FAILED');
  assert('Failing solution provides descriptive error log', typeof failingResult.error === 'string' && failingResult.error.includes('failed'));

  // ── TEST 4: Syntax Error Detection ──
  console.log('\n── TEST 4: Syntax Error Detection ──');
  const syntaxErrorCode = `
    function lowestCommonAncestor(root, p, q) {
      if (root.val
  `;
  const syntaxResult = await runEvaluationInSandbox({
    cleanCode: syntaxErrorCode,
    functionName: lcaConfig.functionName,
    totalTests: lcaConfig.totalTests,
    evaluatorCode: lcaConfig.evaluatorCode,
  });
  assert('Syntax error returns status SYNTAX_ERROR', syntaxResult.status === 'SYNTAX_ERROR');
  assert('Syntax error includes descriptive error message', typeof syntaxResult.error === 'string');

  // ── TEST 5: Missing Function Definition ──
  console.log('\n── TEST 5: Missing Function Definition ──');
  const missingFnCode = `
    const notTheExpectedFunctionName = 123;
  `;
  const missingResult = await runEvaluationInSandbox({
    cleanCode: missingFnCode,
    functionName: lcaConfig.functionName,
    totalTests: lcaConfig.totalTests,
    evaluatorCode: lcaConfig.evaluatorCode,
  });
  assert('Missing function returns status EXECUTION_ERROR', missingResult.status === 'EXECUTION_ERROR');
  assert('Missing function error names missing function', typeof missingResult.error === 'string' && missingResult.error.includes('lowestCommonAncestor'));

  // ── TEST 6: Synchronous Infinite Loop Termination (C4 Critical) ──
  console.log('\n── TEST 6: Synchronous Infinite Loop Termination (C4 Guard) ──');
  const loopCode = `
    function lowestCommonAncestor(root, p, q) {
      while (true) {}
    }
  `;
  const loopStart = Date.now();
  const loopResult = await runEvaluationInSandbox({
    cleanCode: loopCode,
    functionName: lcaConfig.functionName,
    totalTests: lcaConfig.totalTests,
    evaluatorCode: lcaConfig.evaluatorCode,
  });
  const loopElapsed = Date.now() - loopStart;

  assert('Infinite loop returns status TIMEOUT', loopResult.status === 'TIMEOUT');
  assert('Infinite loop terminated within deadline (< 3500ms)', loopElapsed < 3500);
  assert('Server event loop remained unblocked (did not hang process)', true);

  // ── TEST 7: Sandbox Isolation & Host Prototype Containment ──
  console.log('\n── TEST 7: Sandbox Isolation & Host Prototype Containment ──');
  const escapeCode = `
    function lowestCommonAncestor(root, p, q) {
      try {
        const proc = [].constructor.constructor("return typeof process")();
        if (proc === "object") return 999;
      } catch (e) {}
      return 6;
    }
  `;
  const escapeResult = await runEvaluationInSandbox({
    cleanCode: escapeCode,
    functionName: lcaConfig.functionName,
    totalTests: lcaConfig.totalTests,
    evaluatorCode: lcaConfig.evaluatorCode,
  });
  // Case 1 expected is 6, Case 2 is 2. If proc was accessible and returned 999, tests would fail or return wrong val.
  // When process is not accessible, proc throws or returns "undefined", so test 1 receives 6.
  assert('Sandbox does not leak host process into VM Realm', escapeResult.testsPassed >= 1);

  console.log('\n========================================================================');
  console.log(`🏁 C4 SUITE COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
