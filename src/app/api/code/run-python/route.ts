import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Auth Gate ────────────────────────────────────────────────────────────
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
    const { code, testSuite, stdin, timeoutMs = 3000 } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing Python source code' }, { status: 400 });
    }

    if (code.length > 50000 || (testSuite && typeof testSuite === 'string' && testSuite.length > 50000)) {
      return NextResponse.json({ error: 'Source code or test suite exceeds size limit (50KB max)' }, { status: 400 });
    }

    // ── Security Sandbox — Forbidden Python APIs across BOTH code and testSuite ──
    const forbiddenPatterns = [
      /os\./,                    // Any os module usage (os.environ, os.system, os.popen, etc.)
      /\bimport\s+os\b/,         // import os
      /\bfrom\s+os\b/,           // from os import ...
      /sys\./,                   // sys module access (sys.modules, etc.)
      /\bimport\s+sys\b/,        // import sys
      /\bfrom\s+sys\b/,          // from sys import ...
      /subprocess/,              // Subprocess spawning
      /__import__/,              // Dynamic import (bypass restrictions)
      /importlib/,               // Import library (dynamic loading)
      /eval\s*\(/,               // Dynamic code evaluation
      /exec\s*\(/,               // Code execution
      /compile\s*\(/,            // Code compilation
      /\bopen\s*\(/,             // Any file access
      /\bpathlib\b/,             // Pathlib filesystem access
      /\bPath\s*\(/,             // Path(...) construction
      /\bio\./,                  // io module (io.open, etc.)
      /\bimport\s+io\b/,         // import io
      /\bfrom\s+io\b/,           // from io import ...
      /shutil/,                  // File manipulation
      /socket/,                  // Raw network socket
      /urllib/,                  // HTTP requests
      /requests/,                // HTTP requests library
      /http\.client/,            // Python http.client exfiltration
      /\bhttp\./,                // Any http module usage
      /httpx/,                   // Async HTTP
      /aiohttp/,                 // Async HTTP
      /ctypes/,                  // C library interop (bypass sandbox)
      /__subclasses__/,          // Class hierarchy traversal / sandbox escape
      /__builtins__/,            // Builtin dictionary override
      /ftplib|telnetlib/,        // Legacy network protocols
      /\bpty\b|\bposix\b|\bfcntl\b/, // Low-level OS/process interop
    ];

    const combinedSource = `${code}\n${typeof testSuite === 'string' ? testSuite : ''}`;

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(combinedSource)) {
        return NextResponse.json({
          language: 'python',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'RUNTIME_ERROR',
          totalDurationMs: Date.now() - startTime,
          terminalLogs: [
            '[SECURITY GUARD] Restricted Python module/call detected in code or testSuite. Process execution, eval, network, and dynamic imports are disallowed.'
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Security Sandbox Check',
            input: 'Forbidden Module',
            expectedOutput: 'Clean Execution',
            actualOutput: 'Security Violation',
            passed: false,
            durationMs: Date.now() - startTime
          }]
        });
      }
    }

    // Clamp timeout strictly between 500ms and 4000ms
    const clampedTimeout = Math.min(Math.max(Number(timeoutMs) || 3000, 500), 4000);

    const runId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(os.tmpdir(), 'pinit_python_' + runId);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      fs.writeFileSync(path.join(tempDir, 'solution.py'), code, 'utf8');

      // If a test suite is provided, import solution and run assertions
      const testCode = testSuite && typeof testSuite === 'string' && testSuite.trim()
        ? `from solution import *\n\n${testSuite}`
        : `import solution\nprint('Solution module loaded successfully.')`;

      fs.writeFileSync(path.join(tempDir, 'test_runner.py'), testCode, 'utf8');

      // SCRUB PROCESS ENVIRONMENT: Do NOT pass server secrets to child process!
      const sanitizedEnv: NodeJS.ProcessEnv = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PATH: process.env.PATH || '',
        SYSTEMROOT: process.env.SYSTEMROOT || '',
        TMP: tempDir,
        TEMP: tempDir,
        PYTHONDONTWRITEBYTECODE: '1',
        PYTHONUNBUFFERED: '1',
      };

      const runPromise = new Promise<{ stdout: string; stderr: string; timedOut?: boolean }>((resolve) => {
        const proc = exec('python test_runner.py', { cwd: tempDir, timeout: clampedTimeout, env: sanitizedEnv }, (error, stdout, stderr) => {
          if (error && error.killed) {
            resolve({ stdout: stdout || '', stderr: `Execution timed out (${clampedTimeout}ms limit exceeded).`, timedOut: true });
          } else {
            resolve({ stdout: stdout || '', stderr: stderr || '' });
          }
        });

        if (stdin && typeof stdin === 'string') {
          proc.stdin?.write(stdin);
          proc.stdin?.end();
        }
      });

      const { stdout, stderr, timedOut } = await runPromise;
      const duration = Date.now() - startTime;

      if (timedOut) {
        return NextResponse.json({
          language: 'python',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'TIMEOUT',
          totalDurationMs: duration,
          terminalLogs: ['⚙️ Python 3 Executing test_runner.py...', stderr],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Time Limit Execution',
            input: stdin || 'Default',
            expectedOutput: '< 3000ms',
            actualOutput: 'Time Limit Exceeded',
            passed: false,
            durationMs: duration
          }]
        });
      }

      if (stderr && stderr.includes('AssertionError')) {
        const errorLines = stderr.trim().split('\n');
        const lastError = errorLines[errorLines.length - 1];

        return NextResponse.json({
          language: 'python',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'ASSERTION_FAILED',
          totalDurationMs: duration,
          terminalLogs: [
            '⚙️ Python 3 Executing test_runner.py...',
            stdout,
            `[TEST FAILURE] ${lastError}`
          ].filter(Boolean),
          testOutcomes: [{
            index: 1,
            testCaseName: 'Proctored Test Suite',
            input: 'Test Inputs',
            expectedOutput: 'Passing Assertions',
            actualOutput: lastError,
            passed: false,
            durationMs: duration
          }]
        });
      }

      if (stderr && !stderr.includes('All') && (stderr.includes('Traceback') || stderr.includes('SyntaxError') || stderr.includes('NameError') || stderr.includes('TypeError'))) {
        return NextResponse.json({
          language: 'python',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'RUNTIME_ERROR',
          totalDurationMs: duration,
          terminalLogs: [
            '⚙️ Python 3 Executing test_runner.py...',
            stderr
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Python Runtime',
            input: 'Execution',
            expectedOutput: 'Clean Run',
            actualOutput: 'Runtime Exception',
            passed: false,
            durationMs: duration
          }]
        });
      }

      // Success
      return NextResponse.json({
        language: 'python',
        totalTests: 1,
        passedTests: 1,
        failedTests: 0,
        allPassed: true,
        status: 'SUCCESS',
        totalDurationMs: duration,
        terminalLogs: [
          '⚙️ Python 3 Executing test_runner.py...',
          stdout || '[SUCCESS] All Python test assertions verified cleanly.',
          `[OK] Completed in ${duration}ms.`
        ],
        testOutcomes: [{
          index: 1,
          testCaseName: 'Proctored Python Test Suite',
          input: 'Test Inputs',
          expectedOutput: 'All Assertions Passed',
          actualOutput: stdout.trim() || 'Passed',
          passed: true,
          durationMs: duration
        }]
      });
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
