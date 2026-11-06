import sys
import json
import subprocess
import tempfile
import os

sys.path.append('scripts')
from soft_skills_days46_50_snippets import SNIPPETS

outputs = {}

for day, parts in SNIPPETS.items():
    outputs[day] = {}
    for part, code in parts.items():
        with tempfile.NamedTemporaryFile('w', suffix='.ts', delete=False, encoding='utf-8') as f:
            f.write(code)
            temp_path = f.name
        
        try:
            # Run via tsx
            res = subprocess.run('npx tsx ' + temp_path, capture_output=True, text=True, check=True, shell=True)
            outputs[day][part] = res.stdout.strip()
            print(f"Day {day} Part {part}: OK ({len(res.stdout.strip().splitlines())} lines)")
        except subprocess.CalledProcessError as e:
            print(f"ERROR Day {day} Part {part}:")
            print(e.stderr)
            sys.exit(1)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

with open('scripts/soft_skills_days46_50_outputs.json', 'w', encoding='utf-8') as f:
    json.dump(outputs, f, indent=2, ensure_ascii=False)

print("Saved all 25 outputs to scripts/soft_skills_days46_50_outputs.json successfully!")
