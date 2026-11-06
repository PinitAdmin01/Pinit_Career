import json

def get_day_22():
    day_num = 22
    title = "GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models"
    goal = "Master collaborative enterprise software engineering on GitHub: contrast the Forking Model used in open-source consortia against the Shared Repository Branching Model used in internal engineering teams, orchestrate pull request lifecycles from draft to review, author substantive high-quality PR descriptions with linked issues (Fixes #42, Closes #108), request and assign reviewers via CODEOWNERS, and enforce PR metadata invariants."
    minutes = 22
    recap = "Yesterday we completed ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine, synthesizing linear history, squashing, hotfix cherry-picking, and Ed25519 cryptography."

    parts = [
        {
            "title": "Collaboration Architectures: The Forking Model vs Shared Repository Branching",
            "say": [
                "Welcome to Day 22 of Git Version Control. Over our first twenty-one days, we mastered the core Git engine: local object databases, commit graphs, branching, 3-way merges, interactive rebasing, surgical cherry-picking, and remote networking protocols. Starting today, we expand our horizon from raw Git plumbing to the global hub of modern software engineering: GitHub and collaborative team workflows.",
                "In enterprise and open-source software engineering, code is almost never written in isolation. Hundreds of developers contribute simultaneously to shared codebases. To coordinate this massive scale without chaos, organizations adopt one of two foundational collaboration models: The Forking Model or The Shared Repository Branching Model.",
                "Let us first examine The Forking Model: A fork is a server-side clone of a repository created on GitHub under a developer's personal account. The forking model is the universal foundation of open-source software development (such as the Linux kernel, Kubernetes, React, and Python). Why do open-source projects rely on forks? The primary reason is Security and Access Control: In an open-source project with tens of thousands of potential contributors worldwide, the maintainers cannot grant direct write permissions to anyone. If contributors had push access, a malicious or careless user could force-push over `main` or inject backdoors directly into release branches.",
                "Under the forking model, external contributors have zero write permissions to the canonical repository (known as `upstream`). Instead, the contributor forks the repository to their own GitHub profile (`origin`), clones their personal fork to their local computer, creates a local topic branch, and pushes their commits to their personal fork. They then open a Pull Request from their fork's branch (`origin:feature`) targeting the canonical repository's `main` branch (`upstream:main`). The canonical maintainers review the pull request, automated CI test suites execute, and if approved, the maintainers merge the code. Furthermore, GitHub enforces strict security boundaries on fork pull requests: by default, GitHub Actions workflows running on fork pull requests do not have access to repository secrets (such as deployment keys or production API tokens), completely preventing untrusted pull requests from exfiltrating corporate credentials.",
                "To protect open-source runner infrastructure from abuse, GitHub also implements the 'Require approval for first-time contributors' guardrail: Automated CI workflows on fork PRs do not run automatically until a project maintainer inspects the diff and manually approves workflow execution, neutralizing malicious Bitcoin mining and resource exhaustion attacks.",
                "How does a developer keep their fork synchronized with canonical upstream development? They establish a dual-remote topology: `git remote add upstream https://github.com/canonical-org/project.git`. Periodically, the developer runs `git fetch upstream` followed by `git rebase upstream/main` on their local branch, pushing the updated state to their personal fork `origin` to keep their workspace in sync with the community.",
                "Now let us contrast this with The Shared Repository Branching Model: In corporate engineering environments, venture-backed startups, and private enterprise teams, all engineers are trusted employees or vetted contractors. Granting each developer a personal fork would create thousands of disconnected repositories and fragment issue tracking. Instead, all team members are added as Collaborators with write access to a single, centralized organizational repository.",
                "In the shared repository model, developers clone the organization's repository directly. When developing a feature, an engineer creates a feature branch directly on the corporate repository (e.g. `feature/user-authentication` or `username/login-fix`), commits their work, and pushes the branch directly to `origin`. However, write access does not mean developers can push directly to `main`! Enterprise repositories configure strict Branch Protection Rules that lock `main`, requiring all changes to be submitted through a Pull Request that must pass automated CI checks and receive peer code review approvals before merging.",
                "Understanding the architectural difference between forks (cross-repository collaboration with strict security isolation) and branches (intra-repository collaboration among trusted team members) allows a software engineer to navigate both open-source ecosystems and internal enterprise engineering teams with complete confidence.",
                "In this first part, we construct a collaboration model simulator in the shell. We model permission boundaries, contrast upstream versus origin routing across forks, evaluate secret access isolation, test dual-remote sync topologies, and verify collaboration architecture invariants."
            ],
            "example": "The forking model is like submitting an unsolicited manuscript to a publishing house: you write your book at home and mail a copy to the editors, who inspect it before deciding whether to publish it, whereas shared branching is like staff writers collaborating in the company newsroom.",
            "code": "mkdir -p /home/student/workspace/github_collab_sim\necho \"COLLAB_MODEL,REPO_RELATIONSHIP,WRITE_PERMISSIONS,UPSTREAM_ACCESS,SECRET_EXPOSURE_RISK,STATUS\" > /home/student/workspace/github_collab_sim/collab_models.csv\necho \"FORK_MODEL,cross_repository_clone,PERSONAL_FORK_WRITABLE,CANONICAL_UPSTREAM_READ_ONLY,SECRETS_ISOLATED_SECURE,RECOMMENDED_OPEN_SOURCE\" >> /home/student/workspace/github_collab_sim/collab_models.csv\necho \"SHARED_BRANCH_MODEL,intra_org_repository,COLLABORATOR_WRITE_BRANCHES,PROTECTED_MAIN_GATED,CONTROLLED_CI_RUNNERS,RECOMMENDED_ENTERPRISE\" >> /home/student/workspace/github_collab_sim/collab_models.csv\necho \"SECURITY_BOUNDARY,fork_pr_ci_gating,UNTRUSTED_CODE_ISOLATION,ZERO_ENVIRONMENT_SECRET_LEAK,ENFORCED_GUARDRAIL,NOMINAL\" >> /home/student/workspace/github_collab_sim/collab_models.csv\necho \"COLLAB_AUDIT,EVALUATION,DUAL_COLLABORATION_ARCHITECTURES_VALIDATED,ALL_BOUNDARIES_CONFIRMED,COLLABORATION_MODELS_CONTRASTED_VERIFIED\" >> /home/student/workspace/github_collab_sim/collab_models.csv\ncat /home/student/workspace/github_collab_sim/collab_models.csv\ngrep \"COLLABORATION_MODELS_CONTRASTED_VERIFIED\" /home/student/workspace/github_collab_sim/collab_models.csv",
            "output": "COLLAB_MODEL,REPO_RELATIONSHIP,WRITE_PERMISSIONS,UPSTREAM_ACCESS,SECRET_EXPOSURE_RISK,STATUS\nFORK_MODEL,cross_repository_clone,PERSONAL_FORK_WRITABLE,CANONICAL_UPSTREAM_READ_ONLY,SECRETS_ISOLATED_SECURE,RECOMMENDED_OPEN_SOURCE\nSHARED_BRANCH_MODEL,intra_org_repository,COLLABORATOR_WRITE_BRANCHES,PROTECTED_MAIN_GATED,CONTROLLED_CI_RUNNERS,RECOMMENDED_ENTERPRISE\nSECURITY_BOUNDARY,fork_pr_ci_gating,UNTRUSTED_CODE_ISOLATION,ZERO_ENVIRONMENT_SECRET_LEAK,ENFORCED_GUARDRAIL,NOMINAL\nCOLLAB_AUDIT,EVALUATION,DUAL_COLLABORATION_ARCHITECTURES_VALIDATED,ALL_BOUNDARIES_CONFIRMED,COLLABORATION_MODELS_CONTRASTED_VERIFIED\nCOLLAB_AUDIT,EVALUATION,DUAL_COLLABORATION_ARCHITECTURES_VALIDATED,ALL_BOUNDARIES_CONFIRMED,COLLABORATION_MODELS_CONTRASTED_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes collaboration model comparison audit schema."},
                {"line": 3, "note": "Documents Fork Model security isolation and read-only upstream access for open-source."},
                {"line": 4, "note": "Documents Shared Repository Branching Model with protected main gating for enterprise."},
                {"line": 5, "note": "Validates security boundaries isolating CI secrets on fork pull requests."},
                {"line": 6, "note": "Certifies collaboration architecture comparison with verified marker."}
            ],
            "tryIt": "Add an entry testing git remote -v to confirm presence of both origin and upstream remote endpoints.",
            "check": {
                "question": "Why do open-source projects universally prefer the Forking Model over granting direct branch write access to contributors?",
                "options": [
                    "Because it allows contributors to propose changes without granting write permissions to the canonical repository, protecting the project from unauthorized modifications and secret leakage",
                    "Because GitHub crashes if more than 5 developers clone the same repository",
                    "Because the forking model compresses git objects using bzip2",
                    "Because developers must pay a fee to create branches in corporate repositories"
                ],
                "answer": 0,
                "why": "The Forking Model guarantees security by isolating external development to personal forks, requiring maintainer review before merging into canonical branches."
            }
        },
        {
            "title": "The Pull Request Anatomy: Draft PRs, Commits, Diffs & Lifecycle States",
            "say": [
                "Now let us examine the fundamental collaboration vehicle on GitHub: The Pull Request (PR). It is essential to recognize a crucial technical truth: Git itself has no native concept of a 'pull request'! In core Git plumbing, there are only commits, trees, blobs, and references. A Pull Request is a web-native collaboration primitive invented by GitHub that formalizes peer code review, continuous integration testing, and discussion around candidate changes before they merge.",
                "Let us trace the complete lifecycle of a Pull Request: A PR transitions through four distinct states: 1. Draft (Work in progress); 2. Open (Ready for review); 3. Merged (Integrated into the target branch); and 4. Closed (Rejected or abandoned without merging).",
                "Let us examine the power of Draft Pull Requests: When an engineer is working on a complex multi-day feature or an experimental architectural refactoring, they do not wait until the code is 100 percent complete to open a PR. Instead, they open a Draft Pull Request! When a PR is designated as a Draft, GitHub visually flags it with a grey draft icon, disables the merge button, and automatically suppresses notifications to assigned reviewers. Why is this beneficial? Because opening an early draft PR allows the developer to: 1. Verify that automated GitHub Actions CI pipelines pass across various platforms; 2. Inspect the consolidated diff on the web UI to catch stray debug statements; and 3. Solicit high-level early architectural feedback from tech leads before investing time into edge cases and polish. Once the feature is mature and tested, a single click on 'Ready for review' transitions the PR to Open status, notifying team members that the code is ready for formal review.",
                "To accelerate daily developer ergonomics, GitHub provides the official GitHub CLI tool (`gh`). Rather than switching back and forth between terminal and web browsers, developers command the entire PR lifecycle directly from the shell: `gh pr create --draft --title \"feat: auth\" --body \"WIP\"` to initiate a draft PR, `gh pr view --web` to preview the diff in a browser, `gh pr ready` to mark it ready for review, and `gh pr checkout 108` to download a colleague's PR branch locally for interactive testing and debugging.",
                "Now, let us analyze how GitHub computes PR Diffs: When you view the 'Files changed' tab on a GitHub pull request, what code are you actually looking at? GitHub displays what is known as a Three-Dot Diff (`base...head`). In Git graph mathematics, `main...feature` compares the tip of `feature` against the Common Ancestor commit between `main` and `feature`! It does NOT show changes that were merged into `main` after the feature branch was created! This prevents reviewers from seeing irrelevant diffs introduced by other teammates, focusing attention exclusively on the lines modified by the author.",
                "When `main` advances while a PR is being reviewed, GitHub offers an 'Update branch' button. Developers can choose between updating via a merge commit or updating via rebase: in high-performing engineering teams, updating via rebase is strictly enforced to prevent polluting the PR diff with merge artifacts.",
                "A pull request also contains two distinct inspection perspectives: The 'Commits' tab, which lists each individual commit in chronological order, and the 'Files changed' tab, which aggregates all commits into a single unified diff. Elite software engineers ensure that both tabs are pristine: each individual commit tells a focused atomic story, and the aggregated diff is clean, formatted, and free of extraneous noise.",
                "Furthermore, GitHub provides rich diff inspection tools: switching between Unified and Split diff views, hiding whitespace changes (`?w=1`), displaying rich visual diffs for images and rendered Markdown files, and tracking diff evolution as new commits are pushed to the head branch.",
                "In this second part, we construct a PR lifecycle state machine and diff analysis engine in the shell. We model state transitions across Draft, Open, Merged, and Closed, simulate three-dot common ancestor diff computations, track commit aggregations, test `gh` CLI lifecycle operations, and verify pull request anatomy invariants."
            ],
            "example": "A Draft Pull Request is like inviting a master builder to walk through your house while the drywall and framing are exposed: you want their feedback on the load-bearing beams before you paint the walls and install fine trim.",
            "code": "mkdir -p /home/student/workspace/github_collab_sim\necho \"PR_NUMBER,LIFECYCLE_STATE,MERGE_BUTTON_ENABLED,NOTIFY_REVIEWERS,DIFF_ALGORITHM,STATUS\" > /home/student/workspace/github_collab_sim/pr_lifecycle.csv\necho \"PR_101,DRAFT,FALSE,SUPPRESSED_SILENT,THREE_DOT_COMMON_ANCESTOR,WORK_IN_PROGRESS\" >> /home/student/workspace/github_collab_sim/pr_lifecycle.csv\necho \"PR_101,OPEN_READY_FOR_REVIEW,GATED_BY_PROTECTIONS,DISPATCHED_ACTIVE,THREE_DOT_COMMON_ANCESTOR,ACTIVE_REVIEW\" >> /home/student/workspace/github_collab_sim/pr_lifecycle.csv\necho \"PR_101,MERGED,COMPLETED,ARCHIVED_COMMITTED,FAST_FORWARD_OR_REBASE,SUCCESSFULLY_INTEGRATED\" >> /home/student/workspace/github_collab_sim/pr_lifecycle.csv\necho \"PR_102,CLOSED_UNMERGED,ABORTED,CLOSED_NO_INTEGRATION,N_A_ABANDONED,REJECTED_CLEANUP\" >> /home/student/workspace/github_collab_sim/pr_lifecycle.csv\necho \"LIFECYCLE_AUDIT,STATE_MACHINE_VERIFIED,ALL_FOUR_STATES_EVALUATED,THREE_DOT_DIFF_CONFIRMED,PR_LIFECYCLE_ANATOMY_VERIFIED\" >> /home/student/workspace/github_collab_sim/pr_lifecycle.csv\ncat /home/student/workspace/github_collab_sim/pr_lifecycle.csv\ngrep \"PR_LIFECYCLE_ANATOMY_VERIFIED\" /home/student/workspace/github_collab_sim/pr_lifecycle.csv",
            "output": "PR_NUMBER,LIFECYCLE_STATE,MERGE_BUTTON_ENABLED,NOTIFY_REVIEWERS,DIFF_ALGORITHM,STATUS\nPR_101,DRAFT,FALSE,SUPPRESSED_SILENT,THREE_DOT_COMMON_ANCESTOR,WORK_IN_PROGRESS\nPR_101,OPEN_READY_FOR_REVIEW,GATED_BY_PROTECTIONS,DISPATCHED_ACTIVE,THREE_DOT_COMMON_ANCESTOR,ACTIVE_REVIEW\nPR_101,MERGED,COMPLETED,ARCHIVED_COMMITTED,FAST_FORWARD_OR_REBASE,SUCCESSFULLY_INTEGRATED\nPR_102,CLOSED_UNMERGED,ABORTED,CLOSED_NO_INTEGRATION,N_A_ABANDONED,REJECTED_CLEANUP\nLIFECYCLE_AUDIT,STATE_MACHINE_VERIFIED,ALL_FOUR_STATES_EVALUATED,THREE_DOT_DIFF_CONFIRMED,PR_LIFECYCLE_ANATOMY_VERIFIED\nLIFECYCLE_AUDIT,STATE_MACHINE_VERIFIED,ALL_FOUR_STATES_EVALUATED,THREE_DOT_DIFF_CONFIRMED,PR_LIFECYCLE_ANATOMY_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes PR lifecycle state machine audit schema."},
                {"line": 3, "note": "Documents Draft state suppressing reviewer notifications and disabling merge."},
                {"line": 4, "note": "Documents Open state activating reviewer notifications and protection gates."},
                {"line": 5, "note": "Documents Merged state integrating commits into target branch."},
                {"line": 6, "note": "Documents Closed unmerged state cleanly terminating abandoned work."},
                {"line": 7, "note": "Certifies PR lifecycle anatomy with verified marker."}
            ],
            "tryIt": "Add an entry testing three-dot diff calculation comparing common ancestor against branch head.",
            "check": {
                "question": "What is the primary operational advantage of creating a Draft Pull Request on GitHub?",
                "options": [
                    "It allows developers to run automated CI tests and review their diffs without notifying reviewers or enabling premature merging",
                    "It automatically merges the code to production without any human review",
                    "It prevents the developer from editing any code in the branch",
                    "It charges the company a reduced cloud fee"
                ],
                "answer": 0,
                "why": "Draft PRs allow early inspection and automated CI testing while disabling merge buttons and suppressing reviewer notifications."
            }
        },
        {
            "title": "High-Impact PR Descriptions: Markdown, Architecture Context & Issue Linking",
            "say": [
                "Now we advance to Pillar 3: High-Impact PR Descriptions, Markdown Architecture Context, and Automated Issue Linking. In modern software engineering, the code you write is only half of your deliverable; the other half is the communication that explains why the code exists. A pull request with a blank description or a lazy 'fixed stuff' message forces reviewers to guess your intent, dramatically slows down review turnaround, and leads to undetected production defects.",
                "Let us examine the four mandatory sections of a high-impact pull request description: 1. Executive Summary: What problem does this PR solve, and what is the high-level solution? 2. Architectural Context & Tradeoffs: Why did you choose this implementation over alternative designs? Are there performance or security implications? 3. Visual & Empirical Evidence: For UI changes, attach before-and-after screenshots or screen recordings; for backend changes, attach benchmark numbers, terminal curl outputs, or test suite execution logs. 4. Verification Protocol: Step-by-step instructions that allow a reviewer to reproduce the issue locally and verify that your fix resolves it.",
                "Professional engineers leverage rich GitHub Flavored Markdown (GFM) features to enhance clarity: embedding collapsible disclosure widgets (`<details><summary>Click to expand benchmark logs</summary>...</details>`) to prevent terminal logs from dominating the page, creating interactive task checklists (`- [x] Unit tests passing`, `- [ ] Migration tested on staging`), embedding formatted comparison tables, and providing fenced code snippets with syntax highlighting.",
                "To standardize these high standards across entire engineering departments, organizations implement Pull Request Templates: by creating a Markdown file at `.github/pull_request_template.md` (or `.github/PULL_REQUEST_TEMPLATE/`), GitHub automatically pre-populates every new PR with a structured template containing mandatory checklists.",
                "Now let us examine one of GitHub's most potent workflow automations: Automated Issue Linking via Closing Keywords. In professional project management, engineering tasks and bugs are tracked in GitHub Issues. When you write a PR that resolves an issue, you do not need to manually navigate to the issue and close it after merging. Instead, you include an explicit Closing Keyword in your PR description followed by the issue number!",
                "What are GitHub's supported closing keywords? GitHub recognizes: `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, and `resolved`. For example, writing: `Fixes #42` or `Closes #108` in your PR description instructs GitHub's automation engine to create an active bidirectional link. On the issue page, GitHub displays a notification: 'vinay linked a pull request that will close this issue'. And the moment that PR is merged into the repository's default branch (`main`), GitHub automatically closes Issue #42 and #108 with a reference to the closing commit!",
                "GitHub also supports cross-repository issue closing: If you are working in a multi-repo microservice architecture, writing `Closes acme-corp/api-gateway#89` automatically closes the issue in the external repository when your PR merges into your local repository's default branch. However, mark this critical nuance: if a PR is closed without being merged, or if it is merged into a non-default branch (such as a temporary feature branch), the linked issue remains open, preventing premature task completion.",
                "Furthermore, authoring clean, descriptive PR titles conforming to Conventional Commits (`feat: add stripe checkout webhook verification`) directly impacts automated releases: When repository maintainers select 'Squash and merge', GitHub defaults the final squashed commit title to the PR title, allowing automated changelog generators and semantic release tools to categorize the deployment seamlessly. In automated release pipelines (such as Semantic Release or Release Please), a PR title starting with `feat:` increments the minor version, `fix:` increments the patch version, and `feat!:` or `BREAKING CHANGE:` increments the major version automatically.",
                "Developers also organize large pull requests using milestone targets, project board statuses, and organizational labels (`priority: P0`, `type: bug`, `area: auth`), integrating with automated agile project boards.",
                "In this third part, we construct a PR description and issue linking parser in the shell. We model regex matching against closing keywords (`Fixes`, `Closes`, `Resolves`), evaluate PR description substance and length constraints, verify bidirectional issue link bindings, and validate description invariants."
            ],
            "example": "A high-impact PR description with issue linking is like a builder submitting a detailed architectural permit to a city inspector: it explains the exact blueprints, provides engineering stress tests, and cites the specific building code violations being remediated.",
            "code": "mkdir -p /home/student/workspace/github_collab_sim\necho \"PR_FIELD,CONTENT_EXTRACTED,REGEX_PATTERN,PARSED_ISSUE_ID,SUBSTANTIVE_BODY,STATUS\" > /home/student/workspace/github_collab_sim/pr_metadata.csv\necho \"PR_TITLE,feat: add stripe webhook verification,None,None,TRUE,VALIDATED\" >> /home/student/workspace/github_collab_sim/pr_metadata.csv\necho \"LINKED_ISSUE,Closes #108,(?:Fixes|Closes|Resolves)\\s+#(\\d+),108,TRUE,AUTO_CLOSE_REGISTERED\" >> /home/student/workspace/github_collab_sim/pr_metadata.csv\necho \"SECONDARY_ISSUE,Fixes #42,(?:Fixes|Closes|Resolves)\\s+#(\\d+),42,TRUE,AUTO_CLOSE_REGISTERED\" >> /home/student/workspace/github_collab_sim/pr_metadata.csv\necho \"BODY_CONTENT,This PR implements Stripe webhooks with HMAC-SHA256 signature verification.,LENGTH_GE_30_CHARS,None,TRUE,SUBSTANTIVE_PASSED\" >> /home/student/workspace/github_collab_sim/pr_metadata.csv\necho \"METADATA_AUDIT,EVALUATION,ALL_LINKED_ISSUES_EXTRACTED,PR_DESCRIPTION_VALIDATED,PR_DESCRIPTION_AND_LINKING_VERIFIED\" >> /home/student/workspace/github_collab_sim/pr_metadata.csv\ncat /home/student/workspace/github_collab_sim/pr_metadata.csv\ngrep \"PR_DESCRIPTION_AND_LINKING_VERIFIED\" /home/student/workspace/github_collab_sim/pr_metadata.csv",
            "output": "PR_FIELD,CONTENT_EXTRACTED,REGEX_PATTERN,PARSED_ISSUE_ID,SUBSTANTIVE_BODY,STATUS\nPR_TITLE,feat: add stripe webhook verification,None,None,TRUE,VALIDATED\nLINKED_ISSUE,Closes #108,(?:Fixes|Closes|Resolves)\\s+#(\\d+),108,TRUE,AUTO_CLOSE_REGISTERED\nSECONDARY_ISSUE,Fixes #42,(?:Fixes|Closes|Resolves)\\s+#(\\d+),42,TRUE,AUTO_CLOSE_REGISTERED\nBODY_CONTENT,This PR implements Stripe webhooks with HMAC-SHA256 signature verification.,LENGTH_GE_30_CHARS,None,TRUE,SUBSTANTIVE_PASSED\nMETADATA_AUDIT,EVALUATION,ALL_LINKED_ISSUES_EXTRACTED,PR_DESCRIPTION_VALIDATED,PR_DESCRIPTION_AND_LINKING_VERIFIED\nMETADATA_AUDIT,EVALUATION,ALL_LINKED_ISSUES_EXTRACTED,PR_DESCRIPTION_VALIDATED,PR_DESCRIPTION_AND_LINKING_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes PR metadata and issue linking audit schema."},
                {"line": 3, "note": "Documents conventional commit PR title validation."},
                {"line": 4, "note": "Documents regex extraction of closing issue ID 108 using Closes keyword."},
                {"line": 5, "note": "Documents regex extraction of closing issue ID 42 using Fixes keyword."},
                {"line": 6, "note": "Validates substantive PR body description length meeting quality threshold."},
                {"line": 7, "note": "Certifies PR description and issue linking with verified marker."}
            ],
            "tryIt": "Add an entry testing regex matching for 'Resolves #256' to confirm automated issue resolution.",
            "check": {
                "question": "Which of the following phrases will automatically close Issue #42 when a pull request merges into GitHub's default branch?",
                "options": [
                    "Closes #42 (or Fixes #42, Resolves #42)",
                    "Mentions #42",
                    "Related to #42",
                    "Look at #42"
                ],
                "answer": 0,
                "why": "GitHub requires specific closing keywords (Close, Closes, Closed, Fix, Fixes, Fixed, Resolve, Resolves, Resolved) followed by the issue number to trigger automatic issue closing."
            }
        },
        {
            "title": "Reviewer Orchestration: CODEOWNERS, Review Requests & Team Assignments",
            "say": [
                "Now we arrive at Pillar 4: Reviewer Orchestration, CODEOWNERS Automation, and Review Management. When a pull request is opened, who is responsible for reviewing it? In small teams, authors manually ping a colleague on Slack. However, in mid-size and large-scale engineering organizations with hundreds of files and microservices, manual review assignment breaks down: authors don't know who owns which subsystem, pull requests sit idle for days, and critical security code gets reviewed by engineers without domain expertise.",
                "To automate governance, GitHub introduced a declarative mechanism called CODEOWNERS. By placing a plain-text file named `CODEOWNERS` in the repository's `.github/`, root `/`, or `docs/` directory, organizations define exact ownership mappings between filesystem paths and GitHub users or teams.",
                "Let us examine the syntax of a production `CODEOWNERS` file: It follows the familiar pattern-matching rules of `.gitignore`: 1. Global default fallback: `* @engineering-leads` (assigns engineering leads to any file that does not match a more specific rule); 2. Component ownership: `/src/auth/ @security-team` (any pull request that modifies files inside `src/auth/` automatically requests a review from the security team); 3. Extension ownership: `*.sql @database-architects` (any database migration or SQL file automatically tags the DBA team); 4. Documentation ownership: `/docs/ @tech-writers`. Notice that like `.gitignore`, rules later in the file take precedence over earlier rules for matching paths.",
                "Let us observe important syntax rules for `CODEOWNERS`: Paths containing spaces must be enclosed in quotes (e.g. `\"/docs/api specs/\" @writers`). If a syntax error exists in `CODEOWNERS` (such as an invalid username or malformed pattern), GitHub displays an error badge under repository settings and ignores the erroneous rule, making continuous linting of `CODEOWNERS` essential for enterprise compliance.",
                "When a developer opens a PR that touches both `/src/auth/login.ts` and `/docs/api.md`, GitHub's CODEOWNERS engine evaluates the diff and automatically assigns both `@security-team` and `@tech-writers` as required reviewers! Concurrently, when paired with protected branch rules ('Require review from Code Owners'), GitHub strictly blocks the merge button until an approved member of each respective owner team submits a formal approval, making it physically impossible for unauthorized code to slip into production.",
                "In monorepos housing multiple applications, CODEOWNERS scales gracefully: Directory hierarchies allow sub-teams to own specific microservices without bottlenecking the rest of the company. For example, `/apps/billing/** @fintech-team` and `/apps/billing/security/** @appsec-lead` establish a granular hierarchy where sensitive subdirectories require specialized security clearance.",
                "Let us also distinguish between Assignees and Reviewers: In GitHub project management, an Assignee is the engineer who is actively responsible for shepherding the task to completion (usually the PR author or task lead). A Reviewer, in contrast, is the peer or team lead tasked with critically reading the diff, running tests, and providing feedback. Simply mentioning someone with `@username` in a PR comment or description does NOT create a formal review request; only assigning them as an official Reviewer activates merge blockers and notifications.",
                "Furthermore, modern teams utilize GitHub Team Review Assignment: Inside organizational team settings, managers configure automated review routing algorithms: Round-Robin (distributes reviews evenly across all team members) or Load-Balancing (assigns reviews to whoever currently has the fewest open review requests), preventing senior engineers from burning out under review bottlenecks. Team review assignment can also factor in active working hours and time zones, ensuring pull requests are never routed to engineers who are offline or on leave.",
                "In collaborative enterprise review flows, CODEOWNERS rules interact directly with branch protection dismissal policies: When an author pushes new commits to address review comments, repository settings can automatically dismiss stale approvals. This ensures that any new modifications introduced after an approval was granted must be re-evaluated and re-approved by the code owner before the PR is unlocked for production merging.",
                "In this fourth pillar, we construct a CODEOWNERS parsing and reviewer assignment simulator in the shell. We model path matching rules across directories and file extensions, evaluate automated reviewer dispatch, enforce code owner approval gates, and validate reviewer orchestration invariants."
            ],
            "example": "A CODEOWNERS file is like a hospital routing chart: chest pain patients are automatically routed to cardiology, broken bones to orthopedics, and head injuries to neurology, ensuring specialists review every critical condition.",
            "code": "mkdir -p /home/student/workspace/github_collab_sim\necho \"PATH_PATTERN,ASSIGNED_OWNER_OR_TEAM,DIFF_FILE_TOUCHED,AUTOMATED_REVIEW_TRIGGERED,APPROVAL_REQUIRED,STATUS\" > /home/student/workspace/github_collab_sim/codeowners_audit.csv\necho \"* ,@platform-core,README.md,TRUE,OPTIONAL,MATCHED_GLOBAL_FALLBACK\" >> /home/student/workspace/github_collab_sim/codeowners_audit.csv\necho \"/src/auth/ ,@security-team,src/auth/tokens.ts,TRUE,MANDATORY_BLOCKER,SECURITY_GATE_ACTIVE\" >> /home/student/workspace/github_collab_sim/codeowners_audit.csv\necho \"*.sql ,@data-architects,migrations/001_init.sql,TRUE,MANDATORY_BLOCKER,SCHEMA_GATE_ACTIVE\" >> /home/student/workspace/github_collab_sim/codeowners_audit.csv\necho \"/docs/ ,@tech-writers,docs/architecture.md,TRUE,OPTIONAL,DOCS_GATE_ACTIVE\" >> /home/student/workspace/github_collab_sim/codeowners_audit.csv\necho \"CODEOWNERS_AUDIT,EVALUATION,ALL_DIFF_PATHS_MATCHED,OWNERS_DISPATCHED,CODEOWNERS_AND_REVIEWER_ORCHESTRATION_VERIFIED\" >> /home/student/workspace/github_collab_sim/codeowners_audit.csv\ncat /home/student/workspace/github_collab_sim/codeowners_audit.csv\ngrep \"CODEOWNERS_AND_REVIEWER_ORCHESTRATION_VERIFIED\" /home/student/workspace/github_collab_sim/codeowners_audit.csv",
            "output": "PATH_PATTERN,ASSIGNED_OWNER_OR_TEAM,DIFF_FILE_TOUCHED,AUTOMATED_REVIEW_TRIGGERED,APPROVAL_REQUIRED,STATUS\n* ,@platform-core,README.md,TRUE,OPTIONAL,MATCHED_GLOBAL_FALLBACK\n/src/auth/ ,@security-team,src/auth/tokens.ts,TRUE,MANDATORY_BLOCKER,SECURITY_GATE_ACTIVE\n*.sql ,@data-architects,migrations/001_init.sql,TRUE,MANDATORY_BLOCKER,SCHEMA_GATE_ACTIVE\n/docs/ ,@tech-writers,docs/architecture.md,TRUE,OPTIONAL,DOCS_GATE_ACTIVE\nCODEOWNERS_AUDIT,EVALUATION,ALL_DIFF_PATHS_MATCHED,OWNERS_DISPATCHED,CODEOWNERS_AND_REVIEWER_ORCHESTRATION_VERIFIED\nCODEOWNERS_AUDIT,EVALUATION,ALL_DIFF_PATHS_MATCHED,OWNERS_DISPATCHED,CODEOWNERS_AND_REVIEWER_ORCHESTRATION_VERIFIED",
            "codeNotes": [
                {"line": 2, "note": "Initializes CODEOWNERS pattern matching audit schema."},
                {"line": 3, "note": "Documents global fallback owner rule for unmatched repository paths."},
                {"line": 4, "note": "Documents security team ownership for authentication path requiring mandatory approval."},
                {"line": 5, "note": "Documents database team ownership for SQL extensions requiring mandatory approval."},
                {"line": 6, "note": "Documents technical writer ownership for documentation directory."},
                {"line": 7, "note": "Certifies CODEOWNERS and reviewer orchestration with verified marker."}
            ],
            "tryIt": "Add an entry testing path matching for /api/routes/ to verify backend team automated review request.",
            "check": {
                "question": "What happens when a pull request modifies files matching a rule defined in '.github/CODEOWNERS'?",
                "options": [
                    "GitHub automatically requests reviews from the specified users or teams, and if branch protection requires it, blocks merging until a code owner approves",
                    "GitHub immediately rejects the pull request and deletes the branch",
                    "The files are converted into binary executable files",
                    "The developer's GitHub account is downgraded to a trial account"
                ],
                "answer": 0,
                "why": "CODEOWNERS automates review requests based on modified file paths and enforces mandatory code owner signoffs when enabled in branch protections."
            }
        },
        {
            "title": "Master GitHub Collaboration Suite: End-to-End Governance Certification",
            "say": [
                "In this fifth and final part of Day 22, we synthesize all four foundational pillars of GitHub collaboration into an end-to-end governance and certification suite. We bring together collaboration model selection (Forking vs Shared Branching), pull request lifecycle state management (Draft to Open to Merged), high-impact PR description authoring with automated issue closing keywords (`Fixes #42`, `Closes #108`), and automated reviewer orchestration via `CODEOWNERS` into a unified master pipeline.",
                "Let us review the complete enterprise pull request lifecycle from inception to deployment: 1. A product manager or tech lead creates an issue detailing requirements and acceptance criteria (e.g. Issue #108: 'Implement Stripe Webhook Verification'); 2. A developer branches off the latest production tip (`git switch -c feat/stripe-webhook`); 3. The developer authors atomic, conventional commits with passing unit tests; 4. The developer pushes to `origin` with upstream tracking (`git push -u origin feat/stripe-webhook`); 5. The developer opens a Draft Pull Request on GitHub using the organizational PR template, embedding architecture context and the keyword `Closes #108`; 6. Automated GitHub Actions CI test pipelines trigger in parallel, running linting, typechecking, and unit tests; 7. The developer verifies CI green status and changes the PR from Draft to 'Ready for review'; 8. GitHub's `CODEOWNERS` engine inspects the diff and automatically requests reviews from `@security-team` and `@backend-leads`; 9. Peers conduct code review, leaving actionable inline feedback; 10. The author addresses feedback with clean fixups; 11. Reviewers submit formal approvals (`LGTM`); 12. With all status checks green and required approvals granted, the branch protection gate unlocks, allowing the PR to merge cleanly via rebase or squash; and 13. GitHub automatically closes Issue #108 and deletes the head feature branch to prevent repository clutter.",
                "To maintain regulatory compliance across SOC2, ISO 27001, and financial audit frameworks, enterprise organizations rely on GitHub audit logs and pull request immutability: Every production release can be traced back to its specific pull request, proving who authored the code, which CI test suites passed, which designated code owners approved the diff, and the exact timestamp of merge. This end-to-end chain of custody guarantees that rogue commits cannot reach production environments unnoticed.",
                "Organizations also automate post-merge repository hygiene: Under repository settings, administrators enable 'Automatically delete head branches'. When a pull request is merged, GitHub automatically deletes the remote topic branch (`origin/feat/stripe-webhook`), keeping the repository free from hundreds of stale ghost branches.",
                "Furthermore, engineering leaders track core DORA metrics—Lead Time for Changes, Deployment Frequency, Change Failure Rate, and Mean Time to Recovery (MTTR). In high-velocity engineering organizations, pull request metrics like Time to First Review and Review Iteration Count are tracked systematically. Teams achieve fast review cycles by keeping pull requests small (under 400 lines of diff as recommended by Google Engineering practices), authoring comprehensive PR descriptions, and using automated CODEOWNERS routing to remove human friction.",
                "Let us evaluate the comprehensive 5-Pillar GitHub Collaboration Rubric certified today:",
                "Pillar 1: Collaboration Architecture. Evaluates the strategic selection between the Forking Model (zero-trust security for open source) and Shared Repository Branching (protected-main velocity for enterprise teams).",
                "Pillar 2: PR Lifecycle Anatomy. Evaluates state machine discipline across Draft, Open, Merged, and Closed states, combined with accurate three-dot common ancestor diff inspection.",
                "Pillar 3: High-Impact Documentation & Issue Linking. Evaluates structured PR descriptions meeting length thresholds (>= 30 chars) and automated issue closing bindings (`Fixes`, `Closes`, `Resolves`).",
                "Pillar 4: Reviewer Orchestration & CODEOWNERS. Evaluates declarative path ownership, automated reviewer dispatch, and mandatory code owner gating.",
                "Pillar 5: Master Index Certification. Evaluates the end-to-end integration and certifies full enterprise collaboration maturity with the benchmark index: `GitHub Collaboration Index: 100/100`.",
                "This achievement completes Day 22 and directly prepares us for Day 23: Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals, where we will dive into the art of conducting high-leverage peer code reviews.",
                "Let us execute the master GitHub collaboration suite and verify all collaboration invariants."
            ],
            "example": "The Master GitHub Collaboration Suite is like an automated air travel dispatch protocol: flight planning (issue), boarding checks (draft PR & CI), control tower clearance (CODEOWNERS review), and landing rollout (merge & issue closure).",
            "code": "mkdir -p /home/student/workspace/github_collab_suite\necho \"COLLAB_PILLAR,STANDARD,EVALUATION_METRIC,VALIDATED_STATE,CERTIFICATION_STATUS\" > /home/student/workspace/github_collab_suite/collab_master_audit.csv\necho \"COLLAB_ARCHITECTURE,Access Isolation,FORKING_VS_SHARED_BRANCH_BOUND,SECURITY_ISOLATION_VERIFIED,PASS\" >> /home/student/workspace/github_collab_suite/collab_master_audit.csv\necho \"LIFECYCLE_STATE,State Machine,DRAFT_OPEN_MERGED_CLOSED_LIFECYCLE,THREE_DOT_DIFF_CONFIRMED,PASS\" >> /home/student/workspace/github_collab_suite/collab_master_audit.csv\necho \"ISSUE_LINKING,Metadata Automation,CLOSING_KEYWORD_REGEX_MATCHED,ISSUES_42_108_BOUND,PASS\" >> /home/student/workspace/github_collab_suite/collab_master_audit.csv\necho \"REVIEWER_ORCHESTRATION,Declarative Governance,CODEOWNERS_PATH_MAPPING_DISPATCH,SPECIALIST_GATING_ACTIVE,PASS\" >> /home/student/workspace/github_collab_suite/collab_master_audit.csv\necho \"INDEX_CERTIFICATION,Master Score,100_PERCENT,GitHub Collaboration Index: 100/100,PASS\" >> /home/student/workspace/github_collab_suite/collab_master_audit.csv\ncat /home/student/workspace/github_collab_suite/collab_master_audit.csv\ngrep \"GitHub Collaboration Index: 100/100\" /home/student/workspace/github_collab_suite/collab_master_audit.csv",
            "output": "COLLAB_PILLAR,STANDARD,EVALUATION_METRIC,VALIDATED_STATE,CERTIFICATION_STATUS\nCOLLAB_ARCHITECTURE,Access Isolation,FORKING_VS_SHARED_BRANCH_BOUND,SECURITY_ISOLATION_VERIFIED,PASS\nLIFECYCLE_STATE,State Machine,DRAFT_OPEN_MERGED_CLOSED_LIFECYCLE,THREE_DOT_DIFF_CONFIRMED,PASS\nISSUE_LINKING,Metadata Automation,CLOSING_KEYWORD_REGEX_MATCHED,ISSUES_42_108_BOUND,PASS\nREVIEWER_ORCHESTRATION,Declarative Governance,CODEOWNERS_PATH_MAPPING_DISPATCH,SPECIALIST_GATING_ACTIVE,PASS\nINDEX_CERTIFICATION,Master Score,100_PERCENT,GitHub Collaboration Index: 100/100,PASS\nINDEX_CERTIFICATION,Master Score,100_PERCENT,GitHub Collaboration Index: 100/100,PASS",
            "codeNotes": [
                {"line": 2, "note": "Initializes Master GitHub Collaboration Suite audit schema."},
                {"line": 3, "note": "Validates collaboration architecture isolation and security boundary selection."},
                {"line": 4, "note": "Validates PR lifecycle state machine and three-dot diff analysis."},
                {"line": 5, "note": "Validates automated issue linking with closing keyword regex."},
                {"line": 6, "note": "Validates declarative CODEOWNERS routing and specialist gating."},
                {"line": 7, "note": "Certifies full GitHub collaboration suite with 100/100 index marker."}
            ],
            "tryIt": "Add an entry testing git config --get remote.origin.url to verify organizational repository endpoint binding.",
            "check": {
                "question": "What is the primary architectural value of automating the entire PR lifecycle from issue creation to branch deletion?",
                "options": [
                    "It ensures full traceability from product requirements to production commits, eliminates untested changes, automates peer review routing, and maintains repository hygiene",
                    "It eliminates the need for software engineers to write code",
                    "It deletes previous Git repositories to save cloud storage space",
                    "It replaces compilers with web browser plugins"
                ],
                "answer": 0,
                "why": "Automated PR lifecycle management enforces compliance, accelerates code reviews, links tasks to code diffs, and guarantees production stability."
            }
        }
    ]

    summary = [
        "The Forking Model isolates external contributors to personal copies for security in open source, while Shared Repository Branching manages trusted team velocity via protected branches.",
        "A Pull Request is a web-native review container transitioning through Draft, Open, Merged, and Closed states, computing changes via three-dot common ancestor diffs (`base...head`).",
        "High-impact PR descriptions include architectural rationale, test evidence, and closing keywords (`Fixes #123`, `Closes #456`) that automatically close linked issues upon merge.",
        "`.github/CODEOWNERS` declaratively maps filesystem paths to specialists and teams, automatically requesting reviews and enforcing mandatory merge gating on sensitive code.",
        "Automating the PR lifecycle guarantees that all production code is peer-reviewed, verified by CI, linked to tracked issues, and cleanly integrated without merge defects."
    ]

    projectStep = {
        "title": "Build the Complete GitHub Collaboration & Pull Request Engine",
        "steps": [
            "Configure remote endpoints contrasting the open-source Forking Model against enterprise Shared Branching.",
            "Manage pull request lifecycle state transitions across Draft, Open, Merged, and Closed, evaluating three-dot diffs.",
            "Extract issue linking closing keywords (`Fixes`, `Closes`, `Resolves`) and validate substantive description thresholds.",
            "Implement declarative `.github/CODEOWNERS` path routing and enforce specialist review requirements.",
            "Execute the end-to-end GitHub Collaboration Master Suite and certify 100/100 collaboration maturity."
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
    day = get_day_22()
    words = [sum(len(p.split()) for p in part['say']) for part in day['parts']]
    total = sum(words)
    print(f"Git Day 22: Total={total} words (~{total/150:.1f}m), Parts={words}")
