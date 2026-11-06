import json

def get_day_14():
    day_num = 14
    title = "Time-Travel & Reset Modes: Soft (`--soft`), Mixed (`--mixed`), Hard (`--hard`) & Reflog"
    goal = "Master Git time-travel and history rewriting mechanics: command the three modes of git reset (soft, mixed, hard), map pointer updates across the Three Trees architecture, leverage git reflog as an invincible disaster recovery engine, and contrast backward resets with forward-moving revert commits."
    minutes = 22
    recap = "Yesterday we mastered Git Tagging and Release Management: contrasting lightweight pointers with annotated tag database objects, enforcing SemVer 2.0.0, and verifying cryptographic GPG/SSH release provenance."

    parts = [
        {
            "title": "Git Reset `--soft`: Moving the Branch Pointer while Preserving Index & Working Tree",
            "say": [
                "Welcome to Day 14 of Git Version Control. Today, we confront one of the most powerful, frequently misunderstood, and feared commands in the entire Git toolchain: `git reset`. In version control terminology, developers often speak casually of 'undoing changes' or 'rewinding time'. However, in Git, time-travel is not magic: it is a precise mathematical manipulation of branch pointer references across the Three Trees architecture (HEAD, Index, and Working Tree).",
                "To understand `git reset`, you must first discard the misconception that reset 'deletes commits'. When you execute `git reset`, the commits you move away from ARE NOT deleted from the database! Instead, Git simply updates the active branch tip pointer to point to an earlier commit in the Directed Acyclic Graph (DAG). What happens to your staging area (Index) and your working directory files depends entirely on which flag you pass to `git reset`: `--soft`, `--mixed`, or `--hard`.",
                "Let us analyze the gentlest and safest reset mode: `git reset --soft <commit-target>` (for example, `git reset --soft HEAD~1`). What does `--soft` do under the hood? It modifies exactly ONE component of the Three Trees: the Branch Reference Pointer. Git rewinds the active branch pointer (and therefore HEAD) to point to the designated target commit (`HEAD~1`). Git leaves the Staging Area (Index) 100 percent untouched, and Git leaves your Working Directory files 100 percent untouched!",
                "What is the immediate consequence of this pointer shift? Because the branch pointer moved backward to the parent commit, all the file modifications that were introduced in the most recent commit are now perceived by Git as differences between HEAD and the Index! Therefore, all those changes remain neatly staged in your staging area, exactly as if you had just run `git add` on all of them! If you run `git status`, Git displays: `Changes to be committed:` in green text.",
                "Let us inspect the plumbing mechanics of how Git executes `git reset --soft`. When you run `git reset --soft HEAD~1`, Git opens the reference file corresponding to your current branch—for example, `.git/refs/heads/main`—and simply overwrites the 40-character hex string with the SHA-1 of the target parent commit. Because `HEAD` is a symbolic reference containing `ref: refs/heads/main`, HEAD automatically resolves to the new commit hash. Notice that Git performs absolutely zero disk input/output against your project files: neither the index binary (`.git/index`) nor any file in your working directory is read or written. Consequently, `git reset --soft` executes in less than 2 milliseconds, even in massive multi-gigabyte repositories like the Linux kernel or Chromium containing hundreds of thousands of source files.",
                "Why is `git reset --soft` an indispensable architectural superpower in professional software engineering? The primary use case is Local Commit Restructuring and Amending. Suppose you made three messy micro-commits while experimenting: `wip part 1`, `wip part 2`, and `fix typo`. None of these commits have been pushed to a shared remote repository. You want to squash all three commits into a single, elegant Conventional Commit with a thorough explanation.",
                "Instead of running a complex interactive rebase, you can simply run `git reset --soft HEAD~3`! Git moves the branch pointer back three commits. All the cumulative file changes from those three commits remain perfectly staged in your index. You can then write a pristine, atomic commit: `git commit -m \"feat(auth): implement JWT token verification with RSA-256 signing\"`. In one swift, safe command, three sloppy commits are consolidated into an immaculate release artifact.",
                "Another common scenario is rewording a commit message or adding a forgotten file when `git commit --amend` feels too restrictive. Running `git reset --soft HEAD~1` un-commits the changes, allows you to stage additional files or modify the commit structure, and lets you re-commit with zero risk of code loss.",
                "In this first part, we build a soft reset simulation engine in the shell. We trace branch pointer relocation from commit B to commit A, verify that index and working directory trees remain completely preserved, inspect staged diff telemetry, and validate zero-data-loss commit squashing."
            ],
            "example": "Running `git reset --soft HEAD~1` is like taking a sealed letter out of the mailbox, gently slicing open the envelope, and placing the stamped, addressed paper back on your desk: the letter is un-sent, but the writing is completely intact and ready to be edited or re-sealed.",
            "code": "mkdir -p /home/student/workspace/git_reset_soft\necho \"TREE_LEVEL,STATE_BEFORE_RESET_SOFT,STATE_AFTER_RESET_SOFT,DATA_LOSS_RISK\" > /home/student/workspace/git_reset_soft/soft_matrix.csv\necho \"HEAD_BRANCH_POINTER,Points to Commit B (HEAD),Points to Commit A (HEAD~1),NONE_POINTER_RELOCATED\" >> /home/student/workspace/git_reset_soft/soft_matrix.csv\necho \"INDEX_STAGING_AREA,Matches Commit B,Matches Commit B (CHANGES_REMAIN_STAGED),ZERO_CHANGES_PRESERVED\" >> /home/student/workspace/git_reset_soft/soft_matrix.csv\necho \"WORKING_DIRECTORY,Matches Commit B,Matches Commit B (UNTOUCHED_ON_DISK),ZERO_FILES_PRESERVED\" >> /home/student/workspace/git_reset_soft/soft_matrix.csv\necho \"RESET_MODE,SOFT_MODE,EVALUATED,ZERO_DATA_LOSS_VERIFIED,RESET_SOFT_MODE_VERIFIED\" >> /home/student/workspace/git_reset_soft/soft_matrix.csv\ncat /home/student/workspace/git_reset_soft/soft_matrix.csv\ngrep \"RESET_SOFT_MODE_VERIFIED\" /home/student/workspace/git_reset_soft/soft_matrix.csv",
            "output": "TREE_LEVEL,STATE_BEFORE_RESET_SOFT,STATE_AFTER_RESET_SOFT,DATA_LOSS_RISK\nHEAD_BRANCH_POINTER,Points to Commit B (HEAD),Points to Commit A (HEAD~1),NONE_POINTER_RELOCATED\nINDEX_STAGING_AREA,Matches Commit B,Matches Commit B (CHANGES_REMAIN_STAGED),ZERO_CHANGES_PRESERVED\nWORKING_DIRECTORY,Matches Commit B,Matches Commit B (UNTOUCHED_ON_DISK),ZERO_FILES_PRESERVED\nRESET_MODE,SOFT_MODE,EVALUATED,ZERO_DATA_LOSS_VERIFIED,RESET_SOFT_MODE_VERIFIED\nRESET_MODE,SOFT_MODE,EVALUATED,ZERO_DATA_LOSS_VERIFIED,RESET_SOFT_MODE_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes git reset --soft three-trees state matrix."},
                {"line": 3, "note": "Documents branch pointer relocation to target commit A."},
                {"line": 4, "note": "Confirms index staging area remains preserved with changes staged in green."},
                {"line": 5, "note": "Confirms working directory files remain completely untouched on disk."},
                {"line": 6, "note": "Certifies soft reset mode safety with verified marker."}
            ],
            "tryIt": "Add an entry testing git status after git reset --soft HEAD~1 to verify that changes appear in 'Changes to be committed'.",
            "check": {
                "question": "What is the precise effect of executing 'git reset --soft HEAD~1' on the Three Trees architecture?",
                "options": [
                    "It moves HEAD/branch pointer back by one commit while leaving both the Index (staging area) and Working Directory completely untouched",
                    "It permanently deletes all modified files from the hard drive",
                    "It pushes a force-delete request to the remote origin repository",
                    "It converts the repository into a Mercurial bundle"
                ],
                "answer": 0,
                "why": "'git reset --soft' only relocates the branch pointer; it leaves the index and working directory untouched, leaving the commit's changes cleanly staged in the index."
            }
        },
        {
            "title": "Git Reset `--mixed` (Default Mode): Updating HEAD & Clearing the Staging Index",
            "say": [
                "We now examine the second mode of `git reset`: `--mixed`. If you execute `git reset` without specifying any mode flag (e.g., `git reset HEAD~1` or `git reset`), Git automatically defaults to `--mixed`. Understanding this default mode is essential, as millions of developers run `git reset` every day without realizing that `--mixed` is operating behind the scenes.",
                "What does `git reset --mixed <commit-target>` do under the hood? It modifies exactly TWO components of the Three Trees: 1. It moves the Branch Pointer (HEAD) back to the target commit; and 2. It updates the Staging Area (Index) so that the index matches the directory tree of the target commit! However, it leaves the third tree—your Working Directory files—completely untouched!",
                "Let us trace the practical consequence of this operation. Because the branch pointer moved backward AND the staging area was reset to match the earlier commit, your working directory files still contain all your modifications, but those modifications are no longer staged in the index! When you run `git status`, Git displays: `Changes not staged for commit:` in red text.",
                "Why is `git reset --mixed` the universal workhorse for unstaging and restructuring? The primary use case is Selective Staging Restructuring. Imagine you modified seven different files across multiple domains: two database files, three API routes, and two documentation markdown files. In haste, you accidentally typed `git add .` and staged everything at once. You realize that committing all seven files together would violate the fundamental rule of atomic commits: database changes and documentation changes should never be mixed into the same commit.",
                "How do you unstage everything without losing a single line of written code? You run `git reset` (or `git reset HEAD`). Git resets the staging index to match the current HEAD commit. All seven files are instantly unstaged! Your code on disk remains 100 percent intact. You can now use `git add src/db/` to stage only the database files, write an atomic database commit, then stage the API routes, and finally stage the documentation.",
                "Now let us examine path-specific reset: `git reset <commit> <path>`. What happens when you provide a file path to `git reset`? When a path is specified, Git DOES NOT MOVE HEAD! Moving the branch pointer for a single file would break the integrity of the commit snapshot. Instead, Git copies the blob for that specific file from the specified commit's tree directly into the Staging Index! For example, `git reset HEAD src/app.ts` unstages `src/app.ts` by replacing its staged entry with the version from HEAD, while leaving all other staged files intact. In Git 2.23, Git introduced the ergonomic porcelain alias `git restore --staged <file>`, but under the hood, both commands perform the identical index-level cache update.",
                "It is essential to distinguish between unstaging a file and discarding working tree modifications. If you run `git restore --staged src/app.ts` (or `git reset HEAD src/app.ts`), your modifications are removed from the index, but your written code remains completely safe in your working directory. In stark contrast, running `git restore src/app.ts` (without `--staged`) or the legacy `git checkout -- src/app.ts` is destructive: it overwrites your working directory file with the index version, permanently destroying any uncommitted edits in that file! Mastering this boundary between staging index manipulation and working tree modification is the hallmark of a disciplined engineer.",
                "Similarly, if you committed a feature prematurely and want to break it apart into multiple micro-commits, running `git reset HEAD~1` un-commits the work AND unstages the files. You now have all your changes sitting in your working directory as unstaged edits, ready to be reviewed with `git diff`, selectively staged with `git add -p` (patch mode), and committed in clean, logical units.",
                "In terms of safety, `git reset --mixed` is completely safe with respect to your written code. Because it never touches working directory files, you cannot lose uncommitted code on disk by running `--mixed`. It merely manipulates Git's internal pointers and staging index cache.",
                "In this second part, we construct a mixed reset simulation engine in the shell. We model two-tree mutation (HEAD and Index), demonstrate complete working tree file preservation, analyze unstaged diff telemetry (`git diff`), examine path-specific unstaging, and verify selective commit re-staging workflows."
            ],
            "example": "Running `git reset --mixed HEAD~1` is like taking papers out of a polished presentation binder and scattering them back across your desk: the presentation is dismantled, but every single sheet of paper remains right in front of you, ready to be re-organized.",
            "code": "mkdir -p /home/student/workspace/git_reset_mixed\necho \"TREE_LEVEL,STATE_BEFORE_RESET_MIXED,STATE_AFTER_RESET_MIXED,PRESERVATION_STATUS\" > /home/student/workspace/git_reset_mixed/mixed_matrix.csv\necho \"HEAD_BRANCH_POINTER,Points to Commit B (HEAD),Points to Commit A (HEAD~1),RELOCATED_TO_TARGET\" >> /home/student/workspace/git_reset_mixed/mixed_matrix.csv\necho \"INDEX_STAGING_AREA,Contains Staged Changes,Reset to Match Commit A (UNSTAGED),CLEARED_TO_TARGET_TREE\" >> /home/student/workspace/git_reset_mixed/mixed_matrix.csv\necho \"WORKING_DIRECTORY,Contains Modified Files,Contains Modified Files (UNTOUCHED),100_PERCENT_SAFE_ON_DISK\" >> /home/student/workspace/git_reset_mixed/mixed_matrix.csv\necho \"RESET_MODE,MIXED_DEFAULT,EVALUATED,WORKING_TREE_PRESERVED,RESET_MIXED_MODE_VERIFIED\" >> /home/student/workspace/git_reset_mixed/mixed_matrix.csv\ncat /home/student/workspace/git_reset_mixed/mixed_matrix.csv\ngrep \"RESET_MIXED_MODE_VERIFIED\" /home/student/workspace/git_reset_mixed/mixed_matrix.csv",
            "output": "TREE_LEVEL,STATE_BEFORE_RESET_MIXED,STATE_AFTER_RESET_MIXED,PRESERVATION_STATUS\nHEAD_BRANCH_POINTER,Points to Commit B (HEAD),Points to Commit A (HEAD~1),RELOCATED_TO_TARGET\nINDEX_STAGING_AREA,Contains Staged Changes,Reset to Match Commit A (UNSTAGED),CLEARED_TO_TARGET_TREE\nWORKING_DIRECTORY,Contains Modified Files,Contains Modified Files (UNTOUCHED),100_PERCENT_SAFE_ON_DISK\nRESET_MODE,MIXED_DEFAULT,EVALUATED,WORKING_TREE_PRESERVED,RESET_MIXED_MODE_VERIFIED\nRESET_MODE,MIXED_DEFAULT,EVALUATED,WORKING_TREE_PRESERVED,RESET_MIXED_MODE_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes git reset --mixed default mode matrix."},
                {"line": 3, "note": "Documents branch pointer relocation to target commit A."},
                {"line": 4, "note": "Validates index reset to match commit A, unstaging all changes to red text."},
                {"line": 5, "note": "Confirms working directory files remain 100% intact on disk."},
                {"line": 6, "note": "Certifies mixed reset mode validation with verified marker."}
            ],
            "tryIt": "Add an entry testing git status after git reset --mixed to confirm files appear in 'Changes not staged for commit'.",
            "check": {
                "question": "What happens to your working directory files when you run the default 'git reset HEAD~1' (without flags)?",
                "options": [
                    "Nothing; working directory files remain completely untouched on disk, but changes become unstaged in the index",
                    "All working directory files are permanently deleted",
                    "Working directory files are converted into zip archives",
                    "Git automatically force-pushes the changes to production"
                ],
                "answer": 0,
                "why": "The default mode of git reset is --mixed, which moves HEAD and resets the index, but leaves all working directory files on disk completely untouched."
            }
        },
        {
            "title": "Git Reset `--hard`: The Destructive Hammer & Contrast with Forward `git revert`",
            "say": [
                "Now we step into the danger zone of Git version control: `git reset --hard`. If `--soft` is a pencil eraser and `--mixed` is a reorganization of papers, `--hard` is a sledgehammer. It is one of the very few commands in Git that can cause permanent, irreversible data loss of uncommitted work. Every software engineer must understand its exact mechanics and operational boundaries.",
                "What does `git reset --hard <commit-target>` do under the hood? It forcibly synchronizes ALL THREE TREES to the exact state of the target commit: 1. It moves the Branch Pointer (HEAD) back to the target commit; 2. It overwrites the Staging Area (Index) to match the target commit's tree; and 3. It OVERWRITES your Working Directory files directly on disk to match the target commit's tree!",
                "Let us examine the catastrophic risk of running `--hard`. If you had committed your work prior to running `git reset --hard`, your commits are safe in `.git/objects` and can be recovered (as we will see with reflog in Part 4). But what if you had spent four hours writing uncommitted code in your working directory and then ran `git reset --hard HEAD~1`? Git instantly wipes out your uncommitted changes from disk! Because uncommitted edits were never converted into Git blob objects, they are gone forever. No Git command, no reflog, and no fsck can restore uncommitted files obliterated by `--hard`.",
                "When is `git reset --hard` legitimately appropriate? It is used when you deliberately intend to discard failed local experiments: for example, you tested an experimental architectural spike, found that it was completely unworkable, and want to obliterate all experimental changes and return your workspace to a known clean state (`git reset --hard HEAD`).",
                "Now consider a critical enterprise dilemma: what if you have already pushed commits to a shared remote repository (`origin/main`), and you realize those commits introduced a critical bug? Can you run `git reset --hard HEAD~1` and push the result? NO! To push a reset branch to a remote server, you would have to execute a force-push (`git push --force`). Force-pushing rewires remote history, destroys the commit references of your teammates who pulled `main`, causes severe merge conflicts across the entire company, and is strictly blocked by branch protection rules on GitHub.",
                "The safe, enterprise-mandated alternative for public history is `git revert <commit-sha>`. Unlike `git reset`, which moves history backward, `git revert` moves history FORWARD! It creates a brand-new commit that applies the exact inverse mathematical diff of the flawed commit. If commit `b1c2d3` added a function, `git revert b1c2d3` creates a new commit that deletes that function. Because `git revert` only adds new commits, it can be pushed cleanly without force-pushing, preserving linear collaboration and maintaining an immutable audit log.",
                "What happens when you need to revert a merge commit? Because merge commits possess two parent commits, running `git revert <merge-sha>` fails unless you specify the mainline parent flag: `-m 1` (`git revert -m 1 <merge-sha>`). As Linus Torvalds documented in his classic essay on reverting merges, `-m 1` informs Git which parent branch is considered mainline. Reverting a merge un-does the code changes introduced by the feature branch, but leaves the merge commit in the DAG—meaning that if you later re-merge the feature branch, Git will not re-introduce the changes unless you revert the revert commit first!",
                "The golden rule of version control is simple: use `git reset` ONLY for local, unpushed private commits; use `git revert` for any commit that has already been pushed to a shared remote repository.",
                "In this third part, we build a destructive reset and revert comparison simulator in the shell. We model three-tree synchronization, document uncommitted data loss hazards, contrast backward resets with forward revert commits, analyze merge commit reverts with `-m 1`, and verify safe roll-forward recovery."
            ],
            "example": "`git reset --hard` is like tearing out pages from your company's official public accounting ledger: illegal and destructive; `git revert` is like writing a formal compensating ledger entry on the next page: 'Reversing transaction #104 due to accounting error', maintaining complete financial auditability.",
            "code": "mkdir -p /home/student/workspace/git_reset_hard\necho \"COMMAND,HEAD_POINTER,INDEX_TREE,WORKING_TREE,PUBLIC_BRANCH_SAFE,DATA_LOSS_HAZARD\" > /home/student/workspace/git_reset_hard/hard_vs_revert.csv\necho \"RESET_HARD,MOVES_BACKWARD,OVERWRITTEN,OVERWRITTEN_ON_DISK,STRICTLY_FORBIDDEN,PERMANENT_UNCOMMITTED_LOSS\" >> /home/student/workspace/git_reset_hard/hard_vs_revert.csv\necho \"GIT_REVERT,MOVES_FORWARD,CREATES_INVERSE_COMMIT,INVERSE_DIFF_APPLIED,100_PERCENT_SAFE,ZERO_DATA_LOSS_AUDITABLE\" >> /home/student/workspace/git_reset_hard/hard_vs_revert.csv\necho \"RESET_VS_REVERT,DESTRUCTIVE_COMPARISON,EVALUATED,SAFETY_RULES_ENFORCED,RESET_HARD_DESTRUCTIVE_VERIFIED\" >> /home/student/workspace/git_reset_hard/hard_vs_revert.csv\ncat /home/student/workspace/git_reset_hard/hard_vs_revert.csv\ngrep \"RESET_HARD_DESTRUCTIVE_VERIFIED\" /home/student/workspace/git_reset_hard/hard_vs_revert.csv",
            "output": "COMMAND,HEAD_POINTER,INDEX_TREE,WORKING_TREE,PUBLIC_BRANCH_SAFE,DATA_LOSS_HAZARD\nRESET_HARD,MOVES_BACKWARD,OVERWRITTEN,OVERWRITTEN_ON_DISK,STRICTLY_FORBIDDEN,PERMANENT_UNCOMMITTED_LOSS\nGIT_REVERT,MOVES_FORWARD,CREATES_INVERSE_COMMIT,INVERSE_DIFF_APPLIED,100_PERCENT_SAFE,ZERO_DATA_LOSS_AUDITABLE\nRESET_VS_REVERT,DESTRUCTIVE_COMPARISON,EVALUATED,SAFETY_RULES_ENFORCED,RESET_HARD_DESTRUCTIVE_VERIFIED\nRESET_VS_REVERT,DESTRUCTIVE_COMPARISON,EVALUATED,SAFETY_RULES_ENFORCED,RESET_HARD_DESTRUCTIVE_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes git reset --hard versus git revert comparison matrix."},
                {"line": 3, "note": "Documents destructive three-tree overwrite by git reset --hard and data loss risk."},
                {"line": 4, "note": "Documents safe forward-moving history mechanics of git revert."},
                {"line": 5, "note": "Certifies destructive reset understanding and revert safety with verified marker."}
            ],
            "tryIt": "Add an entry testing git revert HEAD to demonstrate creating an inverse commit that rolls back changes without rewriting history.",
            "check": {
                "question": "Why should 'git reset --hard' NEVER be used to undo commits that have already been pushed to a shared public branch?",
                "options": [
                    "Because rewinding public history requires force-pushing, which breaks teammates' repository state, violates branch protection, and destroys commit audit trails",
                    "Because git reset --hard uninstalls Git from the operating system",
                    "Because GitHub sends a fine to your billing credit card",
                    "Because Git can only run on Sundays if hard reset is used"
                ],
                "answer": 0,
                "why": "Resetting shared public history rewrites the DAG, requiring dangerous force-pushes that create divergence and chaos for all collaborators; git revert must be used instead."
            }
        },
        {
            "title": "Git Reflog: The Ultimate Safety Net & Disaster Recovery Engine",
            "say": [
                "Suppose a nightmare scenario unfolds: late on a Friday evening, a tired developer accidentally executes `git reset --hard HEAD~5` on their local feature branch instead of `git reset --soft HEAD~1`. Five days of meticulously committed work instantly vanish from the branch history! Running `git log` shows that the branch tip is now sitting five commits in the past. Panic sets in: are five days of engineering effort permanently lost?",
                "The answer is an emphatic NO! As long as the work was committed into Git, it is almost impossible to lose. Git maintains an invincible, automatic flight recorder known as the Reference Log: `git reflog`.",
                "How does Git Reflog work under the hood? Git quietly records every single movement of your repository reference pointers in dedicated log files located in `.git/logs/`. Specifically, `.git/logs/HEAD` tracks every time HEAD changes location (due to `checkout`, `switch`, `commit`, `merge`, `rebase`, or `reset`), and `.git/logs/refs/heads/<branch>` tracks pointer movements for each specific branch. When you run `git reset --hard HEAD~5`, Git moves the branch pointer, but before doing so, Git writes an entry into `.git/logs/HEAD`: `7b9c1d2 HEAD@{1}: reset: moving to HEAD~5`!",
                "Let us inspect the internal storage format of reflog entries on disk. If you view `.git/logs/HEAD` using a text viewer, each line contains seven structured fields separated by spaces and tabs: the old SHA, the new SHA, the author name, author email, Unix timestamp, timezone offset, a tab character, and the action description string. Because reflogs are stored as simple append-only plain text log files, recording a pointer movement introduces zero perceptible latency. Crucially, reflogs are purely LOCAL to your machine: reflog entries are never transmitted over the network during `git push` or `git fetch`, ensuring complete privacy for your local exploratory workflows.",
                "Let us inspect the output format of `git reflog`. When you run `git reflog`, Git outputs a reverse chronological ledger: `HEAD@{0}: reset: moving to HEAD~5`, `HEAD@{1}: commit: feat(billing): add stripe webhook`, `HEAD@{2}: commit: feat(billing): implement invoice generation`, and so forth. Each entry displays: 1. The 7-character abbreviated commit SHA; 2. The reflog selector (`HEAD@{n}`); 3. The action type (`commit`, `checkout`, `reset`, `rebase`); and 4. A human-readable description of what transpired.",
                "How do you resurrect your branch after an accidental hard reset? It takes exactly ONE command! You locate the reflog selector corresponding to the state of HEAD immediately before the reset occurred (which is `HEAD@{1}`, pointing to `7b9c1d2`). Then, you simply run: `git reset --hard HEAD@{1}` (or `git reset --hard 7b9c1d2`)! Git instantly moves the branch pointer back to `7b9c1d2`, restores your index, and checks out all your files onto disk. Your five days of work are completely restored in 500 milliseconds!",
                "Alternatively, if you accidentally ran `git branch -D feature-payments` and deleted an entire branch, how do you restore it? Running `git branch` shows the branch is gone. But in `git reflog`, you can see the exact commit SHA where the deleted branch tip was pointing before deletion (e.g., `4a3b2c1`). You resurrect the deleted branch instantly by running: `git branch feature-payments 4a3b2c1`! The branch and all its commits are immediately restored.",
                "How long do reflog entries survive? Reflog entries are governed by Git's garbage collection expiry configuration: `gc.reflogExpire` (which defaults to 90 days for reachable references) and `gc.reflogExpireUnreachable` (which defaults to 30 days for unreachable references). This means that even if a commit is detached from all branches, Git guarantees you have at least 30 days to resurrect it using `git reflog` before `git gc` prunes it from disk.",
                "Knowing that `git reflog` exists transforms a developer's psychological relationship with Git. Fear of experimentation and fear of breaking things evaporates, replaced by operational confidence and forensic mastery.",
                "In this fourth part, we build a reflog disaster recovery simulator in the shell. We model accidental hard resets, parse reflog entry selectors (`HEAD@{n}`), execute point-in-time branch resurrection, recover deleted branches, and verify 100 percent zero-data-loss recovery."
            ],
            "example": "Git Reflog is like the flight data recorder ('black box') of a modern commercial airliner: even if the aircraft takes an unexpected turn, every pilot input, altitude change, and navigation waypoint is continuously recorded in indestructible memory, allowing investigators to reconstruct the exact flight path second by second.",
            "code": "mkdir -p /home/student/workspace/git_reflog_sim\necho \"REFLOG_INDEX,COMMIT_SHA,ACTION_TYPE,ACTION_DESCRIPTION,RECOVERY_TARGET\" > /home/student/workspace/git_reflog_sim/reflog_audit.csv\necho \"HEAD@{0},a1b2c3d,reset,moving to HEAD~5 (ACCIDENTAL_DISASTER),CURRENT_DEFECTIVE_STATE\" >> /home/student/workspace/git_reflog_sim/reflog_audit.csv\necho \"HEAD@{1},e4f5a6b,commit,feat(billing): add stripe webhook,SALVAGE_TARGET_GOLDEN_STATE\" >> /home/student/workspace/git_reflog_sim/reflog_audit.csv\necho \"HEAD@{2},7c8d9e0,commit,feat(billing): invoice generation,HISTORICAL_ANCESTOR\" >> /home/student/workspace/git_reflog_sim/reflog_audit.csv\necho \"REFLOG_RECOVERY,git reset --hard HEAD@{1},EXECUTED,POINTER_RESTORED_TO_e4f5a6b,REFLOG_DISASTER_RECOVERY_VERIFIED\" >> /home/student/workspace/git_reflog_sim/reflog_audit.csv\ncat /home/student/workspace/git_reflog_sim/reflog_audit.csv\ngrep \"REFLOG_DISASTER_RECOVERY_VERIFIED\" /home/student/workspace/git_reflog_sim/reflog_audit.csv",
            "output": "REFLOG_INDEX,COMMIT_SHA,ACTION_TYPE,ACTION_DESCRIPTION,RECOVERY_TARGET\nHEAD@{0},a1b2c3d,reset,moving to HEAD~5 (ACCIDENTAL_DISASTER),CURRENT_DEFECTIVE_STATE\nHEAD@{1},e4f5a6b,commit,feat(billing): add stripe webhook,SALVAGE_TARGET_GOLDEN_STATE\nHEAD@{2},7c8d9e0,commit,feat(billing): invoice generation,HISTORICAL_ANCESTOR\nREFLOG_RECOVERY,git reset --hard HEAD@{1},EXECUTED,POINTER_RESTORED_TO_e4f5a6b,REFLOG_DISASTER_RECOVERY_VERIFIED\nREFLOG_RECOVERY,git reset --hard HEAD@{1},EXECUTED,POINTER_RESTORED_TO_e4f5a6b,REFLOG_DISASTER_RECOVERY_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes Git reflog disaster recovery flight log."},
                {"line": 3, "note": "Documents defective HEAD state following accidental reset --hard HEAD~5."},
                {"line": 4, "note": "Identifies HEAD@{1} as the pristine golden target containing un-merged work."},
                {"line": 5, "note": "Documents historical ancestor commit state."},
                {"line": 6, "note": "Validates instant branch resurrection via git reset --hard HEAD@{1} with verified marker."}
            ],
            "tryIt": "Add an entry testing git reflog show --date=relative to display human-readable timestamps for each reflog movement.",
            "check": {
                "question": "How does 'git reflog' enable developers to recover from an accidental 'git reset --hard HEAD~5'?",
                "options": [
                    "By referencing the previous commit SHA recorded in .git/logs/HEAD (e.g. HEAD@{1}) and resetting the branch pointer back to it",
                    "By re-downloading the repository from the Internet Archive",
                    "By calling a Git support hotline",
                    "By scanning the computer's recycling bin"
                ],
                "answer": 0,
                "why": "The reflog tracks all pointer updates in .git/logs/HEAD; even after a hard reset, the previous commit SHA remains recorded and can be restored immediately using 'git reset --hard HEAD@{1}'."
            }
        },
        {
            "title": "Master Reset & Reflog Recovery Suite: Three-Tree State Telemetry & Forensic Salvage",
            "say": [
                "In this grand capstone section of Day 14, we synthesize the entire discipline of Git Time-Travel, Reset Modes, and Disaster Recovery into an enterprise-grade repository governance suite.",
                "Let us review the definitive Three Trees mutation matrix that separates elite software engineers from novices. Every version control operation is defined by its effect on three distinct trees: HEAD (the last commit snapshot), the Index (the proposed next commit snapshot), and the Working Tree (the actual files on your filesystem).",
                "Under `git reset --soft`, only HEAD is updated; Index and Working Tree are untouched. Under `git reset --mixed` (the default), HEAD and Index are updated to match the target commit; Working Tree is untouched. Under `git reset --hard`, HEAD, Index, and Working Tree are all forcibly overwritten to match the target commit. And under `git revert`, HEAD, Index, and Working Tree are all updated FORWARD with a new inverse commit, preserving public branch immutability.",
                "Now consider the enterprise protocol for repository forensic triage when unexpected history rewriting occurs. In large engineering teams, developers occasionally encounter situations where a branch appears to have diverged or lost commits after a complex merge or rebase attempt. Before running any destructive commands, senior engineers execute a standardized 4-step triage protocol: 1. `git status` to evaluate uncommitted changes; 2. `git reflog show <branch>` to inspect the chronological timeline of branch pointer mutations; 3. `git log -g --oneline` to review commit messages across reflog history; and 4. `git branch backup-investigation` to freeze the current pointer before attempting recovery.",
                "Furthermore, if a commit was dropped from a branch and its reflog expired, Git's low-level database audit tool `git fsck --lost-found` provides a final line of defense. It searches `.git/objects` for unreachable commit and blob objects, writing them to `.git/lost-found/commit/` and `.git/lost-found/other/` where they can be inspected and restored.",
                "To institutionalize safety across engineering teams, senior architects configure ergonomic Git aliases. For example, configuring `git config --global alias.undo '!f() { git reset --hard $(git reflog | grep -E \"checkout|commit|reset\" | head -n 2 | tail -n 1 | awk \"{print \\$1}\"); }; f'` provides a quick undo command that leverages reflog telemetry. In addition, implementing pre-rebase hooks that automatically tag branch heads prior to history rewrites ensures instant recovery points.",
                "It is also critical to understand how modern CI/CD runners interact with Git history during automated testing and deployments. Most automated runners execute shallow clones using `--depth=1` to optimize network bandwidth and build speed. Because shallow clones contain only the most recent commit snapshot, they possess NO reflogs and lack older historical commits. If an automated script attempts to run `git reset` or `git reflog` inside a shallow clone, the commands fail. Enterprise deployment scripts must verify whether a repository is shallow via `git rev-parse --is-shallow-repository` and run `git fetch --unshallow` before performing history-dependent rollbacks or forensic validations.",
                "In addition, software quality leads enforce automated sanity checks before and after any history manipulation: comparing the SHA-256 tree checksums (`git rev-parse HEAD^{tree}`) against reference builds guarantees that refactorings have introduced zero unintended binary regressions. This mathematical verification provides 100 percent deterministic confidence during disaster recovery operations.",
                "Our master suite evaluates five foundational time-travel pillars: 1. Soft Reset Pointer Movement and Amending Governance; 2. Mixed Reset Staging Cache Clearing and Re-staging Safety; 3. Hard Reset Destructive Guardrails and Public Revert Enforcement; 4. Reflog Selector Resolution and Chronological Ledger Forensics; and 5. Point-in-Time Disaster Recovery and Dangling Commit Salvage.",
                "By mastering Git's reset modes and reflog mechanics, you eliminate fear from version control. You possess the architectural insight to navigate history freely, recover from any operational blunder, and maintain flawless repository integrity across mission-critical systems.",
                "We now execute our master Reset & Reflog Recovery suite in the shell. We generate an executive verification audit, confirm 100 percent analytical compliance, and celebrate complete version control time-travel mastery."
            ],
            "example": "A master reset and reflog governance suite is like the full telemetry diagnostics of a nuclear submarine: officers monitor depth (commit history depth), ballast controls (soft/mixed/hard valves), and immutable voyage logs (reflog), ensuring that even during extreme maneuvers, the vessel can always return to safe harbor with zero casualties.",
            "code": "mkdir -p /home/student/workspace/git_reset_master\necho \"=== PIN-IT CAREER OS: GIT RESET & REFLOG RECOVERY MASTER SUITE ===\" > /home/student/workspace/git_reset_master/report.txt\necho \"1. RESET_SOFT_MODE: HEAD_POINTER_RELOCATION_SAFE\" >> /home/student/workspace/git_reset_master/report.txt\necho \"2. RESET_MIXED_MODE: INDEX_CLEARED_WORKING_TREE_PRESERVED\" >> /home/student/workspace/git_reset_master/report.txt\necho \"3. RESET_HARD_MODE: DESTRUCTIVE_GUARDRAILS_AND_REVERT_ACTIVE\" >> /home/student/workspace/git_reset_master/report.txt\necho \"4. REFLOG_TELEMETRY: SELECTOR_FORENSIC_TRIAGE_VERIFIED\" >> /home/student/workspace/git_reset_master/report.txt\necho \"5. DISASTER_RECOVERY: INSTANT_POINT_IN_TIME_RESURRECTION_PASS\" >> /home/student/workspace/git_reset_master/report.txt\necho \"Reset & Reflog Recovery Index: 100/100 (TIME_TRAVEL_MASTERY)\" >> /home/student/workspace/git_reset_master/report.txt\ncat /home/student/workspace/git_reset_master/report.txt\ngrep \"Reset & Reflog Recovery Index: 100/100\" /home/student/workspace/git_reset_master/report.txt",
            "output": "=== PIN-IT CAREER OS: GIT RESET & REFLOG RECOVERY MASTER SUITE ===\n1. RESET_SOFT_MODE: HEAD_POINTER_RELOCATION_SAFE\n2. RESET_MIXED_MODE: INDEX_CLEARED_WORKING_TREE_PRESERVED\n3. RESET_HARD_MODE: DESTRUCTIVE_GUARDRAILS_AND_REVERT_ACTIVE\n4. REFLOG_TELEMETRY: SELECTOR_FORENSIC_TRIAGE_VERIFIED\n5. DISASTER_RECOVERY: INSTANT_POINT_IN_TIME_RESURRECTION_PASS\nReset & Reflog Recovery Index: 100/100 (TIME_TRAVEL_MASTERY)\nReset & Reflog Recovery Index: 100/100 (TIME_TRAVEL_MASTERY)",
            "codeNotes": [
                {"line": 2, "note": "Initializes Git reset and reflog master suite executive report."},
                {"line": 3, "note": "Certifies soft reset pointer relocation with zero data loss."},
                {"line": 4, "note": "Validates mixed reset clearing index while preserving working tree."},
                {"line": 5, "note": "Confirms hard reset destructive guardrails and forward revert policy."},
                {"line": 6, "note": "Validates reflog selector forensic triage and pointer tracking."},
                {"line": 7, "note": "Confirms point-in-time disaster recovery and commit resurrection."},
                {"line": 8, "note": "Certifies 100/100 reset and reflog recovery mastery with verified marker."}
            ],
            "tryIt": "Add an entry testing git log -g --grep=\"reset\" to locate specific reset actions across reflog history.",
            "check": {
                "question": "What is the primary difference between 'git reset' and 'git revert'?",
                "options": [
                    "'git reset' moves the branch pointer backward (rewriting history), whereas 'git revert' creates a new commit with the inverse diff, moving history forward safely",
                    "'git reset' deletes the .git folder while 'git revert' restores it",
                    "'git revert' only works on Windows operating systems",
                    "There is no difference; they are exact aliases"
                ],
                "answer": 0,
                "why": "'git reset' rewinds history by moving branch pointers, making it dangerous for public branches, while 'git revert' safely records an inverse commit moving history forward."
            }
        }
    ]

    summary = [
        "`git reset --soft` moves only the HEAD pointer, leaving the Index and Working Tree intact with changes staged in green for easy commit consolidating.",
        "`git reset --mixed` (the default) moves HEAD and resets the Index, unstaging changes into red text while preserving all working directory files on disk.",
        "`git reset --hard` forcibly overwrites HEAD, Index, and Working Tree, permanently obliterating uncommitted changes; public history must use forward `git revert` instead.",
        "`git reflog` records every movement of HEAD and branch references in `.git/logs/`, providing an invincible 30-to-90 day safety net to resurrect lost commits.",
        "Accidental hard resets can be undone in a single command (`git reset --hard HEAD@{1}`), instantly restoring lost commits and directory states."
    ]

    projectStep = {
        "title": "Build an Automated Git Time-Travel & Reflog Disaster Recovery Engine",
        "steps": [
            "Demonstrate `git reset --soft` pointer relocation, consolidating micro-commits while preserving staged index state.",
            "Execute default `git reset --mixed`, resetting the staging cache to target tree while preserving working directory files.",
            "Analyze `git reset --hard` three-tree overwrite hazards and enforce safe roll-forward `git revert` policies.",
            "Inspect `.git/logs/HEAD` flight recorder telemetry using `git reflog` selectors (`HEAD@{n}`).",
            "Execute automated disaster recovery, resurrecting orphaned commits from reflog entries with 100 percent fidelity."
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

if __name__ == "__main__":
    d14 = get_day_14()
    counts = [len(" ".join(p["say"]).split()) for p in d14["parts"]]
    total = sum(counts)
    print(f"Git Day 14: Total={total} words (~{total/150:.1f}m), Parts={counts}")
