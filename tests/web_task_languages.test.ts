import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { buildEnrichedDayQuests, DayConfig } from '../src/lib/data/curriculumEnricher';
import { resolveQuestLanguage, getLangInfo } from '../src/components/quests/workspace/useWorkspaceState';
import type { CodeLanguage } from '../src/lib/code/types';

test('W-01: every existing quest across all registered courses still resolves to its old language', () => {
  const allowedOldLanguages = new Set(['javascript', 'python', 'sql', 'java']);
  let totalQuestsChecked = 0;

  for (const course of COURSES_REGISTRY) {
    for (const q of course.quests) {
      const resolved = resolveQuestLanguage(q, q.id);
      assert.ok(
        allowedOldLanguages.has(resolved),
        `Existing quest "${q.id}" in "${course.id}" unexpectedly resolved to "${resolved}"`
      );
      totalQuestsChecked++;
    }
  }

  assert.ok(totalQuestsChecked > 1000, `Expected over 1000 quests checked, found ${totalQuestsChecked}`);
});

test('W-01: known core courses resolve to their exact expected languages', () => {
  const tasks = (courseId: string) =>
    (COURSES_REGISTRY.find((c) => c.id === courseId)?.quests || []).filter((q: any) =>
      /-(exam|assign)-day-\d+$/.test(q.id)
    );

  // JavaScript-based web & systems tasks
  for (const id of ['course-react-web', 'course-dsa-optim', 'course-devops-cicd', 'course-cloud-native']) {
    for (const q of tasks(id)) {
      assert.equal(resolveQuestLanguage(q, q.id), 'javascript', `${id} quest ${q.id} must be javascript`);
    }
  }

  // Python backend & AI tasks
  for (const q of tasks('course-python-backend')) {
    assert.equal(resolveQuestLanguage(q, q.id), 'python', `python-backend quest ${q.id} must be python`);
  }

  // SQL mastery tasks
  for (const q of tasks('course-database-eng')) {
    assert.equal(resolveQuestLanguage(q, q.id), 'sql', `database-eng quest ${q.id} must be sql`);
  }

  // Java tasks
  for (const q of tasks('course-java-logic')) {
    assert.equal(resolveQuestLanguage(q, q.id), 'java', `java-logic quest ${q.id} must be java`);
  }
});

test('W-01: resolveQuestLanguage returns typescript, tsx, html, css when declared on a quest', () => {
  assert.equal(resolveQuestLanguage({ language: 'typescript' }), 'typescript');
  assert.equal(resolveQuestLanguage({ language: 'ts' }), 'typescript');
  assert.equal(resolveQuestLanguage({ language: 'tsx' }), 'tsx');
  assert.equal(resolveQuestLanguage({ language: 'html' }), 'html');
  assert.equal(resolveQuestLanguage({ language: 'css' }), 'css');
});

test('W-01: buildEnrichedDayQuests passes eLanguage and aLanguage from DayConfig to quests', () => {
  const dayCfg: DayConfig = {
    day: 1,
    title: 'Intro to Web TypeScript & React',
    desc: 'Setting up typed components and styles',
    eTitle: 'Define typed props',
    eDesc: 'Practice 1 with TypeScript',
    eStarter: 'type Props = { name: string };',
    eLanguage: 'typescript',
    aTitle: 'Build Button component',
    aDesc: 'Practice 2 with TSX',
    aStarter: 'export function Button() { return <button>Click</button>; }',
    aLanguage: 'tsx',
  };

  const quests = buildEnrichedDayQuests('web-fullstack', 1, dayCfg);
  assert.equal(quests.length, 3);

  const [, practice1, practice2] = quests;
  assert.equal(practice1.language, 'typescript');
  assert.equal(practice2.language, 'tsx');

  assert.equal(resolveQuestLanguage(practice1, practice1.id), 'typescript');
  assert.equal(resolveQuestLanguage(practice2, practice2.id), 'tsx');
});

test('W-01: getLangInfo returns correct file, label, native execution for all CodeLanguage values', () => {
  const testLanguages: Array<{
    lang: CodeLanguage;
    expectedFile: string;
    expectedLabel: string;
  }> = [
    { lang: 'typescript', expectedFile: 'solution.ts', expectedLabel: 'TypeScript compiler' },
    { lang: 'tsx', expectedFile: 'Component.tsx', expectedLabel: 'React / TSX sandbox' },
    { lang: 'html', expectedFile: 'index.html', expectedLabel: 'HTML structure' },
    { lang: 'css', expectedFile: 'styles.css', expectedLabel: 'CSS stylesheet' },
    { lang: 'javascript', expectedFile: 'App.jsx', expectedLabel: 'JS/JSX sandbox' },
    { lang: 'python', expectedFile: 'solution.py', expectedLabel: 'Python runtime (Pyodide WASM)' },
    { lang: 'sql', expectedFile: 'query.sql', expectedLabel: 'PostgreSQL (runs in your browser)' },
    { lang: 'java', expectedFile: 'Solution.java', expectedLabel: 'Java compiler judge' },
  ];

  for (const { lang, expectedFile, expectedLabel } of testLanguages) {
    const info = getLangInfo('test-id', { language: lang });
    assert.equal(info.file, expectedFile, `File for ${lang}`);
    assert.equal(info.label, expectedLabel, `Label for ${lang}`);
    assert.equal(info.native, true, `Native flag for ${lang}`);
    assert.equal(info.language, lang, `Language for ${lang}`);
  }
});
