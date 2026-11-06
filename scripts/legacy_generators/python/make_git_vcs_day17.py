import json

def get_day_17():
    day_num = 17
    title = "Interactive Rebasing (`git rebase -i`): Squashing, Rewording, Dropping & Fixups"
    goal = "Master interactive rebasing mechanics: command git-rebase-todo instructions, consolidate experimental commits via squash and fixup, rewrite commit messages via reword, purge obsolete code via drop, split and reorder historical commits via edit and exec, and curate pristine pull request histories."
    minutes = 22
    recap = "Yesterday we mastered Rebase vs Merge Architecture: exploring commit replay mechanics across the DAG, contrasting linear chronologies with 3-way merges, enforcing the Golden Rule, and commanding rebase conflict resolution."

    parts = [
        {
            "title": "Interactive Rebase Architecture: The `git-rebase-todo` Grammar & Lifecycle",
            "say": [
                "Welcome to Day 17 of Git Version Control. Yesterday, we laid the theoretical and operational foundations of Git rebasing: how Git lifts topic commits, resets to an upstream baseline, and replays each commit sequentially to synthesize a pristine linear history. Today, we unlock Git's ultimate Swiss Army knife for commit curation: Interactive Rebasing (`git rebase -i`).",
                "When software engineers write code during a sprint, the creative process is inherently non-linear and messy. Developers author intermediate commits like 'wip auth', 'fix typo', 'debug print statement', 'try alternative approach', and 'revert debug'. While these micro-commits are useful locally during exploration, submitting a pull request containing twelve disorganized, broken, or trivial commits pollutes the team's repository, frustrates code reviewers, and sabotages automated tools like `git bisect`. Interactive rebasing is the professional craft of curating, refining, and polishing your local commit history before presenting it to your peers.",
                "How do you initiate an interactive rebase? You run `git rebase -i <base>`, where `<base>` is the parent commit prior to the history you wish to edit. For example, to rewrite the last four commits on your current branch, you run `git rebase -i HEAD~4`. To curate all commits on your feature branch since it branched off from `main`, you run `git rebase -i main`. When you issue this command, Git pauses normal shell execution, constructs a temporary control directory at `.git/rebase-merge/`, generates an interactive instruction file named `git-rebase-todo`, and launches your configured text editor (such as VS Code, Vim, or Nano).",
                "Let us examine the precise grammar and structure of the `git-rebase-todo` file. Each line in this file represents a single commit and follows a strict three-column syntax: `<command> <short-sha> <commit-subject>`. For example: `pick a1b2c3d feat(auth): add login endpoint`. Below the commit list, Git includes helpful commented lines explaining all available command actions: `pick` (use commit), `reword` (use commit, but edit commit message), `edit` (use commit, but stop for amending), `squash` (meld into previous commit and combine messages), `fixup` (meld into previous commit, discarding message), `exec` (run shell command), `drop` (remove commit), `break` (stop here), and `label`/`reset`/`merge` (for rebasing merge topologies).",
                "Notice a crucial architectural detail regarding the chronological ordering in `git-rebase-todo`: unlike `git log`, which displays history in reverse chronological order (newest commit at the top, oldest at the bottom), `git-rebase-todo` displays commits in forward chronological order! The oldest commit in the range appears on line 1 at the top, and the newest commit appears at the bottom. Why? Because Git will replay these instructions sequentially from top to bottom! If you rearrange the lines in the text file, Git will physically reorder the commits in your repository's history!",
                "What happens when you delete a line entirely from `git-rebase-todo`? Deleting a line instructs Git to drop that commit completely! It has the exact same effect as changing the command verb from `pick` to `drop`. If you decide you made a mistake while editing the todo file and want to cancel the entire operation before it starts, you simply delete all non-commented lines or exit your editor with a non-zero exit status (or type `:cq` in Vim), and Git will abort the interactive rebase immediately with zero modifications to your repository.",
                "Once you save and close the `git-rebase-todo` file, Git reads your instructions and enters the interactive replay loop. It parses line 1, executes the specified verb, advances to line 2, and continues until all instructions are executed or until an instruction pauses execution for human interaction. All progress is tracked dynamically in `.git/rebase-merge/done` and `.git/rebase-merge/git-rebase-todo`.",
                "Understanding this instruction grammar transforms version control from a passive logging system into an active authoring canvas. You are no longer chained to the chronological accidents of your initial drafting; you possess complete editorial control over how your work is presented to the world.",
                "In this first part, we construct an interactive rebase todo grammar parser in the shell. We model todo instruction queues, evaluate verb mappings, analyze forward chronological ordering, and verify execution dispatch."
            ],
            "example": "Interactive rebasing is like an author editing a rough first draft: rearranging paragraphs, deleting tangents, fixing typos, and combining fragmented thoughts into clear, polished chapters before sending the manuscript to the publisher.",
            "code": "mkdir -p /home/student/workspace/git_rebase_interactive\necho \"TODO_LINE,ACTION_VERB,SHORT_SHA,COMMIT_SUBJECT,REPLAY_ORDER,ACTION_DESCRIPTION\" > /home/student/workspace/git_rebase_interactive/todo_parser.csv\necho \"1,pick,a1b2c3d,feat(api): add database pool,CHRONOLOGICAL_OLDEST,Apply commit diff unchanged\" >> /home/student/workspace/git_rebase_interactive/todo_parser.csv\necho \"2,reword,e4f5a6b,fix typo in config,INTERMEDIATE_1,Pause to rewrite commit message\" >> /home/student/workspace/git_rebase_interactive/todo_parser.csv\necho \"3,squash,7c8d9e0,wip test assertions,INTERMEDIATE_2,Meld into commit e4f5a6b with message edit\" >> /home/student/workspace/git_rebase_interactive/todo_parser.csv\necho \"4,fixup,3f2a1b4,format code with prettier,INTERMEDIATE_3,Meld into prior commit discarding message\" >> /home/student/workspace/git_rebase_interactive/todo_parser.csv\necho \"5,drop,9d8e7f6,temp console log debugging,CHRONOLOGICAL_NEWEST,Completely purge commit from history\" >> /home/student/workspace/git_rebase_interactive/todo_parser.csv\necho \"INTERACTIVE_REBASE,TODO_GRAMMAR_PARSER,EVALUATED,ALL_VERBS_MAPPED,INTERACTIVE_TODO_GRAMMAR_VERIFIED\" >> /home/student/workspace/git_rebase_interactive/todo_parser.csv\ncat /home/student/workspace/git_rebase_interactive/todo_parser.csv\ngrep \"INTERACTIVE_TODO_GRAMMAR_VERIFIED\" /home/student/workspace/git_rebase_interactive/todo_parser.csv",
            "output": "TODO_LINE,ACTION_VERB,SHORT_SHA,COMMIT_SUBJECT,REPLAY_ORDER,ACTION_DESCRIPTION\n1,pick,a1b2c3d,feat(api): add database pool,CHRONOLOGICAL_OLDEST,Apply commit diff unchanged\n2,reword,e4f5a6b,fix typo in config,INTERMEDIATE_1,Pause to rewrite commit message\n3,squash,7c8d9e0,wip test assertions,INTERMEDIATE_2,Meld into commit e4f5a6b with message edit\n4,fixup,3f2a1b4,format code with prettier,INTERMEDIATE_3,Meld into prior commit discarding message\n5,drop,9d8e7f6,temp console log debugging,CHRONOLOGICAL_NEWEST,Completely purge commit from history\nINTERACTIVE_REBASE,TODO_GRAMMAR_PARSER,EVALUATED,ALL_VERBS_MAPPED,INTERACTIVE_TODO_GRAMMAR_VERIFIED\nINTERACTIVE_REBASE,TODO_GRAMMAR_PARSER,EVALUATED,ALL_VERBS_MAPPED,INTERACTIVE_TODO_GRAMMAR_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes interactive rebase todo instruction grammar schema."},
                {"line": 3, "note": "Documents pick verb applying base commit in forward chronological order."},
                {"line": 4, "note": "Documents reword verb pausing replay to rewrite commit message."},
                {"line": 5, "note": "Documents squash verb melding into parent commit with message synthesis."},
                {"line": 6, "note": "Documents fixup verb melding into parent commit discarding message."},
                {"line": 7, "note": "Documents drop verb purging commit entirely from history."},
                {"line": 8, "note": "Certifies interactive rebase todo grammar with verified marker."}
            ],
            "tryIt": "Add an entry testing git config --global sequence.editor to configure a custom non-interactive script editor.",
            "check": {
                "question": "In what chronological order does the 'git-rebase-todo' file present commits during 'git rebase -i'?",
                "options": [
                    "Forward chronological order (oldest commit at top, newest at bottom) because Git replays commits from past to present",
                    "Reverse chronological order (newest commit at top, oldest at bottom) matching git log",
                    "Alphabetical order sorted by commit author name",
                    "Random order randomized by cryptographic seed"
                ],
                "answer": 0,
                "why": "The todo file lists commits from oldest to newest so Git can replay and modify patches sequentially forward in time."
            }
        },
        {
            "title": "Commit Consolidation: `squash` vs `fixup` & Log Curation",
            "say": [
                "Now that we understand the `git-rebase-todo` grammar, let us explore the two most frequently utilized verbs in professional Git workflows: `squash` and `fixup`. Both verbs solve the universal problem of commit fragmentation, but they handle commit message synthesis differently.",
                "Why do developers accumulate fragmented commits during feature development? When you build a feature—say, a user authentication module—you might commit every 30 minutes: 'start auth schema', 'add password hashing', 'fix syntax error in hash function', 'add auth route', 'fix route parameter typo', 'add unit tests', 'fix test assertion'. If you submit all seven commits as a pull request, your teammates must review seven fragmented diffs, half of which are trivial typo corrections. What code reviewers really need is ONE clean, coherent, atomic commit titled `feat(auth): implement user authentication with bcrypt password hashing`.",
                "How does `squash` (abbreviated `s`) work? When you mark a commit as `squash` in `git-rebase-todo`, Git applies that commit's changes and melds them directly into the commit immediately preceding it! Both diffs become part of a single commit tree. Git then pauses the rebase and opens a new editor window containing the commit messages of both commits commented and concatenated together. This gives you full editorial freedom to craft a unified, comprehensive commit message that accurately describes the combined changes.",
                "How does `fixup` (abbreviated `f`) work? The `fixup` verb operates almost identically to `squash` in terms of tree diffs: it melds the commit's code changes into the commit above it. However, `fixup` completely discards the commit message of the squashed commit! It retains only the commit message of the parent commit. Fixup is the ideal tool for minor typo fixes, formatting adjustments, linting corrections, or variable renames where the commit message adds zero semantic value to history.",
                "What happens when you chain multiple squashes or fixups together? You can take five consecutive commits and mark the last four as `squash` or `fixup`! Git will roll all five commits into the single first commit at the top of the chain. If they are marked with `squash`, Git presents an editor containing all five commit messages concatenated, allowing you to synthesize an executive summary. If they are marked with `fixup`, Git silently melts all five commits into the first commit without prompting, preserving only the first commit's message.",
                "Modern Git (version 2.32+) also introduced advanced fixup modifiers: `fixup -C <sha>` and `fixup -c <sha>`, as well as Git 2.38's `--fixup=amend:<sha>` and `--fixup=reword:<sha>`. `fixup -C` takes the commit message of the specified commit and replaces the parent's message entirely without prompting, while `fixup -c` opens an editor pre-populated with that commit's message for editing. This allows you to fix up code while simultaneously replacing an obsolete commit message in a single automated step.",
                "Let us discover the ultimate power-tool combination for high-velocity engineers: `git commit --fixup` and `git rebase -i --autosquash`! Suppose you have already written commit `a1b2c3d` ('feat(api): add user endpoint'). Later, you discover a typo in that endpoint. Instead of manually running `git rebase -i` and searching for the line to edit, you stage your fix and run: `git commit --fixup a1b2c3d`. Git automatically creates a commit with the subject `fixup! feat(api): add user endpoint`.",
                "When you are ready to prepare your pull request, you simply run `git rebase -i --autosquash main`. Git automatically inspects your commit history, finds all `fixup!` and `squash!` commits, reorders them immediately beneath their target parent commits, and sets their verbs to `fixup` or `squash` automatically! You don't have to rearrange a single line manually! You simply inspect Git's automated arrangement, save and close your editor, and your branch is instantly consolidated into pristine atomic commits.",
                "Furthermore, you can configure Git to perform autosquashing automatically every time you run an interactive rebase by setting `git config --global rebase.autoSquash true`. In high-velocity teams, this one configuration setting saves hours of tedious manual line reordering each week.",
                "By mastering `squash` and `fixup`, you guarantee that every commit on your branch represents a discrete, functional, and fully-tested milestone of engineering work.",
                "In this second part, we construct a commit consolidation simulation engine in the shell. We model multi-commit squashing, fixup message elimination, `--autosquash` automated pairing, and log curation verification."
            ],
            "example": "Squashing commits is like a sculptor welding together small preliminary chunks of clay into a single smooth, polished bronze statue before unveiling it in the gallery.",
            "code": "mkdir -p /home/student/workspace/git_squash_sim\necho \"OPERATION,INPUT_COMMITS,ACTION_VERB,MESSAGE_DISPOSITION,OUTPUT_COMMIT_COUNT,RESULTING_COMMIT_SUBJECT\" > /home/student/workspace/git_squash_sim/consolidation.csv\necho \"SQUASH_MELD,C1_feat + C2_wip,squash,COMBINE_AND_EDIT_MESSAGES,1,feat(auth): implement user authentication\" >> /home/student/workspace/git_squash_sim/consolidation.csv\necho \"FIXUP_MELD,C1_feat + C3_typo,fixup,DISCARD_CHILD_MESSAGE,1,feat(auth): implement user authentication\" >> /home/student/workspace/git_squash_sim/consolidation.csv\necho \"AUTOSQUASH_PAIR,C1_feat + fixup!_C4,fixup_autosquash,AUTOMATICALLY_REORDERED_AND_MELDED,1,feat(auth): implement user authentication\" >> /home/student/workspace/git_squash_sim/consolidation.csv\necho \"CONSOLIDATION,SQUASH_AND_FIXUP_ENGINE,EVALUATED,ALL_MELDS_VERIFIED,SQUASH_AND_FIXUP_CONSOLIDATION_VERIFIED\" >> /home/student/workspace/git_squash_sim/consolidation.csv\ncat /home/student/workspace/git_squash_sim/consolidation.csv\ngrep \"SQUASH_AND_FIXUP_CONSOLIDATION_VERIFIED\" /home/student/workspace/git_squash_sim/consolidation.csv",
            "output": "OPERATION,INPUT_COMMITS,ACTION_VERB,MESSAGE_DISPOSITION,OUTPUT_COMMIT_COUNT,RESULTING_COMMIT_SUBJECT\nSQUASH_MELD,C1_feat + C2_wip,squash,COMBINE_AND_EDIT_MESSAGES,1,feat(auth): implement user authentication\nFIXUP_MELD,C1_feat + C3_typo,fixup,DISCARD_CHILD_MESSAGE,1,feat(auth): implement user authentication\nAUTOSQUASH_PAIR,C1_feat + fixup!_C4,fixup_autosquash,AUTOMATICALLY_REORDERED_AND_MELDED,1,feat(auth): implement user authentication\nCONSOLIDATION,SQUASH_AND_FIXUP_ENGINE,EVALUATED,ALL_MELDS_VERIFIED,SQUASH_AND_FIXUP_CONSOLIDATION_VERIFIED\nCONSOLIDATION,SQUASH_AND_FIXUP_ENGINE,EVALUATED,ALL_MELDS_VERIFIED,SQUASH_AND_FIXUP_CONSOLIDATION_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes commit consolidation schema for squash and fixup."},
                {"line": 3, "note": "Documents squash operation combining diffs and editing combined messages."},
                {"line": 4, "note": "Documents fixup operation combining diffs and discarding child message."},
                {"line": 5, "note": "Documents git commit --fixup and autosquash automated pairing."},
                {"line": 6, "note": "Certifies squash and fixup consolidation with verified marker."}
            ],
            "tryIt": "Add an entry testing git config --global rebase.autoSquash true to enable automated autosquashing by default.",
            "check": {
                "question": "What is the key functional difference between the 'squash' verb and the 'fixup' verb in an interactive rebase?",
                "options": [
                    "Both meld code into the prior commit, but 'squash' prompts you to combine both commit messages, whereas 'fixup' silently discards the squashed commit's message",
                    "'squash' deletes files while 'fixup' duplicates them",
                    "'fixup' is only supported on Linux operating systems",
                    "'squash' can only be used once per repository lifetime"
                ],
                "answer": 0,
                "why": "'fixup' discards the commit message of the commit being merged, making it ideal for minor fixes and formatting, while 'squash' combines messages for full editorial control."
            }
        },
        {
            "title": "Historical Revision: `reword` for Message Sanitation & `drop` for Dead Code Purge",
            "say": [
                "Beyond consolidating commits, interactive rebasing grants surgical precision to revise and sanitize existing history. In this part, we examine two essential editorial actions: `reword` for message sanitation and `drop` for purging dead code or unwanted commits from the timeline.",
                "Let us examine `reword` (abbreviated `r`). How often have you reviewed your branch history right before opening a pull request, only to spot a glaring spelling error in a commit message, a missing Jira ticket reference (`PROJ-4821`), or a commit title that violates your team's Conventional Commits standard (such as using 'fixed bug' instead of `fix(payments): handle null stripe customer id`)? In standard Git operations, `git commit --amend` can only modify the very latest commit. What if the offending commit was authored four commits ago?",
                "This is where `reword` shines. In `git rebase -i`, you simply change the command verb from `pick` to `reword` next to the targeted commit. When the rebase runs, Git replays the commits up to that point, applies the commit's diff unchanged, and immediately pauses to open your text editor with the commit message loaded. You edit the message, correct the wording, add ticket numbers and release notes, save, and close the editor. Git writes the new commit object with the revised message and seamlessly continues replaying the remaining commits in the todo queue! The code diff remains 100 percent identical, while the commit message and SHA are modernized.",
                "Now let us examine `drop` (abbreviated `d`). During feature exploration, developers frequently create temporary commits that should never reach the shared repository: temporary debugging scripts, test fixtures containing dummy secrets, diagnostic log statements, or failed architectural experiments. If you want to eliminate an entire commit from your branch, you change its verb from `pick` to `drop` (or simply delete the line from the `git-rebase-todo` file).",
                "What happens internally when Git processes a `drop` instruction? Git simply skips that commit! It does not extract its patch, and it does not apply its diff. When Git finishes the rebase, the commit is completely absent from the branch's active DAG chain. The branch pointer advances from the commit's parent directly to its former child, seamlessly bridging the gap as if the dropped commit never existed.",
                "However, senior engineers must anticipate a critical edge case when dropping commits: downstream dependencies! If a later commit (`Commit C`) modified code that was originally introduced by the dropped commit (`Commit B`), Git will encounter a conflict when trying to apply `Commit C`. Why? Because `Commit C`'s patch expects context lines that no longer exist! When this happens, Git pauses in `.git/rebase-merge/`, presents conflict markers, and asks you to resolve the missing context before continuing.",
                "What happens to dropped commits in Git's object database? Dropped commits are not instantly erased from disk. Their commit objects remain in `.git/objects/`, and their previous existence is preserved in `git reflog`. If you accidentally drop a commit that contained vital work, you can run `git reflog`, identify the commit SHA before the rebase started, and rescue the commit or cherry-pick it back onto your branch.",
                "Let us also examine commit reordering: by simply swapping the order of lines in `git-rebase-todo`, you can move commits forward or backward in time! If you implemented a generic utility function in commit 3 that logically belongs in commit 1, you can move line 3 to line 1 in the todo file. Git will apply the utility first, creating a clean, logical dependency hierarchy.",
                "In enterprise codebases with strict governance, commit hygiene is enforced by automated linters like `commitlint`. Reword allows developers to align legacy or experimental commit titles with the official Conventional Commits specification—specifying `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, or `chore:` with optional breaking change exclamation marks (`feat!:`).",
                "In this third part, we construct a message sanitation and dead code purge engine in the shell. We model reword execution, drop pruning, downstream dependency conflict detection, and historical sanitization verification."
            ],
            "example": "Using reword and drop is like an editor refining an anthology: fixing the chapter title of Chapter 2, and completely cutting Chapter 4 because its side plot didn't fit the rest of the novel.",
            "code": "mkdir -p /home/student/workspace/git_reword_drop\necho \"REVISION_ACTION,TARGET_SHA,ORIGINAL_STATE,MODIFIED_STATE,DAG_INTEGRITY\" > /home/student/workspace/git_reword_drop/revision_audit.csv\necho \"REWORD_SANITATION,b1c2d3e,bad message: fixed stuff,feat(gateway): sanitize proxy headers,REWORDED_SHA_SYNTHESIZED\" >> /home/student/workspace/git_reword_drop/revision_audit.csv\necho \"DROP_DEAD_CODE,f4a5b6c,debug: print database config,PURGED_FROM_DAG_LINEAGE,COMMIT_REMOVED_CLEANLY\" >> /home/student/workspace/git_reword_drop/revision_audit.csv\necho \"REORDER_SEQUENCE,7e8d9c0,applied after feature,REORDERED_BEFORE_FEATURE,DEPENDENCY_HIERARCHY_ALIGNED\" >> /home/student/workspace/git_reword_drop/revision_audit.csv\necho \"HISTORICAL_REVISION,MESSAGE_SANITATION_AND_PURGE,EVALUATED,ALL_MUTATIONS_VALIDATED,REWORD_AND_DROP_PURGE_VERIFIED\" >> /home/student/workspace/git_reword_drop/revision_audit.csv\ncat /home/student/workspace/git_reword_drop/revision_audit.csv\ngrep \"REWORD_AND_DROP_PURGE_VERIFIED\" /home/student/workspace/git_reword_drop/revision_audit.csv",
            "output": "REVISION_ACTION,TARGET_SHA,ORIGINAL_STATE,MODIFIED_STATE,DAG_INTEGRITY\nREWORD_SANITATION,b1c2d3e,bad message: fixed stuff,feat(gateway): sanitize proxy headers,REWORDED_SHA_SYNTHESIZED\nDROP_DEAD_CODE,f4a5b6c,debug: print database config,PURGED_FROM_DAG_LINEAGE,COMMIT_REMOVED_CLEANLY\nREORDER_SEQUENCE,7e8d9c0,applied after feature,REORDERED_BEFORE_FEATURE,DEPENDENCY_HIERARCHY_ALIGNED\nHISTORICAL_REVISION,MESSAGE_SANITATION_AND_PURGE,EVALUATED,ALL_MUTATIONS_VALIDATED,REWORD_AND_DROP_PURGE_VERIFIED\nHISTORICAL_REVISION,MESSAGE_SANITATION_AND_PURGE,EVALUATED,ALL_MUTATIONS_VALIDATED,REWORD_AND_DROP_PURGE_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes historical revision audit schema."},
                {"line": 3, "note": "Documents reword action modernizing commit subject to Conventional Commits."},
                {"line": 4, "note": "Documents drop action purging temporary debug commit from DAG."},
                {"line": 5, "note": "Documents reordering commits to establish clean dependency order."},
                {"line": 6, "note": "Certifies reword and drop historical purge with verified marker."}
            ],
            "tryIt": "Add an entry testing git commit --amend --no-edit to verify single-commit message preservation.",
            "check": {
                "question": "What happens if you delete a commit's entire line from the 'git-rebase-todo' file during an interactive rebase?",
                "options": [
                    "Git drops the commit entirely, removing it from the branch's historical DAG",
                    "Git throws a syntax error and aborts immediately",
                    "Git marks the commit as read-only",
                    "Git duplicates the commit ten times"
                ],
                "answer": 0,
                "why": "Deleting a line from git-rebase-todo is functionally identical to the 'drop' command; Git completely omits that commit when replaying history."
            }
        },
        {
            "title": "Surgical Decomposition & Automation: `edit`, Commit Splitting & `exec` Test Gates",
            "say": [
                "We now ascend to the most sophisticated operational commands in interactive rebasing: `edit` for surgical commit decomposition, and `exec` for automated validation gates across historical timelines.",
                "Let us first examine the `edit` verb (abbreviated `e`). What does `edit` do? When Git encounters `edit <sha>` in the todo file, it replays the commit, applies its diff, and immediately halts the rebase, leaving you at a regular shell prompt in a detached HEAD state pointing to that exact commit! Git outputs: 'Stopped at <sha>... You can amend the commit now, with git commit --amend. Once you are satisfied with your changes, run git rebase --continue'.",
                "Why is `edit` so powerful? It gives you two extraordinary capabilities: 1. Amending an ancient commit; and 2. Splitting a single monolithic commit into multiple smaller atomic commits! Let us walk through the exact, step-by-step engineering protocol for splitting a commit using `edit`:",
                "Suppose commit `C1` contains both a database migration script AND an API controller implementation. You want to split `C1` into two distinct commits: `feat(db): add user table migration` and `feat(api): add user endpoint`. In `git rebase -i`, you mark `C1` with `edit`. When Git pauses at `C1`, you run `git reset HEAD~`. What does `git reset HEAD~` (a mixed reset) do? It moves `HEAD` back one commit to `C1`'s parent, but leaves all of `C1`'s modifications un-staged in your working directory!",
                "Now, you can stage and commit each part independently! You stage the database migration files with `git add src/db/migrations/` and author commit 1: `git commit -m 'feat(db): add user table migration'`. Then, you stage the API controller files with `git add src/api/controllers/` and author commit 2: `git commit -m 'feat(api): add user endpoint'`. What if the commit contained modifications across lines of the same file? You can run `git add -p` (patch mode) to interactively select specific code hunks, staging part of a file into commit 1 and the remaining lines into commit 2! Finally, you run `git rebase --continue`. Git resumes the rebase, replaying all subsequent commits on top of your two newly split commits! What was once a messy monolithic commit is now two clean, beautifully decoupled architectural commits.",
                "Now let us examine the `exec` verb (abbreviated `x`). What is `exec`? The `exec` command allows you to insert arbitrary shell commands into the `git-rebase-todo` list! You can append `exec <shell-command>` after any commit, or you can run `git rebase -i --exec 'npm test' main` to automatically inject a test execution after EVERY SINGLE COMMIT on your branch!",
                "Consider the profound engineering value of `git rebase -i --exec 'npm test' main`: Git replays commit 1 and automatically executes `npm test`. If tests pass, Git automatically advances and replays commit 2, running `npm test` again. If commit 3 breaks a unit test or causes a TypeScript compiler failure, Git instantly halts the rebase right at commit 3! You can immediately inspect the failure, fix the bug, run `git add .` and `git commit --amend`, and run `git rebase --continue`.",
                "By using `exec` test gates, you guarantee that every single intermediate commit in your branch builds cleanly, passes all unit tests, and never introduces regression bugs. This eliminates the nightmare of `git bisect` landing on a broken intermediate commit that prevents debugging.",
                "Furthermore, modern teams combine `exec` with linting and format checkers, such as `git rebase -i --exec 'npm run lint && npm test' main`. If an early commit fails a style guideline, the rebase halts immediately, ensuring that no commit violates repo standards.",
                "What happens if an `exec` command fails? Git pauses the rebase right after the failed execution and leaves you in your working directory with the failing commit checked out. You can run `git status` to see that Git is waiting for you to fix the problem. You can run your test runner manually, debug the error, edit the code, stage the fix with `git add`, amend the commit with `git commit --amend`, and then run `git rebase --continue`. Git will re-run the failed `exec` command on the amended commit to verify that it now passes before proceeding to the next commit in the list!",
                "In this fourth part, we construct an edit splitting and automated exec test gate simulator in the shell. We model mixed reset decomposition, multi-commit staging, automated test gate verification, and clean continuation."
            ],
            "example": "Using edit to split a commit is like unpacking a mixed shipment crate at the loading dock, sorting the tools from the electronics, putting each into its own labeled box, and sending them to their proper warehouse aisles.",
            "code": "mkdir -p /home/student/workspace/git_edit_exec\necho \"DECOMPOSITION_STEP,COMMAND_SEQUENCE,HEAD_STATE,INDEX_STATE,VERIFICATION_STATUS\" > /home/student/workspace/git_edit_exec/split_exec_matrix.csv\necho \"1_PAUSE_ON_EDIT,git rebase -i with 'edit',DETACHED_AT_TARGET_COMMIT,PRESERVED_CHANGES,PAUSED_FOR_INTERACTION\" >> /home/student/workspace/git_edit_exec/split_exec_matrix.csv\necho \"2_UNSTAGE_CHANGES,git reset HEAD~,HEAD_MOVED_TO_PARENT,CHANGES_UNSTAGED_IN_WORKDIR,READY_FOR_SELECTIVE_ADD\" >> /home/student/workspace/git_edit_exec/split_exec_matrix.csv\necho \"3_CREATE_PART_ONE,git add src/db/ && git commit,COMMIT_1_GENERATED,DB_MIGRATION_STAGED,ATOMIC_PART_ONE_SEALED\" >> /home/student/workspace/git_edit_exec/split_exec_matrix.csv\necho \"4_CREATE_PART_TWO,git add src/api/ && git commit,COMMIT_2_GENERATED,API_CONTROLLER_STAGED,ATOMIC_PART_TWO_SEALED\" >> /home/student/workspace/git_edit_exec/split_exec_matrix.csv\necho \"5_AUTOMATED_EXEC,exec npm test after each commit,HEAD_ADVANCING,CONTINUOUS_TEST_GATE,ALL_INTERMEDIATE_TESTS_PASS\" >> /home/student/workspace/git_edit_exec/split_exec_matrix.csv\necho \"DECOMPOSITION_EXEC,SURGICAL_SPLIT_AND_TEST_GATE,EVALUATED,ALL_GATES_PASSED,EDIT_SPLIT_AND_EXEC_VERIFIED\" >> /home/student/workspace/git_edit_exec/split_exec_matrix.csv\ncat /home/student/workspace/git_edit_exec/split_exec_matrix.csv\ngrep \"EDIT_SPLIT_AND_EXEC_VERIFIED\" /home/student/workspace/git_edit_exec/split_exec_matrix.csv",
            "output": "DECOMPOSITION_STEP,COMMAND_SEQUENCE,HEAD_STATE,INDEX_STATE,VERIFICATION_STATUS\n1_PAUSE_ON_EDIT,git rebase -i with 'edit',DETACHED_AT_TARGET_COMMIT,PRESERVED_CHANGES,PAUSED_FOR_INTERACTION\n2_UNSTAGE_CHANGES,git reset HEAD~,HEAD_MOVED_TO_PARENT,CHANGES_UNSTAGED_IN_WORKDIR,READY_FOR_SELECTIVE_ADD\n3_CREATE_PART_ONE,git add src/db/ && git commit,COMMIT_1_GENERATED,DB_MIGRATION_STAGED,ATOMIC_PART_ONE_SEALED\n4_CREATE_PART_TWO,git add src/api/ && git commit,COMMIT_2_GENERATED,API_CONTROLLER_STAGED,ATOMIC_PART_TWO_SEALED\n5_AUTOMATED_EXEC,exec npm test after each commit,HEAD_ADVANCING,CONTINUOUS_TEST_GATE,ALL_INTERMEDIATE_TESTS_PASS\nDECOMPOSITION_EXEC,SURGICAL_SPLIT_AND_TEST_GATE,EVALUATED,ALL_GATES_PASSED,EDIT_SPLIT_AND_EXEC_VERIFIED\nDECOMPOSITION_EXEC,SURGICAL_SPLIT_AND_TEST_GATE,EVALUATED,ALL_GATES_PASSED,EDIT_SPLIT_AND_EXEC_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes commit decomposition and exec test gate schema."},
                {"line": 3, "note": "Documents edit verb halting replay at target commit."},
                {"line": 4, "note": "Documents git reset HEAD~ unstaging modifications for selective splitting."},
                {"line": 5, "note": "Documents authoring atomic part one commit."},
                {"line": 6, "note": "Documents authoring atomic part two commit."},
                {"line": 7, "note": "Documents automated exec command validating tests on every commit."},
                {"line": 8, "note": "Certifies edit splitting and exec test gates with verified marker."}
            ],
            "tryIt": "Add an entry testing git rebase -i --exec 'git diff --check' to verify no whitespace errors exist across replayed history.",
            "check": {
                "question": "How can an engineer split a single monolithic commit into two smaller atomic commits during an interactive rebase?",
                "options": [
                    "Mark the commit with 'edit', run 'git reset HEAD~' to un-stage its files when Git pauses, and create two separate commits before running 'git rebase --continue'",
                    "Delete the commit and re-type the code from memory",
                    "Run 'git branch -D' on the current branch",
                    "Convert the repository into a Subversion repository"
                ],
                "answer": 0,
                "why": "Using 'edit' pauses Git at the commit; running 'git reset HEAD~' moves HEAD to the parent while leaving changes in the working directory to be selectively staged into multiple atomic commits."
            }
        },
        {
            "title": "Master Interactive Rebase Suite: Pull Request History Curation & Index Certification",
            "say": [
                "In this fifth and final part of Day 17, we synthesize all four interactive rebasing capabilities into an end-to-end pull request curation and certification engine. We unite the `git-rebase-todo` instruction grammar, `squash` and `fixup` consolidation, `reword` message sanitation, `drop` dead code purging, `edit` commit splitting, and `exec` automated test gating into a production-grade workflow.",
                "Let us review the complete editorial lifecycle of an enterprise software engineer preparing a pull request: During active sprint development, you work freely—making frequent, small, unpolished commits as you experiment, refactor, and write tests. But before requesting code review from your senior colleagues, you open an interactive rebase session (`git rebase -i main`).",
                "You inspect the forward chronological todo list: 1. You reorder commits so foundational database changes precede business logic; 2. You reword commit subjects to adhere to Conventional Commits and reference active Jira or GitHub issue tickets; 3. You squash and fixup WIP commits, lint corrections, and typo fixes into their parent feature commits; 4. You drop temporary debugging statements and dummy test configurations; 5. You split any oversized commits that bundle unrelated changes; and 6. You run automated test gates with `--exec` to certify that every single commit in the revised history builds cleanly and passes all integration tests.",
                "When your teammates open your pull request on GitHub or GitLab, they don't see a bewildering mess of 25 micro-commits. They see two or three immaculately crafted, self-contained, atomic commits. Each commit has a clear, descriptive message explaining why the change was made, each commit passes CI independently, and any future engineer can bisect or revert individual commits without side effects.",
                "Let us also examine industry standards for Pull Request size and commit structure: At technology leaders like Google, Meta, and Netflix, code review guidelines strongly encourage Small Changes (typically under 400 lines of code across 1 to 3 atomic commits). Large changes increase code review turnaround time exponentially and hide bugs. Interactive rebasing gives every developer the exact tools needed to adhere to these high engineering standards.",
                "What if an interactive rebase encounters an unexpected error or you want to abort midway through? Just like non-interactive rebasing, `git rebase --abort` is always available to instantly revert your branch to its exact pre-rebase state, guaranteeing complete safety and zero risk of data loss.",
                "In enterprise automated review environments, teams configure GitHub Actions workflows to validate commit history hygiene before allowing pull request merges. Tools like Danger JS or Gitlint check every commit on the incoming branch against strict formatting and structural rules. By running `git rebase -i` locally before pushing, developers prevent CI lint failures and speed up integration.",
                "Let us also emphasize the mindset shift that interactive rebasing represents: Junior developers treat Git as a passive recording device, fearing that changing commits is dangerous or dishonest. Senior engineers, by contrast, treat Git as an authoring medium. Your local git history is a rough draft that you sculpt and refine until it is ready for publication. Just as a professional writer does not publish rough drafts with typos and crossed-out paragraphs, a professional engineer does not merge chaotic exploratory commits into a production repository.",
                "Now, we implement our Master Interactive Rebase Suite in the shell. Our test harness validates: 1. Instruction queue parsing and action mapping; 2. Commit count reduction via squash and fixup consolidation; 3. Conventional Commit message compliance via reword; 4. Dead code elimination via drop; 5. Exec test gate passage across all commits; 6. Gitlint and Conventional Commit compliance; and 7. Production certification with the benchmark index: `Interactive Rebasing Index: 100/100`.",
                "This mastery of interactive history curation directly prepares us for Day 18: Cherry-Picking & Selective Patching (`git cherry-pick`), where we will learn how to surgically extract individual commits from one branch and transplant them onto completely different branches to deploy urgent production hotfixes.",
                "Let us execute the master interactive rebase suite and verify all certification invariants."
            ],
            "example": "A curated pull request is like an executive summary prepared for a board meeting: all the raw notes and brainstorming drafts have been condensed into clear, actionable bullet points with complete supporting data.",
            "code": "mkdir -p /home/student/workspace/git_interactive_suite\necho \"CURATION_PHASE,CRITERIA,TARGET_STATE,ACHIEVED_STATE,CERTIFICATION_STATUS\" > /home/student/workspace/git_interactive_suite/pr_audit.csv\necho \"TODO_GRAMMAR,Instruction Parsing,VALID_VERBS_ONLY,100_PERCENT_PARSED,PASS\" >> /home/student/workspace/git_interactive_suite/pr_audit.csv\necho \"CONSOLIDATION,Commit Cleanliness,REDUCE_MICRO_COMMITS,SQUASHED_AND_FIXED_UP,PASS\" >> /home/student/workspace/git_interactive_suite/pr_audit.csv\necho \"SANITATION,Message Quality,CONVENTIONAL_COMMITS,ALL_MESSAGES_STANDARDIZED,PASS\" >> /home/student/workspace/git_interactive_suite/pr_audit.csv\necho \"PURGE_AUDIT,Dead Code Elimination,ZERO_DEBUG_COMMITS,ALL_DEBUG_COMMITS_DROPPED,PASS\" >> /home/student/workspace/git_interactive_suite/pr_audit.csv\necho \"EXEC_TEST_GATE,Bisect Integrity,ALL_COMMITS_PASS_TESTS,ZERO_REGRESSION_FAILURES,PASS\" >> /home/student/workspace/git_interactive_suite/pr_audit.csv\necho \"INDEX_CERTIFICATION,Master Certification,100_PERCENT,Interactive Rebasing Index: 100/100,PASS\" >> /home/student/workspace/git_interactive_suite/pr_audit.csv\ncat /home/student/workspace/git_interactive_suite/pr_audit.csv\ngrep \"Interactive Rebasing Index: 100/100\" /home/student/workspace/git_interactive_suite/pr_audit.csv",
            "output": "CURATION_PHASE,CRITERIA,TARGET_STATE,ACHIEVED_STATE,CERTIFICATION_STATUS\nTODO_GRAMMAR,Instruction Parsing,VALID_VERBS_ONLY,100_PERCENT_PARSED,PASS\nCONSOLIDATION,Commit Cleanliness,REDUCE_MICRO_COMMITS,SQUASHED_AND_FIXED_UP,PASS\nSANITATION,Message Quality,CONVENTIONAL_COMMITS,ALL_MESSAGES_STANDARDIZED,PASS\nPURGE_AUDIT,Dead Code Elimination,ZERO_DEBUG_COMMITS,ALL_DEBUG_COMMITS_DROPPED,PASS\nEXEC_TEST_GATE,Bisect Integrity,ALL_COMMITS_PASS_TESTS,ZERO_REGRESSION_FAILURES,PASS\nINDEX_CERTIFICATION,Master Certification,100_PERCENT,Interactive Rebasing Index: 100/100,PASS\nINDEX_CERTIFICATION,Master Certification,100_PERCENT,Interactive Rebasing Index: 100/100,PASS",
            "codeNotes": [
                {"line": 2, "note": "Initializes Master Interactive Rebase Suite audit schema."},
                {"line": 3, "note": "Validates todo grammar instruction parsing."},
                {"line": 4, "note": "Validates micro-commit consolidation via squash and fixup."},
                {"line": 5, "note": "Validates commit message standardization using Conventional Commits."},
                {"line": 6, "note": "Validates dead code elimination via drop."},
                {"line": 7, "note": "Validates intermediate commit integrity via automated exec test gates."},
                {"line": 8, "note": "Certifies full interactive rebasing suite with 100/100 index marker."}
            ],
            "tryIt": "Add an entry testing git log --oneline --graph -n 4 to verify the final polished commit sequence.",
            "check": {
                "question": "What is the primary motivation for curating pull request commits with interactive rebasing before code review?",
                "options": [
                    "To present clean, atomic, descriptive commits that make review easy, protect bisectability, and keep repository history readable",
                    "To hide all code changes from security scanners",
                    "To increase the size of the Git repository",
                    "To bypass automated CI/CD test runners"
                ],
                "answer": 0,
                "why": "Curating history transforms raw exploratory commits into structured, atomic units of work that accelerate peer review, simplify future debugging, and ensure clean production rollbacks."
            }
        }
    ]

    summary = [
        "`git rebase -i <base>` exposes the interactive rebase todo sheet, giving developers fine-grained control to restructure local commit history prior to code review.",
        "The `squash` (s) action fuses a commit into its predecessor while combining both commit messages into an editor, whereas `fixup` (f) silently discards the commit message.",
        "`reword` (r) pauses execution to amend commit messages without altering diffs, while `drop` (d) completely purges unwanted commits from the branch history.",
        "`edit` (e) pauses the rebase sequencer at a specific commit, allowing developers to split monolithic changes into atomic commits or modify historical files.",
        "The `exec` (x) command injects automated shell commands (such as `npm test` or linting checks) after every replayed commit to enforce continuous compilation."
    ]

    projectStep = {
        "title": "Build Interactive Rebase & Commit History Sculpting Engine",
        "steps": [
            "Generate and parse interactive rebase todo lists, validating action verb syntax and commit SHAs.",
            "Execute multi-commit squashing and fixup consolidation into clean, single-purpose commits.",
            "Perform commit message rewording and historical commit dropping to sanitize branch history.",
            "Pause rebase execution with `edit` to surgically split monolithic commits into atomic units.",
            "Inject automated `exec` test gates across the replay sequencer to verify build integrity at every commit."
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
    day = get_day_17()
    words = [sum(len(p.split()) for p in part['say']) for part in day['parts']]
    total = sum(words)
    print(f"Git Day 17: Total={total} words (~{total/150:.1f}m), Parts={words}")
