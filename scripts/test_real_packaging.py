# scripts/test_real_packaging.py
# PinIT Real OS-Level Packaging, Installation & Entry-Point Verification
# Complies with Batch 010 Specification: Dual-Artifact Verification (Wheel + Sdist) in Isolated Virtual Environments

import sys
import os
import shutil
import tempfile
import subprocess
import glob
from pathlib import Path

def print_pass(msg):
    print(f"  \u2705 [PASS] {msg}")

def print_fail(msg):
    print(f"  \u274c [FAIL] {msg}")

def print_info(msg):
    print(f"  \u2139\ufe0f [INFO] {msg}")

def check_host_python_health():
    """Verifies that the current python interpreter can import standard library modules."""
    print("── STEP 0: HOST PYTHON ENVIRONMENT INTEGRITY PRE-CHECK ──")
    try:
        res = subprocess.run(
            [sys.executable, "-c", "import sys, encodings, os; print(f'{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')"],
            capture_output=True,
            text=True
        )
        if res.returncode == 0:
            version_str = res.stdout.strip()
            print_pass(f"Host Python interpreter is healthy: Python {version_str} ({sys.executable})")
            return True
        else:
            print_fail(f"Host Python integrity check failed:\n{res.stderr.strip()}")
            return False
    except Exception as err:
        print_fail(f"Could not execute python interpreter: {err}")
        return False

def run_real_packaging_test():
    print("\n========================================================================")
    print("\ud83d\udce6 EXECUTING MANDATORY REAL OS-LEVEL PACKAGING & VIRTUALENV AUDIT")
    print("========================================================================\n")

    # Step 0: Integrity Check
    if not check_host_python_health():
        print("\n" + "=" * 72)
        print("\ud83d\udea8 REAL OS PACKAGING NOT VERIFIED \u2014 ENVIRONMENT BLOCKED")
        print("Reason: Host Python interpreter is missing standard-library files (encodings/os/site).")
        print("=" * 72 + "\n")
        return False

    temp_base = tempfile.mkdtemp(prefix="pinit_pkg_dual_test_")
    try:
        project_dir = Path(temp_base) / "audit_project"
        project_dir.mkdir(parents=True, exist_ok=True)
        src_dir = project_dir / "src" / "audit_tool"
        src_dir.mkdir(parents=True, exist_ok=True)

        # 1. Write pyproject.toml with setuptools.build_meta
        pyproject_content = """[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "operational-audit-tool"
version = "0.1.0"
description = "PinIT Test Operational Audit CLI Tool"
readme = "README.md"
requires-python = ">=3.10"
dependencies = []

[project.scripts]
audit-tool = "audit_tool.cli:main"
"""
        (project_dir / "pyproject.toml").write_text(pyproject_content, encoding="utf-8")
        (project_dir / "README.md").write_text("# Operational Audit Tool\nFormative packaging test.", encoding="utf-8")
        print_pass("pyproject.toml created with standardized [build-system], [project], and [project.scripts]")

        # 2. Write package source files
        (src_dir / "__init__.py").write_text('__version__ = "0.1.0"\n', encoding="utf-8")

        config_code = """from dataclasses import dataclass, field
import os

@dataclass(frozen=True)
class ServiceConfig:
    service_name: str
    port: int = 8080
    alert_threshold: float = 80.0
    tags: list = field(default_factory=list)

    def __post_init__(self):
        if not self.service_name or not self.service_name.strip():
            raise ValueError("service_name cannot be empty")
        if self.port < 1 or self.port > 65535:
            raise ValueError(f"port {self.port} out of range [1, 65535]")
        if self.alert_threshold < 0.0 or self.alert_threshold > 100.0:
            raise ValueError("alert_threshold out of range [0.0, 100.0]")

def load_config(cli_port=None, cli_thresh=None):
    svc = os.getenv("APP_SERVICE", "audit-service")
    raw_port = cli_port or os.getenv("APP_PORT", 8080)
    raw_thresh = cli_thresh or os.getenv("APP_ALERT_THRESHOLD", 80.0)
    return ServiceConfig(
        service_name=str(svc),
        port=int(raw_port),
        alert_threshold=float(raw_thresh)
    )
"""
        (src_dir / "config.py").write_text(config_code, encoding="utf-8")

        cli_code = """import sys
import argparse
from audit_tool.config import load_config

def main():
    parser = argparse.ArgumentParser(prog="audit-tool")
    parser.add_argument("--port", type=int, default=None)
    parser.add_argument("--threshold", type=float, default=None)
    parser.add_argument("--cpu", type=float, default=10.0)
    args = parser.parse_args()

    try:
        cfg = load_config(cli_port=args.port, cli_thresh=args.threshold)
    except Exception as err:
        sys.stderr.write(f"Configuration error: {err}\\n")
        return 2

    print(f"SERVICE={cfg.service_name} PORT={cfg.port} CPU={args.cpu} THRESHOLD={cfg.alert_threshold}")
    if args.cpu > cfg.alert_threshold:
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
"""
        (src_dir / "cli.py").write_text(cli_code, encoding="utf-8")
        print_pass("Package source tree written: src/audit_tool/{__init__.py, config.py, cli.py}")

        # 3. BUILD ARTIFACTS: python -m build (producing both wheel and sdist)
        dist_dir = project_dir / "dist"
        dist_dir.mkdir(parents=True, exist_ok=True)
        print(f"\n── STEP 1: BUILDING DISTRIBUTION ARTIFACTS (SDIST + WHEEL) VIA python -m build ──")
        build_res = subprocess.run(
            [sys.executable, "-m", "build", "--sdist", "--wheel", "--outdir", str(dist_dir)],
            cwd=str(project_dir),
            capture_output=True,
            text=True
        )
        assert build_res.returncode == 0, (
            f"python -m build failed! The standard PyPA build frontend is required to create both wheel and sdist.\n"
            f"Build error:\n{build_res.stderr}\n{build_res.stdout}"
        )

        wheels = list(dist_dir.glob("*.whl"))
        sdists = list(dist_dir.glob("*.tar.gz"))

        assert len(wheels) > 0, f"python -m build did not produce a .whl artifact in {dist_dir}!"
        assert len(sdists) > 0, f"python -m build did not produce a .tar.gz source distribution in {dist_dir}!"
        wheel_file = wheels[0]
        sdist_file = sdists[0]
        print_pass(f"Built Wheel artifact verified: {wheel_file.name}")
        print_pass(f"Built Sdist artifact verified: {sdist_file.name}")

        # 4. FRESH ENVIRONMENT #1: WHEEL INSTALLATION & CLI TEST
        print(f"\n── STEP 2: FRESH VENV #1 \u2014 DIRECT WHEEL INSTALLATION & EXECUTION ──")
        venv_wheel_dir = Path(temp_base) / "venv_wheel"
        subprocess.run([sys.executable, "-m", "venv", str(venv_wheel_dir)], check=True, capture_output=True)
        print_pass("Fresh virtual environment #1 (venv_wheel) created cleanly")

        is_windows = os.name == "nt"
        wheel_pip = venv_wheel_dir / ("Scripts/pip.exe" if is_windows else "bin/pip")
        wheel_py = venv_wheel_dir / ("Scripts/python.exe" if is_windows else "bin/python")
        wheel_cli = venv_wheel_dir / ("Scripts/audit-tool.exe" if is_windows else "bin/audit-tool")

        # Install built wheel directly
        print(f"  \u23f3 Installing {wheel_file.name} into venv_wheel...")
        inst_res = subprocess.run([str(wheel_pip), "install", str(wheel_file)], capture_output=True, text=True)
        assert inst_res.returncode == 0, f"Wheel install failed: {inst_res.stderr}"
        print_pass("Built wheel installed directly into fresh venv_wheel site-packages")

        # Execute outside source tree
        isolated_run_dir = Path(temp_base) / "isolated_wheel_run"
        isolated_run_dir.mkdir(parents=True, exist_ok=True)

        # Import test
        imp = subprocess.run([str(wheel_py), "-c", "import audit_tool; print(audit_tool.__file__)"], cwd=str(isolated_run_dir), capture_output=True, text=True)
        assert imp.returncode == 0, "Import failed"
        assert str(venv_wheel_dir).lower() in imp.stdout.lower(), "Import masked by source tree!"
        print_pass(f"Wheel package imported strictly from venv site-packages (Zero source-tree masking)")

        # CLI execution tests
        assert wheel_cli.exists(), "Installed CLI wrapper not found"
        r0 = subprocess.run([str(wheel_cli), "--port", "8080", "--cpu", "10.0"], cwd=str(isolated_run_dir), capture_output=True, text=True)
        assert r0.returncode == 0, f"Expected 0, got {r0.returncode}"
        print_pass("Wheel CLI: Exit code 0 on normal healthy execution")

        r1 = subprocess.run([str(wheel_cli), "--threshold", "50.0", "--cpu", "90.0"], cwd=str(isolated_run_dir), capture_output=True, text=True)
        assert r1.returncode == 1, f"Expected 1, got {r1.returncode}"
        print_pass("Wheel CLI: Exit code 1 on threshold breach")

        r2 = subprocess.run([str(wheel_cli), "--port", "999999"], cwd=str(isolated_run_dir), capture_output=True, text=True)
        assert r2.returncode == 2, f"Expected 2, got {r2.returncode}"
        print_pass("Wheel CLI: Exit code 2 on configuration error")

        # 5. FRESH ENVIRONMENT #2: SDIST INSTALLATION & CLI TEST
        if len(sdists) > 0:
            sdist_file = sdists[0]
            print(f"\n── STEP 3: FRESH VENV #2 \u2014 DIRECT SDIST INSTALLATION & EXECUTION ──")
            venv_sdist_dir = Path(temp_base) / "venv_sdist"
            subprocess.run([sys.executable, "-m", "venv", str(venv_sdist_dir)], check=True, capture_output=True)
            print_pass("Fresh virtual environment #2 (venv_sdist) created cleanly")

            sdist_pip = venv_sdist_dir / ("Scripts/pip.exe" if is_windows else "bin/pip")
            sdist_cli = venv_sdist_dir / ("Scripts/audit-tool.exe" if is_windows else "bin/audit-tool")

            inst_sdist = subprocess.run([str(sdist_pip), "install", str(sdist_file)], capture_output=True, text=True)
            assert inst_sdist.returncode == 0, f"Sdist install failed: {inst_sdist.stderr}"
            print_pass(f"Built sdist ({sdist_file.name}) installed directly into venv_sdist")

            isolated_sdist_run = Path(temp_base) / "isolated_sdist_run"
            isolated_sdist_run.mkdir(parents=True, exist_ok=True)

            r_sdist = subprocess.run([str(sdist_cli), "--cpu", "5.0"], cwd=str(isolated_sdist_run), capture_output=True, text=True)
            assert r_sdist.returncode == 0, "Sdist CLI execution failed"
            print_pass("Sdist CLI: Installed command wrapper executed cleanly outside source tree")

        print("\n========================================================================")
        print("\ud83c\udfc1 DUAL-ARTIFACT REAL PACKAGING TEST PASSED (WHEEL + SDIST VERIFIED)")
        print("========================================================================\n")
        return True

    finally:
        shutil.rmtree(temp_base, ignore_errors=True)

if __name__ == "__main__":
    success = run_real_packaging_test()
    sys.exit(0 if success else 2)
