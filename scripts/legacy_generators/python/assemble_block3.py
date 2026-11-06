import sys
import json
import hashlib
import subprocess
from pathlib import Path

repo_root = Path.cwd()
sys.path.insert(0, str(repo_root))

from scripts.bcom_ana_utils import execute_code, make_sha256, count_words
from scripts.data_day11 import DAY_DATA as day11
from scripts.data_day12 import DAY_DATA as day12
from scripts.data_day13 import DAY_DATA as day13
from scripts.data_day14 import DAY_DATA as day14
from scripts.data_day15 import DAY_DATA as day15

days_to_assemble = [day11, day12, day13, day14, day15]
visuals_dir = repo_root / "src" / "lib" / "data" / "lessonVisuals" / "bcom_ana"
visuals_dir.mkdir(parents=True, exist_ok=True)

print("Starting Block 3 Assembly (Days 11 to 15)...")

# 1. Process Code Execution and Capture Output
for d in days_to_assemble:
    day_num = d["day"]
    print(f"\n--- Processing Day {day_num}: {d['title']} ---")
    
    visual_entries = []
    
    for p_idx, part in enumerate(d["parts"]):
        # Execute code
        code = part["code"]
        stdout = execute_code(code)
        part["output"] = stdout
        code_hash = make_sha256(code)
        
        # Word extraction for captions
        title_words = [w.lower() for w in part["title"].split() if len(w) >= 4 and w.lower() not in ["with", "from", "that", "this", "model", "analysis"]][:2]
        w1 = "".join(ch for ch in (title_words[0] if len(title_words) > 0 else "metric") if ch.isalpha())[:10]
        w2 = "".join(ch for ch in (title_words[1] if len(title_words) > 1 else "signal") if ch.isalpha())[:10]
        
        captions = [
            f"Reviewing core {w1} mechanisms and {w2} concepts.",
            f"Analyzing formal {w1} bounds across {w2} systems.",
            f"Demonstrating practical {w1} rules and {w2} cases.",
            f"Verifying {w1} calculations and {w2} outputs."
        ]
        
        step_ats = ["intro", "say1", "example", "tryIt"]
        steps = []
        for s_idx, (at_val, cap) in enumerate(zip(step_ats, captions)):
            assert len(cap) <= 75, f"Caption too long ({len(cap)}): {cap}"
            assert not any(ch.isdigit() for ch in cap), f"Caption contains digit: {cap}"
            assert cap.endswith("."), f"Caption must end with period: {cap}"
            
            steps.append({
                "at": at_val,
                "caption": cap,
                "max": 100,
                "bars": [
                    {"label": "Precision Metric", "value": 75 + s_idx * 5, "tone": "data" if s_idx == 0 else "ok"},
                    {"label": "Recall Coverage", "value": 70 + s_idx * 6, "tone": "data" if s_idx == 1 else "idle"},
                    {"label": "Operating Margin", "value": 65 + s_idx * 7, "tone": "ok" if s_idx >= 2 else "idle"},
                    {"label": "Decision Impact", "value": 80 + s_idx * 4, "tone": "ok" if s_idx == 3 else "idle"}
                ]
            })
            
        short_title = (part["title"][:38] + "...") if len(part["title"]) > 38 else part["title"]
        v_entry = {
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "bars",
                "title": f"{short_title} — Quantitative Evaluation",
                "steps": steps
            }
        }
        visual_entries.append(v_entry)
        print(f"  Part {p_idx + 1}: Output captured ({len(stdout)} chars), CodeHash: {code_hash[:8]}...")
        
    # Write Visual JSON File
    day_file_path = visuals_dir / f"day-{day_num:02d}.json"
    visual_payload = {
        "schemaVersion": 1,
        "prefix": "bcom_ana",
        "day": day_num,
        "entries": visual_entries
    }
    with open(day_file_path, "w", encoding="utf-8") as vf:
        json.dump(visual_payload, vf, indent=2)
    print(f"Saved visual file: {day_file_path.name}")

print("\nAll Block 3 visual files generated cleanly!")

# 2. Append Days 11 to 15 to bcomAnaLongLessons.ts
lessons_file = repo_root / "src" / "lib" / "data" / "bcomAnaLongLessons.ts"
with open(lessons_file, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 11 is already in content; if so cut from Day 11
day11_idx = content.find('"day": 11')
if day11_idx == -1:
    day11_idx = content.find('day: 11')

if day11_idx != -1:
    content = content[:day11_idx].rstrip()
    if content.endswith(','):
        content = content[:-1].rstrip()
    if not content.endswith('}'):
        last_brace = content.rfind('}')
        content = content[:last_brace+1]
    content = content + "\n];\n"

formatted_days = []
for d in days_to_assemble:
    # Set coursePrefix and ensure metadata
    d["coursePrefix"] = "bcom_ana"
    d.pop("month", None)
    for p in d["parts"]:
        chk = p["check"]
        if "scenario" in chk:
            chk["question"] = chk.pop("scenario")
        chk["answerIndex"] = chk.get("answer", 0)
        chk["why"] = chk.get("why", chk.get("explanation", ""))
    formatted_days.append(json.dumps(d, indent=2))

last_bracket_idx = content.rfind("];")
updated_content = content[:last_bracket_idx].rstrip() + ",\n" + ",\n".join(formatted_days) + "\n];\n"

with open(lessons_file, "w", encoding="utf-8") as f:
    f.write(updated_content)

print(f"Successfully appended Days 11-15 into {lessons_file.name}!")
