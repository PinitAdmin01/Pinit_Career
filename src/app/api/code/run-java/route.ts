import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { code, testSuite, stdin, timeoutMs = 3000 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing Java source code' }, { status: 400 });
    }

    if (code.length > 50000) {
      return NextResponse.json({ error: 'Source code exceeds size limit (50KB max)' }, { status: 400 });
    }

    const forbiddenPatterns = [
      /Runtime\.getRuntime\(\)\.exec/,
      /ProcessBuilder/,
      /System\.exit/,
      /java\.lang\.reflect/
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(code)) {
        return NextResponse.json({
          language: 'java',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'RUNTIME_ERROR',
          totalDurationMs: Date.now() - startTime,
          terminalLogs: [
            '[SECURITY GUARD] Restricted Java API detected. Process spawning and reflection are disallowed in the sandbox.'
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Security Sandbox Check',
            input: 'Forbidden API',
            expectedOutput: 'Clean Execution',
            actualOutput: 'Security Violation',
            passed: false,
            durationMs: Date.now() - startTime
          }]
        });
      }
    }

    const runId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(os.tmpdir(), 'pinit_java_' + runId);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      fs.writeFileSync(path.join(tempDir, 'Solution.java'), code, 'utf8');

      const testCode = testSuite && testSuite.trim()
        ? testSuite
        : `public class Test { public static void main(String[] args) { Solution.main(new String[]{}); } }`;
      fs.writeFileSync(path.join(tempDir, 'Test.java'), testCode, 'utf8');

      const compilePromise = new Promise<{ success: boolean; stderr?: string }>((resolve) => {
        exec('javac -encoding UTF-8 Solution.java Test.java', { cwd: tempDir, timeout: 5000 }, (error, stdout, stderr) => {
          if (error || stderr) {
            resolve({ success: false, stderr: stderr || error?.message });
          } else {
            resolve({ success: true });
          }
        });
      });

      const compileResult = await compilePromise;

      if (!compileResult.success) {
        return NextResponse.json({
          language: 'java',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'SYNTAX_ERROR',
          totalDurationMs: Date.now() - startTime,
          terminalLogs: [
            '⚙️ Javac Compiling Solution.java Test.java...',
            compileResult.stderr || 'Compilation error.'
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Java Compilation',
            input: 'Source Code',
            expectedOutput: '0 Errors',
            actualOutput: 'Compile Error',
            passed: false,
            durationMs: Date.now() - startTime,
            error: compileResult.stderr
          }]
        });
      }

      const maxExecTime = Math.min(Math.max(timeoutMs, 1000), 4000);
      const runPromise = new Promise<{ success: boolean; stdout: string; stderr: string; timedOut: boolean }>((resolve) => {
        const child = exec(
          `java -Xmx128m -Dfile.encoding=UTF-8 Test`,
          { cwd: tempDir, timeout: maxExecTime, maxBuffer: 64 * 1024 },
          (error, stdout, stderr) => {
            const timedOut = Boolean(error && error.killed);
            resolve({
              success: !error && !stderr.includes('AssertionError') && !stderr.includes('Exception'),
              stdout: stdout || '',
              stderr: stderr || (error ? error.message : ''),
              timedOut
            });
          }
        );

        if (stdin && child.stdin) {
          child.stdin.write(stdin);
          child.stdin.end();
        }
      });

      const runResult = await runPromise;

      if (runResult.timedOut) {
        return NextResponse.json({
          language: 'java',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'TIMEOUT',
          totalDurationMs: Date.now() - startTime,
          terminalLogs: [
            `[TIMEOUT] Execution exceeded hard time limit (${maxExecTime}ms). Check for infinite loops!`
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Time Limit Execution',
            input: 'Runtime',
            expectedOutput: `Under ${maxExecTime}ms`,
            actualOutput: 'Execution Timeout',
            passed: false,
            durationMs: Date.now() - startTime
          }]
        });
      }

      const passed = runResult.success;
      const logs = [
        '⚙️ Javac compilation successful (0 errors).',
        runResult.stdout ? `[OUTPUT] ${runResult.stdout.trim()}` : '[OUTPUT] Program finished with 0 output.',
        passed ? '[SUCCESS] All automated test assertions passed!' : `[FAIL] ${runResult.stderr.trim()}`
      ];

      return NextResponse.json({
        language: 'java',
        totalTests: 1,
        passedTests: passed ? 1 : 0,
        failedTests: passed ? 0 : 1,
        allPassed: passed,
        status: passed ? 'SUCCESS' : 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: logs,
        testOutcomes: [{
          index: 1,
          testCaseName: 'Automated Java Test Suite',
          input: 'Test inputs & assertions',
          expectedOutput: 'Pass all assertions with 0 errors',
          actualOutput: passed ? 'Assertion Passed' : runResult.stderr.slice(0, 150),
          passed: passed,
          durationMs: Date.now() - startTime,
          stdout: runResult.stdout,
          error: passed ? undefined : runResult.stderr
        }]
      });

    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        // ignore
      }
    }

  } catch (err: any) {
    return NextResponse.json({
      language: 'java',
      totalTests: 1,
      passedTests: 0,
      failedTests: 1,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: Date.now() - startTime,
      terminalLogs: ['[SYSTEM ERROR] ' + (err?.message || 'Unexpected judge failure')],
      testOutcomes: [{
        index: 1,
        testCaseName: 'Judge Pipeline',
        input: 'Execution Request',
        expectedOutput: 'Clean Execution',
        actualOutput: 'Judge Exception',
        passed: false,
        durationMs: Date.now() - startTime,
        error: err?.message
      }],
      error: err?.message
    }, { status: 500 });
  }
}
