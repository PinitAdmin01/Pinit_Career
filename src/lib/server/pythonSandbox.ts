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

    const testRunnerCode = `import sys, io
token = sys.stdin.readline().rstrip('\\r\\n')
_sand_cap = io.StringIO()
_orig_sys_stdout = sys.stdout
sys.stdout = _sand_cap
try:
    from solution import *
except BaseException as e:
    sys.stdout = _orig_sys_stdout
    sys.stderr.write(f"ImportError: {e}\\n")
    sys.exit(1)

_captured_stdout_ = _sand_cap.getvalue()
sys.stdout = _orig_sys_stdout
sys.stdout.write(_captured_stdout_)

try:
${indentedTestSuite}
    if token:
        sys.stdout.write(token + "\\n")
        sys.stdout.flush()
    sys.exit(0)
except AssertionError as ae:
    sys.stderr.write(f"AssertionError: {ae}\\n")
    sys.exit(2)
except SystemExit:
    raise
except BaseException as ex:
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

      const inputData = `${sentinel}\n${stdin && typeof stdin === 'string' ? stdin : ''}`;
      proc.stdin?.write(inputData);
      proc.stdin?.end();
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

type PyodideRuntime = {
  runPython: (code: string, options?: { globals?: unknown }) => unknown;
  setStdout: (opts: { batched: (line: string) => void }) => void;
  setStderr: (opts: { batched: (line: string) => void }) => void;
  globals: { get: (name: string) => any };
};

let serverPyodidePromise: Promise<PyodideRuntime> | null = null;

function resolveServerPyodideIndexUrl(): string | undefined {
  const candidates = [
    path.join(process.cwd(), 'node_modules', 'pyodide'),
    path.join(process.cwd(), 'public', 'pyodide'),
  ];
  for (const dir of candidates) {
    try {
      if (fs.existsSync(path.join(dir, 'pyodide.asm.wasm'))) {
        return dir.endsWith(path.sep) ? dir : `${dir}${path.sep}`;
      }
    } catch {
      // ignore fs errors and try next candidate
    }
  }
  return undefined;
}

async function getServerPyodide(): Promise<PyodideRuntime> {
  if (!serverPyodidePromise) {
    const indexURL = resolveServerPyodideIndexUrl();
    serverPyodidePromise = import('pyodide')
      .then((mod) =>
        (indexURL ? mod.loadPyodide({ indexURL }) : mod.loadPyodide()) as unknown as Promise<PyodideRuntime>
      )
      .catch((err) => {
        serverPyodidePromise = null;
        throw err;
      });
  }
  return serverPyodidePromise;
}

/**
 * In-process Pyodide WASM fallback when native python/python3 binaries are absent on the server host.
 * Executes submission code followed by test assertions inside an isolated Python namespace dict.
 */
export async function runPythonInPyodideFallback(
  options: PythonSandboxOptions
): Promise<PythonSandboxResult> {
  const { code, tests = '', timeoutMs = 4500 } = options;
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

  let pyodide: PyodideRuntime;
  try {
    pyodide = await getServerPyodide();
  } catch (err) {
    return {
      passed: false,
      stdout: '',
      stderr: err instanceof Error ? err.message : String(err),
      timedOut: false,
      status: 'ENVIRONMENT_ERROR',
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }

  const out: string[] = [];
  const errLines: string[] = [];
  pyodide.setStdout({ batched: (line: string) => out.push(line) });
  pyodide.setStderr({ batched: (line: string) => errLines.push(line) });

  const g = pyodide.globals.get('dict')();
  g.set('__name__', '__main__');

  const runnerScript = [
    'import sys, io',
    '_pinit_status = "SUCCESS"',
    '_pinit_err = ""',
    '_sand_cap = io.StringIO()',
    '_orig_sys_stdout = sys.stdout',
    '_captured_stdout_ = ""',
    'try:',
    '    sys.stdout = _sand_cap',
    `    exec(compile(${JSON.stringify(code)}, "solution.py", "exec"), globals())`,
    '    _captured_stdout_ = _sand_cap.getvalue()',
    '    sys.stdout = _orig_sys_stdout',
    '    if _captured_stdout_:',
    '        sys.stdout.write(_captured_stdout_)',
    `    exec(compile(${JSON.stringify(tests.trim() ? tests : 'pass')}, "tests.py", "exec"), globals())`,
    'except AssertionError as _ae:',
    '    sys.stdout = _orig_sys_stdout',
    '    _pinit_status = "ASSERTION_FAILED"',
    '    _pinit_err = f"AssertionError: {_ae}"',
    'except SystemExit as _se:',
    '    sys.stdout = _orig_sys_stdout',
    '    _pinit_status = "ABNORMAL_TERMINATION"',
    '    _pinit_err = f"SystemExit: {_se}"',
    'except BaseException as _ex:',
    '    sys.stdout = _orig_sys_stdout',
    '    _pinit_status = "RUNTIME_ERROR"',
    '    _pinit_err = f"{type(_ex).__name__}: {_ex}"',
  ].join('\n');

  const clampedTimeout = Math.min(Math.max(Number(timeoutMs) || 4500, 500), 10000);
  let timer: NodeJS.Timeout | null = null;
  try {
    await Promise.race([
      Promise.resolve().then(() => {
        pyodide.runPython(runnerScript, { globals: g });
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('TIMEOUT')), clampedTimeout);
      }),
    ]);

    const statusStr = String(g.get('_pinit_status') ?? 'RUNTIME_ERROR') as PythonSandboxStatus;
    const errStr = String(g.get('_pinit_err') ?? '');
    const stdoutText = out.join('\n').trim();
    const stderrText = [errLines.join('\n').trim(), errStr].filter(Boolean).join('\n');

    return {
      passed: statusStr === 'SUCCESS',
      stdout: stdoutText,
      stderr: stderrText,
      timedOut: false,
      status: statusStr,
    };
  } catch (err) {
    const timedOut = err instanceof Error && err.message === 'TIMEOUT';
    return {
      passed: false,
      stdout: out.join('\n').trim(),
      stderr: err instanceof Error ? err.message : String(err),
      timedOut,
      status: timedOut ? 'TIMEOUT' : 'RUNTIME_ERROR',
      error: err instanceof Error ? err : new Error(String(err)),
    };
  } finally {
    if (timer) clearTimeout(timer);
    g.destroy?.();
  }
}
