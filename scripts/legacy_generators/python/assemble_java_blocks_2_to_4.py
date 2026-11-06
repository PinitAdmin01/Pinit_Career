import json
import hashlib
import os
import re
import sys
import subprocess

sys.path.insert(0, 'scripts')

# Import Days 6 to 20
from block2_day6 import DAY_6
from block2_day7 import DAY_7
from block2_day8 import DAY_8
from block2_day9 import DAY_9
from block2_day10 import DAY_10

from block3_day11 import DAY_11
from block3_day12 import DAY_12
from block3_day13 import DAY_13
from block3_day14 import DAY_14
from block3_day15 import DAY_15

from block4_day16 import DAY_16
from block4_day17 import DAY_17
from block4_day18 import DAY_18
from block4_day19 import DAY_19
from block4_day20 import DAY_20

DAYS_6_TO_20 = [
    DAY_6, DAY_7, DAY_8, DAY_9, DAY_10,
    DAY_11, DAY_12, DAY_13, DAY_14, DAY_15,
    DAY_16, DAY_17, DAY_18, DAY_19, DAY_20
]

print("=== ASSEMBLING BLOCKS 2, 3, 4 (DAYS 6 to 20) ===")

# 1. Update javaBasicsLongLessons.ts
with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m_day6 = re.search(r'\n  \{\s*["\']?day["\']?:\s*6\s*,', content)
m_day21 = re.search(r'\n  \{\s*["\']?day["\']?:\s*21\s*,', content)

if not m_day6:
    raise Exception("Could not find Day 6 in javaBasicsLongLessons.ts")
if not m_day21:
    raise Exception("Could not find Day 21 in javaBasicsLongLessons.ts")

idx_start = m_day6.start()
idx_end = m_day21.start()

print(f"Replacing from index {idx_start} (Day 6) to {idx_end} (Day 21)")

prefix = content[:idx_start]
suffix = content[idx_end:]

new_days_json = []
for d in DAYS_6_TO_20:
    s = json.dumps(d, indent=4)
    indented = '\n'.join(('  ' + line if line else line) for line in s.split('\n'))
    new_days_json.append(indented)

new_content = prefix + '\n' + ',\n'.join(new_days_json) + ',\n' + suffix.lstrip('\n')

with open('src/lib/data/javaBasicsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated src/lib/data/javaBasicsLongLessons.ts for Days 6 to 20.")

# 2. Generate on-disk visual JSON files
visuals_dir = 'src/lib/data/lessonVisuals/java-basics'
os.makedirs(visuals_dir, exist_ok=True)

for d in DAYS_6_TO_20:
    day_num = d['day']
    padded = f"day-{day_num:02d}.json"
    p = os.path.join(visuals_dir, padded)

    entries = []
    for p_idx, part in enumerate(d['parts']):
        code_str = part.get('code', '')
        h = hashlib.sha256(code_str.encode('utf-8')).hexdigest()
        title_short = part['title'][:40]

        spec = {
            "template": "stack-queue",
            "title": f"{title_short} — JVM Execution Flow",
            "mode": "stack",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Allocate stack frame and inspect class contracts for {title_short}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Execution Engine", "Class Invariants"],
                    "action": "push",
                    "actionItem": "Class Invariants",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Execute bytecode instructions and operand stack push for {title_short}...",
                    "mode": "stack",
                    "items": ["main() Frame", "Operand Stack", "Heap Reference"],
                    "action": "push",
                    "actionItem": "Heap Reference",
                    "tones": ["data", "active", "accent"]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Verify bounds, state integrity, and object references...",
                    "mode": "stack",
                    "items": ["main() Frame", "Verified Contract", "Return Register"],
                    "action": "push",
                    "actionItem": "Verified Contract",
                    "tones": ["data", "ok", "ok"]
                },
                {
                    "at": "tryIt",
                    "caption": "Step 4: Clean stack frame and yield execution...",
                    "mode": "stack",
                    "items": ["Result Register (Success)"],
                    "action": "pop",
                    "actionItem": "Result Register (Success)",
                    "tones": ["ok"]
                }
            ]
        }

        entries.append({
            "partTitle": part['title'],
            "codeHash": h,
            "spec": spec
        })

    obj = {
        "schemaVersion": 1,
        "prefix": "java-basics",
        "day": day_num,
        "entries": entries
    }

    with open(p, 'w', encoding='utf-8') as f_out:
        json.dump(obj, f_out, indent=2, ensure_ascii=False)
    print(f"Generated visual file: {p}")

# 3. Rebuild long-lessons archive
print("\nRunning build-long-lessons-json.cjs...")
subprocess.run(["node", "scripts/utils/build-long-lessons-json.cjs"], check=True)
print("\nALL ASSEMBLED AND ARCHIVED SUCCESSFULLY!")
