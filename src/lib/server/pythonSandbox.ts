import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { findForbiddenPython } from '@/lib/code/python/pythonGuard';

export const PASS_SENTINEL = '__PINIT_TESTS_PASSED__';

export interface PythonSandboxOptions {
  code: string;
  tests?: string;
  timeoutMs?: number;
  stdin?: string;
  sentinel?: string;
}

export type PythonSandboxStatus =
  | 'SUCCESS'
  | 'ASSERTION_FAILED'
  | 'ENVIRONMENT_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIMEOUT'
  | 'ABNORMAL_TERMINATION'
  | 'SECURITY_VIOLATION';

export interface PythonSandboxResult {
  passed: boolean;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  isSecurityViolation?: boolean;
  status: PythonSandboxStatus;
  error?: Error | null;
}

/**
 * Runs Python code and test assertions in a scrubbed local temporary environment.
 * Evaluates security restrictions with findForbiddenPython before execution.
 */
export async function runPythonInSandbox(
  options: PythonSandboxOptions
): Promise<PythonSandboxResult> {
  const { code, tests = '', timeoutMs = 3000, stdin, sentinel = PASS_SENTINEL } = options;

  // 1. Security Check
  const combinedSource = `${code}\n${tests}`;
  const forbiddenToken = findForbiddenPython(combinedSource);
  if (forbiddenToken) {
    return {
      passed: false,
      stdout: '',
      stderr: `[SECURITY GUARD] Restricted Python module/call detected in code or tests: ${forbiddenToken}`,
      timedOut: false,
      isSecurityViolation: true,
      status: 'SECURITY_VIOLATION',
    };
  }

  // 2. Clamp timeout between 500ms and 10000ms
  const clampedTimeout = Math.min(Math.max(Number(timeoutMs) || 3000, 500), 10000);

  // 3. Isolated temp directory
  const runId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), 'pinit_python_' + runId);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    fs.writeFileSync(path.join(tempDir, 'solution.py'), code, 'utf8');

    const indentedTestSuite = tests.trim()
      ? tests
          .split('\n')
          .map((line) => '    ' + line)
          .join('\n')
      : '    pass';

    const testRunnerCode = `import sys
try:
    from solution import *
except Exception as e:
    sys.stderr.write(f"ImportError: {e}\\n")
    sys.exit(1)

try:
${indentedTestSuite}
    print("${sentinel}")
except AssertionError as ae:
    sys.stderr.write(f"AssertionError: {ae}\\n")
    sys.exit(2)
except Exception as ex:
    sys.stderr.write(f"RuntimeError: {ex}\\n")
    sys.exit(3)
`;

    fs.writeFileSync(path.join(tempDir, 'test_runner.py'), testRunnerCode, 'utf8');

    // Clean execution environment — strip server secrets
    const sanitizedEnv: NodeJS.ProcessEnv = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PATH: process.env.PATH || '',
      SYSTEMROOT: process.env.SYSTEMROOT || '',
      TMP: tempDir,
      TEMP: tempDir,
      PYTHONDONTWRITEBYTECODE: '1',
      PYTHONUNBUFFERED: '1',
    };

    const pythonBin = process.platform === 'win32' ? 'python' : 'python3';

    const execPromise = new Promise<{
      error: Error | null;
      stdout: string;
      stderr: string;
      timedOut: boolean;
    }>((resolve) => {
      const proc = exec(
        `${pythonBin} test_runner.py`,
        { cwd: tempDir, timeout: clampedTimeout, env: sanitizedEnv },
        (error, stdout, stderr) => {
          const timedOut = Boolean(error && (error as { killed?: boolean }).killed);
          resolve({
            error,
            stdout: stdout || '',
            stderr: stderr || (error ? error.message : ''),
            timedOut,
          });
        }
      );

      if (stdin && typeof stdin === 'string') {
        proc.stdin?.write(stdin);
        proc.stdin?.end();
      }
    });

    const { error, stdout, stderr, timedOut } = await execPromise;

    if (timedOut) {
      return {
        passed: false,
        stdout,
        stderr,
        timedOut: true,
        status: 'TIMEOUT',
        error,
      };
    }

    if (error) {
      const isAssertion = stderr.includes('AssertionError');
      const isMissingPython =
        stderr.includes('not recognized') ||
        stderr.includes('not found') ||
        (error as { code?: string }).code === 'ENOENT';
      const status: PythonSandboxStatus = isAssertion
        ? 'ASSERTION_FAILED'
        : isMissingPython
        ? 'ENVIRONMENT_ERROR'
        : 'RUNTIME_ERROR';

      return {
        passed: false,
        stdout,
        stderr,
        timedOut: false,
        status,
        error,
      };
    }

    const hasPassedSentinel = stdout.includes(sentinel);
    if (!hasPassedSentinel) {
      return {
        passed: false,
        stdout,
        stderr:
          stderr ||
          'Process terminated prematurely without completing test assertions (e.g. exit() or SystemExit).',
        timedOut: false,
        status: 'ABNORMAL_TERMINATION',
      };
    }

    const cleanStdout = stdout.replace(sentinel, '').trim();

    return {
      passed: true,
      stdout: cleanStdout,
      stderr: '',
      timedOut: false,
      status: 'SUCCESS',
    };
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore temporary folder cleanup errors
    }
  }
}
