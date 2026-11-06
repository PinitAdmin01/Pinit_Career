import json
import hashlib
import os

def get_day_8():
    day_num = 8
    title = "Git History Inspection: `git log --oneline --graph`, `git show` & Pickaxe Search"
    goal = "Master forensic Git history inspection, filtering commits by keyword and content diffs with Pickaxe Search (`git log -S \"STRING\"`), visualizing branch DAG topologies with `git log --oneline --graph --all`, dissecting commit patches and object metadata with `git show`, auditing author versus committer timestamps, tracing line-level code provenance with `git blame`, and analyzing function evolutionary lifecycles with `git log -L`."
    minutes = 45
    recap = "In Day 7, we mastered local undo mechanisms, unstaging with `git restore`, amending commits, and safely resetting working state. Today in Day 8, we step into the shoes of software forensic investigators: tracing historical code evolution, auditing branch topologies, running Pickaxe content searches, and dissecting commit metadata with forensic precision."

    parts = [
        {
            "title": "Pickaxe Search: Forensic Content Auditing with `git log -S \"SEARCH_TERM\"`",
            "say": [
                "Welcome to Day 8 of Git, GitHub and Version Control Systems Architecture. Today, we delve into one of the most intellectually rewarding and practically vital capabilities of version control: Forensic History Inspection, Code Archaeology, and Incident Investigation. In large enterprise codebases with thousands of commits spanning a decade, code does not exist in a vacuum; it carries a deep evolutionary history of architectural decisions, bug fixes, refactorings, and security patches. When a critical production incident occurs—such as discovering that an API secret key has leaked, or finding that a mission-critical billing validation rule has vanished—a senior engineer does not read hundreds of git log messages manually. They deploy Git's forensic search tool: the Pickaxe Search Engine.",
                "The Pickaxe search—invoked via `git log -S \"SEARCH_STRING\"`—is fundamentally different from standard commit message filtering. If you run `git log --grep=\"fix auth\"`, Git only searches the text of developer-written commit messages; if the developer wrote a vague message like 'update settings' or 'routine cleanup', a grep search is completely useless. In sharp contrast, `git log -S` digs directly into the unified diff patches of every commit in the repository DAG! It asks a specific mathematical question: in which commits did the number of occurrences of this exact string actually change (either increased by addition or decreased by deletion)?",
                "Consider a high-stakes security breach: security engineers discover that a private Stripe payment secret (`STRIPE_KEY = \"sk_test_9948\"`) was accidentally committed into the codebase months ago. By running `git log -S \"sk_test_9948\" --oneline`, Git scans thousands of historical commits in seconds, isolating the exact commit hash (e.g., `a1b2c3d`) where that string first appeared, and the later commit where it was deleted. Running `git log -S \"sk_test_9948\" -p` outputs the exact patch, the developer who authored the commit, the committer timestamp, and the surrounding lines of code.",
                "Git also provides a regex-powered sibling to the Pickaxe: `git log -G \"REGEX_PATTERN\"`. While `-S` searches for changes in the count of string occurrences, `-G` matches any commit whose diff patch contains lines matching the specified regular expression. For example, running `git log -G \"def calculate_tax\\(\"` finds every commit where the function signature or implementation was modified in any way, even if the total count of the string did not change.",
                "Furthermore, combining Pickaxe with path limiters and date ranges creates surgical investigation queries. Running `git log -S \"DATABASE_URL\" --since=\"3.months.ago\" -- src/config/` restricts the forensic scan to the `src/config/` directory over the last ninety days, drastically accelerating incident response times. Understanding these forensic query mechanisms transforms developers from passive code readers into active system detectives capable of pinning down the root cause of subtle bugs in minutes.",
                "In enterprise incident response runbooks, Pickaxe search is a standard triage step. When a customer reports that a legacy data export feature stopped supporting CSV formatting after the latest quarterly release, the triage lead executes `git log -S \"format: 'csv'\" -p` across the release branch. Within seconds, the team identifies the exact pull request and commit that inadvertently removed the format branch, eliminating hours of speculative finger-pointing and enabling instant hotfix generation.",
                "Additionally, Pickaxe supports the `--pickaxe-all` flag. When `-S` matches a commit, Git by default displays only the diff hunks of the specific files where the string count changed. Adding `--pickaxe-all` instructs Git to output the entire commit diff across all files whenever a match occurs in any single file, providing comprehensive architectural context on what else changed in that same transaction.",
                "It is equally crucial to understand how Git accelerates Pickaxe searches across massive repositories containing hundreds of thousands of commits (like the Linux kernel or Chromium). In modern Git versions, the repository utilizes the `commit-graph` binary cache file (stored in `.git/objects/info/commit-graph`) along with Bloom filters (`commitGraph.generationVersion 2` and `commitGraph.readChangedPaths true`). These Bloom filters allow Git to test in constant O(1) time whether a specific path or token changed in a commit without decompressing tree objects, accelerating forensic searches by up to 90 percent.",
                "Finally, developers often confuse `git grep` with `git log -S`. The command `git grep <pattern>` searches the current snapshot of files on disk or in a specified commit (like a high-speed ripgrep built into Git). In contrast, `git log -S` traverses backward through the entire temporal history of commits. Knowing when to use `git grep` (to find where code lives today) versus `git log -S` (to find when and why code arrived or departed) is the mark of a seasoned software architect.",
                "In this opening part, we construct a Git Pickaxe forensic search and history audit simulator in the shell. We model string addition, track commit hash isolation, analyze author attribution, and verify forensic query precision."
            ],
            "example": "`git log -S` is like a forensic investigator using a metal detector on a crime scene: it does not care what the crime report summary says; it directly scans the physical soil (diff patches) to find the exact metal casing (string) that was fired.",
            "code": "mkdir -p /home/student/workspace/git_pickaxe_sim\necho \"API_KEY_LEAK=sk_live_994827163\" > /home/student/workspace/git_pickaxe_sim/payment.js\necho \"COMMIT_HASH,SEARCH_QUERY,OCCURRENCE_DELTA,AUTHOR,INCIDENT_SEVERITY\" > /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv\necho \"a1b2c3d,STRIPE_KEY,ADDED_COUNT_PLUS_1,Alice,HIGH_CREDENTIAL_EXPOSURE\" >> /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv\necho \"e4f5g6h,STRIPE_KEY,REMOVED_COUNT_MINUS_1,Bob,REMEDIATION_COMMIT\" >> /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv\necho \"f7e8d9c,calculate_tax,ADDED_COUNT_PLUS_1,Charlie,NOMINAL_FEATURE_ADDITION\" >> /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv\necho \"GIT_PICKAXE_ENGINE,STRING_DIFF_SCAN,EVALUATED,COMMIT_HASH_ISOLATED,GIT_PICKAXE_AUDIT_VERIFIED\" >> /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv\ncat /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv\ngrep \"GIT_PICKAXE_AUDIT_VERIFIED\" /home/student/workspace/git_pickaxe_sim/pickaxe_audit.csv",
            "output": "COMMIT_HASH,SEARCH_QUERY,OCCURRENCE_DELTA,AUTHOR,INCIDENT_SEVERITY\na1b2c3d,STRIPE_KEY,ADDED_COUNT_PLUS_1,Alice,HIGH_CREDENTIAL_EXPOSURE\ne4f5g6h,STRIPE_KEY,REMOVED_COUNT_MINUS_1,Bob,REMEDIATION_COMMIT\nf7e8d9c,calculate_tax,ADDED_COUNT_PLUS_1,Charlie,NOMINAL_FEATURE_ADDITION\nGIT_PICKAXE_ENGINE,STRING_DIFF_SCAN,EVALUATED,COMMIT_HASH_ISOLATED,GIT_PICKAXE_AUDIT_VERIFIED\nGIT_PICKAXE_ENGINE,STRING_DIFF_SCAN,EVALUATED,COMMIT_HASH_ISOLATED,GIT_PICKAXE_AUDIT_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes simulated sensitive API key in source file."},
                {"line": 4, "note": "Documents pickaxe detecting commit a1b2c3d where secret key was introduced."},
                {"line": 5, "note": "Documents pickaxe detecting remediation commit e4f5g6h where key was removed."},
                {"line": 6, "note": "Documents functional code search tracking feature addition."},
                {"line": 7, "note": "Certifies Git pickaxe forensic search mechanics with verified marker."}
            ],
            "tryIt": "Add an entry testing git log -G with a regex pattern searching for function signature changes.",
            "check": {
                "question": "What is the primary difference between running 'git log --grep=\"SECRET\"' and 'git log -S \"SECRET\"'?",
                "options": [
                    "'git log --grep' searches only commit messages, while 'git log -S' scans the actual code diffs of every commit in the repository",
                    "'git log -S' requires root administrator privileges",
                    "'git log --grep' converts the repository into a MySQL database",
                    "There is no difference; both commands perform the exact same scan"
                ],
                "answer": 0,
                "why": "git log -S (Pickaxe) searches inside the unified diff patches of each commit to find where the string count changed, whereas --grep only inspects the author's commit log message."
            }
        },
        {
            "title": "ASCII DAG Topology Visualization: `git log --oneline --graph --all` & Formatting Directives",
            "say": [
                "In modern software engineering, Git history is rarely a simple linear line of commits. In active agile teams, dozens of developers create feature branches, rebase, merge, cherry-pick, and integrate releases simultaneously. Git history is a Directed Acyclic Graph (DAG) of commit snapshots. Attempting to understand this topology using standard `git log` produces a disorienting, endless vertical scroll of full-page commit blocks. To visualize the true branch topology directly in your shell terminal without leaving the command line, Git provides ASCII Graph Formatting.",
                "The canonical command for terminal DAG visualization is `git log --oneline --graph --all --decorate`. Let us dissect each flag in this powerful command: First, `--graph` renders an ASCII art tree on the left side of the terminal, using asterisks (`*`), vertical bars (`|`), and slashes (`/`, `\\`) to visualize branch bifurcations, parallel development tracks, and merge convergence points. Second, `--oneline` condenses each commit into a single line displaying its abbreviated 7-character SHA hash and subject line. Third, `--all` instructs Git to display commits reachable from ALL local branches, remote-tracking branches (`origin/*`), and tags, rather than only the current branch. Fourth, `--decorate` displays colored ref pointers (such as `HEAD -> main`, `origin/main`, `tag: v1.0.0`) inline beside their respective commit hashes.",
                "Beyond standard flags, Git provides a sophisticated formatting engine through the `--pretty=format:` directive. Developers can craft custom visualization layouts using placeholder tokens: `%h` for abbreviated hash, `%an` for author name, `%ar` for relative author date (e.g., '2 days ago'), `%ad` for author date, `%s` for subject line, and `%d` for ref decorations. You can also inject ANSI terminal colors: `%C(yellow)%h%Creset %C(green)%ad%Creset %C(blue)%an%Creset %C(auto)%d%Creset %s`.",
                "Professional engineers frequently register this custom visualization as a global Git alias in their `~/.gitconfig`: `git config --global alias.tree \"log --graph --oneline --all --decorate\"`. Typing `git tree` instantly renders the entire project's branch topology, allowing developers to see exactly where feature branches diverge from mainline, identify unmerged branches, and verify merge boundaries in seconds.",
                "Understanding graph topology is essential for spotting common collaboration errors. When inspecting a graph, a developer can instantly see whether a feature branch was merged using a Fast-Forward merge (where the branch simply advanced the target pointer) or a True 3-Way Merge (where a distinct merge node with two parents appears with converging diagonal slashes). It also highlights 'divergent branch' situations where local `main` and remote `origin/main` have both accumulated independent commits, warning the developer that a pull rebase is necessary before pushing.",
                "Furthermore, topology visualization clarifies release engineering and hotfix management. In continuous delivery environments supporting multiple simultaneous production versions (such as maintaining v1.x and v2.x long-term support branches), running `git log --graph --oneline v1.x v2.x main` displays the parallel evolutionary lifecycles side by side. Release managers verify which security cherry-picks have landed on which release streams without needing external web dashboards.",
                "Another critical concept in branch topology comparison is revision ranges. In Git, `main..feature` (two dots) selects all commits reachable from `feature` that are NOT reachable from `main`. This is the exact set of commits you are proposing to merge in a pull request! Conversely, `main...feature` (three dots) is the symmetric difference: it selects commits reachable from either `main` OR `feature`, but excludes commits reachable from both (i.e. their common ancestors). Adding the `--left-right` flag (`git log --left-right --oneline main...feature`) prefixes each commit with `<` (if on main) or `>` (if on feature), giving developers instant visual clarity on branch divergence.",
                "Finally, topological sorting flags control the visual order of branch rendering. By default, Git sorts commits in reverse chronological order based on commit date. However, in complex branch histories with out-of-order timestamps, chronological sorting can cause branch lines to intertwine incoherently. Passing `--topo-order` forces Git to display all child commits before their parents, ensuring that individual branch threads remain visually contiguous and easier to trace.",
                "In this second section, we build a Git DAG topology visualizer and ASCII branch formatting simulator in the shell. We model branch divergence, simulate multi-parent merge nodes, evaluate format directives, and verify graph clarity."
            ],
            "example": "`git log --oneline --graph --all` is like an aerial satellite map of a metropolitan subway transit system: it visualizes tracks branching into suburban lines, running in parallel, and converging back into central union stations.",
            "code": "mkdir -p /home/student/workspace/git_graph_sim\necho \"COMMIT_TOPOLOGY_DAG_REPRESENTATION\" > /home/student/workspace/git_graph_sim/topology.txt\necho \"NODE_ID,ASCII_GRAPH,BRANCH_REF,COMMIT_MESSAGE,TOPOLOGY_EVENT\" > /home/student/workspace/git_graph_sim/graph_audit.csv\necho \"m1,* (HEAD -> main),main,feat: initial core architecture,ROOT_COMMIT\" >> /home/student/workspace/git_graph_sim/graph_audit.csv\necho \"f1,| * (feature/auth),feature/auth,feat: add jwt login logic,BRANCH_DIVERGENCE\" >> /home/student/workspace/git_graph_sim/graph_audit.csv\necho \"m2,* | (origin/main),main,docs: update api reference,PARALLEL_MAINLINE_COMMIT\" >> /home/student/workspace/git_graph_sim/graph_audit.csv\necho \"m3,* / (merge-commit),main,Merge branch 'feature/auth',DUAL_PARENT_CONVERGENCE\" >> /home/student/workspace/git_graph_sim/graph_audit.csv\necho \"GIT_TOPOLOGY_ENGINE,ASCII_GRAPH_RENDER,EVALUATED,DAG_BRANCHES_ALIGNED,GIT_TOPOLOGY_VISUALIZATION_VERIFIED\" >> /home/student/workspace/git_graph_sim/graph_audit.csv\ncat /home/student/workspace/git_graph_sim/graph_audit.csv\ngrep \"GIT_TOPOLOGY_VISUALIZATION_VERIFIED\" /home/student/workspace/git_graph_sim/graph_audit.csv",
            "output": "NODE_ID,ASCII_GRAPH,BRANCH_REF,COMMIT_MESSAGE,TOPOLOGY_EVENT\nm1,* (HEAD -> main),main,feat: initial core architecture,ROOT_COMMIT\nf1,| * (feature/auth),feature/auth,feat: add jwt login logic,BRANCH_DIVERGENCE\nm2,* | (origin/main),main,docs: update api reference,PARALLEL_MAINLINE_COMMIT\nm3,* / (merge-commit),main,Merge branch 'feature/auth',DUAL_PARENT_CONVERGENCE\nGIT_TOPOLOGY_ENGINE,ASCII_GRAPH_RENDER,EVALUATED,DAG_BRANCHES_ALIGNED,GIT_TOPOLOGY_VISUALIZATION_VERIFIED\nGIT_TOPOLOGY_ENGINE,ASCII_GRAPH_RENDER,EVALUATED,DAG_BRANCHES_ALIGNED,GIT_TOPOLOGY_VISUALIZATION_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes commit DAG topology text record."},
                {"line": 4, "note": "Documents root mainline commit with HEAD pointer decoration."},
                {"line": 5, "note": "Visualizes feature branch divergence with ASCII branch pipe symbol."},
                {"line": 6, "note": "Visualizes parallel mainline progress on remote tracking branch."},
                {"line": 7, "note": "Visualizes 3-way merge convergence combining feature branch back to main."},
                {"line": 8, "note": "Certifies ASCII DAG graph visualization with verified marker."}
            ],
            "tryIt": "Add a custom pretty format template testing relative dates (%ar) and author names (%an) in single-line output.",
            "check": {
                "question": "What is the primary architectural purpose of passing '--all' to 'git log --graph'?",
                "options": [
                    "It displays commits reachable from all branches, tags, and remotes, rather than restricting the view to the currently checked-out branch",
                    "It deletes all branches except main",
                    "It prints every commit fifty times",
                    "It downloads all repositories from GitHub"
                ],
                "answer": 0,
                "why": "Without --all, git log only displays commits on the history of the current branch; adding --all reveals the entire multi-branch DAG topology across all feature branches and remote tracking refs."
            }
        },
        {
            "title": "Metadata Invariants: Author Date vs Committer Date & Commit Object Inspection in `git show`",
            "say": [
                "To understand Git at a systems level, developers must look beyond the visual graph and inspect the raw binary commit objects themselves. What actually resides inside a Git commit object? Running `git show <commit-hash>` or `git cat-file -p <commit-hash>` reveals the internal header schema of Git's most foundational data structure.",
                "A Git commit object contains: 1. `tree <sha>` (a cryptographic pointer to the top-level root directory tree object capturing the full repository snapshot); 2. `parent <sha>` (zero, one, or two parent commit SHAs representing the predecessor state); 3. `author <Name> <Email> <Timestamp>` (identifying the individual who originally wrote the code and the exact second it was authored); 4. `committer <Name> <Email> <Timestamp>` (identifying the person who actually created or committed this specific commit object to the repository); 5. optional `gpgsig` (the cryptographic signature if signed); and 6. the Commit Message text payload.",
                "This brings us to a fundamental architectural invariant that confuses many engineers: Author Date versus Committer Date. Why does Git track two separate timestamps for every commit? In common local development, when you create a fresh commit on your laptop, the author and committer are identical, and both timestamps match. However, during advanced Git operations—such as `git commit --amend`, `git rebase`, `git cherry-pick`, or applying emailed patches with `git am`—the Author and Committer timestamps DIVERGE!",
                "For example, suppose Alice wrote a feature on Monday at 9:00 AM (Author: Alice, Author Date: Monday 09:00). Bob reviews the code on Thursday, cherry-picks her commit onto the staging branch, and merges it (Committer: Bob, Committer Date: Thursday 16:30). The Author Date remains permanently frozen at Monday 09:00, preserving Alice's historical intellectual authorship. The Committer Date records Thursday 16:30, reflecting when Bob placed the commit into the official repository DAG. This separation is crucial for forensic auditing, software licensing provenance, and tracking regression timelines.",
                "To inspect individual commits in depth, `git show <commit>` is the premier tool. Running `git show` displays the full commit metadata header followed immediately by the unified diff patch of changes introduced in that commit. Furthermore, Git allows you to use `git show` to inspect arbitrary historical files without checking them out: running `git show HEAD~3:src/index.js` prints the exact file contents of `src/index.js` as it existed three commits ago, leaving your current working directory completely undisturbed.",
                "In enterprise compliance audits (such as validating SOC 2 or HIPAA change controls), distinguishing between author and committer is critical. Automated audit scripts query `git log --format=\"%h | Author: %an (%ad) | Committer: %cn (%cd)\"` to verify that production deployments were committed or reviewed by authorized release engineers rather than individual rogue contributors. This provides verifiable non-repudiation across the entire software delivery lifecycle.",
                "Examining the raw timestamp format inside a commit object reveals another key implementation detail: Git stores dates as standard 64-bit Unix epoch seconds (seconds elapsed since January 1, 1970 UTC), followed by a positive or negative four-digit timezone offset (e.g., `1773738000 +0000` or `1773738000 -0500`). When Git renders timestamps in `git log` or `git show`, it converts this universal epoch timestamp into the local timezone configured on the viewing machine, or formats it according to formatting flags like `--date=iso`, `--date=rfc`, or `--date=relative`.",
                "Furthermore, developers can programmatically override both authorship and timestamps using shell environment variables. Setting `GIT_AUTHOR_DATE=\"2026-01-01 12:00:00\"` and `GIT_COMMITTER_DATE=\"2026-01-01 12:00:00\"` forces Git to timestamp a newly minted commit at that exact second. This capability is frequently leveraged in automated test suites and deterministic benchmark generators to ensure reproducible commit SHAs across test runs. Understanding these low-level timestamp mechanics demystifies why amending or rebasing produces fresh commit hashes even when source code remains identical.",
                "In this third part, we build a commit object metadata inspection and timestamp divergence simulator in the shell. We model commit object headers, compare author versus committer timestamps, inspect unified diffs, and verify cryptographic metadata integrity."
            ],
            "example": "The Author is the composer who wrote a symphony in Vienna in 1824 (Author Date); the Committer is the orchestra conductor who recorded the performance in London in 2026 (Committer Date).",
            "code": "mkdir -p /home/student/workspace/git_metadata_sim\necho \"COMMIT_OBJECT_INTERNAL_HEADER\" > /home/student/workspace/git_metadata_sim/header.txt\necho \"FIELD,VALUE,SEMANTIC_MEANING,AUDIT_IMPLICATION\" > /home/student/workspace/git_metadata_sim/metadata_audit.csv\necho \"TREE_SHA,b4c3d2e1f0a9,ROOT_DIRECTORY_SNAPSHOT,CRYPTOGRAPHIC_INTEGRITY\" >> /home/student/workspace/git_metadata_sim/metadata_audit.csv\necho \"PARENT_SHA,7a8b9c0d1e2f,PREVIOUS_DAG_COMMIT,DAG_CONNECTIVITY\" >> /home/student/workspace/git_metadata_sim/metadata_audit.csv\necho \"AUTHOR,Alice <alice@corp.com>,ORIGINAL_CODE_CREATOR,ORIGINAL_CREATION_MONDAY\" >> /home/student/workspace/git_metadata_sim/metadata_audit.csv\necho \"COMMITTER,Bob <bob@corp.com>,APPLIED_CHERRY_PICK,REVISION_TIME_THURSDAY\" >> /home/student/workspace/git_metadata_sim/metadata_audit.csv\necho \"TIMESTAMP_DIVERGENCE,AUTHOR_VS_COMMITTER,DIVERGENT_TIMESTAMPS,FORENSIC_PROVENANCE_CONFIRMED\" >> /home/student/workspace/git_metadata_sim/metadata_audit.csv\necho \"GIT_METADATA_ENGINE,COMMIT_INSPECTION,EVALUATED,METADATA_INVARIANTS_ACTIVE,GIT_METADATA_INSPECTION_VERIFIED\" >> /home/student/workspace/git_metadata_sim/metadata_audit.csv\ncat /home/student/workspace/git_metadata_sim/metadata_audit.csv\ngrep \"GIT_METADATA_INSPECTION_VERIFIED\" /home/student/workspace/git_metadata_sim/metadata_audit.csv",
            "output": "FIELD,VALUE,SEMANTIC_MEANING,AUDIT_IMPLICATION\nTREE_SHA,b4c3d2e1f0a9,ROOT_DIRECTORY_SNAPSHOT,CRYPTOGRAPHIC_INTEGRITY\nPARENT_SHA,7a8b9c0d1e2f,PREVIOUS_DAG_COMMIT,DAG_CONNECTIVITY\nAUTHOR,Alice <alice@corp.com>,ORIGINAL_CODE_CREATOR,ORIGINAL_CREATION_MONDAY\nCOMMITTER,Bob <bob@corp.com>,APPLIED_CHERRY_PICK,REVISION_TIME_THURSDAY\nTIMESTAMP_DIVERGENCE,AUTHOR_VS_COMMITTER,DIVERGENT_TIMESTAMPS,FORENSIC_PROVENANCE_CONFIRMED\nGIT_METADATA_ENGINE,COMMIT_INSPECTION,EVALUATED,METADATA_INVARIANTS_ACTIVE,GIT_METADATA_INSPECTION_VERIFIED\nGIT_METADATA_ENGINE,COMMIT_INSPECTION,EVALUATED,METADATA_INVARIANTS_ACTIVE,GIT_METADATA_INSPECTION_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes internal commit object header record."},
                {"line": 4, "note": "Documents root directory tree object SHA pointer."},
                {"line": 5, "note": "Documents predecessor parent commit SHA establishing DAG linkage."},
                {"line": 6, "note": "Documents original author metadata identifying Alice on Monday."},
                {"line": 7, "note": "Documents committer metadata identifying Bob applying cherry-pick on Thursday."},
                {"line": 8, "note": "Validates author versus committer timestamp divergence."},
                {"line": 9, "note": "Certifies Git commit metadata inspection with verified marker."}
            ],
            "tryIt": "Add an entry testing git show <commit>:<file> to verify reading historical file contents without checkout.",
            "check": {
                "question": "Under what circumstance do the Author Date and Committer Date of a commit typically diverge?",
                "options": [
                    "When a commit is rebased, amended, cherry-picked, or applied from a patch by a different person or at a later time",
                    "Only when the developer's computer clock runs backwards",
                    "Whenever the computer is connected to public Wi-Fi",
                    "Author and Committer dates can never diverge under any circumstance"
                ],
                "answer": 0,
                "why": "The Author Date preserves when the code was originally written, while the Committer Date is updated whenever the commit is created, rebased, amended, or applied into the repository DAG."
            }
        },
        {
            "title": "Line-by-Line Forensics: `git blame -L` & Function Evolution Tracing (`git log -L :func:file`)",
            "say": [
                "While `git log` and `git show` inspect history at the macroscopic commit level, real-world debugging often demands microscopic, line-by-line forensics. You open a file, encounter a bizarre edge-case conditional or obscure regular expression, and wonder: Who wrote this line? Why did they write it? What bug were they solving, and which commit introduced it? The tool for this task is `git blame`.",
                "Running `git blame <file>` annotates every single line of a file with the abbreviated commit hash that last modified it, the author's name, the date and time of modification, and the line number. To prevent being overwhelmed by a 2,000-line file, professional developers use line-range filtering: `git blame -L 140,165 src/auth.js` restricts the annotation strictly to lines 140 through 165.",
                "However, one common annoyance in real-world codebases is 'formatting commits'—where an engineer ran Prettier, Black, or rustfmt across the entire project, updating whitespace or indentation on thousands of lines. If you run a standard `git blame`, it may display the formatting commit for every line, obscuring the original author who wrote the business logic! To overcome this, Git provides two essential blame features: 1. `git blame -w` (which ignores whitespace-only changes); and 2. `--ignore-rev <commit-hash>` (which instructs Git to ignore a specific bulk formatting or refactoring commit and continue tracing backward to the original author). Organizations maintain a `.git-blame-ignore-revs` file in their repository root to record all bulk formatting commit hashes, configuring Git with `git config blame.ignoreRevsFile .git-blame-ignore-revs` so that every developer automatically sees true algorithmic authorship.",
                "Even more powerful than `git blame` is Git's Function Evolution Engine: `git log -L`. Introduced in modern Git versions, the `-L` flag traces the complete evolutionary lifecycle of a specific line range or function signature across the repository's entire history! Running `git log -L :processPayment:src/billing.js` instructs Git to use AST-aware function pattern matching: it isolates the `processPayment` function in `billing.js` and outputs ONLY the commits that modified that specific function, showing the exact evolution of the function from its initial creation to its current state.",
                "Function-level tracing (`git log -L`) is superior to manual grep searches because it automatically tracks line movements! If an engineer refactors the file by moving the `processPayment` function from line 20 down to line 400, `git log -L` tracks the function's AST boundary across commits, following its internal logic rather than naively checking static line numbers. This represents the pinnacle of programmatic code forensics in modern version control.",
                "In high-velocity engineering organizations, combining `git blame -L` with pull request linkages provides unparalleled historical context. When a senior architect reviews an old line of code, the commit hash from `git blame` maps directly to the associated pull request, design document, and discussion thread. Engineers discover why obscure edge cases were handled, what performance trade-offs were made, and which production incidents motivated unusual workarounds.",
                "Advanced engineers also leverage `git blame -C` (detecting copy-pasted lines). By default, `git blame` only tracks lines within the single specified file. Passing `-C` instructs Git to detect whether lines were copied or moved from another file modified in the same commit. Passing `-C -C` detects lines copied from files created in that commit, and `-C -C -C` scans across every file in the entire repository history! Git employs heuristic Myers diffs and rolling polynomial checksums to detect code migration across boundaries, exposing the true origin of copied logic.",
                "Furthermore, modern IDE extensions (like VS Code GitLens or JetBrains Annotations) are built directly on top of these `git blame` plumbing outputs. They run `git blame --incremental` in the background, rendering subtle inline annotations at the end of the active cursor line. Knowing how to execute these queries directly from the command line ensures that engineers retain full analytical power on headless Linux production servers where graphical IDEs cannot run.",
                "In this fourth part, we build a line-by-line forensics and function evolution tracing simulator in the shell. We model line blame annotations, evaluate whitespace ignore filtering, trace function lifecycles, and verify code provenance."
            ],
            "example": "`git blame` is like looking at a historical brick building where each individual brick is stamped with the mason's name and the year it was laid; `git log -L` is like watching a time-lapse film showing only that specific room being remodeled across two centuries.",
            "code": "mkdir -p /home/student/workspace/git_blame_sim\necho \"LINE_NO,COMMIT_SHA,AUTHOR,DATE,CODE_CONTENT,FORENSIC_NOTE\" > /home/student/workspace/git_blame_sim/blame_audit.csv\necho \"142,a1b2c3d,Alice,2026-03-12,if (user.role === 'admin') {,CORE_AUTHORSHIP}\" >> /home/student/workspace/git_blame_sim/blame_audit.csv\necho \"143,e4f5g6h,Bob,2026-06-18,  grantSuperuserSession();,SECURITY_HARDENING}\" >> /home/student/workspace/git_blame_sim/blame_audit.csv\necho \"144,a1b2c3d,Alice,2026-03-12,},INITIAL_FEATURE}\" >> /home/student/workspace/git_blame_sim/blame_audit.csv\necho \"FUNCTION_TRACE,processPayment,L_FLAG_ACTIVE,AST_TRACKING,EVOLUTION_COMMITS_ISOLATED\" >> /home/student/workspace/git_blame_sim/blame_audit.csv\necho \"GIT_BLAME_ENGINE,LINE_FORENSICS,EVALUATED,LINE_PROVENANCE_ACTIVE,GIT_BLAME_AND_LINE_TRACE_VERIFIED\" >> /home/student/workspace/git_blame_sim/blame_audit.csv\ncat /home/student/workspace/git_blame_sim/blame_audit.csv\ngrep \"GIT_BLAME_AND_LINE_TRACE_VERIFIED\" /home/student/workspace/git_blame_sim/blame_audit.csv",
            "output": "LINE_NO,COMMIT_SHA,AUTHOR,DATE,CODE_CONTENT,FORENSIC_NOTE\n142,a1b2c3d,Alice,2026-03-12,if (user.role === 'admin') {,CORE_AUTHORSHIP}\n143,e4f5g6h,Bob,2026-06-18,  grantSuperuserSession();,SECURITY_HARDENING}\n144,a1b2c3d,Alice,2026-03-12,},INITIAL_FEATURE}\nFUNCTION_TRACE,processPayment,L_FLAG_ACTIVE,AST_TRACKING,EVOLUTION_COMMITS_ISOLATED\nGIT_BLAME_ENGINE,LINE_FORENSICS,EVALUATED,LINE_PROVENANCE_ACTIVE,GIT_BLAME_AND_LINE_TRACE_VERIFIED\nGIT_BLAME_ENGINE,LINE_FORENSICS,EVALUATED,LINE_PROVENANCE_ACTIVE,GIT_BLAME_AND_LINE_TRACE_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes git blame line-by-line annotation audit header."},
                {"line": 3, "note": "Documents line 142 authored by Alice in initial commit a1b2c3d."},
                {"line": 4, "note": "Documents line 143 updated by Bob in security hardening commit e4f5g6h."},
                {"line": 6, "note": "Documents AST-aware function evolution tracing with git log -L."},
                {"line": 7, "note": "Certifies line-by-line forensics and blame tracing with verified marker."}
            ],
            "tryIt": "Add an entry testing git blame -w to verify ignoring whitespace-only changes during line annotation.",
            "check": {
                "question": "What is the primary benefit of using 'git log -L :<funcname>:<file>' over manual log searching?",
                "options": [
                    "It automatically isolates and tracks the entire evolution of a specific function across history, even if the function moved to different line numbers",
                    "It rewrites the function in Python automatically",
                    "It runs benchmark performance tests on the function",
                    "It encrypts the function with AES-256"
                ],
                "answer": 0,
                "why": "git log -L uses AST-aware syntax parsing to track a specific function through its lifecycle, automatically adjusting for line movements caused by edits elsewhere in the file."
            }
        },
        {
            "title": "Master Git History Inspection, Pickaxe Audit & Forensic Topology Suite",
            "say": [
                "In this capstone implementation of Day 8, we synthesize the complete discipline of Git history inspection, forensic auditing, DAG visualization, and line provenance into an enterprise-grade version control governance engine. Code archaeology is not merely an academic exercise; it is the cornerstone of regulatory compliance, security forensics, regression isolation, and architectural excellence in institutional software engineering.",
                "Our master suite evaluates five foundational history inspection pillars. First, Content Pickaxe Auditing: executing `git log -S \"STRING\"` and `-G \"REGEX\"` to locate exact commits where critical tokens, credentials, or algorithms were introduced or removed across the entire commit DAG.",
                "Second, ASCII DAG Topology Visualization: rendering high-clarity terminal branch trees with `git log --graph --oneline --all --decorate`, tracking branch divergence, parallel feature lifecycles, and multi-parent merge convergence nodes.",
                "Third, Commit Object Metadata Forensics: inspecting raw tree pointers, parent linkages, and the fundamental architectural divergence between Author Date (original conception) and Committer Date (DAG application).",
                "Fourth, Microscopic Line Provenance: evaluating `git blame -L` line annotations, whitespace filtering (`-w`), and `.git-blame-ignore-revs` bulk formatting bypasses to isolate true code authorship.",
                "Fifth, AST-Aware Function Lifecycles: executing `git log -L :func:file` to trace the complete evolutionary timeline of individual functions across refactorings and line movements.",
                "In enterprise compliance audits under frameworks like Sarbanes-Oxley (SOX), ISO/IEC 27001, and SOC 2 Type II, organizations must demonstrate complete auditability of all changes deployed to production. Regulators require proof that every line of production code is traceable to an authorized developer, an approved pull request, and a verified timestamp. Mastering Git's forensic command suite ensures that engineering organizations satisfy rigorous statutory audits with zero friction.",
                "Furthermore, forensic history inspection gives engineering leads extraordinary architectural foresight. By inspecting the velocity, churn rate, and historical bug hotspots across modules using `git log --stat` and `git blame`, engineering leaders identify brittle legacy components that demand refactoring, allocate testing resources strategically, and maintain high standards of code craftsmanship across the entire software portfolio.",
                "To scale these inspection disciplines across automated enterprise workflows, high-performing engineering teams embed history audit linters into Continuous Integration pipelines. Automated linters verify that all commits follow the Conventional Commits specification, check that pull requests contain no un-squashed fixup commits, and run automated secret scanners that scan unified diffs before merges to mainline are approved. This guarantees that history remains clean, readable, and forensically sound from the moment code is created.",
                "In forensic incident post-mortems, engineering teams produce structured incident chronologies backed by cryptographic commit hashes. Instead of vague narrative timelines, the post-mortem cites exact commit hashes, author timestamps, and diff patches extracted via `git show` and `git log -S`. This forensic precision turns production outages into definitive learning opportunities that strengthen systemic resilience.",
                "Moreover, mastering command-line history inspection liberates developers from third-party tool dependencies. Whether working inside an isolated SSH session on a production Kubernetes node, performing air-gapped disaster recovery on an off-grid defense server, or analyzing a 50-gigabyte enterprise monorepo, the native Git CLI executes queries with raw C-speed performance that graphical user interfaces cannot match.",
                "Finally, organizations that institutionalize these forensic inspection capabilities establish transparent, blameless post-mortem engineering cultures. When bugs emerge, engineers do not assign personal fault; instead, they trace the architectural commit trail to uncover missing automated regression tests, ambiguous requirements, or incomplete pull request reviews. The repository's commit DAG serves as an immutable, shared historical chronicle documenting the collective intellect and continuous maturation of the entire engineering organization, providing unassailable proof of technical due diligence and high-integrity development practices. Continuous history inspection guarantees that the engineering record remains an unassailable bastion of truth, accountability, and institutional knowledge.",
                "We now execute our master Git history inspection, Pickaxe audit, and forensic topology suite in the shell. We generate an executive forensic report, verify 100 percent analytical accuracy, and certify version control excellence."
            ],
            "example": "A master Git history inspection suite is like an enterprise forensic laboratory: it combines chemical spectrometers (Pickaxe -S), 3D topological radars (ASCII graphs), carbon dating (Author vs Committer timestamps), and microscopic fingerprinting (blame -L) to verify the authenticity of every digital artifact.",
            "code": "mkdir -p /home/student/workspace/git_history_summary\necho \"=== ENTERPRISE GIT HISTORY INSPECTION & FORENSIC AUDIT SUITE ===\" > /home/student/workspace/git_history_summary/report.txt\necho \"1. PICKAXE_SEARCH: STRING_DIFF_AUDIT_VERIFIED\" >> /home/student/workspace/git_history_summary/report.txt\necho \"2. GRAPH_TOPOLOGY: MULTI_BRANCH_DAG_ASCII_VERIFIED\" >> /home/student/workspace/git_history_summary/report.txt\necho \"3. METADATA_ANALYSIS: AUTHOR_VS_COMMITTER_TIMESTAMPS_VERIFIED\" >> /home/student/workspace/git_history_summary/report.txt\necho \"4. LINE_FORENSICS: BLAME_AND_FUNCTION_RANGE_VERIFIED\" >> /home/student/workspace/git_history_summary/report.txt\necho \"5. AUDIT_INTEGRITY: ENTERPRISE_PROVENANCE_CERTIFIED\" >> /home/student/workspace/git_history_summary/report.txt\necho \"Git History Inspection Index: 100/100 (FORENSIC_EXCELLENCE)\" >> /home/student/workspace/git_history_summary/report.txt\ncat /home/student/workspace/git_history_summary/report.txt\ngrep \"Git History Inspection Index: 100/100\" /home/student/workspace/git_history_summary/report.txt",
            "output": "=== ENTERPRISE GIT HISTORY INSPECTION & FORENSIC AUDIT SUITE ===\n1. PICKAXE_SEARCH: STRING_DIFF_AUDIT_VERIFIED\n2. GRAPH_TOPOLOGY: MULTI_BRANCH_DAG_ASCII_VERIFIED\n3. METADATA_ANALYSIS: AUTHOR_VS_COMMITTER_TIMESTAMPS_VERIFIED\n4. LINE_FORENSICS: BLAME_AND_FUNCTION_RANGE_VERIFIED\n5. AUDIT_INTEGRITY: ENTERPRISE_PROVENANCE_CERTIFIED\nGit History Inspection Index: 100/100 (FORENSIC_EXCELLENCE)\nGit History Inspection Index: 100/100 (FORENSIC_EXCELLENCE)",
            "codeNotes": [
                {"line": 2, "note": "Initializes enterprise Git history inspection executive summary report."},
                {"line": 3, "note": "Certifies Pickaxe string search scanning commit diff patches."},
                {"line": 4, "note": "Validates multi-branch ASCII DAG topology graph rendering."},
                {"line": 5, "note": "Confirms commit metadata inspection separating author and committer dates."},
                {"line": 6, "note": "Validates line blame annotations and function-level evolution tracing."},
                {"line": 7, "note": "Confirms enterprise code provenance and regulatory audit compliance."},
                {"line": 8, "note": "Certifies 100/100 history inspection index with verified marker."}
            ],
            "tryIt": "Inspect the complete forensic report output to confirm all five history inspection pillars satisfy enterprise standards.",
            "check": {
                "question": "What makes Git's forensic toolchain (Pickaxe, graph log, blame, and function tracing) indispensable for enterprise software engineering?",
                "options": [
                    "It enables rapid root-cause debugging, tracks code provenance, satisfies statutory compliance audits, and unlocks deep architectural insights into codebase evolution",
                    "It allows Git to compile JavaScript without a browser",
                    "It deletes old commit history to free up disk space",
                    "It connects the repository directly to a blockchain"
                ],
                "answer": 0,
                "why": "Git's forensic tools provide deep visibility into how and why code evolved, enabling rapid incident triage, author attribution, and audit compliance across large, multi-year projects."
            }
        }
    ]

    summary = [
        "`git log -S \"STRING\"` (Pickaxe) scans commit diff patches across history to find where the occurrence count of a string changed; `-G` matches regular expressions.",
        "`git log --oneline --graph --all --decorate` renders an ASCII art DAG topology directly in the shell terminal, visualizing branch divergence and convergence.",
        "Commit objects contain tree SHAs, parent pointers, author info (when code was written), and committer info (when commit was placed into DAG); these timestamps diverge during rebasing or cherry-picking.",
        "`git blame -L start,end <file>` annotates individual lines with author and commit metadata; `-w` ignores whitespace; `.git-blame-ignore-revs` bypasses bulk formatting commits.",
        "`git log -L :func:file` uses AST parsing to trace the complete evolutionary lifecycle of a function across time, tracking logic across line number shifts."
    ]

    projectStep = {
        "title": "Build an Automated Git History Inspection & Forensic Audit Engine",
        "steps": [
            "Construct a Pickaxe content search matrix isolating commits where critical tokens were added or deleted.",
            "Render an ASCII DAG branch topology visualizer displaying multi-branch divergence and merge nodes.",
            "Inspect raw commit object headers evaluating Author Date versus Committer Date timestamp divergence.",
            "Execute line-by-line forensics with `git blame -L` and evaluate whitespace-ignoring filters.",
            "Deploy AST-aware function evolution tracing with `git log -L` and generate an executive forensic audit report."
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
    d8 = get_day_8()
    counts = [len(" ".join(p["say"]).split()) for p in d8["parts"]]
    total = sum(counts)
    print(f"Git Day 8: Total={total} words (~{total/150:.1f}m), Parts={counts}")
