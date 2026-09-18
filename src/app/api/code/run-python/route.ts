import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { getAuthoritativeQuest, getAuthoritativeQuestXp } from '@/lib/quests/questRegistry';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function persistPythonCompletionServerSide(uid: string, questId: string, xpAmount: number): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  try {
    const { data: profile, error: fetchErr } = await admin
      .from('users')
      .select('completed_quests, xp_total')
      .eq('id', uid)
      .single();
    if (fetchErr || !profile) return;
    const current: string[] = profile.completed_quests || [];
    if (current.includes(questId)) return;
    const newCompleted = [...current, questId];
    const newXp = (profile.xp_total || 0) + xpAmount;
    await admin
      .from('users')
      .update({ completed_quests: newCompleted, xp_total: newXp })
      .eq('id', uid);
  } catch (e: any) {
    console.warn('[run-python] persistPythonCompletionServerSide threw:', e?.message);
  }
}

const PASS_SENTINEL = '__PINIT_TESTS_PASSED__';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`pyrun_${ip}`, { limit: 15, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many execution requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    // ── Auth Gate ────────────────────────────────────────────────────────────
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const { code, testSuite, stdin, timeoutMs = 3000, questId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing Python source code' }, { status: 400 });
    }

    // ── Authoritative Quest & Test Suite Validation ───────────────────────────
    let effectiveTestSuite = typeof testSuite === 'string' ? testSuite : '';
    let authoritativeXpAwarded = 0;
    const cleanQuestId = typeof questId === 'string' ? questId.trim() : '';

    if (cleanQuestId) {
      const registeredQuest = getAuthoritativeQuest(cleanQuestId);
      if (!registeredQuest) {
        return NextResponse.json(
          {
            ok: false,
            error: 'UNREGISTERED_QUEST',
            message: `Quest '${cleanQuestId}' is not recognized in the authoritative quest registry.`
          },
          { status: 400 }
        );
      }
      // Forcefully overwrite testSuite with server-owned suite
      effectiveTestSuite = registeredQuest.testSuite || effectiveTestSuite;
      authoritativeXpAwarded = registeredQuest.xp;
    }

    if (code.length > 50000 || (effectiveTestSuite && effectiveTestSuite.length > 50000)) {
      return NextResponse.json({ error: 'Source code or test suite exceeds size limit (50KB max)' }, { status: 400 });
    }

    // ── Isolated Judge Remote Routing (Cloud Run / Container) ────────────────
    const judgeUrl = process.env.PYTHON_JUDGE_URL;
    if (judgeUrl) {
      try {
        const judgeRes = await fetch(judgeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            testSuite: effectiveTestSuite,
            stdin,
            timeoutMs
          })
        });

        if (judgeRes.ok) {
          const result = await judgeRes.json();
          if (result.allPassed && cleanQuestId && gated.user?.id) {
            await persistPythonCompletionServerSide(gated.user.id, cleanQuestId, authoritativeXpAwarded);
          }
          return NextResponse.json(result);
        }
      } catch (judgeErr: any) {
        console.warn('[run-python] Remote PYTHON_JUDGE_URL unreachable, falling back to local sandbox:', judgeErr.message);
      }
    }

    // ── Security Sandbox — Forbidden Python APIs across BOTH code and testSuite ──
    const forbiddenPatterns = [
      /os./,                    // Any os module usage (os.environ, os.system, os.popen, etc.)
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
      /\bexit\s*\(/,             // Early exit exploit
      /\bquit\s*\(/,             // Early quit exploit
      /\braise\s+SystemExit\b/,  // Early SystemExit exploit
      /sys\.exit/,               // sys.exit exploit
      /os\._exit/,               // os._exit exploit
    ];

    const combinedSource = `${code}\n${effectiveTestSuite}`;

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
            '[SECURITY GUARD] Restricted Python module/call detected in code or testSuite. Process execution, eval, network, dynamic imports, and process exit traps are disallowed.'
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

      // Runner imports solution, runs tests, and emits sentinel ONLY upon full success
      const indentedTestSuite = effectiveTestSuite && effectiveTestSuite.trim()
        ? effectiveTestSuite.split('\n').map(line => '    ' + line).join('\n')
        : '    pass';

      const testRunnerCode = `import sys
try:
    from solution import *
except Exception as e:
    sys.stderr.write(f"ImportError: {e}\\n")
    sys.exit(1)

try:
${indentedTestSuite}
    print("${PASS_SENTINEL}")
except AssertionError as ae:
    sys.stderr.write(f"AssertionError: {ae}\\n")
    sys.exit(2)
except Exception as ex:
    sys.stderr.write(f"RuntimeError: {ex}\\n")
    sys.exit(3)
`;

      fs.writeFileSync(path.join(tempDir, 'test_runner.py'), testRunnerCode, 'utf8');

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

      const pythonBin = process.platform === 'win32' ? 'python' : 'python3';

      const runPromise = new Promise<{ error: Error | null; stdout: string; stderr: string; timedOut: boolean }>((resolve) => {
        const proc = exec(
          `${pythonBin} test_runner.py`,
          { cwd: tempDir, timeout: clampedTimeout, env: sanitizedEnv },
          (error, stdout, stderr) => {
            const timedOut = Boolean(error && (error as any).killed);
            resolve({
              error,
              stdout: stdout || '',
              stderr: stderr || (error ? error.message : ''),
              timedOut
            });
          }
        );

        if (stdin && typeof stdin === 'string') {
          proc.stdin?.write(stdin);
          proc.stdin?.end();
        }
      });

      const { error, stdout, stderr, timedOut } = await runPromise;
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

      // FAIL-CLOSED DEFENSE: If child process failed or exited non-zero
      if (error) {
        const isAssertion = stderr.includes('AssertionError');
        const isMissingPython = stderr.includes('not recognized') || stderr.includes('not found') || (error as any).code === 'ENOENT';
        const status = isAssertion ? 'ASSERTION_FAILED' : (isMissingPython ? 'ENVIRONMENT_ERROR' : 'RUNTIME_ERROR');
        const lastError = stderr.trim().split('\n').pop() || error.message;

        return NextResponse.json({
          language: 'python',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status,
          totalDurationMs: duration,
          terminalLogs: [
            '⚙️ Python 3 Executing test_runner.py...',
            stdout,
            `[TEST FAILURE] ${lastError}`
          ].filter(Boolean),
          testOutcomes: [{
            index: 1,
            testCaseName: 'Proctored Python Test Suite',
            input: stdin || 'Test Inputs',
            expectedOutput: 'Passing Assertions',
            actualOutput: lastError,
            passed: false,
            durationMs: duration
          }]
        });
      }

      // POSITIVE PASS SENTINEL CHECK: Must contain sentinel, else exit() or premature termination occurred
      const hasPassedSentinel = stdout.includes(PASS_SENTINEL);
      if (!hasPassedSentinel) {
        return NextResponse.json({
          language: 'python',
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          allPassed: false,
          status: 'ABNORMAL_TERMINATION',
          totalDurationMs: duration,
          terminalLogs: [
            '⚙️ Python 3 Executing test_runner.py...',
            '[TEST FAILURE] Process terminated prematurely without completing test assertions (e.g. exit() or SystemExit).'
          ],
          testOutcomes: [{
            index: 1,
            testCaseName: 'Proctored Python Test Suite',
            input: 'Execution Flow',
            expectedOutput: 'All Test Assertions Executed',
            actualOutput: 'Abnormal Process Termination',
            passed: false,
            durationMs: duration
          }]
        });
      }

      // Clean, verified success
      if (cleanQuestId && gated.user?.id) {
        await persistPythonCompletionServerSide(gated.user.id, cleanQuestId, authoritativeXpAwarded);
      }

      const cleanStdout = stdout.replace(PASS_SENTINEL, '').trim();

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
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
