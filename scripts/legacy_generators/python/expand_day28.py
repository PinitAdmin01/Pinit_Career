import json

def expand_day28():
    with open("scripts/make_git_vcs_day28.py", "r", encoding="utf-8") as f:
        text = f.read()

    # Part 1 expansion
    p1_target = '"In this first part, we construct a multi-repository workspace simulation in the shell. We model parent and child repository structures, evaluate polyrepo versus monorepo trade-offs, inspect submodule metadata directories, and verify multi-repository architecture invariants."'
    p1_addition = """
                "Let us examine security boundaries and licensing isolation in multi-repository systems: A critical reason enterprise legal teams mandate submodules over monorepos is Intellectual Property (IP) and Open Source Licensing compliance. For example, if an enterprise application incorporates an open-source component licensed under LGPL or BSD, maintaining that component as a discrete submodule repository with clear cryptographic provenance isolates the open-source code from proprietary, patented corporate business logic. Furthermore, when partnering with external third-party software vendors or security audit contractors, organizations can grant contractors access strictly to the submodule repository containing the component they are auditing, without exposing the parent enterprise repository or internal trade secrets.",
                "In this first part, we construct a multi-repository workspace simulation in the shell. We model parent and child repository structures, evaluate polyrepo versus monorepo trade-offs, inspect submodule metadata directories, and verify multi-repository architecture invariants."
"""
    text = text.replace(p1_target, p1_addition)

    # Part 2 expansion
    p2_target = '"In this second part, we execute `git submodule add` in the shell, inspect the `.gitmodules` configuration file, verify Git Tree Mode `160000` using low-level plumbing commands, and certify submodule recording invariants."'
    p2_addition = """
                "Let us examine how to cleanly and completely remove a submodule from a repository: In legacy Git, removing a submodule was a notorious 5-step headache requiring manual edits to `.gitmodules`, `.git/config`, and `.git/modules`. In modern Git, the removal workflow is streamlined into two safe commands: First, run `git submodule deinit -f libs/crypto` to deregister the submodule and remove its working directory while preserving committed history; second, run `git rm -f libs/crypto` to stage the deletion of the directory and the removal of the configuration entry from `.gitmodules`. When committed, the Gitlink pointer is deleted from the tree, cleanly excising the submodule from the codebase.",
                "Furthermore, teams configure branch tracking inside `.gitmodules`: By specifying `branch = stable` in the submodule section, developers signal to Git which release branch the parent project intends to follow when running automated remote updates.",
                "In this second part, we execute `git submodule add` in the shell, inspect the `.gitmodules` configuration file, verify Git Tree Mode `160000` using low-level plumbing commands, and certify submodule recording invariants."
"""
    text = text.replace(p2_target, p2_addition)

    # Part 3 expansion
    p3_target = '"In this third part, we simulate a fresh developer clone in the shell, demonstrate the empty submodule directory phenomenon, execute `git submodule update --init --recursive`, and verify recursive submodule cloning invariants."'
    p3_addition = """
                "Let us examine parallel execution and shallow cloning performance optimizations for submodules: In massive enterprise codebases containing twenty or thirty submodules across distributed microservices, fetching submodules sequentially can add several minutes to developer clones and CI builds. Git provides the `--jobs` flag to download multiple submodules simultaneously in parallel: `git submodule update --init --recursive --jobs 8`. By downloading eight submodules concurrently across independent network threads, teams slash checkout duration by up to 70%.",
                "Furthermore, to conserve local disk space and accelerate CI runner initialization, teams combine recursive initialization with shallow clones: `git submodule update --init --recursive --depth 1`. This instructs Git to download only the single pinned commit for every submodule without pulling thousands of historical commits, reducing download payload size from gigabytes to mere megabytes.",
                "In CI/CD environments with private submodules, authentication requires special care: Because the parent repository and child submodule repositories may reside under different organizational permissions, teams configure deployment keys or pass an authenticated machine token via `with: { token: secrets.MACHINE_USER_TOKEN }` in GitHub Actions, ensuring runners have authorization to pull both the parent and all private nested dependencies.",
                "In this third part, we simulate a fresh developer clone in the shell, demonstrate the empty submodule directory phenomenon, execute `git submodule update --init --recursive`, and verify recursive submodule cloning invariants."
"""
    text = text.replace(p3_target, p3_addition)

    # Part 4 expansion
    p4_target = '"In this fourth part, we advance a submodule repository with a new commit, demonstrate parent pointer tracking updates, simulate the push verification check, and verify submodule synchronization invariants."'
    p4_addition = """
                "Let us analyze Submodule Merge Conflicts: What occurs when two developers branch off `main`, and Developer A updates the submodule to commit `1111111` while Developer B updates the same submodule to commit `2222222`? When they attempt to merge, Git reports a Merge Conflict on the Gitlink pointer itself! Because Git cannot automatically compute a 3-way text merge on two 40-character SHA hashes, the developer must resolve the conflict explicitly: The engineer must navigate into the submodule directory, determine which commit represents the true intended integration tip (or author a new merge commit inside the submodule combining both features), checkout that integrated commit, return to the parent repository, and stage the resolved `160000` pointer via `git add libs/crypto`.",
                "Understanding gitlink conflict resolution demystifies one of the most dreaded error states in version control, allowing senior engineers to guide their squads through complex multi-package integrations without panic.",
                "In this fourth part, we advance a submodule repository with a new commit, demonstrate parent pointer tracking updates, simulate the push verification check, and verify submodule synchronization invariants."
"""
    text = text.replace(p4_target, p4_addition)

    # Part 5 expansion
    p5_target = '"In this fifth part, we construct a Git Subtree integration and workspace dependency topology simulator in Python. We model subtree commit synthesis, evaluate monorepo caching dynamics, and certify multi-package version control mastery."'
    p5_addition = """
                "Let us examine the mechanics of Git Subtree Split (`git subtree split`): Suppose your team developed an innovative logging framework inside a parent monolithic application at `src/utils/logger`. Over time, the logging tool proved so valuable that your company decided to open-source it as a standalone repository! How can you extract that folder without losing its multi-year commit history? Using `git subtree split --prefix=src/utils/logger -b split-logger`, Git's history rewriting engine walks the entire repository DAG, extracts every commit that ever touched `src/utils/logger`, and synthesizes a pristine, synthetic commit branch containing only the logger's history with file paths re-rooted to the repository top level! You can then push that branch directly to a fresh GitHub repository, preserving complete authorship attribution and timestamps.",
                "For hyper-scale organizations with hundreds of gigabytes of source code, engineering architects evaluate Hermetic Monorepo Build Systems such as Google Bazel, Meta Buck2, or Twitter Pants: Unlike standard package managers, Bazel treats every source file and toolchain as an immutable, content-addressed input, executing builds inside isolated sandboxes with zero network access and distributing build actions across thousands of remote cloud worker nodes.",
                "In this fifth part, we construct a Git Subtree integration and workspace dependency topology simulator in Python. We model subtree commit synthesis, evaluate monorepo caching dynamics, and certify multi-package version control mastery."
"""
    text = text.replace(p5_target, p5_addition)

    with open("scripts/make_git_vcs_day28.py", "w", encoding="utf-8") as f:
        f.write(text)
    print("Expanded Day 28 make script!")

if __name__ == "__main__":
    expand_day28()
