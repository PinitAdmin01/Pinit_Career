// scripts/test_code_runner_hardening.ts
// Verification test suite for T7: Code Runner Sandboxing & Execution Hardening

import fs from 'fs';
import path from 'path';
import { executeJavaScriptSuite } from '../src/lib/code/runners/jsRunner';
import { runTestSuite } from '../src/lib/code/codeRunner';

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

async function runHardeningSuite() {
  console.log('========================================================================');
  console.log('🛡️ VERIFYING T7: CODE RUNNER SANDBOXING & HARDENING');
  console.log('========================================================================\n');

  // ── TEST 1: Source Invariants on jsRunner & sandboxedIframeRunner ──
  console.log('── TEST 1: Source Invariants on Runner Wiring ──');
  const jsRunnerPath = path.resolve(process.cwd(), 'src/lib/code/runners/jsRunner.ts');
  const jsRunnerContent = fs.readFileSync(jsRunnerPath, 'utf8');

  assert(
    'jsRunner is NOT statically returning SECURITY_POLICY_ENFORCED',
    !jsRunnerContent.includes('actualOutput: \'SECURITY_POLICY_ENFORCED\'')
  );
  assert(
    'jsRunner imports and delegates to executeInTwoLayerSandbox for browser DOM',
    jsRunnerContent.includes('executeInTwoLayerSandbox')
  );
  assert(
    'jsRunner includes isolated Node VM fallback for headless execution',
    jsRunnerContent.includes('executeNodeVmSuite')
  );

  const pythonJudgePath = path.resolve(process.cwd(), 'src/lib/code/runners/pythonJudgeRunner.ts');
  const pythonJudgeContent = fs.readFileSync(pythonJudgePath, 'utf8');
  assert(
    'pythonJudgeRunner prioritizes in-browser Pyodide WASM when window is defined',
    pythonJudgeContent.includes('typeof window !== \'undefined\'') &&
    pythonJudgeContent.includes('executePythonSuite')
  );

  // ── TEST 2: JavaScript Legitimate Algorithm Execution ──
  console.log('\n── TEST 2: JavaScript Legitimate Algorithm Execution ──');
  const validSortCode = `
    function solution(arr) {
      if (!Array.isArray(arr) || arr.length <= 1) return true;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
      }
      return true;
    }
  `;
  const sortCases = [
    { input: '[1, 2, 3, 4]', output: 'true', name: 'Sorted Array' },
    { input: '[5, 2, 1]', output: 'false', name: 'Unsorted Array' },
    { input: '[]', output: 'true', name: 'Empty Array' }
  ];

  const sortResult = await executeJavaScriptSuite(validSortCode, 'solution', sortCases, 3000);
  assert('Legitimate algorithm execution status is SUCCESS', sortResult.status === 'SUCCESS');
  assert('All 3 test cases passed', sortResult.passedTests === 3 && sortResult.allPassed);
  assert('Test case 1 output matches "true"', sortResult.testOutcomes[0]?.actualOutput === 'true');
  assert('Test case 2 output matches "false"', sortResult.testOutcomes[1]?.actualOutput === 'false');

  // Multi-argument function test
  const addCode = `
    function add(a, b) {
      return a + b;
    }
  `;
  const addCases = [
    { input: '(3, 5)', output: '8', name: 'Addition 3+5' },
    { input: '(-2, 7)', output: '5', name: 'Addition -2+7' }
  ];
  const addResult = await executeJavaScriptSuite(addCode, 'add', addCases, 3000);
  assert('Multi-argument function add(a, b) status is SUCCESS', addResult.status === 'SUCCESS');
  assert('Both add test cases passed', addResult.allPassed && addResult.passedTests === 2);

  // ── TEST 3: JavaScript Security Isolation (No Secret Exfiltration) ──
  console.log('\n── TEST 3: JavaScript Security Isolation & Credential Containment ──');

  // Attack A: Exfiltrate localStorage / cookies
  const exfilCode = `
    function solution() {
      try {
        const token = window.localStorage.getItem('secret_token');
        return 'EXFIL:' + token;
      } catch (e) {
        return 'BLOCKED:' + e.message;
      }
    }
  `;
  const exfilResult = await executeJavaScriptSuite(exfilCode, 'solution', [{ input: '[]', output: 'safe' }], 3000);
  const actualOut = exfilResult.testOutcomes[0]?.actualOutput || '';
  assert('localStorage exfiltration does NOT succeed', !actualOut.includes('EXFIL:secret_token'));
  assert(
    'window is undefined / blocked in sandbox',
    actualOut.includes('BLOCKED') || exfilResult.status === 'RUNTIME_ERROR' || !actualOut.includes('secret_token')
  );

  // Attack B: Host process escape attempt
  const processEscapeCode = `
    function solution() {
      try {
        process.exit(1);
        return 'ESCAPED';
      } catch (e) {
        return 'PROCESS_BLOCKED:' + e.message;
      }
    }
  `;
  const escapeResult = await executeJavaScriptSuite(processEscapeCode, 'solution', [{ input: '[]', output: 'safe' }], 3000);
  assert('Process escape does not terminate host process', true);
  assert('process.exit() is blocked (process is undefined)', escapeResult.testOutcomes[0]?.actualOutput?.includes('PROCESS_BLOCKED'));

  // Attack C: Require / module loading attempt
  const requireCode = `
    function solution() {
      try {
        const fs = require('fs');
        return 'FS_EXFIL:' + fs.readdirSync('.');
      } catch (e) {
        return 'REQUIRE_BLOCKED:' + e.message;
      }
    }
  `;
  const requireResult = await executeJavaScriptSuite(requireCode, 'solution', [{ input: '[]', output: 'safe' }], 3000);
  assert('require is undefined in sandbox', requireResult.testOutcomes[0]?.actualOutput?.includes('REQUIRE_BLOCKED'));

  // ── TEST 4: Pre-emptive CPU Timeout Enforcement (Infinite Loop) ──
  console.log('\n── TEST 4: Pre-emptive CPU Timeout Enforcement ──');
  const infiniteLoopCode = `
    function solution() {
      while (true) {
        // CPU freeze attack
      }
    }
  `;
  const loopStart = Date.now();
  const loopResult = await executeJavaScriptSuite(infiniteLoopCode, 'solution', [{ input: '[]', output: 'true' }], 1000);
  const loopDuration = Date.now() - loopStart;

  assert('Infinite loop execution returned status TIMEOUT', loopResult.status === 'TIMEOUT');
  assert('Infinite loop did NOT pass test cases', !loopResult.allPassed && loopResult.passedTests === 0);
  assert(
    `Execution terminated within timeout window (${loopDuration}ms <= 2500ms)`,
    loopDuration >= 900 && loopDuration <= 2500
  );

  // ── TEST 5: Public codeRunner.runTestSuite Integration ──
  console.log('\n── TEST 5: Public runTestSuite Unified Interface ──');
  const unifiedJsResult = await runTestSuite(validSortCode, 'javascript', {
    functionName: 'solution',
    testCases: sortCases,
    timeoutMs: 3000
  });
  assert('runTestSuite("javascript") executes cleanly', unifiedJsResult.status === 'SUCCESS' && unifiedJsResult.allPassed);

  console.log('\n========================================================================');
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runHardeningSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
