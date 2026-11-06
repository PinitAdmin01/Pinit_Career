import json

def expand_day30():
    with open("scripts/make_git_vcs_day30.py", "r", encoding="utf-8") as f:
        text = f.read()

    # Part 1 expansion
    p1_target = '"In this first pillar of our capstone, we construct an integrated object model verification kernel. We compute content-addressable SHA hashes from raw object headers, trace three-tree state transitions, validate atomic commit invariants, and certify foundational version control integrity."'
    p1_addition = """
                "Let us examine Git Packfile Delta Compression and Object Database Maintenance: When a repository accumulates thousands of commits, storing every file version as an individual, loose zlib-compressed object in `.git/objects/` would exhaust filesystem inodes and degrade disk read performance. Git solves this through Packfiles (`.pack`) and Pack Index files (`.idx`): Git's garbage collection engine (`git gc --aggressive`) identifies similar file versions across historical commits, compresses them using sliding-window directed acyclic delta compression—storing only byte-level binary diffs relative to a base object—and packs them into high-performance packfiles, reducing repository disk footprint by up to 90% while accelerating object lookups using binary fanout tables in the `.idx` file.",
                "In this first pillar of our capstone, we construct an integrated object model verification kernel. We compute content-addressable SHA hashes from raw object headers, trace three-tree state transitions, validate atomic commit invariants, and certify foundational version control integrity."
"""
    text = text.replace(p1_target, p1_addition)

    # Part 2 expansion
    p2_target = '"In this second pillar of our capstone, we simulate concurrent branch divergence, evaluate merge-base common ancestors, resolve a simulated 3-way merge conflict, execute a hard reset disaster, and demonstrate 100% data recovery via the git reflog."'
    p2_addition = """
                "Let us examine one of Git's most potent automated productivity secrets: Rerere (Reuse Recorded Resolution). When working on long-lived rebase branches or cherry-picking multiple commits, developers frequently encounter the exact same merge conflict repeatedly. By running `git config --global rerere.enabled true`, Git automatically snapshots pre-image and post-image conflict resolutions in `.git/rr-cache/`: The next time Git encounters the identical conflict pattern anywhere in the repository, it automatically resolves it using your previous decision without prompting, eliminating repetitive conflict resolution fatigue.",
                "Furthermore, understanding Reflog Retention and Pruning Policies protects against data loss: Git's internal garbage collection preserves unreachable commits referenced in the reflog for 90 days by default (`gc.reflogExpire = 90.days`). Only commits that are both unreachable from any branch pointer AND unreferenced by any reflog entry are purged during `git prune`, providing a three-month safety window for disaster recovery.",
                "In this second pillar of our capstone, we simulate concurrent branch divergence, evaluate merge-base common ancestors, resolve a simulated 3-way merge conflict, execute a hard reset disaster, and demonstrate 100% data recovery via the git reflog."
"""
    text = text.replace(p2_target, p2_addition)

    # Part 3 expansion
    p3_target = '"In this third pillar of our capstone, we simulate an interactive history rewrite, squash micro-commits using fixup semantics, cherry-pick an isolated hotfix, configure remote tracking refspecs, and verify linear history synchronization invariants."'
    p3_addition = """
                "Let us analyze rebase conflict choreography and state engine mechanics: When Git halts an interactive rebase due to a conflict, the repository enters an intermediate suspended state (`.git/rebase-merge/`). Junior developers panic and attempt manual file restores. The master architect executes standard rebase choreography: 1. Inspect status with `git status` to identify conflicting files; 2. Open conflicting files and resolve conflict markers; 3. Stage the resolved files using `git add <resolved-file>` (never run `git commit` during a rebase!); and 4. Advance the rebase engine using `git rebase --continue`. If the conflict is intractable, `git rebase --abort` safely returns the repository to the pristine pre-rebase state with zero side effects.",
                "Furthermore, Pillar 3 encompasses Cryptographic Commit Verification via GPG and SSH signatures: Enterprise security standards require signing commits (`git commit -S -m '...'`). Remote hosting platforms verify the cryptographic signature against the committer's public key, displaying a 'Verified' badge in the commit log and preventing impersonation attacks across the development team.",
                "In this third pillar of our capstone, we simulate an interactive history rewrite, squash micro-commits using fixup semantics, cherry-pick an isolated hotfix, configure remote tracking refspecs, and verify linear history synchronization invariants."
"""
    text = text.replace(p3_target, p3_addition)

    # Part 4 expansion
    p4_target = '"In this fourth pillar of our capstone, we construct a complete repository governance simulation. We author `.github/CODEOWNERS`, model branch protection gating, simulate peer review quorums and required status checks, and verify enterprise collaboration invariants."'
    p4_addition = """
                "Let us examine GitHub Merge Queues: In hyper-scale engineering teams where hundreds of developers merge pull requests into `main` every hour, a dangerous failure mode known as Merge Skew or the Semantic Race Condition occurs: PR A and PR B both pass CI independently in isolation, but when merged together into `main`, their changes interact to break the production build! GitHub Merge Queue eliminates this vulnerability entirely: When pull requests are approved, they enter an automated serialized queue. GitHub automatically tests each PR integrated on top of the preceding queued PRs in temporary virtual test branches before allowing them to merge into `main`, guaranteeing that the default branch remains unbroken 100% of the time.",
                "Additionally, enterprise compliance governance mandates Audit Log Streaming: Every branch protection rule change, force push attempt, repository role elevation, and code access event is captured in immutable JSON audit streams, feeding into corporate SIEM platforms (like Splunk, Datadog, or Elastic) for real-time security threat detection.",
                "In this fourth pillar of our capstone, we construct a complete repository governance simulation. We author `.github/CODEOWNERS`, model branch protection gating, simulate peer review quorums and required status checks, and verify enterprise collaboration invariants."
"""
    text = text.replace(p4_target, p4_addition)

    # Part 5 expansion
    p5_target = '"In this final pillar of our capstone, we orchestrate the complete Sovereign Git Master Suite. We execute comprehensive automated verification across all five architectural pillars, certify 100/100 capstone mastery, and record the sovereign certification audit log."'
    p5_addition = """
                "As you stand at the summit of Course 22, reflect upon the architectural transformation you have achieved: You are no longer an engineer who memorizes git commands by rote, hoping they work; you understand the underlying C data structures, graph algorithms, and cryptographic primitives that govern every version control transaction. You possess the mental models required to debug corrupted repositories, design enterprise multi-team branching models, architect zero-trust CI/CD pipelines, and lead high-velocity software engineering organizations.",
                "The hallmark of a Staff or Principal Git Architect is not merely technical mastery, but technical leadership: establishing empathetic code review cultures, authoring clear contributor documentation, automating repetitive quality checks so developers can focus on creative problem-solving, and mentoring the next generation of engineers in the art and science of version control.",
                "With all five pillars synthesized and validated, you have satisfied every rigorous requirement of the PinIT Career OS curriculum. You are formally accredited as a Sovereign Git and Version Control Master.",
                "In this final pillar of our capstone, we orchestrate the complete Sovereign Git Master Suite. We execute comprehensive automated verification across all five architectural pillars, certify 100/100 capstone mastery, and record the sovereign certification audit log."
"""
    text = text.replace(p5_target, p5_addition)

    with open("scripts/make_git_vcs_day30.py", "w", encoding="utf-8") as f:
        f.write(text)
    print("Expanded Day 30 make script!")

if __name__ == "__main__":
    expand_day30()
