import os
import json
import subprocess
import sys
sys.path.append("scripts")
from soft_skills_days56_60_snippets import SNIPPETS

outputs = {}

print(f"Executing 25 TypeScript snippets across Days 56-60 via npx tsx...")

for day, parts in sorted(SNIPPETS.items()):
    day_str = str(day)
    outputs[day_str] = {}
    for idx, code in enumerate(parts):
        part_str = str(idx + 1)
        temp_file = f"temp_snippet_56_60_{day_str}_{part_str}.ts"
        with open(temp_file, "w", encoding="utf-8") as f:
            f.write(code)

        try:
            res = subprocess.run(
                ["npx", "tsx", temp_file],
                capture_output=True,
                text=True,
                check=True,
                shell=True
            )
            out = res.stdout.strip()
            outputs[day_str][part_str] = out
            print(f"[OK] Executed snippet Day {day_str} Part {part_str}: {len(out)} chars")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed snippet Day {day_str} Part {part_str}:")
            print("STDOUT:", e.stdout)
            print("STDERR:", e.stderr)
            raise
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

with open("scripts/soft_skills_days56_60_outputs.json", "w", encoding="utf-8") as f:
    json.dump(outputs, f, indent=2)

print("\nSuccessfully executed and captured all 25 outputs into scripts/soft_skills_days56_60_outputs.json!")
