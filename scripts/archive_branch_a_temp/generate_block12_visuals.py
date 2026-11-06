# -*- coding: utf-8 -*-
"""
Generate Gate v2 Visual JSON specs for Days 56 to 60 (Block 12).
Template: 'stack-queue'
4 synchronized steps: intro, say1, example, tryIt.
Exact SHA-256 code hashes.
Output: src/lib/data/lessonVisuals/java-basics/day-{56..60}.json
"""

import json
import hashlib
import os

from day56_data import day56
from day57_data import day57
from day58_data import day58
from day59_data import day59
from day60_data import day60

days = [day56, day57, day58, day59, day60]

out_dir = "src/lib/data/lessonVisuals/java-basics"
os.makedirs(out_dir, exist_ok=True)

for day_obj in days:
    day_num = day_obj["day"]
    entries = []
    
    for part_idx, part in enumerate(day_obj["parts"]):
        part_title = part["title"]
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        
        spec = {
            "template": "stack-queue",
            "title": f"Day {day_num} Part {part_idx + 1} - JVM Call Stack & Heap State",
            "mode": "stack",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Allocate stack frame and inspect reference pointers for {part_title[:25]}.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()"],
                    "action": "push",
                    "actionItem": f"Day{day_num}Subsystem.init()",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "say1",
                    "caption": "Step 2: Push active execution frame onto JVM thread call stack.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()", f"Part{part_idx + 1}Executor.run()"],
                    "action": "push",
                    "actionItem": f"Part{part_idx + 1}Executor.run()",
                    "tones": ["ok", "ok", "data", "data"]
                },
                {
                    "at": "example",
                    "caption": "Step 3: Pop completed execution frame after verifying heap state invariant.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()"],
                    "action": "pop",
                    "actionItem": f"Part{part_idx + 1}Executor.run()",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "tryIt",
                    "caption": "Step 4: Push tryIt verification frame and evaluate assertions.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()", "AssertionRunner.verify()"],
                    "action": "push",
                    "actionItem": "AssertionRunner.verify()",
                    "tones": ["ok", "ok", "data", "ok"]
                }
            ]
        }
        
        entries.append({
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": spec
        })
        
    visual_data = {
        "schemaVersion": 1,
        "prefix": "java-basics",
        "day": day_num,
        "promptSha": f"java-basics-day-{day_num}-spec",
        "model": "curriculum-visual-synthesizer-v2",
        "entries": entries
    }
    
    file_path = os.path.join(out_dir, f"day-{day_num}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(visual_data, f, indent=2)
    print(f"Generated {file_path} with {len(entries)} visual entries.")

print("All Block 12 visual JSON specs generated successfully!")
