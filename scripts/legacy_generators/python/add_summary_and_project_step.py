import json

def update_days():
    # Day 26
    d26_summary = [
        "GitHub Issue Forms define declarative YAML schemas (`.github/ISSUE_TEMPLATE/`) with mandatory field validation, eliminating malformed, un-reproducible bug reports.",
        "Multi-dimensional label taxonomies (`type/`, `priority/`, `component/`, `status/`) provide orthogonal filtering dimensions and prevent label clutter across enterprise repositories.",
        "GitHub Milestones group issues into time-boxed sprint containers with mathematical burndown tracking ($Completion = \\frac{Closed}{Total} \\times 100$) to measure team velocity.",
        "GitHub Projects v2 provides reactive Kanban boards with automated workflow rules that dynamically shift cards between columns based on Git events.",
        "Issue-Driven Development binds every code commit to an issue, leveraging closing keywords (`Fixes #42`) to establish end-to-end audit compliance and automated issue closure."
    ]
    d26_project_step = {
        "title": "Build the Agile Issue-Driven Development & Project Tracking Engine",
        "steps": [
            "Author declarative YAML issue form schemas enforcing mandatory reproduction details and automated label bindings.",
            "Deploy multi-dimensional namespaced label taxonomies with programmatic GitHub CLI synchronization.",
            "Construct mathematical milestone sprint burndown and velocity calculators tracking delivery health.",
            "Implement reactive GitHub Projects v2 Kanban state machines with automated event-driven column transitions.",
            "Establish closed-loop Issue-Driven Development traceability with PR closing keyword verification and audit logging."
        ]
    }

    # Day 27
    d27_summary = [
        "GitHub Actions provides native cloud CI/CD orchestration executing event-driven workflows defined in `.github/workflows/` across virtual runner environments.",
        "Workflow YAML architecture leverages path filtering (`paths:`) and concurrency control (`cancel-in-progress: true`) to eliminate redundant builds and conserve runner minutes.",
        "Core actions (`actions/checkout@v4`, `actions/setup-node@v4`) and lockfile-hashed dependency caching (`actions/cache@v4`) accelerate CI pipelines by up to 90%.",
        "Matrix strategies (`strategy: matrix`) spawn parallel concurrent virtual runners testing combinations across operating systems and runtime versions with fail-fast tolerance.",
        "Protected branch status checks enforce that all required CI jobs must pass with exit code 0 before pull request merges are permitted, backed by diagnostic artifact uploads."
    ]
    d27_project_step = {
        "title": "Build the Complete GitHub Actions CI/CD Pipeline Engine",
        "steps": [
            "Construct standard `.github/workflows/` directory hierarchies and author event-driven workflow configurations.",
            "Implement path filtering and concurrency group deduplication with automated cancellation of obsolete builds.",
            "Configure `actions/checkout@v4` shallow clones and cryptographic lockfile hash dependency caching.",
            "Execute cross-platform matrix testing across operating systems and language runtime versions with fail-fast control.",
            "Establish automated pull request status check gating with job summaries and diagnostic failure artifact uploads."
        ]
    }

    # Day 28
    d28_summary = [
        "Multi-repository architectures balance polyrepo autonomy against monorepo atomic consistency, using Git Submodules as a sovereign hybrid dependency bridge.",
        "Submodules embed external repositories at exact, pinned 40-character commit SHAs recorded as Gitlinks with special tree mode `160000` inside the `.gitmodules` registry.",
        "Cloning repositories with submodules requires `git clone --recursive` or `git submodule update --init --recursive` to populate empty submodule working trees.",
        "Submodules default to a detached HEAD state to guarantee build reproducibility; developers checkout branches before editing and update parent pointers atomically.",
        "Modern monorepo alternatives like Git Subtree physically merge external files into parent trees, while pnpm/npm workspaces with Turborepo provide remote computation caching."
    ]
    d28_project_step = {
        "title": "Build the Multi-Package Submodule & Monorepo Management Suite",
        "steps": [
            "Model multi-repository dependency topologies evaluating polyrepo versus monorepo trade-offs.",
            "Execute `git submodule add` and inspect the `.gitmodules` configuration alongside tree mode `160000` gitlink pointers.",
            "Implement recursive repository cloning (`git clone --recursive`) and multi-level nested submodule updates.",
            "Manage detached HEAD states, advance submodule commits, and synchronize updated parent pointers with push verification.",
            "Evaluate Git Subtree and Turborepo monorepo workspace alternatives to certify multi-package version control mastery."
        ]
    }

    # Day 29
    d29_summary = [
        "Git Hooks execute automated scripts locally before key lifecycle events (`pre-commit`, `commit-msg`, `pre-push`), shifting quality checks to the developer workstation.",
        "Husky enables portable, version-controlled hook management by configuring Git's `core.hooksPath` to point to the tracked `.husky/` directory via `prepare` scripts.",
        "Lint-Staged accelerates pre-commit formatting and linting by executing formatters exclusively on staged files in the index, completing in under 300 milliseconds.",
        "Commitlint enforces Conventional Commits grammar on `commit-msg` hooks, ensuring clean, machine-parseable commit histories that drive automated semantic release.",
        "Multi-layered quality defense combines client-side hooks for developer speed with non-bypassable remote server-side CI status checks for ironclad security."
    ]
    d29_project_step = {
        "title": "Build the Automated Pre-Commit Linting & Git Hooks Quality Suite",
        "steps": [
            "Explore native client-side and server-side lifecycle hook templates inside `.git/hooks/`.",
            "Configure portable version-controlled hook management using Husky and Git's `core.hooksPath` setting.",
            "Implement Lint-Staged incremental formatting and linting targeting staged files exclusively for sub-second execution.",
            "Deploy Commitlint conventional grammar enforcement on `commit-msg` hooks validating type, scope, and length.",
            "Construct multi-layered quality defense evaluating pre-commit, pre-push, and non-bypassable remote CI status gates."
        ]
    }

    # Day 30
    d30_summary = [
        "Pillar 1: Content-addressable object storage models files as SHA-1 hashed blobs, trees, commits, and tags managed across the three-tree staging pipeline.",
        "Pillar 2: Lightweight branch pointers enable high-concurrency development unified via 3-way ORT merging with reflog disaster recovery protecting against data loss.",
        "Pillar 3: Interactive rebase autosquash curates clean conventional history, while cherry-pick backports surgical hotfixes and Ed25519 SSH keys secure remotes.",
        "Pillar 4: Enterprise GitHub collaboration enforces declarative CODEOWNERS routing, empathetic review feedback, branch protection rules, and trunk-based velocity.",
        "Pillar 5: End-to-end automation unites issue milestones, GitHub Actions CI/CD matrix pipelines, mode 160000 submodules, and Husky pre-commit hooks."
    ]
    d30_project_step = {
        "title": "Execute the Sovereign Git & Master Version Control Capstone Suite",
        "steps": [
            "Synthesize Pillar 1: Verify content-addressable SHA object hashing and three-tree state transitions with atomic commits.",
            "Synthesize Pillar 2: Resolve 3-way merge conflicts with ORT engine and demonstrate reflog disaster recovery.",
            "Synthesize Pillar 3: Execute interactive history squashing, cherry-pick hotfix backporting, and remote refspec synchronization.",
            "Synthesize Pillar 4: Enforce `.github/CODEOWNERS` routing, peer review quorums, branch protection, and trunk-based workflows.",
            "Synthesize Pillar 5: Orchestrate automated issue milestones, GitHub Actions matrix CI, submodules, and Husky quality gates to achieve 100/100 Master Certification."
        ]
    }

    configs = [
        ("scripts/make_git_vcs_day26.py", d26_summary, d26_project_step),
        ("scripts/make_git_vcs_day27.py", d27_summary, d27_project_step),
        ("scripts/make_git_vcs_day28.py", d28_summary, d28_project_step),
        ("scripts/make_git_vcs_day29.py", d29_summary, d29_project_step),
        ("scripts/make_git_vcs_day30.py", d30_summary, d30_project_step)
    ]

    for path, summary, project_step in configs:
        with open(path, "r", encoding="utf-8") as f:
            code = f.read()

        # Find return statement in get_day_...
        old_return = """    return {
        "day": day_num,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts
    }"""
        new_return = f"""    summary = {json.dumps(summary, indent=8)}

    projectStep = {json.dumps(project_step, indent=8)}

    return {{
        "day": day_num,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }}"""
        if old_return in code:
            code = code.replace(old_return, new_return)
            with open(path, "w", encoding="utf-8") as f:
                f.write(code)
            print(f"Updated {path} with summary and projectStep!")
        else:
            print(f"Old return not found in {path}")

if __name__ == "__main__":
    update_days()
