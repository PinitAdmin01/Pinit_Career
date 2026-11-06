import json

def expand_day27():
    with open("scripts/make_git_vcs_day27.py", "r", encoding="utf-8") as f:
        text = f.read()

    # Part 1 expansion
    p1_target = '"In this first part, we construct a GitHub Actions directory hierarchy and author a foundational workflow YAML file. We declare workflow triggers, configure virtual runner environments, define multi-step execution sequences, and verify workflow orchestration invariants."'
    p1_addition = """
                "Let us contrast GitHub-Hosted Runners with Self-Hosted Runners: While GitHub-hosted runners provide maintenance-free, zero-configuration cloud environments that spin up in seconds, large enterprise organizations frequently deploy Self-Hosted Runners inside private VPCs or on-premises Kubernetes clusters. Self-hosted runners allow builds to access internal corporate databases, proprietary hardware accelerators (such as GPU clusters for machine learning training), and high-performance NVMe storage arrays. To maintain security hygiene, enterprise platform teams deploy ephemeral runner auto-scalers (such as Actions Runner Controller on Kubernetes) that destroy the container immediately after job completion, preventing persistent state contamination or credential theft across tenant jobs.",
                "Furthermore, GitHub Actions supports running jobs directly inside Docker containers using the `container:` directive: By specifying a container image (e.g. `container: { image: 'node:20-bookworm-slim' }`), GitHub automatically pulls the container, mounts the workspace directory, and executes all steps inside that isolated container environment, ensuring identical binary toolchains across local developer workstations and remote CI runners.",
                "In this first part, we construct a GitHub Actions directory hierarchy and author a foundational workflow YAML file. We declare workflow triggers, configure virtual runner environments, define multi-step execution sequences, and verify workflow orchestration invariants."
"""
    text = text.replace(p1_target, p1_addition)

    # Part 2 expansion
    p2_target = '"In this second part, we author an advanced workflow YAML configuration featuring path filtering, branch constraints, concurrency group deduplication, and encrypted secret environment injection. We parse and validate the YAML syntax in the shell and verify workflow configuration invariants."'
    p2_addition = """
                "Let us examine keyless cloud authentication via OpenID Connect (OIDC): In traditional CI/CD setups, engineers generated long-lived cloud credentials (such as AWS IAM Access Keys or GCP Service Account JSON keys) and saved them as GitHub Secrets. If an attacker compromised the repository or an untrusted dependency dumped environment variables, those static credentials gave permanent unauthorized access to cloud production infrastructure. With GitHub Actions OIDC integration, static keys are completely eliminated! The runner requests an ephemeral, cryptographically signed JSON Web Token (JWT) from GitHub's OIDC provider. Cloud providers (AWS STS, Google Cloud Workload Identity, Azure AD) validate the token's claims (`repository`, `ref`, `actor`) and grant short-lived temporary access tokens valid for only fifteen minutes, achieving zero-trust cloud security.",
                "Furthermore, enterprise architectures standardize pipelines using Reusable Workflows (`workflow_call`): Instead of copying and pasting identical 200-line CI YAML files across fifty separate microservice repositories, a central platform team maintains a single canonical workflow in a centralized `.github` repository. Individual microservices simply invoke the centralized workflow via `uses: enterprise-org/.github/.github/workflows/standard-ci.yml@v2`, guaranteeing uniform security scanning, compliance auditing, and dependency verification across the entire organization.",
                "In this second part, we author an advanced workflow YAML configuration featuring path filtering, branch constraints, concurrency group deduplication, and encrypted secret environment injection. We parse and validate the YAML syntax in the shell and verify workflow configuration invariants."
"""
    text = text.replace(p2_target, p2_addition)

    # Part 3 expansion
    p3_target = '"In this third part, we construct a production CI job featuring `actions/checkout@v4`, `actions/setup-node@v4`, lockfile cryptographic hash calculation, and dependency caching simulation in the shell. We model cache hit/miss semantics and verify dependency management invariants."'
    p3_addition = """
                "Let us analyze modern package manager caching mechanics across pnpm and Yarn Berry: In high-performance monorepo architectures, teams increasingly adopt pnpm due to its content-addressable storage model and hard-linked dependency trees. To cache pnpm efficiently, workflows combine `actions/cache` with `pnpm/action-setup`: The workflow queries pnpm's global store path (`pnpm store path`) and caches that exact content-addressable store keyed against the `pnpm-lock.yaml` hash. Because pnpm stores immutable package chunks by their content checksums, cache restoration is nearly instantaneous and consumes a fraction of the disk bandwidth required by traditional `node_modules` tarballs.",
                "Furthermore, developers must understand GitHub Actions Cache Limits and Eviction Policies: GitHub allocates a generous default limit of 10 gigabytes of cache storage per repository. When a repository exceeds this 10GB quota, GitHub's background cache management engine automatically executes a Least Recently Used (LRU) eviction algorithm: caches that have not been accessed in the longest period are permanently purged to make space for newly recorded entries. Additionally, any cache entry that has not been accessed for seven consecutive days is automatically deleted, ensuring stale dependencies from abandoned feature branches do not pollute remote storage.",
                "In this third part, we construct a production CI job featuring `actions/checkout@v4`, `actions/setup-node@v4`, lockfile cryptographic hash calculation, and dependency caching simulation in the shell. We model cache hit/miss semantics and verify dependency management invariants."
"""
    text = text.replace(p3_target, p3_addition)

    # Part 4 expansion
    p4_target = '"In this fourth part, we author a Python-based matrix expansion simulator in the shell. We calculate Cartesian combinations, model platform inclusions and exclusions, evaluate fail-fast behavior across multi-environment test runs, and verify matrix testing invariants."'
    p4_addition = """
                "Let us explore parallel test sharding across matrix runners: In massive enterprise codebases with thousands of unit and integration tests, running all tests sequentially inside a single runner might take 45 minutes, creating a severe bottleneck for developer feedback. GitHub Actions allows teams to shard test suites across multiple parallel runners using a numeric matrix: `strategy: { matrix: { shard: [1, 2, 3, 4] } }`. Modern test runners (including Jest, Vitest, and Playwright) natively support sharding via CLI flags: `npm test -- --shard=${{ matrix.shard }}/4`. Each runner executes exactly one-fourth of the test files in parallel, slashing total wall-clock CI duration from 45 minutes down to approximately 11 minutes without modifying test logic.",
                "Furthermore, advanced workflows leverage Dynamic Matrix Generation using Job Outputs: Rather than hardcoding static matrix arrays in YAML, an initial setup job can execute a script that inspects git diffs or queries a microservice directory list, outputting a dynamic JSON array (`echo 'matrix=[\"service-a\", \"service-b\"]' >> $GITHUB_OUTPUT`). The downstream test job ingests this dynamic output using `strategy: { matrix: ${{ fromJson(needs.setup.outputs.matrix) }} }`, testing only the specific packages that were actually touched by the pull request.",
                "Teams also manage runner concurrency saturation using the `max-parallel:` directive: If a matrix generates 30 concurrent jobs but your organization's GitHub billing plan or self-hosted cluster can only support 10 simultaneous runners, configuring `max-parallel: 10` throttles execution to 10 active jobs at a time, preventing runner queue starvation and API rate-limiting.",
                "In this fourth part, we author a Python-based matrix expansion simulator in the shell. We calculate Cartesian combinations, model platform inclusions and exclusions, evaluate fail-fast behavior across multi-environment test runs, and verify matrix testing invariants."
"""
    text = text.replace(p4_target, p4_addition)

    # Part 5 expansion
    p5_target = '"In this fifth part, we construct a PR status check reporting and diagnostic artifact engine in Python. We simulate test execution status reporting, generate step summary markdown, model failure artifact uploads, and certify GitHub Actions CI/CD mastery."'
    p5_addition = """
                "Let us examine automated code coverage reporting and regression threshold gating: In high-reliability engineering environments, CI workflows don't just verify whether tests pass; they calculate the percentage of codebase statements, branches, and functions exercised by those tests. By executing coverage tools (such as c8, Istanbul, or pytest-cov), the runner generates an LCOV or JaCoCo XML report. Actions can compare this coverage percentage against a strict baseline threshold (e.g. failing the build if overall coverage drops by more than 0.5%), and automated bots post inline pull request comments highlighting exact uncovered lines in the developer's diff.",
                "Finally, enterprise workflows incorporate resilient retry policies for flaky network steps: External dependencies, remote container registries, and package mirrors occasionally experience transient network timeouts. Using retry mechanisms (such as `nick-fields/retry@v3` or native bash retry loops), workflows automatically re-attempt flaky network commands up to three times with exponential backoff before reporting a fatal failure, preventing spurious build failures and maintaining developer trust in the CI system.",
                "In this fifth part, we construct a PR status check reporting and diagnostic artifact engine in Python. We simulate test execution status reporting, generate step summary markdown, model failure artifact uploads, and certify GitHub Actions CI/CD mastery."
"""
    text = text.replace(p5_target, p5_addition)

    with open("scripts/make_git_vcs_day27.py", "w", encoding="utf-8") as f:
        f.write(text)
    print("Expanded Day 27 make script!")

if __name__ == "__main__":
    expand_day27()
