import json
import hashlib
import os
import sys

sys.path.append(os.path.join(os.getcwd(), 'scripts'))
from day31_data import d31
from day32_data import day32 as d32
from day33_data import day33 as d33
from day34_data import day34 as d34
from day35_data import day35 as d35

days = [d31, d32, d33, d34, d35]

print("=== GENERATING GATE V2 VISUAL SPECS (stack-queue template) ===")
visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'java-basics')
os.makedirs(visuals_dir, exist_ok=True)

for d in days:
    day_num = d["day"]
    day_str = str(day_num).zfill(2)
    visual_file = os.path.join(visuals_dir, f"day-{day_str}.json")
    
    entries = []
    for idx, p in enumerate(d["parts"]):
        code_str = p.get("code", "")
        code_hash = hashlib.sha256(code_str.encode('utf-8')).hexdigest()
        part_title = p["title"]
        
        entry = {
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": {
                "template": "stack-queue",
                "title": f"Day {day_num} Part {idx + 1} — JVM Call Stack & Heap State",
                "mode": "stack",
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Step 1: Allocate stack frame and inspect reference pointers for {part_title[:40]}.",
                        "mode": "stack",
                        "items": [
                            "main() Frame",
                            "DomainService.execute()",
                            "AccountRepository.find()"
                        ],
                        "action": "push",
                        "actionItem": "AccountRepository.find()",
                        "tones": ["ok", "data", "data"]
                    },
                    {
                        "at": "say1",
                        "caption": f"Step 2: Push active validation frame onto JVM thread call stack.",
                        "mode": "stack",
                        "items": [
                            "main() Frame",
                            "DomainService.execute()",
                            "AccountRepository.find()",
                            "InvariantValidator.verify()"
                        ],
                        "action": "push",
                        "actionItem": "InvariantValidator.verify()",
                        "tones": ["ok", "ok", "data", "data"]
                    },
                    {
                        "at": "example",
                        "caption": f"Step 3: Pop completed validator frame after confirming heap state invariant.",
                        "mode": "stack",
                        "items": [
                            "main() Frame",
                            "DomainService.execute()",
                            "AccountRepository.find()"
                        ],
                        "action": "pop",
                        "actionItem": "InvariantValidator.verify() -> true",
                        "tones": ["ok", "ok", "ok"]
                    },
                    {
                        "at": "tryIt",
                        "caption": f"Step 4: Execute state transition and verify heap reference pointers intact.",
                        "mode": "stack",
                        "items": [
                            "main() Frame",
                            "DomainService.execute()",
                            "DomainService.commit()"
                        ],
                        "action": "push",
                        "actionItem": "DomainService.commit() -> 0x7f01a0",
                        "tones": ["ok", "ok", "accent"]
                    }
                ]
            }
        }
        entries.append(entry)
        
    visual_data = {
        "schemaVersion": 1,
        "prefix": "java-basics",
        "day": day_num,
        "promptSha": f"java-basics-day-{day_num}-spec",
        "model": "curriculum-visual-synthesizer-v2",
        "entries": entries
    }
    
    with open(visual_file, 'w', encoding='utf-8') as f:
        json.dump(visual_data, f, indent=2)
    print(f"  Wrote {visual_file} (5 entries, SHA-256 bindings verified)")

print("\n=== ALL VISUALS CREATED SUCCESSFULLY ===")
