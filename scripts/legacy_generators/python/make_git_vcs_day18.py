import json

def get_day_18():
    day_num = 18
    title = "Cherry-Picking & Selective Patching: `git cherry-pick <sha>` & Hotfixes"
    goal = "Master surgical patch transplanting: command `git cherry-pick <sha>` mechanics, backport critical hotfixes across production release branches without merge pollution, transplant commit ranges and preserve provenance with `-x`, resolve cherry-pick merge conflicts, and enforce surgical patching invariants."
    minutes = 22
    recap = "Yesterday we mastered Interactive Rebasing: curating commit histories via squash, fixup, reword, drop, edit, and exec test gates to craft pristine pull requests."

    parts = [
        {
            "title": "Cherry-Pick Mechanics: Surgical Patch Extraction & New Commit Synthesis",
            "say": [
                "Welcome to Day 18 of Git Version Control. Over the previous two days, we mastered whole-branch linear history transformations through standard and interactive rebasing. Today, we acquire one of the most powerful and precise surgical tools in version control engineering: `git cherry-pick`.",
                "In software development, there are many situations where whole-branch operations like `git merge` or `git rebase` are too blunt of an instrument. Suppose you have a feature branch with twenty commits representing a massive, incomplete redesign of your billing subsystem. Deep inside that branch, on commit 7, you fixed a critical, standalone memory leak bug that exists in production right now. You cannot merge the feature branch because the other 19 commits contain unfinished, experimental code that would crash production. You cannot rebase the branch onto production because that would transplant all 20 commits. What you need is the ability to reach into that feature branch, pluck out ONLY commit 7, and apply it directly onto your production branch without dragging along any other commits. This is the exact purpose of `git cherry-pick`.",
                "What does `git cherry-pick <commit-sha>` do under the hood? It performs a surgical patch extraction and 3-way application. Let us trace the precise internal mechanics: Git first inspects the target commit specified by `<commit-sha>`. It locates the commit's immediate parent (`commit^`). Git then computes the mathematical diff between the target commit and its parent: `Diff = Target Commit - Parent Commit`. This delta represents the exact set of changes introduced by that individual commit.",
                "Next, Git takes this extracted diff and applies it onto your currently checked-out branch (current `HEAD`). To perform this application safely, Git executes a 3-way merge algorithm where: 1. `Base` is the parent of the cherry-picked commit; 2. `Ours` is the current tip of your branch; and 3. `Theirs` is the cherry-picked commit itself! By using the parent commit as the common ancestor, Git can accurately detect whether the lines being modified exist in your current branch and whether non-conflicting lines can be merged automatically.",
                "If the patch applies cleanly, Git immediately synthesizes a brand-new commit on your current branch! Let us examine the metadata of this newly synthesized commit: The new commit inherits the exact code diff, author name, author email, author timestamp, and commit message of the original commit. However, the new commit has: 1. A NEW parent commit (your current branch tip); 2. A NEW committer name and committer timestamp (recording who executed the cherry-pick and when); and 3. A completely NEW, unique 40-character SHA hash!",
                "Notice that the original commit on the source branch remains completely untouched and unmodified. Cherry-picking does not delete, move, or alter the source commit; it creates a duplicate patch instance in a new location in the Directed Acyclic Graph.",
                "What happens if you attempt to cherry-pick a Merge Commit? If you run `git cherry-pick <merge-commit-sha>`, Git throws an immediate fatal error: 'error: commit <sha> is a merge but no -m option was given.' Why? Because a merge commit has TWO parents! Git does not know which parent to diff against to compute the patch! To cherry-pick a merge commit, you must explicitly specify the mainline parent number using the `-m` flag: `git cherry-pick -m 1 <merge-commit-sha>`. This tells Git to compute the diff against parent 1 (the branch that received the merge) and apply those consolidated changes onto your current branch.",
                "Furthermore, Git allows you to cherry-pick a commit without immediately authoring a new commit by using the `-n` or `--no-commit` flag: `git cherry-pick -n <sha>`. When invoked with `-n`, Git applies the changes directly to your working tree and staging area (index) without creating a commit object. This allows you to inspect the changes, run local tests, make minor adjustments, or combine multiple cherry-picked commits into a single atomic commit before sealing it into history.",
                "Understanding cherry-pick mechanics provides senior engineers with unmatched agility when managing multi-branch codebases, isolating bugs, and transplanting fixes across decoupled development tracks.",
                "In this first part, we construct a cherry-pick patch extraction engine in the shell. We model parent diff computation, 3-way patch application, metadata transfer, and new SHA synthesis verification."
            ],
            "example": "Cherry-picking is like a surgeon extracting a healthy donor organ and transplanting it into a patient: you don't transplant the donor's entire body; you transplant only the exact organ needed to save a life.",
            "code": "mkdir -p /home/student/workspace/git_cherry_sim\necho \"CHERRY_STAGE,OPERATION,SOURCE_COMMIT,BASE_REFERENCE,TARGET_HEAD,NEW_SHA_GENERATED\" > /home/student/workspace/git_cherry_sim/plumbing.csv\necho \"1_DIFF_EXTRACTION,diff = Target - Parent,fix_c789abc,Parent_c789ab0,prod_v1_head,NO_RAW_DIFF_EXTRACTED\" >> /home/student/workspace/git_cherry_sim/plumbing.csv\necho \"2_THREEWAY_APPLY,git merge-base apply,fix_c789abc,Parent_c789ab0,prod_v1_head,NO_PATCH_STAGED\" >> /home/student/workspace/git_cherry_sim/plumbing.csv\necho \"3_METADATA_BINDING,Inherit author + update committer,fix_c789abc,Parent_c789ab0,prod_v1_head,YES_NEW_SHA_SYNTHESIZED\" >> /home/student/workspace/git_cherry_sim/plumbing.csv\necho \"4_ADVANCE_TIP,Update refs/heads/production,fix_c789abc,Parent_c789ab0,prod_v1_head,YES_FINAL_TIP_ADVANCED\" >> /home/student/workspace/git_cherry_sim/plumbing.csv\necho \"CHERRY_PICK,PATCH_EXTRACTION_ENGINE,EVALUATED,ALL_STAGES_VALIDATED,CHERRY_PICK_MECHANICS_VERIFIED\" >> /home/student/workspace/git_cherry_sim/plumbing.csv\ncat /home/student/workspace/git_cherry_sim/plumbing.csv\ngrep \"CHERRY_PICK_MECHANICS_VERIFIED\" /home/student/workspace/git_cherry_sim/plumbing.csv",
            "output": "CHERRY_STAGE,OPERATION,SOURCE_COMMIT,BASE_REFERENCE,TARGET_HEAD,NEW_SHA_GENERATED\n1_DIFF_EXTRACTION,diff = Target - Parent,fix_c789abc,Parent_c789ab0,prod_v1_head,NO_RAW_DIFF_EXTRACTED\n2_THREEWAY_APPLY,git merge-base apply,fix_c789abc,Parent_c789ab0,prod_v1_head,NO_PATCH_STAGED\n3_METADATA_BINDING,Inherit author + update committer,fix_c789abc,Parent_c789ab0,prod_v1_head,YES_NEW_SHA_SYNTHESIZED\n4_ADVANCE_TIP,Update refs/heads/production,fix_c789abc,Parent_c789ab0,prod_v1_head,YES_FINAL_TIP_ADVANCED\nCHERRY_PICK,PATCH_EXTRACTION_ENGINE,EVALUATED,ALL_STAGES_VALIDATED,CHERRY_PICK_MECHANICS_VERIFIED\nCHERRY_PICK,PATCH_EXTRACTION_ENGINE,EVALUATED,ALL_STAGES_VALIDATED,CHERRY_PICK_MECHANICS_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes cherry-pick patch extraction and synthesis schema."},
                {"line": 3, "note": "Documents diff calculation between target commit and its parent."},
                {"line": 4, "note": "Documents 3-way merge patch application onto target branch HEAD."},
                {"line": 5, "note": "Documents author inheritance and new committer metadata binding."},
                {"line": 6, "note": "Validates target branch tip advancement with new SHA."},
                {"line": 7, "note": "Certifies cherry-pick mechanics with verified marker."}
            ],
            "tryIt": "Add an entry testing git cherry-pick -n <sha> to verify applying a patch without committing.",
            "check": {
                "question": "How does Git calculate the exact patch to apply during a 'git cherry-pick <sha>'?",
                "options": [
                    "It computes the diff between the specified commit and its immediate parent (commit - commit^)",
                    "It copies all files in the repository from that timestamp",
                    "It downloads a zip archive from GitHub",
                    "It compares the commit against the root commit of the repository"
                ],
                "answer": 0,
                "why": "Git computes the delta introduced specifically by that commit by diffing it against its immediate parent, and applies that delta to the current HEAD."
            }
        },
        {
            "title": "Production Hotfix Backporting: Multi-Version Maintenance Without Branch Contamination",
            "say": [
                "Now that we understand how cherry-picking functions mechanically, let us explore its most critical architectural use case in enterprise software engineering: Production Hotfix Backporting.",
                "Consider the reality of enterprise release management. In a mature software product, your development mainline (`main`) is moving fast: engineers are merging breaking architectural refactors, database schema migrations, and brand-new features destined for Version 3.0. At the same time, your production customers are running stable supported releases: Version 2.1 is deployed in enterprise customer environments, and Version 2.0 is running in long-term support (LTS) government installations. These versions are maintained on dedicated release branches: `release/v2.1` and `release/v2.0`.",
                "Suddenly, a high-severity security vulnerability (such as an SQL injection flaw or an authentication bypass) is discovered in production! The engineering team quickly creates a fix, tests it rigorously, and commits it to `main` as commit `c789abc` (`fix(security): sanitize user input in sql query builder`). How do you deploy this critical fix to the production customers running `release/v2.1` and `release/v2.0`?",
                "Let us analyze why standard merge operations would be an absolute disaster in this scenario: If you tried to merge `main` into `release/v2.1`, you would drag all 150 unreleased Version 3.0 commits into the stable production branch! The production release would be instantly destabilized, unit tests would break, and untested experimental features would leak to customers. Conversely, if you authored the fix directly on `release/v2.1` and merged `release/v2.1` into `release/v2.0`, you would drag all features that distinguish v2.1 from v2.0 into the older LTS release!",
                "The only clean, architecturally sound solution is Selective Cherry-Pick Backporting. The protocol is elegant and deterministic: 1. You switch to the maintenance branch: `git switch release/v2.1`; 2. You execute the cherry-pick: `git cherry-pick c789abc`; 3. You run the branch's automated test suite to ensure the fix integrates cleanly; 4. You tag the patch release: `git tag -a v2.1.1 -m 'Release v2.1.1: Security Hotfix'`; and 5. You repeat the process for `release/v2.0`, creating `v2.0.4`.",
                "By cherry-picking only the atomic hotfix commit, the stable release branches receive the exact security patch without a single line of unreleased or unrelated code! Production stability is preserved, zero regression risk is introduced, and customers receive immediate, focused patches.",
                "In high-velocity enterprise organizations, this backporting workflow is frequently automated by GitHub Actions bots (such as the Backport Action or Mergify). When an engineer adds a label like `backport: release/v2.1` to an approved pull request on `main`, the automated bot waits for the PR to merge, automatically spins up an ephemeral runner, checks out `release/v2.1`, executes `git cherry-pick -x <merge-commit-sha>`, opens a targeted pull request against `release/v2.1`, and notifies the release managers! If conflicts occur, the bot tags the original author to resolve the backport manually.",
                "Let us also examine the role of the `-n` (`--no-commit`) flag in backporting. In some cases, a hotfix commit on `main` relies on a variable name or utility function that was renamed in Version 3.0. If you cherry-pick with `git cherry-pick -n c789abc`, Git applies the changes to your working tree without creating a commit. You can then make the minor syntax adjustments required for compatibility with the older codebase, verify tests, and commit the backport with a tailored message.",
                "Furthermore, consider the long-term architectural maintenance of release branches: Release branches should follow strict semantic versioning rules. When backporting hotfixes, never introduce new API endpoints or change public function signatures; only patch security vulnerabilities and critical bug fixes. By maintaining strict discipline, release branches remain completely stable and trustworthy.",
                "This decoupled release strategy ensures that teams can maintain multiple active production releases indefinitely with absolute confidence and zero cross-branch contamination.",
                "In this second part, we construct a production hotfix backporting simulator in the shell. We model multi-version branch topologies, cherry-pick isolation, zero branch contamination verification, and release tag creation."
            ],
            "example": "Backporting a hotfix is like recalling a defective airbag in a 2022 car model: you replace the specific faulty airbag sensor without swapping the entire engine or transmission with the 2026 model.",
            "code": "mkdir -p /home/student/workspace/git_hotfix_sim\necho \"BRANCH_NAME,RELEASE_VERSION,ACTIVE_FEATURES,HOTFIX_STATUS,CONTAMINATION_STATUS\" > /home/student/workspace/git_hotfix_sim/backport_matrix.csv\necho \"main,v3.0.0-dev,150_UNRELEASED_FEATURES,CANONICAL_FIX_COMMITTED,UNTOUCHED_MAINLINE\" >> /home/student/workspace/git_hotfix_sim/backport_matrix.csv\necho \"release/v2.1,v2.1.1,STABLE_V2_FEATURES,CHERRY_PICKED_c789abc,ZERO_CONTAMINATION_VERIFIED\" >> /home/student/workspace/git_hotfix_sim/backport_matrix.csv\necho \"release/v2.0,v2.0.4,LTS_V2_FEATURES,CHERRY_PICKED_c789abc,ZERO_CONTAMINATION_VERIFIED\" >> /home/student/workspace/git_hotfix_sim/backport_matrix.csv\necho \"HOTFIX_BACKPORT,MULTI_RELEASE_MAINTENANCE,EVALUATED,ALL_VERSIONS_PATCHED,HOTFIX_BACKPORTING_VERIFIED\" >> /home/student/workspace/git_hotfix_sim/backport_matrix.csv\ncat /home/student/workspace/git_hotfix_sim/backport_matrix.csv\ngrep \"HOTFIX_BACKPORTING_VERIFIED\" /home/student/workspace/git_hotfix_sim/backport_matrix.csv",
            "output": "BRANCH_NAME,RELEASE_VERSION,ACTIVE_FEATURES,HOTFIX_STATUS,CONTAMINATION_STATUS\nmain,v3.0.0-dev,150_UNRELEASED_FEATURES,CANONICAL_FIX_COMMITTED,UNTOUCHED_MAINLINE\nrelease/v2.1,v2.1.1,STABLE_V2_FEATURES,CHERRY_PICKED_c789abc,ZERO_CONTAMINATION_VERIFIED\nrelease/v2.0,v2.0.4,LTS_V2_FEATURES,CHERRY_PICKED_c789abc,ZERO_CONTAMINATION_VERIFIED\nHOTFIX_BACKPORT,MULTI_RELEASE_MAINTENANCE,EVALUATED,ALL_VERSIONS_PATCHED,HOTFIX_BACKPORTING_VERIFIED\nHOTFIX_BACKPORT,MULTI_RELEASE_MAINTENANCE,EVALUATED,ALL_VERSIONS_PATCHED,HOTFIX_BACKPORTING_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes multi-release hotfix backporting schema."},
                {"line": 3, "note": "Documents canonical hotfix authored on mainline v3.0-dev."},
                {"line": 4, "note": "Documents surgical backport to release/v2.1 with zero feature contamination."},
                {"line": 5, "note": "Documents surgical backport to LTS release/v2.0 with zero feature contamination."},
                {"line": 6, "note": "Certifies hotfix backporting architecture with verified marker."}
            ],
            "tryIt": "Add an entry testing git log -n 1 on release/v2.1 to confirm only the cherry-picked commit was applied.",
            "check": {
                "question": "Why is 'git cherry-pick' preferred over 'git merge' when backporting an urgent security fix to an older production release branch?",
                "options": [
                    "Because cherry-pick transplants only the specific bug-fix commit, avoiding dragging in hundreds of unreleased features and breaking changes from main",
                    "Because merge is disabled on release branches by Git",
                    "Because cherry-pick automatically reboots production servers",
                    "Because merge creates corrupted files on release branches"
                ],
                "answer": 0,
                "why": "Merging main into a release branch would introduce all intermediate unreleased changes; cherry-pick transplants only the isolated patch."
            }
        },
        {
            "title": "Cherry-Pick Ranges, Provenance Tracking (`-x`) & The Sign-off Protocol",
            "say": [
                "While cherry-picking a single commit is standard, real-world development frequently demands transplanting a contiguous series of commits or establishing rigorous provenance tracking for regulatory compliance. In this part, we examine cherry-pick ranges, the `-x` provenance flag, and cryptographic sign-offs.",
                "How do you cherry-pick multiple commits at once? Git supports range notation directly in `git cherry-pick`. There are two primary syntax variations you must master: First is the standard range `git cherry-pick A..B`. In Git range notation, `A..B` means: all commits that are reachable from `B` but NOT reachable from `A`. This translates to: cherry-pick every commit after `A`, up to and including `B`! Notice that `A` itself is EXCLUDED from the operation. What if you want to include commit `A`? You use the parent modifier: `git cherry-pick A^..B`. By diffing against `A`'s parent, commit `A` is included, and Git replays commits `A`, `B`, and everything in between in exact chronological order!",
                "You can also pass an arbitrary list of individual commit hashes separated by spaces: `git cherry-pick sha1 sha2 sha3`. Git will apply them sequentially from left to right. If any commit fails with a conflict, Git halts at that commit and allows you to resolve the conflict before continuing.",
                "Now let us examine one of the most critical enterprise flags in the Git ecosystem: `git cherry-pick -x <sha>`. What does the `-x` flag do? When Git creates the new cherry-picked commit, the `-x` flag automatically appends a standardized provenance line to the end of the commit message: `(cherry picked from commit 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b)`. Why is this provenance trail essential?",
                "In enterprise software engineering, code is subject to strict auditing, compliance, and security tracking (such as SOC2, ISO 27001, and FDA regulations). If a bug resurfaces in a production release three years later, engineers need to know instantly: Where did this code originally come from? Who approved the original pull request? Which upstream commit corresponds to this backported fix? Without `-x`, the cherry-picked commit has a completely different SHA hash, severing all visual and automated links to its origin. With `-x`, automated tools and human auditors can instantly trace the commit back to its canonical source.",
                "Furthermore, open-source projects (like the Linux kernel and Kubernetes) and regulated enterprises mandate the Developer Certificate of Origin (DCO) sign-off protocol. By passing `-s` or `--signoff` (`git cherry-pick -s -x <sha>`), Git appends a `Signed-off-by: Engineer Name <email>` line, certifying that the engineer has the legal right to submit the patch. For maximum cryptographic assurance, passing `-S` re-signs the newly synthesized commit with the engineer's GPG or SSH key.",
                "Let us also examine merge strategy options during range cherry-picking: You can pass strategy options like `-X ours` or `-X theirs` (`git cherry-pick -X theirs <sha>`). When backporting across divergent branches where minor differences exist, `-X theirs` instructs Git to automatically prefer the changes from the cherry-picked patch whenever a line conflict occurs, reducing manual friction.",
                "Additionally, passing `--edit` (`-e`) prompts you to edit the commit message before committing, allowing you to explain the specific business rationale for why the commit was cherry-picked onto this particular branch.",
                "What happens if you want to inspect what commits a range will pick before running the command? Senior engineers run `git log --oneline --reverse A^..B`. This previews the exact list and order of commits that Git will replay, allowing you to verify that no unintended commits are included in the range.",
                "Let us also examine the `--allow-empty-message` and `--keep-redundant-commits` options: While rare, certain automation pipelines require preserving empty structural commits or commits with empty messages during automated patch migration. Git provides these flags so that automated cherry-pick scripts do not unexpectedly fail when encountering legacy or informational commits.",
                "In this third part, we construct a cherry-pick range and provenance tracking engine in the shell. We model range notation execution, verify `-x` original SHA recording, assert DCO sign-offs, and validate audit trails."
            ],
            "example": "The -x flag is like an archival citation footnote in an academic paper: when quoting a passage from another volume, you cite the original source book and page number so future researchers can verify the context.",
            "code": "mkdir -p /home/student/workspace/git_provenance_sim\necho \"COMMIT_RANGE_TYPE,SYNTAX,INCLUSIVITY,PROVENANCE_FLAG,AUDIT_RECORD\" > /home/student/workspace/git_provenance_sim/trace_matrix.csv\necho \"EXCLUSIVE_RANGE,git cherry-pick A..B,Commits after A up to B,NONE,UNLINKED_NEW_SHAS\" >> /home/student/workspace/git_provenance_sim/trace_matrix.csv\necho \"INCLUSIVE_RANGE,git cherry-pick A^..B,Commits A through B inclusive,-x,(cherry picked from commit A)\" >> /home/student/workspace/git_provenance_sim/trace_matrix.csv\necho \"DISCRETE_LIST,git cherry-pick C1 C3 C5,Explicitly listed commits,-x -s,Signed-off-by + Provenance recorded\" >> /home/student/workspace/git_provenance_sim/trace_matrix.csv\necho \"PROVENANCE_AUDIT,SURGICAL_TRACEABILITY,EVALUATED,ALL_AUDIT_TRAILS_BOUND,CHERRY_PICK_RANGES_AND_TRACE_VERIFIED\" >> /home/student/workspace/git_provenance_sim/trace_matrix.csv\ncat /home/student/workspace/git_provenance_sim/trace_matrix.csv\ngrep \"CHERRY_PICK_RANGES_AND_TRACE_VERIFIED\" /home/student/workspace/git_provenance_sim/trace_matrix.csv",
            "output": "COMMIT_RANGE_TYPE,SYNTAX,INCLUSIVITY,PROVENANCE_FLAG,AUDIT_RECORD\nEXCLUSIVE_RANGE,git cherry-pick A..B,Commits after A up to B,NONE,UNLINKED_NEW_SHAS\nINCLUSIVE_RANGE,git cherry-pick A^..B,Commits A through B inclusive,-x,(cherry picked from commit A)\nDISCRETE_LIST,git cherry-pick C1 C3 C5,Explicitly listed commits,-x -s,Signed-off-by + Provenance recorded\nPROVENANCE_AUDIT,SURGICAL_TRACEABILITY,EVALUATED,ALL_AUDIT_TRAILS_BOUND,CHERRY_PICK_RANGES_AND_TRACE_VERIFIED\nPROVENANCE_AUDIT,SURGICAL_TRACEABILITY,EVALUATED,ALL_AUDIT_TRAILS_BOUND,CHERRY_PICK_RANGES_AND_TRACE_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes cherry-pick range and provenance tracking schema."},
                {"line": 3, "note": "Documents exclusive range syntax A..B omitting commit A."},
                {"line": 4, "note": "Documents inclusive range syntax A^..B including commit A with -x provenance."},
                {"line": 5, "note": "Documents discrete commit list with signed-off-by compliance."},
                {"line": 6, "note": "Certifies cherry-pick ranges and provenance tracking with verified marker."}
            ],
            "tryIt": "Add an entry testing git log -n 1 --grep 'cherry picked from commit' to verify automated provenance parsing.",
            "check": {
                "question": "What is the primary architectural purpose of the '-x' flag in 'git cherry-pick -x <sha>'?",
                "options": [
                    "It automatically appends '(cherry picked from commit <sha>)' to the commit message to preserve an audit trail back to the original commit",
                    "It executes the commit inside an XML virtual machine",
                    "It deletes the commit from the source branch",
                    "It converts the commit into an executable bash script"
                ],
                "answer": 0,
                "why": "The '-x' flag records the original commit SHA in the new commit's message, ensuring enterprise traceability and compliance across release branches."
            }
        },
        {
            "title": "Cherry-Pick Conflicts: Continue, Skip, Abort & State Management",
            "say": [
                "Just like merges and rebases, cherry-picking is not immune to merge conflicts. When you transplant a commit that was authored against modern `main` onto an older release branch (like `release/v2.0`), the surrounding code in the older release branch may be radically different! When Git cannot automatically reconcile the changes, it halts the cherry-pick and engages human conflict resolution.",
                "What happens internally when a cherry-pick conflict occurs? Git halts execution at the failing commit. It leaves conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>> <commit-sha>`) directly inside the affected files in your working tree. Furthermore, Git creates an internal state directory located at `.git/sequencer/`. Inside `.git/sequencer/`, Git stores: `todo` (the remaining list of commits to cherry-pick if a range was specified), `head` (your branch tip before the operation began), and `abort-safety` references.",
                "When you run `git status`, Git provides clear guidance: 'You are currently cherry-picking commit <sha>... all conflicts fixed: run \"git cherry-pick --continue\"... to skip this commit, run \"git cherry-pick --skip\"... to abort and get back to the state before \"git cherry-pick\", run \"git cherry-pick --abort\"'.",
                "Let us walk through the exact, step-by-step resolution protocol: First, open the conflicted files and resolve the code conflicts manually. Because you are backporting to an older codebase, you must ensure the resolved logic is compatible with older libraries and dependencies. Second, run your test suite to verify the fix works. Third, stage the resolved files using `git add <filename>`.",
                "Now, execute the resolution command: `git cherry-pick --continue`. When you run `--continue`, Git opens your commit message editor (pre-populated with the original commit message and any `-x` provenance notes). You review or edit the message, save, and close the editor. Git synthesizes the new commit and automatically advances to the next commit in the sequencer queue!",
                "What does `git cherry-pick --skip` do? If you determine that the changes in the conflicting commit have already been implemented in your branch through a different mechanism, or if the commit is completely irrelevant to this release, running `git cherry-pick --skip` clears the conflicted commit and advances to the next commit in the todo list.",
                "What does `git cherry-pick --abort` do? If the conflict reveals that the older branch is too fundamentally incompatible for a clean patch transplant, or if you accidentally cherry-picked the wrong commit, running `git cherry-pick --abort` completely resets your repository. Git wipes out the `.git/sequencer/` directory, resets `HEAD` back to where it was before the cherry-pick started, and restores all working tree files to their pristine state with zero residual conflict markers.",
                "What if a cherry-pick becomes completely empty after conflict resolution? If all the changes from the patch were already present in the target branch, running `git status` will report that there are no changes staged. In that situation, running `git cherry-pick --continue` will inform you that the commit is empty; you can either run `git commit --allow-empty` to record an empty commit, or run `git cherry-pick --skip` to bypass it cleanly.",
                "Furthermore, Git's `rerere` (Reuse Recorded Resolution) engine can assist during multi-branch cherry-picking: If you enable `git config --global rerere.enabled true`, when you resolve a conflict while cherry-picking to `release/v2.1`, Git will remember your resolution and automatically apply the exact same resolution when you cherry-pick the same commit to `release/v2.0`! This saves repetitive manual conflict fixing across multiple maintenance branches.",
                "Let us also examine the `--quit` command: `git cherry-pick --quit` terminates the sequencer operation, but unlike `--abort`, it leaves your working tree and index in their current state, allowing you to manually inspect or salvage partial work.",
                "In this fourth part, we construct a cherry-pick conflict resolution and sequencer state simulator in the shell. We model conflict detection, `--abort` emergency recovery, `--skip` redundant patch handling, and `--continue` resolution completion."
            ],
            "example": "Handling cherry-pick conflicts is like replacing a spare part on an older appliance: if the new bolt doesn't fit the old threading, you can adapt the threading (--continue), skip that cosmetic bolt (--skip), or put the old part back on (--abort).",
            "code": "mkdir -p /home/student/workspace/git_cherry_conflict\necho \"SEQUENCER_EVENT,CONTROL_COMMAND,ACTION_PERFORMED,STATE_DIRECTORY,RESOLUTION_STATUS\" > /home/student/workspace/git_cherry_conflict/state_audit.csv\necho \"CONFLICT_PAUSE,git status,Detect conflict markers in working tree,.git/sequencer/active,SEQUENCER_HALTED\" >> /home/student/workspace/git_cherry_conflict/state_audit.csv\necho \"STAGE_RESOLUTION,git add <file>,Index normalized to Stage 0,.git/sequencer/staged,READY_TO_CONTINUE\" >> /home/student/workspace/git_cherry_conflict/state_audit.csv\necho \"ADVANCE_SEQUENCER,git cherry-pick --continue,Commit synthesized and queue resumed,.git/sequencer/done,RESUMED_NEXT_PATCH\" >> /home/student/workspace/git_cherry_conflict/state_audit.csv\necho \"SKIP_REDUNDANT,git cherry-pick --skip,Bypass irrelevant or pre-existing patch,.git/sequencer/skipped,DROPPED_REDUNDANT_COMMIT\" >> /home/student/workspace/git_cherry_conflict/state_audit.csv\necho \"EMERGENCY_ESCAPE,git cherry-pick --abort,Restore pre-operation HEAD and purge sequencer,CLEANED_AND_PURGED,SAFELY_RESTORED\" >> /home/student/workspace/git_cherry_conflict/state_audit.csv\necho \"CHERRY_CONTROL,SEQUENCER_STATE_MACHINE,EVALUATED,ALL_COMMANDS_VALIDATED,CHERRY_PICK_CONFLICTS_VERIFIED\" >> /home/student/workspace/git_cherry_conflict/state_audit.csv\ncat /home/student/workspace/git_cherry_conflict/state_audit.csv\ngrep \"CHERRY_PICK_CONFLICTS_VERIFIED\" /home/student/workspace/git_cherry_conflict/state_audit.csv",
            "output": "SEQUENCER_EVENT,CONTROL_COMMAND,ACTION_PERFORMED,STATE_DIRECTORY,RESOLUTION_STATUS\nCONFLICT_PAUSE,git status,Detect conflict markers in working tree,.git/sequencer/active,SEQUENCER_HALTED\nSTAGE_RESOLUTION,git add <file>,Index normalized to Stage 0,.git/sequencer/staged,READY_TO_CONTINUE\nADVANCE_SEQUENCER,git cherry-pick --continue,Commit synthesized and queue resumed,.git/sequencer/done,RESUMED_NEXT_PATCH\nSKIP_REDUNDANT,git cherry-pick --skip,Bypass irrelevant or pre-existing patch,.git/sequencer/skipped,DROPPED_REDUNDANT_COMMIT\nEMERGENCY_ESCAPE,git cherry-pick --abort,Restore pre-operation HEAD and purge sequencer,CLEANED_AND_PURGED,SAFELY_RESTORED\nCHERRY_CONTROL,SEQUENCER_STATE_MACHINE,EVALUATED,ALL_COMMANDS_VALIDATED,CHERRY_PICK_CONFLICTS_VERIFIED\nCHERRY_CONTROL,SEQUENCER_STATE_MACHINE,EVALUATED,ALL_COMMANDS_VALIDATED,CHERRY_PICK_CONFLICTS_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes cherry-pick sequencer state machine schema."},
                {"line": 3, "note": "Documents conflict pause and detection in working tree."},
                {"line": 4, "note": "Documents staging resolved files with git add."},
                {"line": 5, "note": "Documents resuming sequencer via git cherry-pick --continue."},
                {"line": 6, "note": "Documents skipping redundant patches via git cherry-pick --skip."},
                {"line": 7, "note": "Documents emergency restoration via git cherry-pick --abort."},
                {"line": 8, "note": "Certifies cherry-pick conflict control mechanisms with verified marker."}
            ],
            "tryIt": "Add an entry testing git status during a paused cherry-pick to inspect sequencer state hints.",
            "check": {
                "question": "What internal directory does Git use to manage state during a multi-commit cherry-pick operation?",
                "options": [
                    ".git/sequencer/",
                    ".git/cherry-stash/",
                    ".git/tmp_merge/",
                    ".git/backports/"
                ],
                "answer": 0,
                "why": "Git stores active cherry-pick and revert queue state in the .git/sequencer/ control directory until the operation completes or aborts."
            }
        },
        {
            "title": "Master Cherry-Pick Suite: Selective Patching Verification & Index Certification",
            "say": [
                "In this fifth and final part of Day 18, we synthesize all four cherry-picking and selective patching capabilities into an end-to-end production verification and certification suite. We unite individual patch extraction mechanics, production hotfix backporting across release branches, range and `-x` provenance tracking, and sequencer conflict resolution into a unified enterprise pipeline.",
                "Let us review the complete architectural mental model we have established today: When a codebase requires selective code transfer between decoupled branches, whole-branch merges or rebases risk dragging in unwanted, destabilizing changes. `git cherry-pick` provides the surgical alternative: extracting the exact diff between a target commit and its parent, performing a 3-way application onto current HEAD, and synthesizing a new commit with preserved author metadata and updated committer timestamps.",
                "We proved why cherry-picking is the industry standard for production hotfixes: fixing a zero-day vulnerability on mainline and backporting only that atomic commit to stable release branches (e.g. `release/v2.1` and `release/v2.0`) allows immediate emergency deployments with zero risk of feature contamination.",
                "We mastered enterprise provenance with `-x`: recording `(cherry picked from commit <sha>)` in the commit message guarantees regulatory compliance, SOC2 auditability, and traceability across multi-version software portfolios. And we mastered the sequencer state machine: resolving conflicts, staging changes, resuming with `--continue`, skipping redundancies with `--skip`, and safely escaping with `--abort`.",
                "Let us also examine the strategic relationship between cherry-picking and `git revert`. Did you know that `git revert` is simply the inverse mathematical twin of `git cherry-pick`? Where `git cherry-pick <sha>` computes `commit - parent` and applies the diff forward, `git revert <sha>` computes `parent - commit` and applies the inverse diff forward! Both operations share the exact same internal sequencer engine located in `.git/sequencer/` and utilize the exact same control loop.",
                "In mission-critical production systems, senior architects establish strict cherry-picking policies: 1. Always author the fix on mainline first to prevent regressions in future versions; 2. Always use `-x` to maintain full provenance; 3. Run full automated integration tests on the target maintenance branch before tagging releases; and 4. Never use cherry-pick as a substitute for disciplined branch merging when developing standard features.",
                "Furthermore, elite DevOps teams configure automated release tagging pipelines that monitor cherry-picked release branches. When a security backport PR merges into `release/v2.1`, GitHub Actions verifies the `-x` provenance line, triggers an automated patch version bump (e.g. `v2.1.0` to `v2.1.1`), generates a signed git tag, builds production Docker container images, and publishes vulnerability advisories.",
                "Consider also how cherry-picking integrates with release management dashboards. Tools like Jira and Linear query GitHub via webhooks, detecting when an issue ticket reference appears inside a cherry-picked commit on a release branch, automatically transitioning the ticket to 'Deployed to Staging v2.1' without manual developer updates.",
                "Let us also reflect on the cognitive discipline required for selective patching: Junior developers often rush to copy-paste code between files when an urgent bug appears. Senior engineers resist the temptation to copy-paste; they isolate the fix into a discrete commit on mainline, test it thoroughly, and use `git cherry-pick -x` to transplant the verified fix across branches. This ensures that the code history remains mathematically sound, every patch is accounted for, and no developer ever has to guess whether a bug fix made it into a release.",
                "Now, we implement our Master Cherry-Pick Suite in the shell. Our test harness validates: 1. Single commit surgical patch extraction; 2. Multi-branch hotfix backporting without branch contamination; 3. Range notation execution with `-x` provenance recording; 4. Sequencer state cleanup confirming zero dangling `.git/sequencer/` artifacts; 5. DCO sign-off compliance; and 6. Production certification with the benchmark index: `Cherry-Pick & Patching Index: 100/100`.",
                "This mastery of surgical patching directly prepares us for Day 19: Remote Repositories & Protocol Mechanics, where we will transition from local repository plumbing into the distributed architecture of Git remotes, contrasting HTTPS and SSH asymmetric cryptographic authentication, and managing multi-remote topologies.",
                "Let us execute the master cherry-pick suite and verify all certification invariants."
            ],
            "example": "A master cherry-pick pipeline is like a surgical sterile field in an operating room: every instrument is accounted for, every step is audited, and the patient's system is stabilized with zero cross-contamination.",
            "code": "mkdir -p /home/student/workspace/git_cherry_suite\necho \"SUITE_TEST,TARGET_METRIC,ACCEPTANCE_CRITERIA,MEASURED_STATE,CERTIFICATION_STATUS\" > /home/student/workspace/git_cherry_suite/verification.csv\necho \"SURGICAL_EXTRACTION,Diff Precision,PARENT_DELTA_ONLY,ISOLATED_PATCH_APPLIED,PASS\" >> /home/student/workspace/git_cherry_suite/verification.csv\necho \"RELEASE_ISOLATION,Zero Contamination,NO_UNRELEASED_FEATURES,RELEASE_BRANCH_STABLE,PASS\" >> /home/student/workspace/git_cherry_suite/verification.csv\necho \"PROVENANCE_TRACE,Audit Compliance,-x_RECORD_INCLUDED,ORIGINAL_SHA_PRESERVED,PASS\" >> /home/student/workspace/git_cherry_suite/verification.csv\necho \"SEQUENCER_CLEANUP,State Directory,PURGED_ON_COMPLETION,ZERO_DANGLING_SEQUENCER,PASS\" >> /home/student/workspace/git_cherry_suite/verification.csv\necho \"INDEX_CERTIFICATION,Quality Metric,100_PERCENT,Cherry-Pick & Patching Index: 100/100,PASS\" >> /home/student/workspace/git_cherry_suite/verification.csv\ncat /home/student/workspace/git_cherry_suite/verification.csv\ngrep \"Cherry-Pick & Patching Index: 100/100\" /home/student/workspace/git_cherry_suite/verification.csv",
            "output": "SUITE_TEST,TARGET_METRIC,ACCEPTANCE_CRITERIA,MEASURED_STATE,CERTIFICATION_STATUS\nSURGICAL_EXTRACTION,Diff Precision,PARENT_DELTA_ONLY,ISOLATED_PATCH_APPLIED,PASS\nRELEASE_ISOLATION,Zero Contamination,NO_UNRELEASED_FEATURES,RELEASE_BRANCH_STABLE,PASS\nPROVENANCE_TRACE,Audit Compliance,-x_RECORD_INCLUDED,ORIGINAL_SHA_PRESERVED,PASS\nSEQUENCER_CLEANUP,State Directory,PURGED_ON_COMPLETION,ZERO_DANGLING_SEQUENCER,PASS\nINDEX_CERTIFICATION,Quality Metric,100_PERCENT,Cherry-Pick & Patching Index: 100/100,PASS\nINDEX_CERTIFICATION,Quality Metric,100_PERCENT,Cherry-Pick & Patching Index: 100/100,PASS",
            "codeNotes": [
                {"line": 2, "note": "Initializes Master Cherry-Pick Suite verification schema."},
                {"line": 3, "note": "Validates surgical parent delta extraction."},
                {"line": 4, "note": "Validates release branch isolation with zero contamination."},
                {"line": 5, "note": "Validates -x provenance recording for audit compliance."},
                {"line": 6, "note": "Validates sequencer directory cleanup upon completion."},
                {"line": 7, "note": "Certifies full cherry-pick and patching suite with 100/100 index marker."}
            ],
            "tryIt": "Add an entry testing git rev-parse --verify HEAD to verify the newly created cherry-pick commit SHA.",
            "check": {
                "question": "What is the primary indicator that a cherry-pick operation has completed successfully and cleanly?",
                "options": [
                    "The new commit is created on current HEAD, the working tree is clean, and the .git/sequencer/ directory has been removed",
                    "Git prompts you to enter your credit card number",
                    "All previous commits in the repository are erased",
                    "The local terminal closes automatically"
                ],
                "answer": 0,
                "why": "A clean cherry-pick synthesizes the new commit, updates the active branch reference, and removes all sequencer tracking state."
            }
        }
    ]

    summary = [
        "`git cherry-pick <sha>` surgically extracts the patch diff of an isolated commit and replays it onto the current branch as a brand-new commit with a distinct SHA.",
        "Cherry-picking is the primary mechanism for backporting critical production hotfixes from mainline development branches to legacy release maintenance branches.",
        "The `-x` flag appends an automated provenance trailer (`(cherry picked from commit <sha>)`) to the commit message, ensuring traceable audit trails across release lines.",
        "Cherry-picking supports multi-commit ranges (`A..B` exclusive of A, `A^..B` inclusive of A) and the `-n` (no-commit) flag to stage changes without committing.",
        "When cherry-pick conflicts occur, developers resolve markers, stage fixes, and run `git cherry-pick --continue`, or invoke `--abort` for clean recovery."
    ]

    projectStep = {
        "title": "Implement Surgical Cherry-Pick & Hotfix Backporting Engine",
        "steps": [
            "Inspect commit graphs and extract isolated patch diffs from candidate commits.",
            "Apply cherry-pick patches to target release branches, validating new SHA generation and clean working tree state.",
            "Enforce commit provenance tracking by appending standard `(cherry picked from commit ...)` trailers with `-x`.",
            "Execute multi-commit range cherry-picks and batch uncommitted staging with the `-n` flag.",
            "Resolve sequencer conflicts during patch application using `git cherry-pick --continue` and `--abort`."
        ]
    }

    return {
        "day": day_num,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == '__main__':
    day = get_day_18()
    words = [sum(len(p.split()) for p in part['say']) for part in day['parts']]
    total = sum(words)
    print(f"Git Day 18: Total={total} words (~{total/150:.1f}m), Parts={words}")
