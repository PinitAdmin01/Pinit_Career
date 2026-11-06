# scripts/build_bcom_law_days47_50.py
import json
import hashlib
import subprocess
import os
import sys

print("=== STARTING BCOM_LAW DAYS 47-50 HIGH-FIDELITY GENERATOR ===")

def verify_and_capture_code(code_str: str) -> str:
    res = subprocess.run(
        [sys.executable, "-c", code_str],
        capture_output=True,
        text=True,
        timeout=15
    )
    if res.returncode != 0:
        print("ERROR IN PYTHON SNIPPET:")
        print(res.stderr)
        raise RuntimeError(f"Code snippet execution failed: {res.stderr}")
    return res.stdout

def count_words(say_list: list) -> int:
    return sum(len(s.split()) for s in say_list)

print("Helper functions compiled.")
