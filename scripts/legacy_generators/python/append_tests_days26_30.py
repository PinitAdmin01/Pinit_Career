import os

test_code = """
test('Systems Long Lessons: git_vcs Day 26 GitHub Issues, Milestones & Project Boards: Agile Kanban Workflow Tracking Verification', async () => {
  const d26 = getLongLesson('git_vcs', 26);
  assert.ok(d26, 'git_vcs Day 26 must resolve');
  assert.equal(d26.day, 26);
  assert.equal(d26.parts.length, 5);

  const res1 = await executeBashSuite(d26.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GITHUB_ISSUES_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d26.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('LABEL_TAXONOMY_GOVERNANCE_VERIFIED'));

  const res3 = await executeBashSuite(d26.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MILESTONES_BURNDOWN_VELOCITY_VERIFIED'));

  const res4 = await executeBashSuite(d26.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('KANBAN_PROJECT_AUTOMATION_VERIFIED'));

  const res5 = await executeBashSuite(d26.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Agile Tracking Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 27 GitHub Actions CI/CD Basics: Automated Workflow Pipelines (.github/workflows) Verification', async () => {
  const d27 = getLongLesson('git_vcs', 27);
  assert.ok(d27, 'git_vcs Day 27 must resolve');
  assert.equal(d27.day, 27);
  assert.equal(d27.parts.length, 5);

  const res1 = await executeBashSuite(d27.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('ACTIONS_EVENT_RUNNER_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d27.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('WORKFLOW_YAML_ANATOMY_VERIFIED'));

  const res3 = await executeBashSuite(d27.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('ACTIONS_CACHE_SIMULATION_VERIFIED'));

  const res4 = await executeBashSuite(d27.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('MATRIX_STRATEGY_PARITY_VERIFIED'));

  const res5 = await executeBashSuite(d27.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Actions CI/CD Pipeline Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 28 Git Submodules & Monorepo Multi-Package Management: git submodule Mechanics Verification', async () => {
  const d28 = getLongLesson('git_vcs', 28);
  assert.ok(d28, 'git_vcs Day 28 must resolve');
  assert.equal(d28.day, 28);
  assert.equal(d28.parts.length, 5);

  const res1 = await executeBashSuite(d28.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('SUBMODULE_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d28.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SUBMODULE_ADD_AND_RECORD_VERIFIED'));

  const res3 = await executeBashSuite(d28.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CLONE_RECURSIVE_SUBMODULES_VERIFIED'));

  const res4 = await executeBashSuite(d28.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('SUBMODULE_PINNING_AND_UPDATE_VERIFIED'));

  const res5 = await executeBashSuite(d28.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Submodule Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 29 Git Hooks & Automated Pre-Commit Linting: Husky, Lint-Staged & Commitlint Verification', async () => {
  const d29 = getLongLesson('git_vcs', 29);
  assert.ok(d29, 'git_vcs Day 29 must resolve');
  assert.equal(d29.day, 29);
  assert.equal(d29.parts.length, 5);

  const res1 = await executeBashSuite(d29.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_HOOKS_ARCHITECTURE_VERIFIED'));

  const res2 = await executeBashSuite(d29.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HUSKY_HOOK_MANAGEMENT_VERIFIED'));

  const res3 = await executeBashSuite(d29.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('LINT_STAGED_TARGETED_EXECUTION_VERIFIED'));

  const res4 = await executeBashSuite(d29.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('COMMITLINT_GOVERNANCE_VERIFIED'));

  const res5 = await executeBashSuite(d29.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Automated Linting & Hook Governance Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 30 🏆 FINAL CAPSTONE: Sovereign Git, GitHub & Master Version Control Suite Verification', async () => {
  const d30 = getLongLesson('git_vcs', 30);
  assert.ok(d30, 'git_vcs Day 30 must resolve');
  assert.equal(d30.day, 30);
  assert.equal(d30.parts.length, 5);

  const res1 = await executeBashSuite(d30.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PILLAR1_FOUNDATIONS_VERIFIED'));

  const res2 = await executeBashSuite(d30.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('PILLAR2_BRANCHING_AND_RECOVERY_VERIFIED'));

  const res3 = await executeBashSuite(d30.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PILLAR3_HISTORY_AND_REMOTES_VERIFIED'));

  const res4 = await executeBashSuite(d30.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PILLAR4_COLLABORATION_AND_GOVERNANCE_VERIFIED'));

  const res5 = await executeBashSuite(d30.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Master Version Control Sovereign Index: 100/100'));
});
"""

target = "tests/systems_long_lessons_parity.test.ts"
with open(target, "r", encoding="utf-8") as f:
    content = f.read()

# Avoid duplicate append
if "git_vcs Day 26" in content:
    # Remove existing Day 26..30 tests if any
    idx = content.find("Systems Long Lessons: git_vcs Day 26")
    prev_test_idx = content.rfind("test('", 0, idx)
    content = content[:prev_test_idx].rstrip() + "\n\n"

content = content.rstrip() + "\n" + test_code.strip() + "\n"

with open(target, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully appended Days 26-30 tests to {target}!")
