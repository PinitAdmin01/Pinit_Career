# scripts/assemble_git_month2_batch3.py
import sys
import os
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

from scripts.make_git_month2_days41_45 import (
    day41_lesson,
    day42_lesson,
    day43_lesson,
    day44_lesson,
    day45_lesson
)

batch_days = [day41_lesson, day42_lesson, day43_lesson, day44_lesson, day45_lesson]

print("=== ASSEMBLING GIT_VCS MONTH 2 BATCH 3 (DAYS 41-45) ===")

visual_dir = "src/lib/data/lessonVisuals/git_vcs"
os.makedirs(visual_dir, exist_ok=True)

stages_template = [
    {"id": "s1", "name": "Working Tree", "subtext": "git add", "tone": "data"},
    {"id": "s2", "name": "Staging Index", "subtext": "git commit -S", "tone": "ok"},
    {"id": "s3", "name": "Feature Branch", "subtext": "Security Gate", "tone": "data"},
    {"id": "s4", "name": "Mainline CI", "subtext": "ApexAudit Seal", "tone": "ok"}
]

for d in batch_days:
    day_num = d["day"]
    d["minutes"] = 30
    
    # Standardize codeNotes to { line: N, note: "..." }
    for p in d["parts"]:
        if "codeNotes" in p and isinstance(p["codeNotes"], list):
            new_notes = []
            for idx, note in enumerate(p["codeNotes"]):
                if isinstance(note, str):
                    new_notes.append({"line": idx + 1, "note": note})
                else:
                    new_notes.append(note)
            p["codeNotes"] = new_notes

    # Build visual json
    entries = []
    for part in d["parts"]:
        code_str = part["code"]
        code_hash = hashlib.sha256(code_str.encode("utf-8")).hexdigest()
        part_title = part["title"]
        short_title = part_title[:45] + "..." if len(part_title) > 45 else part_title
        
        entry = {
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": {
                "template": "workflow",
                "title": f"{short_title} — Cryptographic Audit Workflow",
                "stages": stages_template,
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Stage 1 (Working Tree): Inspect {part_title[:30]}...",
                        "activeStageId": "s1",
                        "statusBadge": "INGRESS",
                        "throughput": "100% Ready",
                        "tone": "data",
                        "stages": stages_template
                    },
                    {
                        "at": "say1",
                        "caption": "Stage 2 (Staging Index): Execute cryptographic signing / entropy scan.",
                        "activeStageId": "s2",
                        "statusBadge": "IN_PROGRESS",
                        "throughput": "Active",
                        "tone": "data",
                        "stages": stages_template
                    },
                    {
                        "at": "example",
                        "caption": "Stage 3 (Feature Branch): Validate Merkle tree and secret elimination.",
                        "activeStageId": "s3",
                        "statusBadge": "PROCESSING",
                        "throughput": "Nominal",
                        "tone": "data",
                        "stages": stages_template
                    },
                    {
                        "at": "tryIt",
                        "caption": "Stage 4 (Mainline CI): Complete sovereign audit seal certification.",
                        "activeStageId": "s4",
                        "statusBadge": "VERIFIED",
                        "throughput": "Complete",
                        "tone": "ok",
                        "stages": stages_template
                    }
                ]
            }
        }
        entries.append(entry)

    visual_doc = {
        "schemaVersion": 1,
        "prefix": "git_vcs",
        "day": day_num,
        "promptSha": hashlib.sha256(d["title"].encode("utf-8")).hexdigest(),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }

    visual_path = os.path.join(visual_dir, f"day-{day_num}.json")
    with open(visual_path, "w", encoding="utf-8") as f:
        json.dump(visual_doc, f, indent=2, ensure_ascii=False)
    print(f"Wrote visual spec: {visual_path} (entries: {len(entries)})")

# Now append/update in src/lib/data/gitVcsLongLessons.ts
target_file = "src/lib/data/gitVcsLongLessons.ts"
with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 41 is already present, and truncate back to before Day 41
day41_pos = content.find('"day": 41')
if day41_pos != -1:
    brace_pos = content.rfind("{", 0, day41_pos)
    comma_pos = content.rfind(",", 0, brace_pos)
    prefix = content[:comma_pos + 1]
    print("Found existing Day 41; replacing Days 41-45 with fresh build.")
else:
    last_bracket_idx = content.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in gitVcsLongLessons.ts")

    prefix = content[:last_bracket_idx].rstrip()
    if not prefix.endswith(","):
        prefix = prefix + ","

# Format the new days as JSON objects
new_days_json = ",\n".join(json.dumps(d, indent=2, ensure_ascii=False) for d in batch_days)

updated_content = prefix + "\n" + new_days_json + "\n];\n"
with open(target_file, "w", encoding="utf-8") as f:
    f.write(updated_content)
print(f"Successfully assembled Days 41-45 into {target_file}!")

print("\n=== ASSEMBLY COMPLETE ===")
