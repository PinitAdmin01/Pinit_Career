// Test Suite for P1-1: In-Browser Code Runner & Multi-Language Execution
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function transpileAndRequire(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const moduleObj = { exports: {} };
  const runner = new Function('module', 'exports', 'require', compiled.outputText);
  runner(moduleObj, moduleObj.exports, (modPath) => {
    if (modPath === './types' || modPath === '../types') return require('../src/lib/code/types');
    if (modPath === './runners/jsRunner') return require('../src/lib/code/runners/jsRunner');
    if (modPath === './runners/pythonRunner') return require('../src/lib/code/runners/pythonRunner');
    if (modPath === './runners/sqlRunner') return require('../src/lib/code/runners/sqlRunner');
    return require(modPath);
  });
  return moduleObj.exports;
}

const { executeJavaScriptSuite } = transpileAndRequire(path.join(__dirname, '../src/lib/code/runners/jsRunner.ts'));

let passed = 0;
let failed = 0;

function assert(testName, condition, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details:`, details);
    failed++;
  }
}

async function runTests() {
  console.log(`🧪 Running PinIT Code Runner Test Suite (P1-1)...\n`);

  // 1. JavaScript Correct Solution Test
  const validJsCode = `
    function solution(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return true;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
      }
      return true;
    }
  `;

  const jsTestCases = [
    { input: '[1, 2, 3, 4]', output: 'true', name: 'Sorted Array' },
    { input: '[5, 2, 1]', output: 'false', name: 'Unsorted Array' },
    { input: '[]', output: 'true', name: 'Empty Array' }
  ];

  const jsResult = await executeJavaScriptSuite(validJsCode, 'solution', jsTestCases, 3000);

  assert('JS valid solution passes all 3 test cases', jsResult.allPassed === true && jsResult.passedTests === 3);
  assert('JS status is SUCCESS', jsResult.status === 'SUCCESS');
  assert('JS outcomes record durationMs', jsResult.testOutcomes.every(o => typeof o.durationMs === 'number'));

  // 2. JavaScript Faulty Logic Test
  const faultyJsCode = `
    function solution(arr) {
      return false; // Always returns false
    }
  `;

  const faultyResult = await executeJavaScriptSuite(faultyJsCode, 'solution', jsTestCases, 3000);
  assert('JS faulty solution catches failed assertions', faultyResult.allPassed === false && faultyResult.failedTests > 0);
  assert('JS partial pass or error status assigned', faultyResult.status === 'PARTIAL_PASS' || faultyResult.status === 'RUNTIME_ERROR');

  // 3. JavaScript Syntax Error Trapping
  const syntaxErrJs = `function solution( { return 42; `;
  const syntaxResult = await executeJavaScriptSuite(syntaxErrJs, 'solution', jsTestCases, 3000);
  assert('JS syntax error is trapped safely without crashing process', syntaxResult.status === 'SYNTAX_ERROR');
  assert('JS syntax error message recorded in terminal logs', syntaxResult.terminalLogs.some(l => l.includes('SYNTAX ERROR')));

  // 4. JavaScript Multi-Argument Input (Tuple) Test
  const multiArgJs = `
    function add(a, b) {
      return a + b;
    }
  `;
  const tupleCases = [
    { input: '(10, 25)', output: '35', name: 'Add two numbers' },
    { input: '(-5, 5)', output: '0', name: 'Negative and positive' }
  ];

  const tupleResult = await executeJavaScriptSuite(multiArgJs, 'add', tupleCases, 3000);
  assert('JS parses tuple input arguments correctly', tupleResult.allPassed === true && tupleResult.passedTests === 2);

  // 5. JavaScript Deep Object / Array Equality
  const objectReturnJs = `
    function twoSum(nums, target) {
      const map = {};
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map[comp] !== undefined) return [map[comp], i];
        map[nums[i]] = i;
      }
      return [];
    }
  `;
  const twoSumCases = [
    { input: '([2, 7, 11, 15], 9)', output: '[0, 1]', name: 'Two Sum Target 9' }
  ];
  const objectResult = await executeJavaScriptSuite(objectReturnJs, 'twoSum', twoSumCases, 3000);
  assert('JS performs deep JSON array comparison successfully', objectResult.allPassed === true);

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
