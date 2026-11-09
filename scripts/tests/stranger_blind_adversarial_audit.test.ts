import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CODE_WARS_PROBLEMS_CATALOG } from '../../src/lib/api/codeWarsApi';
import { CODEWARS_PROBLEM_REGISTRY } from '../../src/lib/server/codeWarsSandbox';
import { judgeCodeWarsSubmission } from '../../src/lib/server/codeWarsJudge';
import * as ts from 'typescript';
import { execSync } from 'child_process';

describe('🕵️‍♂️ THIRD-PERSON STRANGER BLIND AUDIT: 90 PROBLEMS UNDER ADVERSARIAL TORTURE', () => {

  it('Vector 1: Complete Catalog Structural Sanity & Absolute Uniqueness', () => {
    assert.strictEqual(CODE_WARS_PROBLEMS_CATALOG.length, 90, 'Must have exactly 90 problems');

    const ids = new Set<string>();
    const titles = new Set<string>();
    const competencies = new Set<string>();
    const tiers: Record<string, number> = { basic: 0, intermediate: 0, advanced: 0 };

    for (const p of CODE_WARS_PROBLEMS_CATALOG) {
      assert.ok(!ids.has(p.id), `Duplicate ID: ${p.id}`);
      ids.add(p.id);

      const normTitle = p.title.trim().toLowerCase();
      assert.ok(!titles.has(normTitle), `Duplicate Title: ${p.title}`);
      titles.add(normTitle);

      assert.ok(!competencies.has(p.competencyId), `Duplicate Competency: ${p.competencyId}`);
      competencies.add(p.competencyId);

      assert.ok(['basic', 'intermediate', 'advanced'].includes(p.difficulty), `Invalid difficulty: ${p.difficulty}`);
      tiers[p.difficulty]++;

      assert.ok(p.timeLimitSeconds && p.timeLimitSeconds >= 60, `timeLimitSeconds too short on ${p.id}`);
      assert.ok(p.memoryLimitMb && p.memoryLimitMb >= 64, `memoryLimitMb too short on ${p.id}`);
      assert.ok(p.hint && p.hint.length >= 40, `Hint too short on ${p.id}`);
      assert.ok(p.testCases && p.testCases.length >= 2, `Fewer than 2 test cases on ${p.id}`);
    }

    assert.strictEqual(tiers.basic, 30, 'Must have 30 Basic problems');
    assert.strictEqual(tiers.intermediate, 30, 'Must have 30 Intermediate problems');
    assert.strictEqual(tiers.advanced, 30, 'Must have 30 Advanced problems');
  });

  it('Vector 2: TypeScript & Python Starter Code Strict AST Compilation Check', () => {
    for (const p of CODE_WARS_PROBLEMS_CATALOG) {
      // Check TS syntax
      const sf = ts.createSourceFile('test.ts', p.starterCode.typescript, ts.ScriptTarget.Latest, true);
      const diagnostics = (sf as any).parseDiagnostics || [];
      assert.strictEqual(diagnostics.length, 0, `TS syntax error in starterCode for ${p.id}`);

      // Check Python syntax via stdin
      assert.doesNotThrow(() => {
        execSync('python -c "import sys, ast; ast.parse(sys.stdin.read())"', {
          input: p.starterCode.python,
          stdio: ['pipe', 'pipe', 'pipe']
        });
      }, `Python syntax error in starterCode for ${p.id}`);
    }
  });

  it('Vector 3: Cheat-Resistance & Blind Hardcoding Rejection Across All 90 Problems', async () => {
    for (let i = 0; i < CODE_WARS_PROBLEMS_CATALOG.length; i++) {
      const p = CODE_WARS_PROBLEMS_CATALOG[i];
      const reg = (CODEWARS_PROBLEM_REGISTRY as any)[p.id];
      assert.ok(reg, `Missing registry entry for ${p.id}`);

      // Submit hardcoded dummy -999999
      const badCode = `function ${reg.functionName}(...args: any[]) { return -999999; }`;
      const res = await judgeCodeWarsSubmission(p.id, badCode, 'typescript');
      assert.strictEqual(res.passed, false, `Dummy return -999999 must NOT pass ${p.id}`);
    }
  });

  it('Vector 4: In-Place Argument Mutation Defense (Anti-Contamination)', async () => {
    const arrayProblems = ['war_two_sum_01', 'war_max_subarray_05', 'war_plus_one_21', 'war_remove_duplicates_sorted_23'];
    for (const pid of arrayProblems) {
      const reg = (CODEWARS_PROBLEM_REGISTRY as any)[pid];
      const mutatorCode = `
        function ${reg.functionName}(arr: any[], ...rest: any[]) {
          if (Array.isArray(arr)) {
            arr.length = 0; // maliciously clear input array
          }
          return -999999;
        }
      `;
      const res = await judgeCodeWarsSubmission(pid, mutatorCode, 'typescript');
      assert.strictEqual(res.ok, true, `Evaluator must not crash on in-place mutation for ${pid}`);
      assert.strictEqual(res.passed, false);
    }
  });

});
