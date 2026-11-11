import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resolveQuestLanguage, getLangInfo, TEACHERS } from '../src/components/quests/workspace/useWorkspaceState';
import { WorkspaceCodeEditor } from '../src/components/quests/workspace/WorkspaceCodeEditor';
import { WorkspaceTestResults } from '../src/components/quests/workspace/WorkspaceTestResults';
import {
  TeacherSelectScreen,
  CompletionScreen,
  SubmitButtonsBar,
} from '../src/components/quests/workspace/WorkspaceSubmitPanel';

test('resolveQuestLanguage and getLangInfo accurately resolve hyphenated and specialized course prefixes', () => {
  // Hyphenated Python DSA prefix must not truncate to 'dsa' (Java)
  assert.equal(resolveQuestLanguage({}, 'dsa-py-d5-exam-1'), 'python');
  assert.equal(getLangInfo('dsa-py-d5-exam-1').file, 'solution.py');

  // Hyphenated SQL mastery prefix
  assert.equal(resolveQuestLanguage({}, 'sql-mastery-d3-assign-1'), 'sql');
  assert.equal(getLangInfo('sql-mastery-d3-assign-1').file, 'query.sql');

  // Embedded IoT C++ prefix
  assert.equal(resolveQuestLanguage({}, 'iot_emb-d1-assign-1'), 'cpp');
  assert.equal(getLangInfo('iot_emb-d1-assign-1').file, 'solution.cpp');

  // Git & Version Control Bash prefix
  assert.equal(resolveQuestLanguage({}, 'git_vcs-d2-assign-1'), 'bash');
  assert.equal(getLangInfo('git_vcs-d2-assign-1').file, 'script.sh');

  // B.Com Finance & Tax prefixes
  assert.equal(resolveQuestLanguage({}, 'bcom-finance-d4-exam-1'), 'python');
  assert.equal(resolveQuestLanguage({}, 'bcom_tax-d2-assign-1'), 'python');

  // Java & React hyphenated prefixes
  assert.equal(resolveQuestLanguage({}, 'java-basics-d1-assign-1'), 'java');
  assert.equal(resolveQuestLanguage({}, 'react-basics-d2-assign-1'), 'javascript');
});

test('WorkspaceCodeEditor renders grace timer banner, file/env badges, and code textarea testids', () => {
  const html = renderToStaticMarkup(
    React.createElement(WorkspaceCodeEditor, {
      questId: 'dsa-py-d5-exam-1',
      code: 'def solve(nums):\n    return sum(nums)',
      setCode: () => {},
      editorLocked: false,
      isExam: true,
      examTimedOut: false,
      isCompleted: false,
      unlockRemainingSec: 180,
      onExtendGrace: () => {},
      onSubmit: () => {},
      userId: 'user-1',
      langInfo: { file: 'solution.py', label: 'Python runtime (Pyodide WASM)', native: true },
      onResetCode: () => {},
    })
  );

  assert.ok(html.includes('data-testid="workspace-code-editor"'));
  assert.ok(html.includes('data-testid="workspace-reset-code-btn"'));
  assert.ok(html.includes('data-testid="workspace-grace-banner"'));
  assert.ok(html.includes('data-testid="btn-extend-grace"'));
  assert.ok(html.includes('data-testid="workspace-file-badge"'));
  assert.ok(html.includes('solution.py (Proctored Environment)'));
  assert.ok(html.includes('data-testid="workspace-env-badge"'));
  assert.ok(html.includes('EXAM ENVIRONMENT'));
  assert.ok(html.includes('data-testid="workspace-code-input"'));
});

test('WorkspaceTestResults renders terminal logs, AI debug button on failure, and pass/fail status badge', () => {
  const failHtml = renderToStaticMarkup(
    React.createElement(WorkspaceTestResults, {
      output: { success: false, message: 'AssertionError: expected 42 got 0' },
      terminalLogs: ['[INFO] Running test suite...', '[ERROR] AssertionError: expected 42 got 0'],
      langFile: 'solution.py',
      onAskAiTutor: () => {},
      isCompleted: false,
    })
  );

  assert.ok(failHtml.includes('data-testid="workspace-test-results"'));
  assert.ok(failHtml.includes('data-testid="workspace-terminal"'));
  assert.ok(failHtml.includes('data-testid="btn-ask-ai-debug"'));
  assert.ok(failHtml.includes('data-testid="workspace-terminal-logs"'));
  assert.ok(failHtml.includes('data-testid="workspace-output-badge"'));
  assert.ok(failHtml.includes('data-status="fail"'));

  const passHtml = renderToStaticMarkup(
    React.createElement(WorkspaceTestResults, {
      output: { success: true, message: 'All 5 test cases passed!' },
      terminalLogs: ['[INFO] All 5 test cases passed!'],
      langFile: 'solution.py',
      onAskAiTutor: () => {},
      isCompleted: true,
    })
  );

  assert.ok(!passHtml.includes('data-testid="btn-ask-ai-debug"'));
  assert.ok(passHtml.includes('data-status="pass"'));
});

test('TeacherSelectScreen, CompletionScreen, and SubmitButtonsBar render deterministic testids', () => {
  const teacherHtml = renderToStaticMarkup(
    React.createElement(TeacherSelectScreen, {
      quest: { id: 'dsa-py-d1-assign-1', title: 'Two Sum Hash Map' },
      selectedTeacherId: 'kashyap',
      setSelectedTeacherId: () => {},
      pins: 50,
      onUnlockQuest: () => {},
    })
  );
  assert.ok(teacherHtml.includes('data-testid="teacher-select-screen"'));
  assert.ok(teacherHtml.includes('data-testid="teacher-card-kashyap"'));
  assert.ok(teacherHtml.includes('data-testid="btn-start-quest"'));

  const completionHtml = renderToStaticMarkup(
    React.createElement(CompletionScreen, {
      quest: { id: 'dsa-py-d1-assign-1', title: 'Two Sum Hash Map', xp: 150, pins: 5 },
      currentTeacher: TEACHERS[0],
      category: 'assignment',
    })
  );
  assert.ok(completionHtml.includes('data-testid="workspace-completion-screen"'));
  assert.ok(completionHtml.includes('data-testid="workspace-xp-reward"'));
  assert.ok(completionHtml.includes('data-testid="workspace-pins-reward"'));

  const submitHtml = renderToStaticMarkup(
    React.createElement(SubmitButtonsBar, {
      isExam: false,
      isCompleted: false,
      examTimedOut: false,
      onSubmit: () => {},
      onReset: () => {},
    })
  );
  assert.ok(submitHtml.includes('data-testid="workspace-submit-bar"'));
  assert.ok(submitHtml.includes('data-testid="btn-submit-workspace"'));
  assert.ok(submitHtml.includes('data-testid="btn-reset-workspace"'));
});
