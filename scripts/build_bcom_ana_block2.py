import json
import hashlib
import subprocess
import sys
from pathlib import Path

# Paths
repo_root = Path.cwd()
lessons_file = repo_root / "src" / "lib" / "data" / "bcomAnaLongLessons.ts"
visuals_dir = repo_root / "src" / "lib" / "data" / "lessonVisuals" / "bcom_ana"
visuals_dir.mkdir(parents=True, exist_ok=True)

def execute_code(code: str) -> str:
    """Execute Python code and capture exact stdout without stripping leading whitespace."""
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{code}\nError: {res.stderr}")
    return res.stdout.rstrip("\r\n")

def make_sha256(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

print("Authoring Days 6 to 10 for bcom_ana (Course 24)...")
