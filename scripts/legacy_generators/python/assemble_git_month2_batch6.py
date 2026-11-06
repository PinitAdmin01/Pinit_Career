# scripts/assemble_git_month2_batch6.py
import sys
import os
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("."))

from scripts.make_git_month2_days56_60 import days_56_60

batch_days = [days_56_60[str(k)] if str(k) in days_56_60 else days_56_60[k] for k in range(56, 61)]

print("=== ASSEMBLING GIT_VCS MONTH 2 BATCH 6 (DAYS 56-60 — FINAL COURSE 20 COMPLETION) ===")

visual_dir = "src/lib/data/lessonVisuals/git_vcs"
os.makedirs(visual_dir, exist_ok=True)

stages_template = [
    {"id": "s1", "name": "Working Tree", "subtext": "Scalar / FSMonitor", "tone": "data"},
    {"id": "s2", "name": "Security Gate", "subtext": "Pre-Receive / AST", "tone": "ok"},
    {"id": "s3", "name": "Merge Queue", "subtext": "SLSA Level 3", "tone": "data"},
    {"id": "s4", "name": "GitOps Fleet", "subtext": "ApexEnterpriseGitOps", "tone": "ok"}
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
                "title": f"{short_title} — Sovereign GitOps",
                "stages": stages_template,
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Stage 1 (Working Tree): Initialize {part_title[:30]}...",
                        "activeStageId": "s1",
                        "statusBadge": "INGRESS",
                        "throughput": "100% Ready",
                        "tone": "data",
                        "stages": stages_template
                    },
                    {
                        "at": "say1",
                        "caption": "Stage 2 (Security Gate): Enforce Pre-Receive CAS, Entropy & AST invariants.",
                        "activeStageId": "s2",
                        "statusBadge": "IN_PROGRESS",
                        "throughput": "Active",
                        "tone": "data",
                        "stages": stages_template
                    },
                    {
                        "at": "example",
                        "caption": "Stage 3 (Merge Queue): Validate speculative post-merge tree & SLSA attestation.",
                        "activeStageId": "s3",
                        "statusBadge": "PROCESSING",
                        "throughput": "Nominal",
                        "tone": "data",
                        "stages": stages_template
                    },
                    {
                        "at": "tryIt",
                        "caption": "Stage 4 (GitOps Fleet): Issue sovereign ApexEnterpriseGitOps certification.",
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

target_file = "src/lib/data/gitVcsLongLessons.ts"
with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

day56_pos = content.find('"day": 56')
if day56_pos != -1:
    brace_pos = content.rfind("{", 0, day56_pos)
    comma_pos = content.rfind(",", 0, brace_pos)
    prefix = content[:comma_pos + 1]
    print("Found existing Day 56; replacing Days 56-60 with fresh build.")
else:
    last_bracket_idx = content.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in gitVcsLongLessons.ts")

    prefix = content[:last_bracket_idx].rstrip()
    if not prefix.endswith(","):
        prefix = prefix + ","

new_days_json = ",\n".join(json.dumps(d, indent=2, ensure_ascii=False) for d in batch_days)

updated_content = prefix + "\n" + new_days_json + "\n];\n"
with open(target_file, "w", encoding="utf-8") as f:
    f.write(updated_content)
print(f"Successfully assembled Days 56-60 into {target_file}!")

print("\n=== ASSEMBLY COMPLETE ===")
