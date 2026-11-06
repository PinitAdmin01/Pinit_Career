# scripts/regenerate_scrm_visuals.py
import json
import hashlib
from pathlib import Path

repo_root = Path.cwd()
visuals_dir = repo_root / "src" / "lib" / "data" / "lessonVisuals" / "bcom_scrm"

STEP_CAPTIONS = [
    {
        "at": "intro",
        "caption": "Analyzing inbound lead volume across target enterprise accounts.",
        "stage": "top"
    },
    {
        "at": "say1",
        "caption": "Evaluating qualification metrics and account compatibility bounds.",
        "stage": "qual"
    },
    {
        "at": "example",
        "caption": "Tracking multi-touch sales cadence and product telemetry flows.",
        "stage": "target"
    },
    {
        "at": "tryIt",
        "caption": "Optimizing contract velocity and final closed retention yield.",
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

for day_num in [31, 32, 33, 34, 35]:
    vis_file = visuals_dir / f"day-{day_num}.json"
    with open(vis_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    for entry in data["entries"]:
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
        entry["spec"]["steps"] = steps
        
    with open(vis_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Updated visuals for Day {day_num}")

print("All Block 7 visuals updated successfully!")
