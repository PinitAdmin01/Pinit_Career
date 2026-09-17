// cloud-run/python-judge/server.js
//
// Real, isolated Python grading judge for CareerOS.
//
// Isolation & Security:
//   - Runs in an isolated container process outside the Next.js web server.
//   - Executes Python in a dedicated temporary workspace with scrubbed environment.
//   - Strict timeout enforcement (SIGTERM then SIGKILL).
//   - Enforces a positive pass sentinel (__PINIT_TESTS_PASSED__) emitted ONLY after
//     all test assertions complete. Early termination via exit() or SystemExit is
//     rejected as ABNORMAL_TERMINATION (never reported as success).
//   - If Python is missing or encounters a runtime failure, fails closed with allPassed: false.

const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const TIMEOUT_MS = 4000;
const MAX_BUFFER = 128 * 1024;
const MAX_CODE_LENGTH = 50000;
const PASS_SENTINEL = '__PINIT_TESTS_PASSED__';

function runPython(code, testSuite, stdin) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let tempDir;
    try {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinit_py_'));
    } catch (e) {
      resolve({
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: ['[JUDGE SETUP ERROR] ' + e.message],
        testOutcomes: [{
          index: 1,
          testCaseName: 'Judge Environment Setup',
          input: '',
          expectedOutput: 'Clean Environment',
          actualOutput: e.message,
          passed: false,
          durationMs: Date.now() - startTime
        }]
      });
      return;
    }

    const solutionPath = path.join(tempDir, 'solution.py');
    const runnerPath = path.join(tempDir, 'test_runner.py');

    // Runner imports solution, runs tests, and emits sentinel ONLY upon full success
    const runnerScript = `import sys
try:
    from solution import *
except Exception as e:
    sys.stderr.write(f"Module Import Error: {e}\\n")
    sys.exit(1)

# Execute test suite assertions
try:
${testSuite ? testSuite.split('\\n').map(line => '    ' + line).join('\\n') : '    pass'}
    # Sentinel MUST be printed after all assertions succeed
    print("${PASS_SENTINEL}")
except AssertionError as ae:
    sys.stderr.write(f"AssertionError: {ae}\\n")
    sys.exit(2)
except Exception as ex:
    sys.stderr.write(f"Runtime Exception: {ex}\\n")
    sys.exit(3)
`;

    try {
      fs.writeFileSync(solutionPath, code, 'utf8');
      fs.writeFileSync(runnerPath, runnerScript, 'utf8');
    } catch (e) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      resolve({
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: ['[FILE WRITE ERROR] ' + e.message],
        testOutcomes: [{
          index: 1,
          testCaseName: 'File Write',
          input: '',
          expectedOutput: 'Files Created',
          actualOutput: e.message,
          passed: false,
          durationMs: Date.now() - startTime
        }]
      });
      return;
    }

    const sanitizedEnv = {
      PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
      TMPDIR: tempDir,
      PYTHONDONTWRITEBYTECODE: '1',
      PYTHONUNBUFFERED: '1',
    };

    // Determine python binary (python3 or python)
    const pythonBin = process.platform === 'win32' ? 'python' : 'python3';

    const child = execFile(
      pythonBin,
      ['test_runner.py'],
      {
        cwd: tempDir,
        timeout: TIMEOUT_MS,
        maxBuffer: MAX_BUFFER,
        env: sanitizedEnv,
      },
      (error, stdout, stderr) => {
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
        const duration = Date.now() - startTime;

        if (error && error.killed) {
          resolve({
            language: 'python',
            totalTests: 1,
            passedTests: 0,
            failedTests: 1,
            allPassed: false,
            status: 'TIMEOUT',
            totalDurationMs: duration,
            terminalLogs: [
              '⚙️ Python 3 Executing in isolated container...',
              `Execution timed out (${TIMEOUT_MS}ms limit exceeded).`
            ],
            testOutcomes: [{
              index: 1,
              testCaseName: 'Time Limit Execution',
              input: stdin || 'Default',
              expectedOutput: `< ${TIMEOUT_MS}ms`,
              actualOutput: 'Time Limit Exceeded',
              passed: false,
              durationMs: duration
            }]
          });
          return;
        }

        // If child exited with error or non-zero exit code
        if (error) {
          const isAssertion = stderr.includes('AssertionError');
          const status = isAssertion ? 'ASSERTION_FAILED' : 'RUNTIME_ERROR';
          const errLine = stderr.trim().split('\\n').pop() || error.message;

          resolve({
            language: 'python',
            totalTests: 1,
            passedTests: 0,
            failedTests: 1,
            allPassed: false,
            status,
            totalDurationMs: duration,
            terminalLogs: [
              '⚙️ Python 3 Executing in isolated container...',
              stdout,
              `[FAILURE] ${errLine}`
            ].filter(Boolean),
            testOutcomes: [{
              index: 1,
              testCaseName: 'Python Test Suite',
              input: stdin || '',
              expectedOutput: 'Passing Assertions',
              actualOutput: errLine,
              passed: false,
              durationMs: duration
            }]
          });
          return;
        }

        // Check for positive pass sentinel
        const hasPassedSentinel = stdout.includes(PASS_SENTINEL);
        if (!hasPassedSentinel) {
          resolve({
            language: 'python',
            totalTests: 1,
            passedTests: 0,
            failedTests: 1,
            allPassed: false,
            status: 'ABNORMAL_TERMINATION',
            totalDurationMs: duration,
            terminalLogs: [
              '⚙️ Python 3 Executing in isolated container...',
              '[TEST FAILURE] Process exited prematurely without completing test suite assertions (e.g. exit() or unhandled termination).'
            ],
            testOutcomes: [{
              index: 1,
              testCaseName: 'Complete Suite Verification',
              input: '',
              expectedOutput: 'All Test Assertions Executed',
              actualOutput: 'Premature Process Exit',
              passed: false,
              durationMs: duration
            }]
          });
          return;
        }

        // Clean positive pass
        const cleanStdout = stdout.replace(PASS_SENTINEL, '').trim();
        resolve({
          language: 'python',
          totalTests: 1,
          passedTests: 1,
          failedTests: 0,
          allPassed: true,
          status: 'SUCCESS',
          totalDurationMs: duration,
          terminalLogs: [
            '⚙️ Python 3 Executing in isolated container...',
            cleanStdout || '[SUCCESS] All Python test assertions verified cleanly.',
            `[OK] Completed in ${duration}ms.`
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Proctored Python Test Suite',
            input: stdin || 'Test Inputs',
            expectedOutput: 'All Assertions Passed',
            actualOutput: cleanStdout || 'Passed',
            passed: true,
            durationMs: duration
          }]
        });
      }
    );

    if (stdin && child.stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }

    const hardKill = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch {}
    }, TIMEOUT_MS + 500);
    child.on('exit', () => clearTimeout(hardKill));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'python-judge' }));
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let bodyText = '';
  req.on('data', (chunk) => { bodyText += chunk; });
  req.on('end', async () => {
    try {
      const body = JSON.parse(bodyText || '{}');
      const { code, testSuite, stdin } = body;

      if (typeof code !== 'string' || !code) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ allPassed: false, status: 'RUNTIME_ERROR', error: 'Missing Python source code' }));
        return;
      }

      if (code.length > MAX_CODE_LENGTH) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ allPassed: false, status: 'RUNTIME_ERROR', error: 'Source code exceeds size limit' }));
        return;
      }

      const result = await runPython(code, testSuite, stdin);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ allPassed: false, status: 'RUNTIME_ERROR', error: 'Judge pipeline error: ' + (err && err.message) }));
    }
  });
});

server.listen(PORT, () => console.log(`python-judge listening on :${PORT}`));
