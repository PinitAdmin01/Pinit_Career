import os
import sys

def append_tests():
    test_file = "tests/systems_long_lessons_parity.test.ts"
    with open(test_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if Day 16 already present
    if "git_vcs Day 16 Rebase vs Merge Architecture" in content:
        print("Day 16 test already present. Truncating before Day 16...")
        idx = content.find("test('Systems Long Lessons: git_vcs Day 16")
        if idx != -1:
            content = content[:idx].rstrip() + "\n\n"

    new_tests = """test('Systems Long Lessons: git_vcs Day 16 Rebase vs Merge Architecture: Linear History Mechanics Verification', async () => {
  const d16 = getLongLesson('git_vcs', 16);
  assert.ok(d16, 'git_vcs Day 16 must resolve');
  assert.equal(d16.day, 16);
  assert.equal(d16.parts.length, 5);

  const res1 = await executeBashSuite(d16.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('REBASE_DAG_REPLAY_VERIFIED'));

  const res2 = await executeBashSuite(d16.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('REBASE_VS_MERGE_CHRONOLOGY_VERIFIED'));

  const res3 = await executeBashSuite(d16.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('GOLDEN_RULE_OF_REBASING_VERIFIED'));

  const res4 = await executeBashSuite(d16.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REBASE_CONFLICT_RESOLUTION_VERIFIED'));

  const res5 = await executeBashSuite(d16.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Linear Rebase Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 17 Interactive Rebasing (`git rebase -i`): Squashing, Rewording & Dropping Verification', async () => {
  const d17 = getLongLesson('git_vcs', 17);
  assert.ok(d17, 'git_vcs Day 17 must resolve');
  assert.equal(d17.day, 17);
  assert.equal(d17.parts.length, 5);

  const res1 = await executeBashSuite(d17.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('INTERACTIVE_TODO_GRAMMAR_VERIFIED'));

  const res2 = await executeBashSuite(d17.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('SQUASH_AND_FIXUP_CONSOLIDATION_VERIFIED'));

  const res3 = await executeBashSuite(d17.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('REWORD_AND_DROP_PURGE_VERIFIED'));

  const res4 = await executeBashSuite(d17.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('EDIT_SPLIT_AND_EXEC_VERIFIED'));

  const res5 = await executeBashSuite(d17.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Interactive Rebasing Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 18 Cherry-Picking & Selective Patching: `git cherry-pick <sha>` & Hotfixes Verification', async () => {
  const d18 = getLongLesson('git_vcs', 18);
  assert.ok(d18, 'git_vcs Day 18 must resolve');
  assert.equal(d18.day, 18);
  assert.equal(d18.parts.length, 5);

  const res1 = await executeBashSuite(d18.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('CHERRY_PICK_MECHANICS_VERIFIED'));

  const res2 = await executeBashSuite(d18.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HOTFIX_BACKPORTING_VERIFIED'));

  const res3 = await executeBashSuite(d18.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('CHERRY_PICK_RANGES_AND_TRACE_VERIFIED'));

  const res4 = await executeBashSuite(d18.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('CHERRY_PICK_CONFLICTS_VERIFIED'));

  const res5 = await executeBashSuite(d18.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Cherry-Pick & Patching Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 19 Remote Repositories & Protocol Mechanics: HTTPS, SSH Keys & Remote Management Verification', async () => {
  const d19 = getLongLesson('git_vcs', 19);
  assert.ok(d19, 'git_vcs Day 19 must resolve');
  assert.equal(d19.day, 19);
  assert.equal(d19.parts.length, 5);

  const res1 = await executeBashSuite(d19.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('REMOTE_CONFIG_AND_REFS_VERIFIED'));

  const res2 = await executeBashSuite(d19.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('HTTPS_VS_SSH_PROTOCOLS_VERIFIED'));

  const res3 = await executeBashSuite(d19.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('MULTI_REMOTE_ORCHESTRATION_VERIFIED'));

  const res4 = await executeBashSuite(d19.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('REMOTE_MANAGEMENT_PLUMBING_VERIFIED'));

  const res5 = await executeBashSuite(d19.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Remote Architecture Index: 100/100'));
});

test('Systems Long Lessons: git_vcs Day 20 Remote Synchronization Workflow: `git fetch`, `git pull --rebase` & Upstream Tracking Verification', async () => {
  const d20 = getLongLesson('git_vcs', 20);
  assert.ok(d20, 'git_vcs Day 20 must resolve');
  assert.equal(d20.day, 20);
  assert.equal(d20.parts.length, 5);

  const res1 = await executeBashSuite(d20.parts[0].code!);
  assert.equal(res1.allPassed, true);
  assert.ok(res1.stdout?.includes('GIT_FETCH_NON_DESTRUCTIVE_VERIFIED'));

  const res2 = await executeBashSuite(d20.parts[1].code!);
  assert.equal(res2.allPassed, true);
  assert.ok(res2.stdout?.includes('UPSTREAM_BRANCH_TRACKING_VERIFIED'));

  const res3 = await executeBashSuite(d20.parts[2].code!);
  assert.equal(res3.allPassed, true);
  assert.ok(res3.stdout?.includes('PULL_MERGE_BUBBLES_VERIFIED'));

  const res4 = await executeBashSuite(d20.parts[3].code!);
  assert.equal(res4.allPassed, true);
  assert.ok(res4.stdout?.includes('PULL_REBASE_LINEAR_SYNC_VERIFIED'));

  const res5 = await executeBashSuite(d20.parts[4].code!);
  assert.equal(res5.allPassed, true);
  assert.ok(res5.stdout?.includes('Remote Synchronization Index: 100/100'));
});
"""

    updated_content = content.rstrip() + "\n\n" + new_tests
    with open(test_file, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print("Successfully appended Days 16-20 tests to", test_file)

if __name__ == "__main__":
    append_tests()
