// scripts/test_production_killswitch.ts
import { executeJavaScriptSuite } from '../src/lib/code/runners/jsRunner';
import fs from 'fs';

console.log('========================================================================');
console.log('PHASE 1: PRODUCTION KILL-SWITCH & FAIL-CLOSED INTEGRITY TEST');
console.log('========================================================================\n');

(async () => {
  // 1. Functional assertion: student JS execution must be blocked with SECURITY_POLICY_ENFORCED
  const testCode = `
    function solution(a, b) {
      return a + b;
    }
  `;

  const result = await executeJavaScriptSuite(testCode, 'solution', [
    { input: '[2, 3]', output: '5', name: 'Addition Test' }
  ]);

  console.log('Execution Status:', result.status);
  console.log('All Passed:', result.allPassed);
  console.log('Error Message:', result.error);
  console.log('Terminal Logs:', result.terminalLogs);

  const isBlocked = result.status === 'RUNTIME_ERROR' &&
                    result.error?.includes('SECURITY_POLICY_ENFORCED') &&
                    result.allPassed === false;

  if (!isBlocked) {
    console.error('❌ FAIL: Kill switch did NOT block execution as required!');
    process.exit(1);
  }
  console.log('\n✅ [PASS] Host main-thread execution strictly blocked with SECURITY_POLICY_ENFORCED.');

  // 2. Source-code static analysis: verify no new Function or eval in jsRunner.ts
  const jsRunnerCode = fs.readFileSync('src/lib/code/runners/jsRunner.ts', 'utf8');
  const hasNewFunction = /new\s+Function\s*\(/.test(jsRunnerCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ''));
  const hasEval = /\beval\s*\(/.test(jsRunnerCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ''));

  if (hasNewFunction || hasEval) {
    console.error('❌ FAIL: Active dynamic code evaluation (new Function/eval) detected in jsRunner.ts!');
    process.exit(1);
  }
  console.log('✅ [PASS] Static scan confirms 0 active new Function(...) or eval(...) in jsRunner.ts.');

  console.log('\n========================================================================');
  console.log('PHASE 1 KILL-SWITCH INTEGRITY: 100% VERIFIED');
  console.log('========================================================================');
})();
