import os
import sys
import json
import hashlib

sys.path.insert(0, os.path.dirname(__file__))

from make_soft_skills_day06 import get_day_06
from make_soft_skills_day07 import get_day_07
from make_soft_skills_day08 import get_day_08
from make_soft_skills_day09 import get_day_09
from make_soft_skills_day10 import get_day_10

def generate_visual_json(day_obj):
    day_num = day_obj["day"]
    entries = []
    stages = [
        {"id": "s1", "name": "Context Framing", "subtext": "Stakeholder Goal", "tone": "data"},
        {"id": "s2", "name": "Structured Thesis", "subtext": "BLUF / Pyramid", "tone": "data"},
        {"id": "s3", "name": "Objection Defense", "subtext": "Data-Backed", "tone": "ok"},
        {"id": "s4", "name": "Executive Alignment", "subtext": "Action Plan", "tone": "ok"}
    ]
    
    for part in day_obj["parts"]:
        title = part["title"]
        code = part["code"]
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        
        spec = {
            "template": "workflow",
            "title": f"{title[:45]}... — Operational Workflow",
            "stages": stages,
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Stage 1 (Context Framing): Initialize {title[:40]}...",
                    "activeStageId": "s1",
                    "statusBadge": "INGRESS",
                    "throughput": "100% Ready",
                    "tone": "data",
                    "stages": stages
                },
                {
                    "at": "say1",
                    "caption": "Stage 2 (Structured Thesis): Process core communication model.",
                    "activeStageId": "s2",
                    "statusBadge": "IN_PROGRESS",
                    "throughput": "Active",
                    "tone": "data",
                    "stages": stages
                },
                {
                    "at": "example",
                    "caption": "Stage 3 (Objection Defense): Verify high-trust invariants.",
                    "activeStageId": "s3",
                    "statusBadge": "VALIDATED",
                    "throughput": "Zero Friction",
                    "tone": "ok",
                    "stages": stages
                },
                {
                    "at": "tryIt",
                    "caption": "Stage 4 (Executive Alignment): Commit collaborative action plan.",
                    "activeStageId": "s4",
                    "statusBadge": "COMPLETED",
                    "throughput": "Alignment Met ✓",
                    "tone": "ok",
                    "stages": stages
                }
            ]
        }
        
        entries.append({
            "partTitle": title,
            "codeHash": code_hash,
            "spec": spec,
            "filled": spec
        })
        
    v_dict = {
        "schemaVersion": 1,
        "prefix": "soft-skills",
        "day": day_num,
        "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }
    
    dir_path = "src/lib/data/lessonVisuals/soft-skills"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, f"day-{day_num:02d}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(v_dict, f, indent=2, ensure_ascii=False)
    print(f"Generated Visual JSON: {file_path}")

def append_days():
    days = [get_day_06(), get_day_07(), get_day_08(), get_day_09(), get_day_10()]
    
    # Generate visual JSON files
    for d in days:
        generate_visual_json(d)
        
    target_ts = "src/lib/data/softSkillsLongLessons.ts"
    with open(target_ts, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    # Check if Day 6 is already in ts_content; if so, strip from Day 6 onwards
    for day_num in range(6, 11):
        for pattern in [f"day: {day_num}", f'"day": {day_num}']:
            pos = ts_content.rfind(f"{{\n    {pattern}")
            if pos == -1:
                pos = ts_content.rfind(f"{{\n  {pattern}")
            if pos != -1:
                ts_content = ts_content[:pos].rstrip().rstrip(",") + "\n];\n"
                break
                
    idx = ts_content.rfind("];")
    if idx == -1:
        raise RuntimeError(f"Could not find closing bracket in {target_ts}")
        
    new_days_json = ",\n".join(json.dumps(d, indent=2, ensure_ascii=False) for d in days)
    
    prefix = ts_content[:idx].rstrip()
    if prefix.endswith("["):
        new_ts = prefix + "\n" + new_days_json + "\n];\n"
    else:
        new_ts = prefix + ",\n" + new_days_json + "\n];\n"
        
    with open(target_ts, "w", encoding="utf-8") as f:
        f.write(new_ts)
        
    print(f"Successfully appended Days 6-10 to {target_ts}!")

if __name__ == "__main__":
    append_days()
