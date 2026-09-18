import * as dotenv from 'dotenv';
dotenv.config();

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

import { POST as evaluateRoutePOST } from '../src/app/api/code/evaluate/route';
import { CodeWarsApiService } from '../src/lib/api/codeWarsApi';
import * as fs from 'fs';
import * as path from 'path';

async function runBlueprintFriend4Tests() {
  console.log('========================================================================');
  console.log('⚔️  VERIFYING FRIEND 4 MASTER BLUEPRINT: AI ENGINES & CODE EVALUATION (10/10)');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  const studentId = 'test_student_eval_01';
  const mockHeaders = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer demo-token-bypass',
  };

  // ── Task 4.1 & 4.3: POST /api/code/evaluate Route ──
  console.log('── Task 4.1 & 4.3: Route Test Harnesses, Auto-Pass Elimination & Syntax Guards ──');

  // Test 1: Problem 1 (war_tree_lca_01) Passing Code
  const validLcaCode = `
    function lowestCommonAncestor(root, p, q) {
      while (root) {
        if (p < root.val && q < root.val) root = root.left;
        else if (p > root.val && q > root.val) root = root.right;
        else return root.val;
      }
      return null;
    }
  `;
  const reqLcaPass = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_tree_lca_01',
      code: validLcaCode,
      language: 'typescript',
    }),
  });
  const resLcaPass = await evaluateRoutePOST(reqLcaPass as any);
  const dataLcaPass = await resLcaPass.json();
  assert(resLcaPass.status === 200, 'LCA passing code returns HTTP 200');
  assert(dataLcaPass.passed === true && dataLcaPass.status === 'SUCCESS', 'LCA passing code evaluates to SUCCESS');
  assert(dataLcaPass.testsPassed === 3 && dataLcaPass.totalTests === 3, 'LCA passes 3/3 test cases');

  // Test 2: Problem 1 (war_tree_lca_01) Failing Code
  const invalidLcaCode = `
    function lowestCommonAncestor(root, p, q) {
      return 999;
    }
  `;
  const reqLcaFail = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_tree_lca_01',
      code: invalidLcaCode,
      language: 'typescript',
    }),
  });
  const resLcaFail = await evaluateRoutePOST(reqLcaFail as any);
  const dataLcaFail = await resLcaFail.json();
  assert(resLcaFail.status === 200, 'LCA failing code returns HTTP 200');
  assert(dataLcaFail.passed === false && dataLcaFail.status === 'FAILED', 'LCA failing code returns FAILED status');
  assert(dataLcaFail.testsPassed < 3, 'LCA failing code does not pass all tests');

  // Test 3: Problem 2 (war_concurrency_deadlock_02) Passing Code
  const validConcurrencyCode = `
    function acquireResourcesDeterministically(requests) {
      const allIds = new Set();
      for (const r of requests) {
        for (const id of r.resourceIds) {
          allIds.add(id);
        }
      }
      return Array.from(allIds).sort();
    }
  `;
  const reqConcPass = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_concurrency_deadlock_02',
      code: validConcurrencyCode,
      language: 'typescript',
    }),
  });
  const resConcPass = await evaluateRoutePOST(reqConcPass as any);
  const dataConcPass = await resConcPass.json();
  assert(resConcPass.status === 200, 'Concurrency problem passing code returns HTTP 200');
  assert(dataConcPass.passed === true && dataConcPass.status === 'SUCCESS', 'Concurrency problem passes deterministically');
  assert(dataConcPass.testsPassed === 2 && dataConcPass.totalTests === 2, 'Concurrency passes 2/2 test cases');

  // Test 4: Problem 2 (war_concurrency_deadlock_02) Incorrect Code - ELIMINATE AUTO-PASS VERIFICATION
  const invalidConcurrencyCode = `
    function acquireResourcesDeterministically(requests) {
      // Returns wrong order: reversed or random
      return ['R9', 'R8'];
    }
  `;
  const reqConcFail = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_concurrency_deadlock_02',
      code: invalidConcurrencyCode,
      language: 'typescript',
    }),
  });
  const resConcFail = await evaluateRoutePOST(reqConcFail as any);
  const dataConcFail = await resConcFail.json();
  assert(resConcFail.status === 200, 'Concurrency problem incorrect code returns HTTP 200');
  assert(
    dataConcFail.passed === false && dataConcFail.status === 'FAILED',
    'CRITICAL: Concurrency problem incorrect code FAILS and does NOT auto-pass!'
  );
  assert(dataConcFail.testsPassed === 0, 'Zero tests passed on bogus concurrency solution');

  // Test 5: Problem 3 (war_sql_btree_query_03) Passing Code
  const validSqlCode = `
    function generateOptimalCompositeIndex(tableName, equalityCols, rangeCol) {
      const cols = [...equalityCols, rangeCol];
      const idxName = \`idx_\${tableName}_\${cols.join('_')}\`;
      return \`CREATE INDEX \${idxName} ON \${tableName} (\${cols.join(', ')});\`;
    }
  `;
  const reqSqlPass = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_sql_btree_query_03',
      code: validSqlCode,
      language: 'typescript',
    }),
  });
  const resSqlPass = await evaluateRoutePOST(reqSqlPass as any);
  const dataSqlPass = await resSqlPass.json();
  assert(resSqlPass.status === 200, 'SQL query optimizer passing code returns HTTP 200');
  assert(dataSqlPass.passed === true && dataSqlPass.status === 'SUCCESS', 'SQL query optimizer passes deterministically');
  assert(dataSqlPass.testsPassed === 2 && dataSqlPass.totalTests === 2, 'SQL query optimizer passes 2/2 test cases');

  // Test 6: Problem 3 (war_sql_btree_query_03) Incorrect Code - ELIMINATE AUTO-PASS VERIFICATION
  const invalidSqlCode = `
    function generateOptimalCompositeIndex(tableName, equalityCols, rangeCol) {
      return "SELECT * FROM dummy;";
    }
  `;
  const reqSqlFail = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_sql_btree_query_03',
      code: invalidSqlCode,
      language: 'typescript',
    }),
  });
  const resSqlFail = await evaluateRoutePOST(reqSqlFail as any);
  const dataSqlFail = await resSqlFail.json();
  assert(resSqlFail.status === 200, 'SQL query optimizer incorrect code returns HTTP 200');
  assert(
    dataSqlFail.passed === false && dataSqlFail.status === 'FAILED',
    'CRITICAL: SQL query optimizer incorrect code FAILS and does NOT auto-pass!'
  );

  // Test 7: Unknown Problem ID Rejection (Never Auto-Pass)
  const reqUnknown = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_unknown_hacks_999',
      code: 'function solve() { return true; }',
      language: 'typescript',
    }),
  });
  const resUnknown = await evaluateRoutePOST(reqUnknown as any);
  const dataUnknown = await resUnknown.json();
  assert(resUnknown.status === 400, 'Unknown problem ID rejected with HTTP 400');
  assert(
    dataUnknown.status === 'UNSUPPORTED_PROBLEM' && dataUnknown.error === 'UNSUPPORTED_PROBLEM',
    'Unknown problem returns UNSUPPORTED_PROBLEM status (never auto-passes)'
  );

  // Test 8: Non-JavaScript / Invalid Syntax Error Handling (Task 4.3)
  const reqSyntaxErr = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_tree_lca_01',
      code: 'def python_code_syntax():\n    return 42',
      language: 'typescript',
    }),
  });
  const resSyntaxErr = await evaluateRoutePOST(reqSyntaxErr as any);
  const dataSyntaxErr = await resSyntaxErr.json();
  assert(resSyntaxErr.status === 400, 'Invalid / non-JS syntax rejected with HTTP 400');
  assert(dataSyntaxErr.status === 'SYNTAX_ERROR', 'Invalid syntax returns SYNTAX_ERROR status');
  assert(typeof dataSyntaxErr.error === 'string' && dataSyntaxErr.error.includes('syntax'), 'Error message describes syntax error');

  // Test 9: Security Violation Tokens Guard
  const reqSecErr = new Request('http://localhost:3000/api/code/evaluate', {
    method: 'POST',
    headers: mockHeaders,
    body: JSON.stringify({
      problemId: 'war_tree_lca_01',
      code: 'const p = process.env; function lowestCommonAncestor() {}',
      language: 'typescript',
    }),
  });
  const resSecErr = await evaluateRoutePOST(reqSecErr as any);
  const dataSecErr = await resSecErr.json();
  assert(resSecErr.status === 400, 'Forbidden process access rejected with HTTP 400');
  assert(dataSecErr.status === 'SECURITY_VIOLATION', 'Forbidden token returns SECURITY_VIOLATION');

  // ── Task 4.2: CodeWarsApiService submitSolution & Zero new Function ──
  console.log('\n── Task 4.2: CodeWarsApiService Sandbox Delegation & Zero new Function ──');

  // Check codebase for zero raw new Function() in codeWarsApi.ts
  const apiFilePath = path.join(process.cwd(), 'src/lib/api/codeWarsApi.ts');
  const apiFileContent = fs.readFileSync(apiFilePath, 'utf-8');
  assert(
    !apiFileContent.includes('new Function('),
    'CRITICAL: Zero instances of raw new Function(...) in src/lib/api/codeWarsApi.ts'
  );

  // Test 10: submitSolution with war_tree_lca_01
  const match1 = CodeWarsApiService.startMatch(studentId, 'war_tree_lca_01', 'solo_speedrun');
  const lcaSub = await CodeWarsApiService.submitSolution({
    matchId: match1.id,
    studentId,
    code: validLcaCode,
    language: 'typescript',
    timeSpentSeconds: 30,
  });
  assert(lcaSub.passed === true && lcaSub.testsPassed === 3, 'CodeWarsApiService.submitSolution passes LCA valid solution');
  assert(!!lcaSub.evidenceRecordId, 'Evidence recorded for LCA victory');

  // Test 11: submitSolution with war_concurrency_deadlock_02
  const match2 = CodeWarsApiService.startMatch(studentId, 'war_concurrency_deadlock_02', 'solo_speedrun');
  const concSub = await CodeWarsApiService.submitSolution({
    matchId: match2.id,
    studentId,
    code: validConcurrencyCode,
    language: 'typescript',
    timeSpentSeconds: 40,
  });
  assert(concSub.passed === true && concSub.testsPassed === 2, 'CodeWarsApiService.submitSolution passes Concurrency solution');

  // Test 12: submitSolution with war_concurrency_deadlock_02 failure (fails, does not auto-pass)
  const match3 = CodeWarsApiService.startMatch(studentId, 'war_concurrency_deadlock_02', 'solo_speedrun');
  const concFailSub = await CodeWarsApiService.submitSolution({
    matchId: match3.id,
    studentId,
    code: invalidConcurrencyCode,
    language: 'typescript',
    timeSpentSeconds: 40,
  });
  assert(concFailSub.passed === false, 'CodeWarsApiService.submitSolution correctly fails invalid Concurrency solution');

  // Test 13: submitSolution with war_sql_btree_query_03
  const match4 = CodeWarsApiService.startMatch(studentId, 'war_sql_btree_query_03', 'solo_speedrun');
  const sqlSub = await CodeWarsApiService.submitSolution({
    matchId: match4.id,
    studentId,
    code: validSqlCode,
    language: 'typescript',
    timeSpentSeconds: 35,
  });
  assert(sqlSub.passed === true && sqlSub.testsPassed === 2, 'CodeWarsApiService.submitSolution passes SQL Optimizer solution');

  // Test 14: submitSolution with war_sql_btree_query_03 failure (fails, does not auto-pass)
  const match5 = CodeWarsApiService.startMatch(studentId, 'war_sql_btree_query_03', 'solo_speedrun');
  const sqlFailSub = await CodeWarsApiService.submitSolution({
    matchId: match5.id,
    studentId,
    code: invalidSqlCode,
    language: 'typescript',
    timeSpentSeconds: 35,
  });
  assert(sqlFailSub.passed === false, 'CodeWarsApiService.submitSolution correctly fails invalid SQL Optimizer solution');

  console.log('\n========================================================================');
  console.log(`🏁 BLUEPRINT FRIEND 4 SUITE RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBlueprintFriend4Tests().catch((err) => {
  console.error('Test execution crashed:', err);
  process.exit(1);
});
