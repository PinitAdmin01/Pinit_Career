import subprocess
import sys
import hashlib
import json
from pathlib import Path

repo_root = Path.cwd()
lessons_file = repo_root / "src" / "lib" / "data" / "bcomAnaLongLessons.ts"
visuals_dir = repo_root / "src" / "lib" / "data" / "lessonVisuals" / "bcom_ana"
visuals_dir.mkdir(parents=True, exist_ok=True)

def execute_code(code: str) -> str:
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{code}\nError: {res.stderr}")
    return res.stdout.rstrip("\r\n")

def make_sha256(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def count_words(text_list: list) -> int:
    return sum(len(p.split()) for p in text_list)
