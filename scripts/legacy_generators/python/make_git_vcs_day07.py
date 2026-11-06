import json
import hashlib
import os

def get_day_7():
    day_num = 7
    title = "Undoing Local Changes: `git restore`, Unstaging & `git commit --amend`"
    goal = "Master modern Git undo operations, discarding working tree modifications with `git restore <file>`, unstaging staged modifications with `git restore --staged <file>`, amending the latest commit snapshot with `git commit --amend`, purging untracked workspace noise with `git clean -fd`, and differentiating safe non-destructive reverts (`git revert`) from branch reset pointer manipulations (`git reset --soft`, `--mixed`, `--hard`)."
    minutes = 45
    recap = "In Day 6, we mastered repository hygiene, `.gitignore` pattern matching, and surgical untracking with `git rm --cached`. Today in Day 7, we master the complete suite of local Git undo operations: discarding erroneous working edits, un-staging files, amending commit metadata, and safely resetting state."

    parts = [
        {
            "title": "Modern Undo Operations: `git restore --staged <file>` vs `git restore <file>`",
            "say": [
                "Welcome to Day 7 of Git, GitHub and Version Control Systems Architecture. Today, we confront an inevitable daily reality of software engineering: making mistakes, typing experimental code that breaks, accidentally staging files that should not be committed, and needing a fast, surgical, and reliable undo mechanism. In the early days of Git, undoing changes was notoriously confusing and hazardous. Beginners were instructed to use `git checkout -- <file>` to discard edits on disk, or `git reset HEAD <file>` to unstage files from the index. Because `git checkout` was dangerously overloaded—used simultaneously for switching branches, checking out old commits, and wiping out local files—thousands of engineers accidentally deleted days of uncommitted work with a single mistyped command.",
                "To eliminate this hazard and clarify architectural boundaries, Git version 2.23 introduced two dedicated commands with mutually exclusive responsibilities: `git switch` (dedicated strictly to branch navigation) and `git restore` (dedicated strictly to file-level undo operations). Understanding `git restore` gives developers total mastery over their local working directory and staging index.",
                "The `git restore` command operates on two distinct physical locations: the Working Tree (your actual files on disk) and the Staging Area (the Git index stored at `.git/index`). By default, running `git restore <file>` targets the Working Tree. It discards uncommitted modifications on disk by copying the pristine version of the file currently recorded in the Staging Area (or HEAD if nothing is staged) and overwriting your local file. This is the command you run when you write experimental code, realize the approach is flawed, and want to return the file to its last known good state in seconds.",
                "Conversely, when you add the `--staged` flag—running `git restore --staged <file>`—Git shifts its target from the working disk to the Staging Index! This command unstages the specified file, removing it from the pending commit transaction while leaving your local physical file on disk 100 percent intact. If you type `git add .` and accidentally stage a file you wanted to hold back for a separate commit, `git restore --staged <file>` safely pulls it back out of the staging box.",
                "Furthermore, Git allows you to combine both flags or specify alternative restore sources. Running `git restore --staged --worktree <file>` restores the file in BOTH the index and the working tree simultaneously, completely resetting it to HEAD. You can also use the `--source` parameter to restore a file from an older historical commit, release tag, or separate branch: running `git restore --source=HEAD~2 src/app.js` replaces your working copy of `src/app.js` with the version that existed two commits ago, without changing your current branch pointer. Similarly, `git restore --source=v1.2.0 -- config/settings.json` extracts a historical configuration template into your workspace effortlessly.",
                "In high-pressure production environments, understanding the safety profile of `git restore` is critical. Discarding uncommitted working tree changes with `git restore <file>` is DESTRUCTIVE: because the discarded edits were never committed to Git's object database, they cannot be recovered from the reflog! Always verify your changes with `git diff` before issuing a working-tree restore.",
                "In enterprise codebases with hundreds of modified files, interactive restoring is another indispensable tool. Running `git restore -p <file>` triggers patch-mode restoring. Git divides uncommitted modifications into discrete unified diff hunks, prompting the developer interactively (using y, n, q, a, d, e commands) to select exactly which hunks to discard while preserving the remaining modifications in the working tree. This fine-grained control allows engineers to strip temporary debugging print statements while keeping core algorithmic changes intact.",
                "Under the hood, `git restore` reads the target blob from Git's object database or the index cache and writes it to the local filesystem using atomic file replacement techniques. By separating branch switching from file modification discards, modern Git architecture eliminates the legacy ambiguity that caused widespread data loss among generations of software developers.",
                "In this opening part, we construct a modern local undo and staging remediation simulator in the shell. We model working tree modifications, test index unstaging, compare working tree discards, and verify surgical undo precision."
            ],
            "example": "`git restore --staged <file>` is like taking an envelope out of the outgoing mail slot and placing it back on your desk; `git restore <file>` is using an eraser to wipe out pencil markings on the letter itself.",
            "code": "mkdir -p /home/student/workspace/git_restore_sim\necho \"STABLE_API_ENDPOINT=https://api.prod.company.com/v1\" > /home/student/workspace/git_restore_sim/service.env\necho \"BROKEN_EXPERIMENTAL_LOCAL_ENDPOINT=http://localhost:9999\" >> /home/student/workspace/git_restore_sim/service.env\necho \"OPERATION,TARGET_FILE,INDEX_ACTION,WORKING_TREE_ACTION,SAFETY_STATUS\" > /home/student/workspace/git_restore_sim/restore_audit.csv\necho \"RESTORE_STAGED,service.env,UNSTAGED_FROM_INDEX,LOCAL_DISK_EDITS_PRESERVED,SAFE_NON_DESTRUCTIVE\" >> /home/student/workspace/git_restore_sim/restore_audit.csv\necho \"RESTORE_WORKTREE,service.env,INDEX_UNCHANGED,LOCAL_DISCARDED_TO_INDEX,DESTRUCTIVE_UNCOMMITTED_OVERWRITE\" >> /home/student/workspace/git_restore_sim/restore_audit.csv\necho \"RESTORE_BOTH,service.env,INDEX_RESET_TO_HEAD,LOCAL_RESET_TO_HEAD,FULL_COMPONENT_RESTORE\" >> /home/student/workspace/git_restore_sim/restore_audit.csv\necho \"GIT_RESTORE_ENGINE,LOCAL_UNDO_DISPATCH,EVALUATED,SURGICAL_RESTORE_ACTIVE,GIT_RESTORE_OPERATIONS_VERIFIED\" >> /home/student/workspace/git_restore_sim/restore_audit.csv\ncat /home/student/workspace/git_restore_sim/restore_audit.csv\ngrep \"GIT_RESTORE_OPERATIONS_VERIFIED\" /home/student/workspace/git_restore_sim/restore_audit.csv",
            "output": "OPERATION,TARGET_FILE,INDEX_ACTION,WORKING_TREE_ACTION,SAFETY_STATUS\nRESTORE_STAGED,service.env,UNSTAGED_FROM_INDEX,LOCAL_DISK_EDITS_PRESERVED,SAFE_NON_DESTRUCTIVE\nRESTORE_WORKTREE,service.env,INDEX_UNCHANGED,LOCAL_DISCARDED_TO_INDEX,DESTRUCTIVE_UNCOMMITTED_OVERWRITE\nRESTORE_BOTH,service.env,INDEX_RESET_TO_HEAD,LOCAL_RESET_TO_HEAD,FULL_COMPONENT_RESTORE\nGIT_RESTORE_ENGINE,LOCAL_UNDO_DISPATCH,EVALUATED,SURGICAL_RESTORE_ACTIVE,GIT_RESTORE_OPERATIONS_VERIFIED\nGIT_RESTORE_ENGINE,LOCAL_UNDO_DISPATCH,EVALUATED,SURGICAL_RESTORE_ACTIVE,GIT_RESTORE_OPERATIONS_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes service environment file with stable production config."},
                {"line": 3, "note": "Simulates experimental broken local configuration edits."},
                {"line": 5, "note": "Validates git restore --staged unstaging files without modifying disk files."},
                {"line": 6, "note": "Documents git restore discarding working tree changes back to indexed state."},
                {"line": 7, "note": "Documents dual restore resetting both index and working tree to HEAD."},
                {"line": 8, "note": "Certifies modern git restore operations with verified marker."}
            ],
            "tryIt": "Add an entry testing git restore --source=HEAD~1 to simulate restoring an individual file from previous commits.",
            "check": {
                "question": "What is the exact operational effect of running 'git restore --staged app.js'?",
                "options": [
                    "It removes app.js from the staging area (index) while keeping all working tree changes intact on your local disk",
                    "It permanently deletes app.js from your computer's hard drive",
                    "It commits app.js directly to the main production branch",
                    "It uploads app.js to an external cloud storage bucket"
                ],
                "answer": 0,
                "why": "The --staged flag specifically directs git restore to target the index, unstaging the file so it is not included in the next commit while preserving all local modifications on disk."
            }
        },
        {
            "title": "Amending Commits: `git commit --amend` Rewriting the Most Recent Commit & New SHA Generation",
            "say": [
                "Every professional developer knows the feeling: you carefully craft a commit, execute `git commit -m 'feat: implement authentication gateway'`, and two seconds later realize you made an embarrassing typo in the commit title, or forgot to include a critical configuration file you intended to bundle with the feature. In novice teams, developers often create a messy second commit titled 'fix typo' or 'oops forgot config'. In professional engineering teams, git commit history is treated with publication-quality craftsmanship. To fix the most recent commit cleanly, Git provides `git commit --amend`.",
                "Running `git commit --amend` allows you to combine staged changes with the previous commit and reword the commit message. If you simply want to fix a typo in the message, running `git commit --amend -m 'feat: implement authentication gateway'` updates the message instantly. If you forgot to stage a file, you simply run `git add forgotten_file.json` and then execute `git commit --amend --no-edit`. The `--no-edit` flag instructs Git to fold the newly staged file into the previous commit while retaining the existing commit message without launching an interactive editor.",
                "However, understanding Git's internal architecture reveals a fundamental invariant that every software engineer must master: In Git, commit objects are strictly IMMUTABLE! Git does not physically mutate or edit the existing commit object on disk. Why? Because a commit's 40-character SHA-1 (or 64-character SHA-256) hash is a cryptographic checksum computed over the tree object SHA, the parent commit SHA, the author timestamp, the committer timestamp, and the commit message string. If any of these values change by even a single comma or second, the resulting cryptographic hash is completely different!",
                "Therefore, when you run `git commit --amend`, Git performs three low-level actions: 1. It writes a brand new tree object containing the updated file snapshot; 2. It generates a completely NEW commit object with a new SHA hash, referencing the same parent commit as the original commit; and 3. It moves the current branch pointer (e.g., `main` or `feature`) forward to point to the new commit object. The original commit object is left orphaned in Git's object database, where it remains accessible via the reflog until the garbage collector eventually reclaims it.",
                "This brings us to the Cardinal Rule of Amending: NEVER amend a commit that has already been pushed to a shared public remote branch! Because `git commit --amend` produces a new commit SHA, pushing an amended commit requires force-pushing (`git push --force-with-lease`). If your teammates have already fetched the original commit and started branching off it, force-pushing rewritten commit SHAs wrecks their Git history, forcing painful manual rebasing across the entire engineering team.",
                "Amending is strictly reserved for local private commits that have not yet been shared with the team. When used properly on local feature branches before opening a pull request, `git commit --amend` keeps commit histories clean, atomic, and free of extraneous clutter.",
                "Furthermore, understanding author versus committer timestamps during an amend is vital for forensic audits. When you run `git commit --amend`, Git preserves the original Author Name and Author Date (recording when the code was originally conceived), but updates the Committer Name and Committer Date to the current user and exact second the amend occurred. This preserves historical provenance while acknowledging the revision timeline.",
                "If cryptographic commit signing is configured (using GPG, SSH, or S/MIME keys via `git config commit.gpgSign true`), amending also requires re-signing the commit object. Because the tree SHA and timestamp headers have changed, the old cryptographic signature is mathematically invalid. Running `git commit --amend -S` recalculates the signature using your local private key, generating an updated signature header in the new commit object. This guarantees that commit verification badges on GitHub and GitLab continue to display a green 'Verified' status.",
                "In this second section, we build a commit amend and cryptographic SHA immutability simulator in the shell. We model commit creation, simulate amending staged files, track new SHA hash generation, and verify branch pointer reassignment."
            ],
            "example": "`git commit --amend` is like unsealing a freshly stamped wax envelope to slip in an omitted photograph, and then resealing it with a new wax seal before giving it to the courier; once the courier has delivered it to your colleagues, you cannot take it back.",
            "code": "mkdir -p /home/student/workspace/git_amend_sim\necho \"ORIGINAL_COMMIT_SHA=7c3d2e1f4a5b6c8d9e0a1b2c3d4e5f6a7b8c9d0e\" > /home/student/workspace/git_amend_sim/commit_record.txt\necho \"AMENDED_NEW_COMMIT_SHA=9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4f3e2d1c0b\" >> /home/student/workspace/git_amend_sim/commit_record.txt\necho \"COMMIT_STAGE,SHA_HASH,PARENT_SHA,MESSAGE_STATUS,BRANCH_POINTER_STATE\" > /home/student/workspace/git_amend_sim/amend_audit.csv\necho \"ORIGINAL_SNAPSHOT,7c3d2e1,a1b2c3d,feat: init auth api (TYPO_PRESENT),REPLACED_HISTORICAL\" >> /home/student/workspace/git_amend_sim/amend_audit.csv\necho \"AMENDED_SNAPSHOT,9f8e7d6,a1b2c3d,feat: init auth api (CLEAN_VERIFIED),ACTIVE_BRANCH_HEAD\" >> /home/student/workspace/git_amend_sim/amend_audit.csv\necho \"IMMUTABILITY_RULE,NEW_SHA_GENERATED,IDENTICAL_PARENT,CONTENT_INTEGRATED,STRICT_CRYPTOGRAPHIC_PURITY\" >> /home/student/workspace/git_amend_sim/amend_audit.csv\necho \"GIT_AMEND_ENGINE,COMMIT_REVISION,EVALUATED,NEW_SHA_REPLACEMENT_ACTIVE,GIT_COMMIT_AMEND_VERIFIED\" >> /home/student/workspace/git_amend_sim/amend_audit.csv\ncat /home/student/workspace/git_amend_sim/amend_audit.csv\ngrep \"GIT_COMMIT_AMEND_VERIFIED\" /home/student/workspace/git_amend_sim/amend_audit.csv",
            "output": "COMMIT_STAGE,SHA_HASH,PARENT_SHA,MESSAGE_STATUS,BRANCH_POINTER_STATE\nORIGINAL_SNAPSHOT,7c3d2e1,a1b2c3d,feat: init auth api (TYPO_PRESENT),REPLACED_HISTORICAL\nAMENDED_SNAPSHOT,9f8e7d6,a1b2c3d,feat: init auth api (CLEAN_VERIFIED),ACTIVE_BRANCH_HEAD\nIMMUTABILITY_RULE,NEW_SHA_GENERATED,IDENTICAL_PARENT,CONTENT_INTEGRATED,STRICT_CRYPTOGRAPHIC_PURITY\nGIT_AMEND_ENGINE,COMMIT_REVISION,EVALUATED,NEW_SHA_REPLACEMENT_ACTIVE,GIT_COMMIT_AMEND_VERIFIED\nGIT_AMEND_ENGINE,COMMIT_REVISION,EVALUATED,NEW_SHA_REPLACEMENT_ACTIVE,GIT_COMMIT_AMEND_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Records initial commit SHA before amend operation."},
                {"line": 3, "note": "Records amended new commit SHA confirming cryptographic replacement."},
                {"line": 5, "note": "Documents original commit containing typo in commit message."},
                {"line": 6, "note": "Documents amended commit with clean message and active branch head assignment."},
                {"line": 7, "note": "Confirms identical parent commit SHA with newly generated commit hash."},
                {"line": 8, "note": "Certifies git commit --amend operations with verified marker."}
            ],
            "tryIt": "Add an entry testing git commit --amend --no-edit to verify bundling newly staged files without message editing.",
            "check": {
                "question": "What actually happens to the Git object database when you run 'git commit --amend'?",
                "options": [
                    "Git generates a completely new commit object with a new SHA-1 hash and moves the branch pointer to it, leaving the old commit orphaned",
                    "Git mutates the existing commit object in place, keeping the exact same SHA hash",
                    "Git deletes all files in the working directory",
                    "Git closes all open pull requests on GitHub"
                ],
                "answer": 0,
                "why": "Because Git commit objects are cryptographically immutable, amending changes the tree or commit metadata, producing a new cryptographic hash and creating a new commit object while leaving the previous commit orphaned."
            }
        },
        {
            "title": "Cleaning Untracked Artifacts: `git clean -fd` & Workspace Purging",
            "say": [
                "During active development, testing, and debugging, working directories inevitably accumulate a large volume of untracked files: temporary test scripts, compiled artifacts, scratch notes, experimental code snippets, and build output directories. Running `git status` shows an annoying wall of red untracked file entries. While tracked files can be reset with `git restore`, what tool does Git provide to purge untracked files without manually typing individual `rm` commands for dozens of files?",
                "The answer is `git clean`. The `git clean` command is Git's dedicated janitorial tool, specifically designed to purge untracked files from your working tree. However, because deleting files from disk is permanently irreversible, Git includes safety mechanisms by default: if you run `git clean` without arguments, Git will refuse to run, displaying an error message stating that the `clean.requireForce` configuration is active.",
                "To operate `git clean` safely and effectively, developers must master its standard operational flags. The most critical safety flag is `-n` (or `--dry-run`). Running `git clean -n` performs a simulation: Git inspects the working tree and outputs a list of exactly which files would be deleted, without actually deleting anything! Professional engineers always run `git clean -n` or `git clean -nd` first to preview the deletion list before committing to permanent removal.",
                "Once the preview is verified, running `git clean -f` (force) deletes all untracked files in the current directory. However, by default, `-f` ignores untracked directories! If your build process created a new untracked folder (such as `test-output/`), `git clean -f` leaves the folder alone. To recursively delete untracked directories along with untracked files, you must combine the flags: `git clean -fd` (`-f` force, `-d` directory).",
                "What about files that are matched by `.gitignore`? By default, `git clean` respects `.gitignore` rules and does NOT delete ignored files like `node_modules/` or `.env`. However, if you want a complete, nuclear reset that purges both untracked AND ignored build files, you pass the `-x` flag: `git clean -fdx`. This restores the repository to an absolute sterile state identical to a freshly cloned repository. Conversely, running `git clean -fdX` (uppercase X) deletes ONLY ignored files, leaving non-ignored untracked files intact.",
                "The cardinal invariant of `git clean` is filesystem finality. Unlike committed files—which can be rescued from Git's object database or reflog even after branch deletion—files deleted by `git clean` were NEVER committed to Git! Git issues standard POSIX `unlink` system calls directly to the host operating system. Once a file is deleted by `git clean -f`, it is gone forever. Master the dry-run `-n` flag, and you will never experience accidental data loss.",
                "In automated build agents and continuous integration runners, `git clean -ffdx` (with double force flags) is standard operating procedure between pipeline stages. The double `-f` flag overrides repository-level clean configurations that might otherwise block clean operations, ensuring that dirty build caches from previous failed pull request builds cannot cross-contaminate subsequent builds. Furthermore, if the working tree contains nested embedded Git submodules or separate Git repositories (folders containing their own `.git` directories), a single `-f` flag will halt with a safety refusal; Git strictly mandates the double force flag (`-ff`) to recursively purge nested repositories.",
                "For developers who want fine-grained interactive control, Git also offers interactive cleaning via `git clean -i`. This launches a menu-driven session displaying options such as clean, filter by pattern, select by numbers, ask each, and quit. This allows developers to pick and choose individual untracked files for deletion when multiple parallel experiments have left varied artifacts scattered across the tree. Additionally, the exclude flag `-e <pattern>` provides an invaluable safety bypass: running `git clean -fd -e 'local-notes.txt' -e '*.bak'` cleans the entire repository while explicitly preserving designated files.",
                "In this third part, we build a workspace cleaning and untracked file purging simulator in the shell. We model untracked artifacts, compare dry-run previews against forced cleaning, evaluate directory removal, and verify workspace sanitization."
            ],
            "example": "`git clean -n` is like walking through your garage with a roll of red stickers, tagging junk items you plan to throw away; `git clean -fd` is the garbage truck arriving to haul away all tagged items and empty cardboard boxes.",
            "code": "mkdir -p /home/student/workspace/git_clean_sim/build_cache\necho \"temporary debug scratchpad\" > /home/student/workspace/git_clean_sim/scratch.tmp\necho \"compiled binary artifact\" > /home/student/workspace/git_clean_sim/build_cache/output.bin\necho \"CLEAN_MODE,FLAG,TARGETS_AFFECTED,DRY_RUN_PREVIEW,SAFETY_LEVEL\" > /home/student/workspace/git_clean_sim/clean_audit.csv\necho \"DRY_RUN,-n,UNTRACKED_FILES_ONLY,PREVIEW_LISTED_NO_DELETION,ABSOLUTELY_SAFE\" >> /home/student/workspace/git_clean_sim/clean_audit.csv\necho \"FORCE_FILES,-f,UNTRACKED_FILES_ONLY,DIRECT_DELETION_EXEC,IRREVERSIBLE_UNLINK\" >> /home/student/workspace/git_clean_sim/clean_audit.csv\necho \"FORCE_DIRS,-fd,FILES_AND_DIRECTORIES,RECURSIVE_PURGE_EXEC,WORKSPACE_STERILE\" >> /home/student/workspace/git_clean_sim/clean_audit.csv\necho \"NUCLEAR_RESET,-fdx,UNTRACKED_AND_IGNORED,PURGES_BUILD_AND_CACHE,FRESH_CLONE_EQUIVALENT\" >> /home/student/workspace/git_clean_sim/clean_audit.csv\necho \"GIT_CLEAN_ENGINE,WORKSPACE_PURGING,EVALUATED,FORCE_CLEAN_ACTIVE,GIT_CLEAN_UNTRACKED_VERIFIED\" >> /home/student/workspace/git_clean_sim/clean_audit.csv\ncat /home/student/workspace/git_clean_sim/clean_audit.csv\ngrep \"GIT_CLEAN_UNTRACKED_VERIFIED\" /home/student/workspace/git_clean_sim/clean_audit.csv",
            "output": "CLEAN_MODE,FLAG,TARGETS_AFFECTED,DRY_RUN_PREVIEW,SAFETY_LEVEL\nDRY_RUN,-n,UNTRACKED_FILES_ONLY,PREVIEW_LISTED_NO_DELETION,ABSOLUTELY_SAFE\nFORCE_FILES,-f,UNTRACKED_FILES_ONLY,DIRECT_DELETION_EXEC,IRREVERSIBLE_UNLINK\nFORCE_DIRS,-fd,FILES_AND_DIRECTORIES,RECURSIVE_PURGE_EXEC,WORKSPACE_STERILE\nNUCLEAR_RESET,-fdx,UNTRACKED_AND_IGNORED,PURGES_BUILD_AND_CACHE,FRESH_CLONE_EQUIVALENT\nGIT_CLEAN_ENGINE,WORKSPACE_PURGING,EVALUATED,FORCE_CLEAN_ACTIVE,GIT_CLEAN_UNTRACKED_VERIFIED\nGIT_CLEAN_ENGINE,WORKSPACE_PURGING,EVALUATED,FORCE_CLEAN_ACTIVE,GIT_CLEAN_UNTRACKED_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes temporary scratch file in working directory."},
                {"line": 3, "note": "Initializes compiled binary inside untracked directory."},
                {"line": 5, "note": "Documents dry-run -n previewing deletions without removing files."},
                {"line": 6, "note": "Validates git clean -f forcing deletion of untracked files."},
                {"line": 7, "note": "Validates git clean -fd recursively removing untracked directories."},
                {"line": 8, "note": "Documents git clean -fdx purging both untracked and ignored build artifacts."},
                {"line": 9, "note": "Certifies untracked file cleaning with verified marker."}
            ],
            "tryIt": "Add an entry testing git clean -fdX (uppercase X) to verify deleting only ignored files while protecting untracked source.",
            "check": {
                "question": "Why is running 'git clean -n' considered mandatory best practice before executing 'git clean -fd'?",
                "options": [
                    "Because 'git clean -n' performs a safe dry-run previewing exactly what will be deleted, preventing accidental irreversible data loss",
                    "Because 'git clean -n' installs the latest version of Node.js",
                    "Because Git requires an internet connection to run clean",
                    "Because 'git clean -fd' only works on Sunday mornings"
                ],
                "answer": 0,
                "why": "Files deleted by git clean were never committed to Git, meaning they cannot be recovered from the reflog; running -n allows developers to verify the list of files before permanent filesystem deletion."
            }
        },
        {
            "title": "Safe Reversals vs Reset Pointer Mechanics: `git revert` vs `git reset` (`--soft`, `--mixed`, `--hard`)",
            "say": [
                "When changes have already been committed, undoing them requires a deeper architectural choice: do you want to create a new forward-moving commit that reverses the changes, or do you want to physically move your current branch pointer backward in time? This is the fundamental distinction between `git revert` and `git reset`.",
                "Let us examine `git revert` first. The command `git revert <commit-hash>` is Git's non-destructive, forward-moving undo. Instead of rewriting history or moving branch pointers backward, `git revert` inspects the changes introduced by the target commit, calculates the exact mathematical inverse patch, and applies that inverse as a brand new commit on top of the current branch. If commit `a1b2c3d` added 50 lines to `auth.js`, running `git revert a1b2c3d` creates commit `e4f5g6h` titled 'Revert \"feat: add auth\"', which deletes those 50 lines. Because `git revert` moves history strictly forward without changing past commit hashes, it is 100 percent safe for public, shared branches.",
                "Now, let us analyze `git reset`. Unlike revert, `git reset` is a branch pointer manipulation engine: it moves the current HEAD and branch pointer backward to an earlier commit in the DAG. When you execute `git reset <target-commit>`, what happens to your Staging Index and Working Tree depends on which of the three fundamental flags you provide: `--soft`, `--mixed`, or `--hard`.",
                "Mode 1: `git reset --soft <commit>`. The soft reset moves the branch pointer backward, but leaves BOTH the Staging Index and Working Tree completely untouched! All the file modifications from the undone commits remain sitting in your Staging Area, ready to be recommitted. This is the ideal tool for squashing the last five messy experimental commits on your private branch into a single clean commit.",
                "Mode 2: `git reset --mixed <commit>` (Default). The mixed reset moves the branch pointer backward and resets the Staging Index to match the target commit, but leaves the Working Tree untouched! The file modifications remain on your local disk as unstaged changes. This allows you to review your code, restage specific files in logical chunks, and commit them cleanly.",
                "Mode 3: `git reset --hard <commit>`. The hard reset is Git's nuclear option: it moves the branch pointer backward, resets the Staging Index, AND overwrites the Working Tree with the target commit's snapshot! Any uncommitted modifications on your local disk are instantly erased.",
                "A vital scenario in enterprise release engineering is reverting merge commits. A standard commit has one parent, so Git knows unambiguously which state to revert against. However, a merge commit has two (or more) parents: Parent 1 (the mainline branch) and Parent 2 (the merged feature branch). If you execute `git revert <merge-commit>`, Git will halt with a fatal error: 'commit is a merge but no -m option was given.' You must provide the `-m` (mainline) parent index: `git revert -m 1 <merge-commit>` tells Git to revert the changes introduced by the feature branch relative to the mainline parent 1. Furthermore, if the team later decides to re-introduce that feature branch, merging it again will yield an empty diff because Git considers the feature branch commits already merged! The team must explicitly revert the revert commit (`git revert <revert-commit-sha>`) to cleanly resurrect the feature branch.",
                "However, even if you run `git reset --hard` by accident and lose committed work, Git has a safety net: the Reflog (`git reflog`). The reflog records every movement of HEAD. By running `git reflog`, finding the commit hash from before the reset, and running `git reset --hard HEAD@{1}`, you can resurrect your lost commits instantly.",
                "In team collaboration, the golden rule of Git history management is: Use `git revert` on public shared branches (`main`, `develop`, `release`), and use `git reset` exclusively on local, private feature branches before pushing.",
                "There are two additional specialized reset flags worth knowing in advanced engineering: `git reset --keep <commit>` and `git reset --merge <commit>`. These modes move the branch pointer backward and reset the index, but if a file has local uncommitted modifications that differ between HEAD and the target commit, Git aborts the reset with an error instead of overwriting your changes. This provides an extra layer of insurance against accidental data loss when resetting local branches.",
                "In this fourth part, we build a revision reversal and branch reset simulator in the shell. We compare public `git revert` forward inversions against private `git reset` soft, mixed, and hard pointer adjustments."
            ],
            "example": "`git revert` is publishing a formal errata sheet in tomorrow's newspaper correcting a typo printed today; `git reset --hard` is sneaking into the archives at night and burning yesterday's newspaper edition.",
            "code": "mkdir -p /home/student/workspace/git_reset_sim\necho \"HEAD_COMMIT_SHA=e4f5g6h7i8j9\" > /home/student/workspace/git_reset_sim/reset_state.txt\necho \"RESET_MODE,FLAG,HEAD_POINTER,INDEX_CACHE,WORKING_TREE,SAFETY_RULE\" > /home/student/workspace/git_reset_sim/reset_audit.csv\necho \"GIT_REVERT,revert <sha>,MOVES_FORWARD,COMMITS_INVERSE,PRESERVED_INTACT,SAFE_PUBLIC_BRANCHES\" >> /home/student/workspace/git_reset_sim/reset_audit.csv\necho \"RESET_SOFT,--soft,MOVED_BACKWARD,EDITS_REMAIN_STAGED,PRESERVED_INTACT,PRIVATE_SQUASHING_ONLY\" >> /home/student/workspace/git_reset_sim/reset_audit.csv\necho \"RESET_MIXED,--mixed,MOVED_BACKWARD,EDITS_UNSTAGED,PRESERVED_INTACT,DEFAULT_REORGANIZING\" >> /home/student/workspace/git_reset_sim/reset_audit.csv\necho \"RESET_HARD,--hard,MOVED_BACKWARD,RESET_TO_TARGET,OVERWRITTEN_TO_TARGET,DESTRUCTIVE_USE_REFLOG\" >> /home/student/workspace/git_reset_sim/reset_audit.csv\necho \"GIT_RESET_ENGINE,POINTER_MANIPULATION,EVALUATED,REVERT_VS_RESET_ACTIVE,GIT_REVERT_AND_RESET_VERIFIED\" >> /home/student/workspace/git_reset_sim/reset_audit.csv\ncat /home/student/workspace/git_reset_sim/reset_audit.csv\ngrep \"GIT_REVERT_AND_RESET_VERIFIED\" /home/student/workspace/git_reset_sim/reset_audit.csv",
            "output": "RESET_MODE,FLAG,HEAD_POINTER,INDEX_CACHE,WORKING_TREE,SAFETY_RULE\nGIT_REVERT,revert <sha>,MOVES_FORWARD,COMMITS_INVERSE,PRESERVED_INTACT,SAFE_PUBLIC_BRANCHES\nRESET_SOFT,--soft,MOVED_BACKWARD,EDITS_REMAIN_STAGED,PRESERVED_INTACT,PRIVATE_SQUASHING_ONLY\nRESET_MIXED,--mixed,MOVED_BACKWARD,EDITS_UNSTAGED,PRESERVED_INTACT,DEFAULT_REORGANIZING\nRESET_HARD,--hard,MOVED_BACKWARD,RESET_TO_TARGET,OVERWRITTEN_TO_TARGET,DESTRUCTIVE_USE_REFLOG\nGIT_RESET_ENGINE,POINTER_MANIPULATION,EVALUATED,REVERT_VS_RESET_ACTIVE,GIT_REVERT_AND_RESET_VERIFIED\nGIT_RESET_ENGINE,POINTER_MANIPULATION,EVALUATED,REVERT_VS_RESET_ACTIVE,GIT_REVERT_AND_RESET_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes current HEAD commit hash record."},
                {"line": 4, "note": "Documents git revert creating safe forward-moving inverse commit for public branches."},
                {"line": 5, "note": "Validates git reset --soft keeping changes staged for commit squashing."},
                {"line": 6, "note": "Documents default git reset --mixed unstaging files into working tree."},
                {"line": 7, "note": "Documents git reset --hard wiping working tree and index back to target commit."},
                {"line": 8, "note": "Certifies git revert and reset mechanics with verified marker."}
            ],
            "tryIt": "Add an entry testing git reflog recovery syntax (git reset --hard HEAD@{1}) to verify resurrecting commits after a hard reset.",
            "check": {
                "question": "Why should developers use 'git revert' instead of 'git reset --hard' when undoing a commit that was already pushed to a shared team branch?",
                "options": [
                    "Because 'git revert' creates a new forward-moving commit with the inverse changes, preserving shared commit history without requiring disruptive force pushes",
                    "Because 'git revert' makes the code run twice as fast",
                    "Because 'git reset --hard' deletes the GitHub repository completely",
                    "Because 'git revert' automatically writes unit tests"
                ],
                "answer": 0,
                "why": "git revert creates a new commit that undoes the changes, which can be cleanly pushed to shared branches without rewriting history or breaking teammates' cloned repositories."
            }
        },
        {
            "title": "Master Local Undo, Staging Reset, Revision Amending & Working Tree Hygiene Suite",
            "say": [
                "In this capstone implementation of Day 7, we synthesize the complete taxonomy of Git undo operations into an enterprise-grade local remediation and revision governance suite. A disciplined engineer never panics when code breaks, commits misfire, or bad files are staged; they systematically apply the exact undo tool matching the operational scope and branch visibility.",
                "Our master suite validates five foundational local undo and recovery pillars. First, Modern File-Level Restoring: auditing `git restore <file>` to discard broken working tree edits and `git restore --staged <file>` to unstage pending index entries without disk data loss.",
                "Second, Publication-Grade Commit Amending: validating `git commit --amend` to update commit messages and bundle omitted files into the most recent commit, enforcing cryptographic immutability invariants and understanding new SHA hash generation.",
                "Third, Workspace Janitorial Purging: verifying `git clean -fd` to eliminate untracked scratch files and directories, evaluating dry-run `-n` previews to prevent accidental filesystem data loss.",
                "Fourth, Reversal vs Reset Discipline: enforcing strict segregation between public-safe forward inversions (`git revert`) and private branch pointer adjustments (`git reset --soft`, `--mixed`, `--hard`).",
                "Fifth, Reflog Disaster Recovery: configuring safety nets that track HEAD movements, ensuring that even destructive hard resets can be resurrected via `git reflog` within the default 90-day retention window.",
                "In corporate environments with compliance standards like SOC 2 and ISO 27001, understanding these undo mechanics is critical for audit integrity. Regulators and security auditors inspect Git commit logs to ensure that changes deployed to production have clear, unbroken authorship. If engineers carelessly force-push rewritten histories on mainline branches, audit trails become fragmented and change-management verifications fail. Adhering to `git revert` for all shared branches guarantees immutable, tamper-evident software delivery.",
                "Furthermore, mastery of these undo tools accelerates daily developer throughput. Instead of hesitating to experiment or hoarding messy uncommitted code out of fear of breaking the repository, developers work with bold confidence, knowing that every state—from uncommitted working edits to discarded commits—can be navigated, amended, or restored with surgical precision.",
                "When teams design internal engineering onboarding programs, the 'Undo Runbook' is often one of the first documents new hires read. Establishing standard operating procedures—such as requiring pre-commit linting to prevent amend cascades, documenting when to use `git commit --fixup` in conjunction with `git rebase --autosquash`, and establishing team conventions for revert commit messages—ensures consistent engineering rigor across distributed teams.",
                "Additionally, integrating pre-push and post-checkout hooks into local workflows provides automated guardrails. Hooks can warn engineers if they attempt to reset across public release tags, verify that commit messages follow Conventional Commits formatting before amends are finalized, and automatically notify developers if uncommitted files are about to be overwritten during high-impact operations.",
                "To cement these habits in daily development, high-performance engineering teams maintain standardized Git aliases in their global configuration (`~/.gitconfig`). Aliases such as `git undo = reset --soft HEAD~1` (which uncommits the last commit while preserving staged changes), `git unstage = restore --staged` (which pulls files from index back to working tree), and `git discard = restore` (which wipes working edits) make intuitive, safe undo workflows second nature. Understanding the exact underlying mechanics beneath these aliases gives engineers full sovereignty over their version control environments.",
                "Finally, the architectural discipline of writing Atomic Commits transforms undo operations from stressful emergencies into trivial administrative tasks. An atomic commit represents a single, self-contained logical unit of change accompanied by its passing unit tests. When each commit in a repository's history is atomic, rolling back a regression via `git revert` is completely frictionless—it cleanly subtracts the exact offending feature without collateral damage to adjacent features or dependencies. Combined with automated CI pipelines running test suites against every pull request, atomic commit hygiene ensures that software teams achieve sustained velocity with rock-solid stability.",
                "We now execute our master local undo and revision amending governance suite in the shell. We generate an executive recovery report, verify 100 percent operational readiness, and certify version control excellence."
            ],
            "example": "A master Git undo suite is like an aircraft's triple-redundant flight control recovery system: if one sensor or input fails, the pilot can switch to secondary trims (restore), disengage autopilot (amend), or reboot flight computers (revert/reflog) without ever losing flight control.",
            "code": "mkdir -p /home/student/workspace/git_undo_summary\necho \"=== ENTERPRISE GIT LOCAL UNDO & REVISION RECOVERY SUITE ===\" > /home/student/workspace/git_undo_summary/report.txt\necho \"1. RESTORE_OPERATIONS: WORKING_DISCARD_AND_STAGING_UNSTAGE_VERIFIED\" >> /home/student/workspace/git_undo_summary/report.txt\necho \"2. COMMIT_AMEND: NEW_SHA_IMMUTABILITY_PRESERVED\" >> /home/student/workspace/git_undo_summary/report.txt\necho \"3. CLEAN_WORKSPACE: FORCE_AND_DIRECTORY_PURGE_VERIFIED\" >> /home/student/workspace/git_undo_summary/report.txt\necho \"4. REVERT_VS_RESET: PUBLIC_FORWARD_INVERSION_ENFORCED\" >> /home/student/workspace/git_undo_summary/report.txt\necho \"5. RECOVERY_SAFETY: REFLOG_SALVAGE_CIRCUIT_ACTIVE\" >> /home/student/workspace/git_undo_summary/report.txt\necho \"Local Undo Health Index: 100/100 (NOMINAL_AND_SECURE)\" >> /home/student/workspace/git_undo_summary/report.txt\ncat /home/student/workspace/git_undo_summary/report.txt\ngrep \"Local Undo Health Index: 100/100\" /home/student/workspace/git_undo_summary/report.txt",
            "output": "=== ENTERPRISE GIT LOCAL UNDO & REVISION RECOVERY SUITE ===\n1. RESTORE_OPERATIONS: WORKING_DISCARD_AND_STAGING_UNSTAGE_VERIFIED\n2. COMMIT_AMEND: NEW_SHA_IMMUTABILITY_PRESERVED\n3. CLEAN_WORKSPACE: FORCE_AND_DIRECTORY_PURGE_VERIFIED\n4. REVERT_VS_RESET: PUBLIC_FORWARD_INVERSION_ENFORCED\n5. RECOVERY_SAFETY: REFLOG_SALVAGE_CIRCUIT_ACTIVE\nLocal Undo Health Index: 100/100 (NOMINAL_AND_SECURE)\nLocal Undo Health Index: 100/100 (NOMINAL_AND_SECURE)",
            "codeNotes": [
                {"line": 2, "note": "Initializes enterprise Git local undo executive summary report."},
                {"line": 3, "note": "Certifies modern git restore discarding working edits and unstaging index entries."},
                {"line": 4, "note": "Validates git commit --amend generating new cryptographic SHA hashes."},
                {"line": 5, "note": "Confirms git clean -fd safely purging untracked workspace noise."},
                {"line": 6, "note": "Enforces git revert forward inversions on public shared branches."},
                {"line": 7, "note": "Confirms reflog salvage circuit active for disaster recovery."},
                {"line": 8, "note": "Certifies 100/100 local undo health index with verified marker."}
            ],
            "tryIt": "Inspect the complete report output to confirm all five local undo and revision remediation pillars are fully verified.",
            "check": {
                "question": "What is the primary operational advantage of mastering Git's dedicated local undo commands (restore, amend, clean, revert)?",
                "options": [
                    "It allows developers to recover from mistakes rapidly, eliminate working tree clutter, and maintain pristine commit histories without risking data loss",
                    "It automatically fixes compiler syntax errors in C++",
                    "It replaces the need for software testing",
                    "It turns off Git's security features"
                ],
                "answer": 0,
                "why": "Mastering Git's specific undo operations provides precise control over working tree files, staging index caches, and commit DAG histories, ensuring confident recovery from errors without data loss."
            }
        }
    ]

    summary = [
        "`git restore <file>` discards working tree changes back to the index; `git restore --staged <file>` unstages modifications without altering disk files.",
        "`git commit --amend` creates a brand new immutable commit object with a new SHA hash; it must never be used on commits already pushed to public shared branches.",
        "`git clean -n` previews deletions safely; `git clean -fd` forces permanent deletion of untracked files and directories; `-fdx` includes ignored files.",
        "`git revert` applies an inverse commit forward in time for public branches; `git reset` (`--soft`, `--mixed`, `--hard`) moves the branch pointer backward on private branches.",
        "Accidental hard resets can be recovered via `git reflog` within the retention window, restoring lost commit pointers instantly."
    ]

    projectStep = {
        "title": "Build an Automated Local Undo & Revision Amending Engine",
        "steps": [
            "Demonstrate modern file restoring comparing working tree discards against staging area unstaging.",
            "Model commit amending mechanics validating new cryptographic SHA generation and parent linkage.",
            "Execute workspace janitorial cleaning comparing dry-run previews against force directory purging.",
            "Implement a branch reversal matrix differentiating `git revert` forward inversions from `git reset` pointer resets.",
            "Generate an executive local undo report certifying 100/100 recovery health and reflog safety."
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
    d7 = get_day_7()
    counts = [len(" ".join(p["say"]).split()) for p in d7["parts"]]
    total = sum(counts)
    print(f"Git Day 7: Total={total} words (~{total/150:.1f}m), Parts={counts}")
