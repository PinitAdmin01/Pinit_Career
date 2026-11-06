import json

def expand_day29():
    with open("scripts/make_git_vcs_day29.py", "r", encoding="utf-8") as f:
        text = f.read()

    # Part 1 minor boost
    p1_target = '"In this first part, we construct a native Git hooks exploration workspace in the shell. We inspect default `.sample` hook scripts, author a native executable `pre-commit` hook that blocks forbidden debug tokens, test abortive exit codes, and verify Git hooks lifecycle invariants."'
    p1_addition = """
                "Furthermore, developers must understand the execution environment of Git hooks: Hooks execute in a clean subshell with inherited environment variables, but with standard input connected to the terminal for interactive prompts (unless invoked via automated scripts). If a hook requires user confirmation, it must read from `/dev/tty` rather than standard stdin, ensuring interactive prompts work reliably across CLI and GUI clients.",
                "In this first part, we construct a native Git hooks exploration workspace in the shell. We inspect default `.sample` hook scripts, author a native executable `pre-commit` hook that blocks forbidden debug tokens, test abortive exit codes, and verify Git hooks lifecycle invariants."
"""
    text = text.replace(p1_target, p1_addition)

    # Part 2 expansion
    p2_target = '"In this second part, we construct a Husky-style portable hook architecture in the shell. We configure Git\'s `core.hooksPath` to point to a version-controlled `.husky/` directory, author executable hook scripts, verify automated hook triggering, and certify portable hook management invariants."'
    p2_addition = """
                "Let us examine cross-platform compatibility across Windows, macOS, and Linux: In cross-platform engineering squads, developers work on heterogeneous operating systems. Windows developers running PowerShell or CMD do not possess a native `/bin/sh` binary in their system PATH. Modern Husky solves this by generating portable shell scripts with universal shebang headers (`#!/usr/bin/env sh`) that Git executes through its bundled Git Bash Mingw environment on Windows, ensuring identical hook execution regardless of whether an engineer types `git commit` in macOS zsh, Linux bash, or Windows PowerShell.",
                "Furthermore, teams optimize CI/CD pipeline execution by disabling Husky in automated environments: When GitHub Actions or cloud build agents run `npm install`, running Husky to configure `core.hooksPath` on an ephemeral virtual runner that will be destroyed in ten minutes is completely redundant and wastes seconds. Teams configure environmental bypasses by setting `HUSKY=0` in CI workflows (`env: { HUSKY: 0 }`), signaling Husky to skip hook installation on cloud build servers while remaining 100% active on local developer machines.",
                "In this second part, we construct a Husky-style portable hook architecture in the shell. We configure Git's `core.hooksPath` to point to a version-controlled `.husky/` directory, author executable hook scripts, verify automated hook triggering, and certify portable hook management invariants."
"""
    text = text.replace(p2_target, p2_addition)

    # Part 3 expansion
    p3_target = '"In this third part, we construct a Lint-Staged evaluation simulator in Python. We simulate staged file extraction via `git diff --cached`, apply targeted glob matchers, model automatic re-staging, and verify incremental linting invariants."'
    p3_addition = """
                "Let us examine the critical distinction between file-level formatters and whole-project typecheckers: While Prettier and ESLint operate effectively on isolated file paths passed by Lint-Staged (`prettier --write src/auth.ts`), TypeScript static typechecking (`tsc --noEmit`) CANNOT be run on individual files! The TypeScript compiler requires the complete project Abstract Syntax Tree (AST) to verify that an edit in `auth.ts` does not break type signatures imported in `billing.ts`. If an engineer configures Lint-Staged with `'*.ts': 'tsc --noEmit'`, TypeScript ignores the passed file arguments and typechecks the entire 10,000-file repository on every commit, destroying commit speed!",
                "To resolve this architectural tension, engineering architects apply a clean separation of concerns: File-level formatters (Prettier) and linters (ESLint with cache) run in Lint-Staged during pre-commit for sub-second feedback, while whole-project static typechecking (`tsc --noEmit`) and unit tests are deferred to the `pre-push` hook or cloud CI pipeline, ensuring developers enjoy instantaneous local commit loops while maintaining total semantic type safety.",
                "In this third part, we construct a Lint-Staged evaluation simulator in Python. We simulate staged file extraction via `git diff --cached`, apply targeted glob matchers, model automatic re-staging, and verify incremental linting invariants."
"""
    text = text.replace(p3_target, p3_addition)

    # Part 4 expansion
    p4_target = '"In this fourth part, we author a Conventional Commits validator in Python matching Commitlint\'s core grammar rules. We test compliant and non-compliant commit messages, verify automated rejection of malformed headers, and certify commit message governance invariants."'
    p4_addition = """
                "To assist developers who find Conventional Commits grammar intimidating, engineering leads pair Commitlint with Commitizen (`cz-cli` and `@commitlint/cz-commitlint`): Instead of typing `git commit`, developers run `npx cz` or `git cz`. Commitizen launches an interactive terminal prompt: presenting a searchable list of valid types (`feat`, `fix`, `docs`), prompting for an optional scope, asking for a concise summary, and requesting breaking change disclosures. The interactive CLI automatically formats the final commit message to meet 100% of Commitlint's strict grammar requirements, eliminating rejection friction.",
                "Furthermore, combining Commitlint with automated Semantic Release tools (such as `semantic-release` or standard-version) completes the automated continuous delivery engine: When a pull request merges into `main`, semantic-release parses the Commitlint-formatted commit history; if it detects `fix:` commits, it automatically bumps the patch version (`v1.2.3 -> v1.2.4`); if it detects `feat:` commits, it bumps the minor version (`v1.2.3 -> v1.3.0`); and if it detects breaking change footers, it bumps the major version (`v1.2.3 -> v2.0.0`), cutting a GitHub Release and publishing to package registries with zero human intervention.",
                "In this fourth part, we author a Conventional Commits validator in Python matching Commitlint's core grammar rules. We test compliant and non-compliant commit messages, verify automated rejection of malformed headers, and certify commit message governance invariants."
"""
    text = text.replace(p4_target, p4_addition)

    # Part 5 expansion
    p5_target = '"In this fifth part, we construct a multi-layered quality defense simulator in Python. We model tiered pre-commit, pre-push, and remote CI gates, test `--no-verify` bypass dynamics, verify server-side gating parity, and certify Git Hooks quality defense mastery."'
    p5_addition = """
                "Let us examine automated Secret Leak Prevention via pre-commit and pre-push hooks: In cybersecurity forensics, one of the most common and devastating vulnerabilities is developers accidentally committing cloud credentials (AWS keys, Stripe private keys, database passwords, private SSH keys) into Git history. Once pushed to a public or shared GitHub repository, automated adversary bots scrape and exploit those credentials within seconds! To neutralize this threat, enterprise teams integrate automated secret scanning tools (such as Gitleaks, Trufflehog, or git-secrets) into `.husky/pre-commit`.",
                "Secret scanners inspect the staged git diff using entropy analysis and hundreds of regular expressions matching known cloud provider credential formats. If a raw API key or private key header is detected, the hook aborts the commit instantly, preventing the secret from ever entering the git object database. Combining local secret prevention with GitHub Secret Scanning on the server provides ironclad, defense-in-depth credential protection.",
                "In this fifth part, we construct a multi-layered quality defense simulator in Python. We model tiered pre-commit, pre-push, and remote CI gates, test `--no-verify` bypass dynamics, verify server-side gating parity, and certify Git Hooks quality defense mastery."
"""
    text = text.replace(p5_target, p5_addition)

    with open("scripts/make_git_vcs_day29.py", "w", encoding="utf-8") as f:
        f.write(text)
    print("Expanded Day 29 make script!")

if __name__ == "__main__":
    expand_day29()
