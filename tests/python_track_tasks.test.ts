import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { DayConfig } from '../src/lib/data/curriculumEnricher';
import { AI_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/aiPython30DayData';
import { DIST_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/distPython30DayData';
import { CLOUD_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/cloudPython30DayData';
import { NLP_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/nlpPython30DayData';
import { QUANT_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/quantPython30DayData';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

/** Python-track courses whose reference answers are in tests/fixtures (not shipped to students). */
const COURSES: { name: string; configs: DayConfig[]; solutions: string }[] = [
  { name: 'AI Engineering in Python', configs: AI_PYTHON_30_DAYS_CONFIGS, solutions: 'ai_python_solutions.json' },
  { name: 'Distributed Systems in Python', configs: DIST_PYTHON_30_DAYS_CONFIGS, solutions: 'dist_python_solutions.json' },
  { name: 'Cloud Engineering in Python', configs: CLOUD_PYTHON_30_DAYS_CONFIGS, solutions: 'cloud_python_solutions.json' },
  { name: 'NLP in Python', configs: NLP_PYTHON_30_DAYS_CONFIGS, solutions: 'nlp_python_solutions.json' },
  { name: 'Quantitative Trading Systems in Python', configs: QUANT_PYTHON_30_DAYS_CONFIGS, solutions: 'quant_python_solutions.json' },
];

const hasPython = spawnSync('python3', ['--version']).status === 0;

/** The browser runs the student's code and then the checks as one program; this does the same. */
function grade(solution: string, testSuite: string) {
  const blocked = findForbiddenPython(`${solution}\n${testSuite}`);
  if (blocked) return { ok: false, out: `blocked by the server safety filter: ${blocked}` };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'py-task-'));
  try {
    fs.writeFileSync(path.join(dir, 'task.py'), `${solution}\n\n${testSuite}\n`);
    const r = spawnSync('python3', ['task.py'], { cwd: dir, encoding: 'utf8', timeout: 20000 });
    return { ok: r.status === 0 && r.stdout.includes('All checks passed.'), out: `${r.stdout}${r.stderr}` };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** The starting code with every `pass` replaced by `return value`: a guess, not a solution. */
const lazy = (starter: string, value: string) => starter.replace(/^(\s*)pass$/gm, `$1return ${value}`);

for (const course of COURSES) {
  const solutions: [string, string][] = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', course.solutions), 'utf8'));

  test(`${course.name}: 30 days and an answer for every practice task`, () => {
    assert.equal(course.configs.length, 30);
    assert.equal(solutions.length, 30);
  });

  test(`${course.name}: every answer passes, the starting code and lazy guesses fail`, { skip: !hasPython && 'python3 not installed' }, () => {
    course.configs.forEach((cfg, i) => {
      const tasks = [
        { name: 'Practice 1', starter: cfg.eStarter!, check: cfg.eTest!, solution: solutions[i][0] },
        { name: 'Practice 2', starter: cfg.aStarter!, check: cfg.aTest!, solution: solutions[i][1] },
      ];
      for (const t of tasks) {
        const label = `Day ${i + 1} ${t.name}`;
        const good = grade(t.solution, t.check);
        assert.ok(good.ok, `${label}: the answer fails:\n${good.out}`);
        assert.ok(!grade(t.starter, t.check).ok, `${label}: the starting code already passes`);
        for (const value of ['True', 'False', '0', '1', '-1', '[]', "''", 'None', '{}']) {
          assert.ok(!grade(lazy(t.starter, value), t.check).ok, `${label}: passes when everything returns ${value}`);
        }
      }
    });
  });
}
