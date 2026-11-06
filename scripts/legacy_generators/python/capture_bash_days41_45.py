# scripts/capture_bash_days41_45.py
import sys
import os
import json
import subprocess

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

from scripts.build_full_git_days41_45 import bash_snippets

cache_file = "scripts/bash_outputs_days41_45.json"
if os.path.exists(cache_file):
    print(f"Loading existing cache from {cache_file}...")
    with open(cache_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    outputs = {tuple(map(int, k.split("_"))): v for k, v in data.items()}
else:
    outputs = {}

print("=== CAPTURING/VERIFYING DETERMINISTIC OUTPUTS FOR DAYS 41-45 ===")
for (day, part), code in bash_snippets.items():
    if (day, part) in outputs and len(outputs[(day, part)]) > 0:
        continue
    tmp_path = f"scripts/temp_bash_{day}_{part}.sh"
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(code)
    
    cmd = ["npx", "tsx", "scripts/run_single_bash.ts", tmp_path]
    res = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    out = res.stdout
    outputs[(day, part)] = out
    print(f"Day {day} Part {part}: out len={len(out)}")
    if os.path.exists(tmp_path):
        os.remove(tmp_path)

save_data = {f"{day}_{part}": out for (day, part), out in outputs.items()}
with open(cache_file, "w", encoding="utf-8") as f:
    json.dump(save_data, f, indent=2, ensure_ascii=False)

print(f"Saved {len(outputs)} bash outputs to {cache_file}!")
