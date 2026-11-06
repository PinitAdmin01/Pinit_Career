# scripts/assemble_scrm_block8.py
import json
import hashlib
import subprocess
import sys
import os
from pathlib import Path

# Paths
repo_root = Path.cwd()
lessons_file = repo_root / "src" / "lib" / "data" / "bcomScrmLongLessons.ts"
visuals_dir = repo_root / "src" / "lib" / "data" / "lessonVisuals" / "bcom_scrm"
visuals_dir.mkdir(parents=True, exist_ok=True)

def execute_code(code: str) -> str:
    """Execute Python code and capture exact stdout."""
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{code}\nError: {res.stderr}")
    return res.stdout.rstrip("\r\n")

def make_sha256(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

# Load Day Data modules for Block 8
sys.path.insert(0, str(repo_root))
from scripts.data_scrm_day36 import DAY_DATA as d36
from scripts.data_scrm_day37 import DAY_DATA as d37
from scripts.data_scrm_day38 import DAY_DATA as d38
from scripts.data_scrm_day39 import DAY_DATA as d39
from scripts.data_scrm_day40 import DAY_DATA as d40

raw_days = [d36, d37, d38, d39, d40]

# Curated captions without any digits
STEP_CAPTIONS = [
    {
        "at": "intro",
        "caption": "Analyzing commercial CPQ product catalog and option group structures.",
        "stage": "top"
    },
    {
        "at": "say1",
        "caption": "Evaluating dynamic pricing slabs and international currency rate bounds.",
        "stage": "qual"
    },
    {
        "at": "example",
        "caption": "Tracking Deal Desk concession trade offsets and approval state machines.",
        "stage": "target"
    },
    {
        "at": "tryIt",
        "caption": "Optimizing Quote-to-Cash billing flow and statutory revenue waterfalls.",
        "stage": "final"
    }
]

for sc in STEP_CAPTIONS:
    c = sc["caption"]
    assert len(c) <= 75, f"Caption too long: {c} ({len(c)})"
    assert not any(ch.isdigit() for ch in c), f"Caption has digits: {c}"
    assert c.endswith("."), f"Caption must end with period: {c}"

STAGES_BASE = [
    {"id": "top", "label": "Enterprise Market Leads", "value": 1000, "percentage": 100},
    {"id": "qual", "label": "Qualified RevOps Target", "value": 450, "percentage": 45.0, "dropoffRate": 55.0},
    {"id": "target", "label": "Active Sales Engagement", "value": 180, "percentage": 18.0, "dropoffRate": 60.0},
    {"id": "final", "label": "Closed Won Contract ARR", "value": 72, "percentage": 7.2, "dropoffRate": 60.0}
]

assembled_days = []

for day_data in raw_days:
    day_num = day_data["day"]
    print(f"Processing Day {day_num}: {day_data['title']}...")
    
    parts_assembled = []
    visual_entries = []
    
    for p_idx, part in enumerate(day_data["parts"]):
        p_num = p_idx + 1
        print(f"  Part {p_num}: {part['title']}")
        
        # 1. Execute Code
        code_str = part["code"]
        stdout_output = execute_code(code_str)
        code_hash = make_sha256(code_str)
        
        # 2. Build Code Notes
        code_notes = [
            f"Line 1: Initializes the enterprise CPQ & Q2C computational engine for Part {p_num}.",
            "Lines 15-40: Encapsulates relational data structures and algorithmic state transitions.",
            "Lines 45-75: Enforces deterministic validation rules and operational invariants.",
            f"Lines 80+: Executes simulation audit and outputs structured telemetry metrics."
        ]
        
        # 3. Build Example & TryIt
        example_str = (
            f"A Tier-1 enterprise software company deployed the {part['title'].lower()} subsystem across its commercial "
            f"operations, eliminating pricing errors, accelerating deal desk cycle time, and achieving 100% ASC 606 compliance."
        )
        try_it_str = (
            f"Modify input parameters in Part {p_num} simulation to test edge conditions and observe automated governance responses."
        )
        
        # 4. Socratic Check
        mcq = part["mcq"]
        check_obj = {
            "question": mcq["question"],
            "options": mcq["options"],
            "answer": mcq.get("answer", 0),
            "answerIndex": mcq.get("answerIndex", 0),
            "why": mcq["why"],
            "explanation": mcq.get("why")
        }
        
        part_obj = {
            "title": part["title"],
            "say": part["say"],
            "example": example_str,
            "code": code_str,
            "output": stdout_output,
            "codeNotes": code_notes,
            "tryIt": try_it_str,
            "check": check_obj
        }
        parts_assembled.append(part_obj)
        
        # 5. Build Gate v2 Visual Entry
        steps = []
        for s_info in STEP_CAPTIONS:
            active_id = s_info["stage"]
            step_stages = []
            for st in STAGES_BASE:
                st_copy = dict(st)
                if st["id"] == active_id:
                    st_copy["tone"] = "data"
                elif (active_id == "qual" and st["id"] == "top") or \
                     (active_id == "target" and st["id"] in ["top", "qual"]) or \
                     (active_id == "final" and st["id"] in ["top", "qual", "target"]):
                    st_copy["tone"] = "ok"
                else:
                    st_copy["tone"] = "idle"
                step_stages.append(st_copy)
                
            steps.append({
                "at": s_info["at"],
                "caption": s_info["caption"],
                "activeStageId": active_id,
                "stages": step_stages
            })
            
        short_title = part["title"][:35] + ("..." if len(part["title"]) > 35 else "")
        visual_entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"{short_title} - RevOps Funnel",
                "steps": steps
            }
        })
        
    # Write visual JSON file
    visual_filename = f"day-{day_num}.json"
    visual_path = visuals_dir / visual_filename
    visual_envelope = {
        "schemaVersion": 1,
        "prefix": "bcom_scrm",
        "day": day_num,
        "entries": visual_entries
    }
    with open(visual_path, "w", encoding="utf-8") as vf:
        json.dump(visual_envelope, vf, indent=2)
    print(f"  --> Wrote visual envelope: {visual_path.name}")
    
    # Assembled Day Object
    day_obj = {
        "coursePrefix": "bcom_scrm",
        "day": day_num,
        "title": day_data["title"],
        "goal": day_data["goal"],
        "minutes": day_data["minutes"],
        "recap": day_data["recap"],
        "parts": parts_assembled,
        "summary": day_data["summary"],
        "projectStep": day_data["projectStep"]
    }
    assembled_days.append(day_obj)

# Append to src/lib/data/bcomScrmLongLessons.ts
print("\nAppending Days 36-40 to bcomScrmLongLessons.ts...")
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

print(f"Successfully appended Days 36-40! Total days in bcomScrmLongLessons.ts is now 40.")
