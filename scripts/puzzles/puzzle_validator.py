"""
Brutal validator for authored code-reorder puzzles.

For every puzzle of kind "code":
  1. The canonical order is executed as real Python; stdout must equal expected output.
  2. EVERY permutation of the correct blocks is executed; all orders that print the
     expected output become `acceptedOrders`. Too many accepted orders = puzzle too easy.
  3. Every decoy is inserted at every position and swapped in for every block of the
     canonical order; none of those programs may print the expected output.
For kind "steps" (non-executable workflows such as git / deployment), only structure is checked.
"""
import io
import itertools
import os
import random
import shutil
import sys
import tempfile
from contextlib import redirect_stdout, redirect_stderr

STEP_LIMIT = 200_000
MAX_ACCEPTED_RATIO = 0.25   # at most 25% of orderings may be accepted


class StepLimit(Exception):
    pass


def run_program(code: str, workdir: str):
    """Run code, return (ok, stdout_or_error)."""
    try:
        compiled = compile(code, "<puzzle>", "exec")
    except SyntaxError as e:
        return False, f"SyntaxError: {e.msg}"
    # fresh working directory for file-based puzzles
    for name in os.listdir(workdir):
        p = os.path.join(workdir, name)
        if os.path.isdir(p):
            shutil.rmtree(p)
        else:
            os.remove(p)
    steps = [0]

    def tracer(frame, event, arg):
        if event == "line":
            steps[0] += 1
            if steps[0] > STEP_LIMIT:
                raise StepLimit("step limit (infinite loop?)")
        return tracer

    buf = io.StringIO()
    old_cwd = os.getcwd()
    os.chdir(workdir)
    random.seed(7)
    g = {"__name__": "__main__"}
    sys.settrace(tracer)
    try:
        with redirect_stdout(buf), redirect_stderr(io.StringIO()):
            exec(compiled, g)
        return True, buf.getvalue()
    except StepLimit as e:
        return False, str(e)
    except RecursionError:
        return False, "RecursionError"
    except BaseException as e:  # noqa
        if isinstance(e, KeyboardInterrupt):
            raise
        return False, f"{type(e).__name__}: {e}"
    finally:
        sys.settrace(None)
        os.chdir(old_cwd)


def norm(s: str) -> str:
    return "\n".join(line.rstrip() for line in s.strip("\n").split("\n"))


def validate_code_puzzle(p, workdir):
    errors, notes = [], []
    blocks = p["blocks"]
    expected = norm(p["output"])
    ok, out = run_program("\n".join(blocks), workdir)
    if not ok:
        errors.append(f"canonical order crashed: {out}")
        return errors, notes, []
    if norm(out) != expected:
        errors.append(f"canonical output mismatch:\n--- expected ---\n{expected}\n--- got ---\n{norm(out)}")
        return errors, notes, []

    n = len(blocks)
    if n > 8:
        errors.append(f"too many blocks ({n}) for exhaustive check")
        return errors, notes, []
    accepted = []
    total = 0
    for perm in itertools.permutations(range(n)):
        total += 1
        ok, out = run_program("\n".join(blocks[i] for i in perm), workdir)
        if ok and norm(out) == expected:
            accepted.append(list(perm))
    ratio = len(accepted) / total
    notes.append(f"{len(accepted)}/{total} orderings accepted ({ratio:.1%})")
    if ratio > MAX_ACCEPTED_RATIO:
        errors.append(f"too easy: {ratio:.1%} of orderings produce the target output")

    if not p.get("decoys"):
        errors.append("puzzle has no decoy block")
    for di, (dcode, _reason) in enumerate(p.get("decoys", [])):
        # STRICT: swapping the decoy in for ANY correct block must break the program.
        for pos in range(n):
            prog = blocks[:pos] + [dcode] + blocks[pos + 1:]
            ok, out = run_program("\n".join(prog), workdir)
            if ok and norm(out) == expected:
                errors.append(f"decoy #{di+1} replacing block {pos} still prints target output (not a real trap)")
                break
        harmless = 0
        for pos in range(n + 1):
            prog = blocks[:pos] + [dcode] + blocks[pos:]
            ok, out = run_program("\n".join(prog), workdir)
            if ok and norm(out) == expected:
                harmless += 1
        notes.append(f"decoy{di+1} harmless-insert spots={harmless}/{n+1}")
    return errors, notes, accepted


def validate_steps_puzzle(p):
    errors = []
    if len(p["blocks"]) < 4:
        errors.append("steps puzzle needs >= 4 steps")
    if not p.get("decoys"):
        errors.append("steps puzzle needs a decoy")
    return errors


def validate_all(puzzles, expected_days):
    workdir = tempfile.mkdtemp(prefix="puzzle_val_")
    report, results = [], {}
    days = sorted(p["day"] for p in puzzles)
    if days != list(expected_days):
        missing = sorted(set(expected_days) - set(days))
        dup = sorted({d for d in days if days.count(d) > 1})
        report.append(f"DAY COVERAGE ERROR missing={missing} duplicates={dup}")
    failed = 0
    for p in sorted(puzzles, key=lambda x: x["day"]):
        for key in ("title", "mission", "hint", "success", "blocks"):
            if not p.get(key):
                report.append(f"Day {p['day']}: missing field {key}")
        if p.get("kind", "code") == "code":
            errs, notes, accepted = validate_code_puzzle(p, workdir)
        else:
            errs, notes, accepted = validate_steps_puzzle(p), ["non-executable workflow (structure check only)"], [list(range(len(p["blocks"])))]
        results[p["day"]] = accepted
        status = "PASS" if not errs else "FAIL"
        if errs:
            failed += 1
        report.append(f"Day {p['day']:>2} [{p.get('kind','code'):5}] {status} | {'; '.join(notes)}")
        for e in errs:
            report.append("        ERROR: " + e.replace("\n", "\n               "))
    shutil.rmtree(workdir, ignore_errors=True)
    return failed, report, results
