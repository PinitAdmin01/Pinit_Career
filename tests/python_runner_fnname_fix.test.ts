import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { runTestSuite } from '../src/lib/code/codeRunner';
import { Round2Coding } from '../src/app/interview/components/Round2Coding';

const FIVE_TIER_CASES = [
  { input: '([10, 50, 75, 100], 50)', output: '3', expectedOutput: '3', name: '[T1: Standard] Standard Filtering Test' },
  { input: '([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 50)', output: '6', expectedOutput: '6', name: '[T2: Scale] Large Scale Batch Filtering Test' },
  { input: '([], 10)', output: '0', expectedOutput: '0', name: '[T3: Zero/Empty] Empty Input Dataset Test' },
  { input: '([-50, -10, 0, 10], -10)', output: '3', expectedOutput: '3', name: '[T4: Edge Values] Negative & Exact Threshold Boundary Test' },
  { input: '([10, 20, 30], 100)', output: '0', expectedOutput: '0', name: '[T5: Complexity] Zero Matches Full-Scan Test' },
];

describe('Python Round 2 Interview Runner — Function Name & 5-Tier Execution Fix', () => {
  it('passes all 5 tiers for exact user Python code with non-solution functionName (full_stack_software_deve)', async () => {
    const userCode = [
      'def full_stack_software_deve(items, threshold):',
      '    if not items:',
      '        return 0',
      '    return sum(1 for item in items if item >= threshold)',
    ].join('\n');

    const res = await runTestSuite(userCode, 'python', {
      functionName: 'full_stack_software_deve',
      testCases: FIVE_TIER_CASES,
      timeoutMs: 5000,
    });

    assert.equal(res.allPassed, true, `Expected all 5 tiers to pass, got logs: ${res.terminalLogs.join(' | ')}`);
    assert.equal(res.totalTests, 5);
    assert.equal(res.passedTests, 5);
    assert.equal(res.failedTests, 0);
  });

  it('handles Python booleans, None, and single-quoted string inputs cleanly via json.loads', async () => {
    const code = [
      'def count_flags(items, target, tag):',
      '    return sum(1 for x in items if x is target) + (1 if tag == "ok" else 0)',
    ].join('\n');

    const res = await runTestSuite(code, 'python', {
      functionName: 'count_flags',
      testCases: [
        { input: "([True, False, None, True], True, 'ok')", output: '3', name: 'Booleans & None' },
        { input: '([true, null, null], null, "no")', output: '2', name: 'JSON true/null literals' },
      ],
      timeoutMs: 5000,
    });

    assert.equal(res.allPassed, true, `Expected boolean/None tests to pass, got: ${res.terminalLogs.join(' | ')}`);
    assert.equal(res.passedTests, 2);
  });

  it('rejects starter stub (return 0) accurately on non-zero tiers without false positives', async () => {
    const stubCode = [
      'def full_stack_software(items, threshold):',
      '    return 0',
    ].join('\n');

    const res = await runTestSuite(stubCode, 'python', {
      functionName: 'full_stack_software',
      testCases: FIVE_TIER_CASES,
      timeoutMs: 5000,
    });

    assert.equal(res.allPassed, false);
    assert.equal(res.passedTests, 2, 'Only empty and zero-match tiers should pass for return 0');
    assert.equal(res.failedTests, 3);
  });

  it('fails with NameError when expected custom functionName is completely missing', async () => {
    const wrongFnCode = [
      'def completely_different_name(items, threshold):',
      '    return 0',
    ].join('\n');

    const res = await runTestSuite(wrongFnCode, 'python', {
      functionName: 'full_stack_software',
      testCases: [FIVE_TIER_CASES[2]],
      timeoutMs: 5000,
    });

    assert.equal(res.allPassed, false);
    assert.equal(res.passedTests, 0);
    assert.ok(
      res.terminalLogs.join(' ').includes("Function 'full_stack_software' was not defined"),
      `Expected clear NameError mentioning full_stack_software, got: ${res.terminalLogs.join(' | ')}`
    );
  });

  it('Round2Coding renders inline Submit & 5-Q Defense + Next Challenge controls immediately after 5/5 pass', () => {
    const html = renderToStaticMarkup(
      React.createElement(Round2Coding, {
        domainStream: 'tech',
        currentCodingProb: {
          title: 'Full-Stack Software Developer Algorithmic Pipeline & Data Optimizer',
          description: 'Count items >= threshold in O(N) time.',
          starterCode: 'def full_stack_software(items, threshold):\n    return 0',
          testCases: FIVE_TIER_CASES,
        },
        testOutcomes: FIVE_TIER_CASES.map((tc, idx) => ({
          index: idx + 1,
          testCaseName: tc.name,
          passed: true,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.expectedOutput,
        })),
        onProceed: () => {},
        onReviewSolution: () => {},
        onRetryChallenge: () => {},
        canProceed: false,
        codeSubmitted: true,
        codeRunFailed: false,
        codeReviewStarted: false,
        codeReviewQuestionReady: false,
        defenseState: null,
        isSendingInterviewMessage: false,
        lastInterviewerSpeech: 'Welcome to Round 2.',
        manualTextInput: '',
        setManualTextInput: () => {},
        onSendMessage: () => {},
        selectedLang: 'python',
        setSelectedLang: () => {},
        runCodeAndTests: () => {},
        isRunning: false,
        codeContent: 'def full_stack_software(items, threshold):\n    return sum(1 for x in items if x >= threshold)',
        setCodeContent: () => {},
        codeModifiedRef: { current: true },
        activeTeacher: { id: 'rohan', name: 'Mr. Rohan', emoji: '⚡', title: 'Evaluator' },
        animState: 'idle',
        terminalLogs: ['All 5 tiers passed'],
        setTerminalLogs: () => {},
      })
    );

    assert.ok(html.includes('data-testid="round2-banner-submit-btn"'), 'Must show inline Submit & Start 5-Q Defense button inside the green banner');
    assert.ok(html.includes('data-testid="round2-banner-next-challenge-btn"'), 'Must show inline Next Challenge button inside the green banner');
    assert.ok(html.includes('data-testid="round2-toolbar-submit-btn"'), 'Must show Submit & Defend button right beside Run Code & Tests');
  });
});
