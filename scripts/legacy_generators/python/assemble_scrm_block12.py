# scripts/assemble_scrm_block12.py
"""
Assemble Block 12 (Days 56-60) for Course 29: bcom_scrm
1. Generates Gate v2 Visual JSON files:
   - src/lib/data/lessonVisuals/bcom_scrm/day-56.json
   - src/lib/data/lessonVisuals/bcom_scrm/day-57.json
   - src/lib/data/lessonVisuals/bcom_scrm/day-58.json
   - src/lib/data/lessonVisuals/bcom_scrm/day-59.json
   - src/lib/data/lessonVisuals/bcom_scrm/day-60.json
2. Appends Days 56-60 to src/lib/data/bcomScrmLongLessons.ts
"""

import hashlib
import json
from pathlib import Path
from data_scrm_day56 import DAY_56_DATA
from data_scrm_day57 import DAY_57_DATA
from data_scrm_day58 import DAY_58_DATA
from data_scrm_day59 import DAY_59_DATA
from data_scrm_day60 import DAY_60_DATA

DAYS = [DAY_56_DATA, DAY_57_DATA, DAY_58_DATA, DAY_59_DATA, DAY_60_DATA]

visual_dir = Path("src/lib/data/lessonVisuals/bcom_scrm")
visual_dir.mkdir(parents=True, exist_ok=True)
lessons_file = Path("src/lib/data/bcomScrmLongLessons.ts")

# Funnel stages for Block 12
BLOCK_12_STAGES = [
    {"name": "Governance Discovery", "value": 100, "color": "#3B82F6"},
    {"name": "Architectural Design", "value": 75, "color": "#10B981"},
    {"name": "Telemetry Verification", "value": 50, "color": "#F59E0B"},
    {"name": "Board Certification", "value": 25, "color": "#8B5CF6"}
]

CAPTIONS = {
    "intro": "Reviewing sovereign revenue operations and executive leadership models.",
    "say1": "Auditing enterprise technical compliance and architectural governance.",
    "example": "Executing simulated transaction pipelines and telemetry verification.",
    "tryIt": "Validating final cryptographic certificates and boardroom consensus."
}

# Verify captions satisfy invariants
for step_name, cap in CAPTIONS.items():
    assert len(cap) <= 75, f"Caption too long: {cap}"
    assert not any(c.isdigit() for c in cap), f"Caption contains digits: {cap}"
    assert cap.endswith("."), f"Caption must end with period: {cap}"

assembled_days = []

for day_data in DAYS:
    day_num = day_data["day"]
    print(f"Processing Day {day_num}: {day_data['title']}...")
    
    parts_assembled = []
    visual_entries = []
    
    for p_idx, part in enumerate(day_data["parts"]):
        print(f"  Part {p_idx+1}: {part['title']}")
        # Compute SHA-256 code hash
        code_hash = hashlib.sha256(part["code"].encode("utf-8")).hexdigest()
        
        # Build Visual Entry (Funnel template, 4 steps)
        steps_spec = [
            {
                "at": "intro",
                "caption": CAPTIONS["intro"],
                "stages": BLOCK_12_STAGES
            },
            {
                "at": "say1",
                "caption": CAPTIONS["say1"],
                "stages": BLOCK_12_STAGES
            },
            {
                "at": "example",
                "caption": CAPTIONS["example"],
                "stages": BLOCK_12_STAGES
            },
            {
                "at": "tryIt",
                "caption": CAPTIONS["tryIt"],
                "stages": BLOCK_12_STAGES
            }
        ]
        
        entry = {
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "stages": BLOCK_12_STAGES,
                "steps": steps_spec
            }
        }
        visual_entries.append(entry)
        
        # Assembled Part
        parts_assembled.append({
            "title": part["title"],
            "say": part["say"],
            "example": part["example"],
            "code": part["code"],
            "output": part["output"],
            "tryIt": part["tryIt"],
            "codeNotes": part["codeNotes"],
            "check": part["check"]
        })
        
    # Write Gate v2 Visual JSON File
    visual_path = visual_dir / f"day-{day_num}.json"
    visual_envelope = {
        "schemaVersion": 1,
        "prefix": "bcom_scrm",
        "day": day_num,
        "entries": visual_entries
    }
    with open(visual_path, "w", encoding="utf-8") as vf:
        json.dump(visual_envelope, vf, indent=2)
    print(f"  --> Wrote visual envelope: {visual_path.name}")
    
    # Assembled Day Object (strictly sanitized projectStep without objective)
    day_obj = {
        "coursePrefix": "bcom_scrm",
        "day": day_num,
        "title": day_data["title"],
        "goal": day_data["goal"],
        "minutes": day_data["minutes"],
        "recap": day_data["recap"],
        "parts": parts_assembled,
        "summary": day_data["summary"],
        "projectStep": {
            "title": day_data["projectStep"]["title"],
            "steps": day_data["projectStep"]["steps"]
        }
    }
    assembled_days.append(day_obj)

# Append to src/lib/data/bcomScrmLongLessons.ts
print("\nAppending Days 56-60 to bcomScrmLongLessons.ts...")
with open(lessons_file, "r", encoding="utf-8") as lf:
    ts_content = lf.read()

r_idx = ts_content.rfind("];")
if r_idx == -1:
    raise RuntimeError("Could not find closing '];' in bcomScrmLongLessons.ts")

# Convert assembled days to JSON and format
formatted_days = []
for d in assembled_days:
    formatted_days.append(json.dumps(d, indent=2))

days_json_block = ",\n" + ",\n".join(formatted_days)
new_ts_content = ts_content[:r_idx].rstrip() + days_json_block + "\n];\n"

with open(lessons_file, "w", encoding="utf-8") as lf:
    lf.write(new_ts_content)

print(f"Successfully appended Days 56-60! Total days in bcomScrmLongLessons.ts is now 60.")
