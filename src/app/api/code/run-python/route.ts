import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { getAuthoritativeQuest } from '@/lib/quests/questRegistry';
import { questNeedsPassReceipt } from '@/lib/courses/gradeTest';
import { runPythonInSandbox } from '@/lib/server/pythonSandbox';

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
    let canRecordCompletion = false;
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
      // Forcefully overwrite testSuite with server-owned suite. A pass is only recorded against the
      // quest's own suite: never a browser-supplied one, and never for server-graded course tests.
      effectiveTestSuite = registeredQuest.testSuite || effectiveTestSuite;
      canRecordCompletion = Boolean(registeredQuest.testSuite && registeredQuest.testSuite.trim()) && !questNeedsPassReceipt(cleanQuestId);
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
          if (result.allPassed && canRecordCompletion && gated.user?.id) {
            await persistPythonCompletionServerSide(gated.user.id, cleanQuestId, authoritativeXpAwarded);
          }
          return NextResponse.json(result);
        }
      } catch (judgeErr: any) {
        console.warn('[run-python] Remote PYTHON_JUDGE_URL unreachable, falling back to local sandbox:', judgeErr.message);
      }
    }

    // Clamp timeout strictly between 500ms and 4000ms
    const clampedTimeout = Math.min(Math.max(Number(timeoutMs) || 3000, 500), 4000);

    const sandboxRes = await runPythonInSandbox({
      code,
      tests: effectiveTestSuite,
      timeoutMs: clampedTimeout,
      stdin,
    });

    const duration = Date.now() - startTime;

    if (sandboxRes.isSecurityViolation) {
      return NextResponse.json({
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: duration,
        terminalLogs: [
          '[SECURITY GUARD] Restricted Python module/call detected in code or testSuite. Process execution, eval, network, dynamic imports, and process exit traps are disallowed.',
        ],
        testOutcomes: [
          {
            index: 1,
            testCaseName: 'Security Sandbox Check',
            input: 'Forbidden Module',
            expectedOutput: 'Clean Execution',
            actualOutput: 'Security Violation',
            passed: false,
            durationMs: duration,
          },
        ],
      });
    }

    if (sandboxRes.timedOut) {
      return NextResponse.json({
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: 'TIMEOUT',
        totalDurationMs: duration,
        terminalLogs: ['⚙️ Python 3 Executing test_runner.py...', sandboxRes.stderr],
        testOutcomes: [
          {
            index: 1,
            testCaseName: 'Time Limit Execution',
            input: stdin || 'Default',
            expectedOutput: '< 3000ms',
            actualOutput: 'Time Limit Exceeded',
            passed: false,
            durationMs: duration,
          },
        ],
      });
    }

    if (!sandboxRes.passed) {
      if (sandboxRes.status === 'ABNORMAL_TERMINATION') {
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
            '[TEST FAILURE] Process terminated prematurely without completing test assertions (e.g. exit() or SystemExit).',
          ],
          testOutcomes: [
            {
              index: 1,
              testCaseName: 'Proctored Python Test Suite',
              input: 'Execution Flow',
              expectedOutput: 'All Test Assertions Executed',
              actualOutput: 'Abnormal Process Termination',
              passed: false,
              durationMs: duration,
            },
          ],
        });
      }

      const lastError =
        sandboxRes.stderr.trim().split('\n').pop() ||
        (sandboxRes.error ? sandboxRes.error.message : 'Unknown execution error');

      return NextResponse.json({
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: sandboxRes.status,
        totalDurationMs: duration,
        terminalLogs: [
          '⚙️ Python 3 Executing test_runner.py...',
          sandboxRes.stdout,
          `[TEST FAILURE] ${lastError}`,
        ].filter(Boolean),
        testOutcomes: [
          {
            index: 1,
            testCaseName: 'Proctored Python Test Suite',
            input: stdin || 'Test Inputs',
            expectedOutput: 'Passing Assertions',
            actualOutput: lastError,
            passed: false,
            durationMs: duration,
          },
        ],
      });
    }

    // Clean, verified success
    if (canRecordCompletion && gated.user?.id) {
      await persistPythonCompletionServerSide(gated.user.id, cleanQuestId, authoritativeXpAwarded);
    }

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
        sandboxRes.stdout || '[SUCCESS] All Python test assertions verified cleanly.',
        `[OK] Completed in ${duration}ms.`,
      ],
      testOutcomes: [
        {
          index: 1,
          testCaseName: 'Proctored Python Test Suite',
          input: stdin || 'Test Inputs',
          expectedOutput: 'All Assertions Passed',
          actualOutput: sandboxRes.stdout || 'Passed',
          passed: true,
          durationMs: duration,
        },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
