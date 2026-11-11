import test from 'node:test';
import assert from 'node:assert/strict';
import { runTestSuite } from '../src/lib/code/codeRunner';
import { VirtualBashSession } from '../src/lib/code/runners/bashRunner';
import { inspectCppSource, executeCppSuite } from '../src/lib/code/runners/cppRunner';
import { getLangInfo } from '../src/components/quests/workspace/useWorkspaceState';

test('Bash Runner: Virtual POSIX shell handles basic filesystem commands', () => {
  const session = new VirtualBashSession();

  const res1 = session.execute('pwd');
  assert.equal(res1.exitCode, 0);
  assert.equal(res1.stdout, '/home/student/workspace');

  const res2 = session.execute('mkdir -p src/utils');
  assert.equal(res2.exitCode, 0);

  const res3 = session.execute('echo "export const PORT = 3000;" > src/utils/config.ts');
  assert.equal(res3.exitCode, 0);

  const res4 = session.execute('cat src/utils/config.ts');
  assert.equal(res4.exitCode, 0);
  assert.ok(res4.stdout.includes('PORT = 3000'));

  const res5 = session.execute('ls src/utils');
  assert.equal(res5.exitCode, 0);
  assert.ok(res5.stdout.includes('config.ts'));
});

test('Bash Runner: Pipeline processing and filters (grep, wc, sort)', () => {
  const session = new VirtualBashSession();

  const script = `
echo "banana" > fruits.txt
echo "apple" >> fruits.txt
echo "cherry" >> fruits.txt
cat fruits.txt | sort
`;
  const res = session.execute(script);
  assert.equal(res.exitCode, 0);
  const lines = res.stdout.trim().split('\n');
  assert.equal(lines[0], 'apple');
  assert.equal(lines[1], 'banana');
  assert.equal(lines[2], 'cherry');

  const grepRes = session.execute('cat fruits.txt | grep an');
  assert.equal(grepRes.exitCode, 0);
  assert.ok(grepRes.stdout.includes('banana'));
  assert.equal(grepRes.stdout.includes('apple'), false);
});

test('Universal Runner: Dispatches bash test suites correctly', async () => {
  const bashScript = `
echo "42"
`;
  const result = await runTestSuite(bashScript, 'bash', {
    testCases: [
      {
        input: '',
        output: '42',
        name: 'Check Output Value'
      }
    ]
  });

  assert.equal(result.language, 'bash');
  assert.equal(result.allPassed, true);
  assert.equal(result.passedTests, 1);
  assert.equal(result.failedTests, 0);
});

test('C++ Runner: AST structural inspector identifies signatures, pointers and return types', () => {
  const cppCode = `
#include <iostream>
#include <vector>

int calculateSum(const std::vector<int>& nums) {
    int sum = 0;
    for (int n : nums) {
        sum += n;
    }
    return sum;
}
`;
  const report = inspectCppSource(cppCode, 'calculateSum');
  assert.equal(report.hasValidSignature, true);
  assert.equal(report.hasReturn, true);
  assert.equal(report.hasHeaders, true);
  assert.equal(report.hasLoopsOrRecursion, true);
  assert.equal(report.usesPointersOrReferences, true);
  assert.equal(report.syntaxViolations.length, 0);
});

test('Universal Runner: Dispatches C++ test suites and fails closed without a C++ compiler (zero fake pass)', async () => {
  const validCpp = `
#include <iostream>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
`;
  const staticRes = await executeCppSuite(validCpp, 'fibonacci');
  assert.equal(staticRes.language, 'cpp');
  assert.equal(staticRes.allPassed, true);

  const result = await runTestSuite(validCpp, 'cpp', {
    fnName: 'fibonacci',
    testCases: [
      {
        input: '5',
        output: '5',
        name: 'Fibonacci base case'
      }
    ]
  } as any);

  assert.equal(result.language, 'cpp');
  assert.equal(result.allPassed, false);
  assert.equal(result.passedTests, 0);
  assert.equal(result.status, 'RUNTIME_ERROR');
  assert.ok(result.terminalLogs.some(log => log.includes('FAIL-CLOSED')));
});

test('Workspace State: Correctly resolves bash and cpp file configurations', () => {
  const bashInfo = getLangInfo('cli-task-1', { language: 'bash' });
  assert.equal(bashInfo.file, 'script.sh');
  assert.equal(bashInfo.language, 'bash');
  assert.ok(bashInfo.label.includes('POSIX'));

  const cppInfo = getLangInfo('iot-cpp-1', { language: 'cpp' });
  assert.equal(cppInfo.file, 'solution.cpp');
  assert.equal(cppInfo.language, 'cpp');
  assert.ok(cppInfo.label.includes('C++'));
});
