import json
import os
import hashlib
import sys

sys.path.insert(0, 'scripts')
from block5_day21 import DAY_21
from block5_day22 import DAY_22
from block5_day23 import DAY_23
from block5_day24 import DAY_24
from block5_day25 import DAY_25
from block6_day26 import DAY_26
from block6_day27 import DAY_27
from block6_day28 import DAY_28
from block6_day29 import DAY_29
from block6_day30 import DAY_30

ALL_DAYS = [DAY_21, DAY_22, DAY_23, DAY_24, DAY_25, DAY_26, DAY_27, DAY_28, DAY_29, DAY_30]
visuals_dir = 'src/lib/data/lessonVisuals/java-basics'

for d in ALL_DAYS:
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
    print(f"Aligned visual file: {p}")

print("\nVisual alignment completed for Days 21 to 30.")
