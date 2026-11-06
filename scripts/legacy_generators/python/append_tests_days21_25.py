import os
import sys

def append_tests():
    test_file = "tests/systems_long_lessons_parity.test.ts"
    with open(test_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if Day 21 already present; if so, truncate before Day 21
    if "git_vcs Day 21" in content:
        print("Day 21 test already present. Truncating before Day 21...")
        idx = content.find("test('Systems Long Lessons: git_vcs Day 21")
        if idx != -1:
            content = content[:idx].rstrip() + "\n\n"

    new_tests = """test('Systems Long Lessons: git_vcs Day 21 ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine Verification', async () => {
  const d21 = getLongLesson('git_vcs', 21);
  assert.ok(d21, 'git_vcs Day 21 must resolve');
  assert.equal(d21.day, 21);
  assert.equal(d21.parts.length, 5);

  const res1 = await executeBashSuite(d21.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('LINEAR_REBASE_REPLAY_SYNTHESIS_VERIFIED'));

  const res2 = await executeBashSuite(d21.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('INTERACTIVE_SQUASH_CONSOLIDATION_VERIFIED'));

  const res3 = await executeBashSuite(d21.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CHERRY_PICK_PATCH_APPLICATION_VERIFIED'));

  const res4 = await executeBashSuite(d21.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('SSH_ED25519_REMOTE_HYGIENE_VERIFIED'));

  const res5 = await executeBashSuite(d21.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Milestone 3 Advanced Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 22 GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models Verification', async () => {
  const d22 = getLongLesson('git_vcs', 22);
  assert.ok(d22, 'git_vcs Day 22 must resolve');
  assert.equal(d22.day, 22);
  assert.equal(d22.parts.length, 5);

  const res1 = await executeBashSuite(d22.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('COLLABORATION_MODELS_CONTRASTED_VERIFIED'));

  const res2 = await executeBashSuite(d22.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('PR_LIFECYCLE_ANATOMY_VERIFIED'));

  const res3 = await executeBashSuite(d22.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PR_DESCRIPTION_AND_LINKING_VERIFIED'));

  const res4 = await executeBashSuite(d22.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CODEOWNERS_AND_REVIEWER_ORCHESTRATION_VERIFIED'));

  const res5 = await executeBashSuite(d22.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('GitHub Collaboration Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 23 Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals Verification', async () => {
  const d23 = getLongLesson('git_vcs', 23);
  assert.ok(d23, 'git_vcs Day 23 must resolve');
  assert.equal(d23.day, 23);
  assert.equal(d23.parts.length, 5);

  const res1 = await executeBashSuite(d23.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('DIFF_VIEWING_AND_NAVIGATION_VERIFIED'));

  const res2 = await executeBashSuite(d23.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('ACTIONABLE_INLINE_COMMENTS_VERIFIED'));

  const res3 = await executeBashSuite(d23.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GITHUB_SUGGESTED_CHANGES_VERIFIED'));

  const res4 = await executeBashSuite(d23.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REVIEW_VERDICTS_AND_LGTM_VERIFIED'));

  const res5 = await executeBashSuite(d23.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Code Review Mastery Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 24 GitHub Branch Protection Rules: Required CI Status Checks & Protected main Verification', async () => {
  const d24 = getLongLesson('git_vcs', 24);
  assert.ok(d24, 'git_vcs Day 24 must resolve');
  assert.equal(d24.day, 24);
  assert.equal(d24.parts.length, 5);

  const res1 = await executeBashSuite(d24.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('PROTECTED_BRANCH_RULES_VERIFIED'));

  const res2 = await executeBashSuite(d24.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REQUIRED_PR_REVIEWS_AND_CODEOWNERS_VERIFIED'));

  const res3 = await executeBashSuite(d24.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('REQUIRED_STATUS_CHECKS_VERIFIED'));

  const res4 = await executeBashSuite(d24.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('FORCE_PUSH_BLOCKING_AND_BYPASS_VERIFIED'));

  const res5 = await executeBashSuite(d24.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Branch Governance Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 25 Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow Verification', async () => {
  const d25 = getLongLesson('git_vcs', 25);
  assert.ok(d25, 'git_vcs Day 25 must resolve');
  assert.equal(d25.day, 25);
  assert.equal(d25.parts.length, 5);

  const res1 = await executeBashSuite(d25.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('TRUNK_BASED_DEVELOPMENT_VERIFIED'));

  const res2 = await executeBashSuite(d25.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('FEATURE_FLAGS_ARCHITECTURE_VERIFIED'));

  const res3 = await executeBashSuite(d25.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GITFLOW_BRANCHING_STRATEGY_VERIFIED'));

  const res4 = await executeBashSuite(d25.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('STRATEGY_SELECTION_RUBRIC_VERIFIED'));

  const res5 = await executeBashSuite(d25.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Branching Strategy Index: 100/100'));
});
"""

    if not content.endswith("\n"):
        content += "\n"
    content += new_tests

    with open(test_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Successfully appended Days 21-25 tests to {test_file}!")

if __name__ == "__main__":
    append_tests()
