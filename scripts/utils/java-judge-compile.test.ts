/**
 * Java Judge Compile/Execute Integration Test (Risk 3, part B)
 *
 * Exercises the EXACT javac/java invocation pattern used by
 * src/app/api/code/run-java/route.ts (same commands, same flags, same temp-dir
 * layout) against a real JDK, covering the four required scenarios:
 *   1. valid Java, passing test        -> SUCCESS
 *   2. valid Java, failing test        -> RUNTIME_ERROR (assertion failure)
 *   3. invalid Java (syntax error)     -> SYNTAX_ERROR (compiler rejects it)
 *   4. (covered by routing test) unauthenticated request -> 401, never reaches this stage
 *
 * HONESTY REQUIREMENT: this environment was checked for `javac`/`java` on PATH
 * (both this Bash/PowerShell shell) and NEITHER IS INSTALLED. Per the fail-
 * closed principle this whole effort is built on, this test does NOT fabricate
 * a pass when it cannot actually invoke a compiler — it reports SKIPPED with an
 * explicit reason, and exits with a distinguishable status so CI can tell
 * "skipped because no JDK here" apart from "passed" or "failed". If a JDK IS
 * present (e.g. in the actual deployment target), this test genuinely compiles
 * and runs Java and asserts on the real result.
 *
 * This directly informs the unresolved Risk 3 question: this repo's
 * next.config.js says "Node.js deployment — API routes are active", but
 * firebase.json + the `deploy` npm script point at Firebase static hosting
 * with no rewrites to any backend, and no JDK provisioning exists anywhere in
 * this repo (checked: no Dockerfile, no CI step, no README instructions). This
 * test's SKIP result is itself evidence for that unresolved question, not a
 * failure of this fix.
 *
 * Run: node scripts/java-judge-compile.test.js
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

function sh(cmd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
      resolve({ code: error ? (error as any).code ?? 1 : 0, stdout, stderr });
    });
  });
}

async function jdkAvailable(): Promise<boolean> {
  const javac = await sh('javac -version');
  const java = await sh('java -version');
  // `javac -version`/`java -version` print to stderr on some JDKs but exit 0.
  return javac.code === 0 || java.code === 0;
}

// Mirrors run-java/route.ts's compile+run pattern exactly (javac then java,
// same encoding flag, same temp-dir-per-run isolation, same cleanup).
async function compileAndRun(solutionJava: string, testJava: string): Promise<{
  compileOk: boolean; compileStderr?: string;
  runOk?: boolean; runStdout?: string; runStderr?: string;
}> {
  const runId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), 'pinit_java_test_' + runId);
  fs.mkdirSync(tempDir, { recursive: true });
  try {
    fs.writeFileSync(path.join(tempDir, 'Solution.java'), solutionJava, 'utf8');
    fs.writeFileSync(path.join(tempDir, 'Test.java'), testJava, 'utf8');

    const compile = await new Promise<{ success: boolean; stderr?: string }>((resolve) => {
      exec('javac -encoding UTF-8 Solution.java Test.java', { cwd: tempDir, timeout: 5000 }, (error, _stdout, stderr) => {
        if (error || stderr) resolve({ success: false, stderr: stderr || error?.message });
        else resolve({ success: true });
      });
    });
    if (!compile.success) return { compileOk: false, compileStderr: compile.stderr };

    const run = await new Promise<{ success: boolean; stdout: string; stderr: string }>((resolve) => {
      exec('java -Xmx128m -Dfile.encoding=UTF-8 Test', { cwd: tempDir, timeout: 4000, maxBuffer: 64 * 1024 }, (error, stdout, stderr) => {
        resolve({
          success: !error && !stderr.includes('AssertionError') && !stderr.includes('Exception'),
          stdout: stdout || '', stderr: stderr || (error ? error.message : ''),
        });
      });
    });
    return { compileOk: true, runOk: run.success, runStdout: run.stdout, runStderr: run.stderr };
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

let failures = 0;
let passed = 0;
function assert(condition: boolean, message: string): void {
  if (condition) { passed++; } else { failures++; console.error(`  FAIL: ${message}`); }
}
function ok(message: string): void { passed++; console.log(`  ok:   ${message}`); }

async function main() {
  console.log('\n[0] Checking for a real JDK on PATH\n');
  const hasJdk = await jdkAvailable();

  if (!hasJdk) {
    console.log('  SKIPPED: no javac/java found on PATH in this environment.');
    console.log('  This is NOT a fabricated pass — see file header. The routing fix (Risk 3');
    console.log('  part A) is proven separately by java-judge-routing.test.js and the live');
    console.log('  browser evidence quoted there; whether the DEPLOYED target has a JDK at all');
    console.log('  is an open question this sandbox cannot answer — see the Stage 1 report.');
    console.log('\n' + '─'.repeat(70));
    console.log('Java judge compile test: SKIPPED (no JDK available) — 0 passed, 0 failed');
    process.exitCode = 2; // distinct from 0 (pass) and 1 (fail)
    return;
  }

  console.log('  JDK found — running real compile/execute scenarios.\n');

  console.log('[1] Valid Java, PASSING test case -> must report a genuine pass\n');
  {
    const solution = 'public class Solution {\n  public static int add(int a, int b) { return a + b; }\n}';
    const test = 'public class Test {\n  public static void main(String[] a) {\n    if (Solution.add(2,3) != 5) throw new AssertionError("2+3 should be 5");\n    System.out.println("OK");\n  }\n}';
    const result = await compileAndRun(solution, test);
    assert(result.compileOk === true, 'valid Java compiles');
    assert(result.runOk === true, 'correct solution against its own test -> real pass');
  }

  console.log('\n[2] Valid Java, FAILING test case -> must report a genuine failure (AssertionError), not a pass\n');
  {
    const wrongSolution = 'public class Solution {\n  public static int add(int a, int b) { return a - b; }\n}'; // deliberately wrong
    const test = 'public class Test {\n  public static void main(String[] a) {\n    if (Solution.add(2,3) != 5) throw new AssertionError("2+3 should be 5");\n    System.out.println("OK");\n  }\n}';
    const result = await compileAndRun(wrongSolution, test);
    assert(result.compileOk === true, 'wrong-but-syntactically-valid Java still compiles');
    assert(result.runOk === false, 'wrong solution genuinely fails its test (real AssertionError, not a guess)');
    assert(!!result.runStderr && result.runStderr.includes('AssertionError'), 'failure is a real AssertionError from real execution');
  }

  console.log('\n[3] Invalid Java (syntax error) -> must fail at compile stage, never reach execution\n');
  {
    const brokenSolution = 'public class Solution {\n  public static int add(int a, int b) { return a +++ b \n}'; // missing semicolon/brace, garbage operator
    const test = 'public class Test { public static void main(String[] a) { System.out.println(Solution.add(1,2)); } }';
    const result = await compileAndRun(brokenSolution, test);
    assert(result.compileOk === false, 'syntactically invalid Java fails at the REAL compiler, not a heuristic');
    assert(!!result.compileStderr, 'a real javac error message is produced');
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`Java judge compile test: ${passed} passed, ${failures} failed`);
  if (failures > 0) { console.log('FAIL'); process.exitCode = 1; } else { console.log('PASS'); }
}

main();
