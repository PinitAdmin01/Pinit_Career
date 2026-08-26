import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

// STAGE 1 FIX (§3.5 / §3.6 — Java completion authority):
// Previously, after this route returned `allPassed: true`, the ONLY completion
// record created was QuestWorkspaceClient.tsx calling `addCompletedQuest(...)`
// — a purely client-side function. No server-side record existed tied to the
// specific judge run that verified the code. JS quests get a stronger
// guarantee via verify-quest's atomicPersistCompletion (a service-role write
// performed entirely server-side, in the same trusted process that ran the
// check). This gives Java the same guarantee: when THIS route's own real
// javac/java judge says a submission passed, THIS route — not the browser —
// writes the authoritative completion record, using the service-role key.
//
// This is additive: the client's existing `addCompletedQuest(...)` call is
// left untouched (it still drives local UI/XP/streak state), so no existing
// behavior changes if this write fails or is never reached. Follows the exact
// env-var + graceful-degradation pattern already used by src/lib/faceStore.ts
// (getSupabaseAdmin) — if Supabase isn't configured (e.g. demo mode), this
// silently no-ops rather than breaking the response.
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function persistJavaCompletionServerSide(uid: string, questId: string, xpAmount: number): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return; // Not configured (e.g. demo mode) — no-op, matches existing degradation pattern.
  try {
    const { data: profile, error: fetchErr } = await admin
      .from('users')
      .select('completed_quests, xp_total')
      .eq('id', uid)
      .single();
    if (fetchErr || !profile) {
      console.warn('[run-java] persistJavaCompletionServerSide fetch failed:', fetchErr?.message);
      return;
    }
    const current: string[] = profile.completed_quests || [];
    if (current.includes(questId)) return; // idempotent
    const newCompleted = [...current, questId];
    const newXp = (profile.xp_total || 0) + xpAmount;
    const { error: updateErr } = await admin
      .from('users')
      .update({ completed_quests: newCompleted, xp_total: newXp })
      .eq('id', uid);
    if (updateErr) console.warn('[run-java] persistJavaCompletionServerSide update failed:', updateErr.message);
  } catch (e: any) {
    console.warn('[run-java] persistJavaCompletionServerSide threw:', e?.message);
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Auth Gate ────────────────────────────────────────────────────────────
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
    const { code, testSuite, stdin, timeoutMs = 3000, questId, xp } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing Java source code' }, { status: 400 });
    }

    if (code.length > 50000) {
      return NextResponse.json({ error: 'Source code exceeds size limit (50KB max)' }, { status: 400 });
    }

    // ── Security Sandbox — Forbidden Java APIs ───────────────────────────────
    const forbiddenPatterns = [
      /Runtime\.getRuntime/,          // Any Runtime usage (exec, halt, etc.)
      /ProcessBuilder/,               // Spawn subprocesses
      /Process\s*\(/,                 // Direct Process creation
      /System\.exit/,                 // JVM termination
      /java\.lang\.reflect/,          // Reflection (bypass security)
      /Class\.forName/,               // Dynamic class loading
      /ClassLoader/,                  // Class loader manipulation
      /java\.io\.File/,               // Direct filesystem access
      /Files\.delete/,                // File deletion
      /Files\.write/,                 // File write
      /new\s+File\s*\(/,              // File instantiation
      /Thread\.sleep/,                // Deliberate delay / DoS
      /new\s+Thread\s*\(/,            // Thread spawning
      /Executors\./,                  // Thread pool usage
      /java\.net\./,                  // Network access
      /Socket\s*\(/,                  // Raw socket
      /System\.setSecurityManager/,   // Remove sandbox manager
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

      // Server-authoritative completion record (§3.5/§3.6) — written here, by
      // this route, using the real compile+run result it just produced. Non-
      // blocking: never delays or fails the response to the student.
      if (passed && typeof questId === 'string' && questId) {
        persistJavaCompletionServerSide(gated.user.id, questId, typeof xp === 'number' ? xp : 120)
          .catch((e) => console.warn('[run-java] completion persistence rejected:', e?.message));
      }

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
