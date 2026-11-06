import os
import json
import hashlib

def compute_code_hash(code_str):
    return hashlib.sha256((code_str or '').encode("utf-8")).hexdigest()

def make_workflow_spec(part_title):
    stages = [
        {"id": "s1", "name": "Market Forensics", "subtext": "Valuation & Cap Tables", "tone": "data"},
        {"id": "s2", "name": "Strategic Anchoring", "subtext": "ZOPA & BATNA Leverage", "tone": "data"},
        {"id": "s3", "name": "Radical Candor", "subtext": "SBI & Mitigation Paths", "tone": "ok"},
        {"id": "s4", "name": "Executive Consensus", "subtext": "Closing Ratification", "tone": "ok"}
    ]

    steps = [
        {
            "at": "intro",
            "caption": f"Stage 1 (Market Forensics): Analyze {part_title[:45]}...",
            "activeStageId": "s1",
            "statusBadge": "INGRESS",
            "throughput": "100% Ready",
            "tone": "data",
            "stages": stages
        },
        {
            "at": "say1",
            "caption": "Stage 2 (Strategic Anchoring): Establish reservation price and ZOPA leverage.",
            "activeStageId": "s2",
            "statusBadge": "IN_PROGRESS",
            "throughput": "Active Flow",
            "tone": "data",
            "stages": stages
        },
        {
            "at": "example",
            "caption": "Stage 3 (Radical Candor): Structure Triple Option mitigation pathways.",
            "activeStageId": "s3",
            "statusBadge": "VALIDATED",
            "throughput": "High Signal",
            "tone": "ok",
            "stages": stages
        },
        {
            "at": "tryIt",
            "caption": "Stage 4 (Executive Consensus): Ratify mutual agreement and executive alignment.",
            "activeStageId": "s4",
            "statusBadge": "COMPLETED",
            "throughput": "Master Strategist ✓",
            "tone": "ok",
            "stages": stages
        }
    ]

    return {
        "template": "workflow",
        "title": f"{part_title[:45]}... — Operational Workflow",
        "stages": stages,
        "steps": steps
    }

def assemble():
    with open("scripts/soft_skills_days46_50_generated.json", "r", encoding="utf-8") as f:
        days_data = json.load(f)

    os.makedirs("src/lib/data/lessonVisuals/soft-skills", exist_ok=True)

    for d in days_data:
        day_num = d["day"]
        day_padded = f"day-{day_num}.json"
        entries = []
        for p_idx, p in enumerate(d["parts"], 1):
            c_hash = compute_code_hash(p["code"])
            spec = make_workflow_spec(p["title"])
            entries.append({
                "partTitle": p["title"],
                "codeHash": c_hash,
                "spec": spec,
                "filled": spec
            })

        day_file = {
            "schemaVersion": 1,
            "prefix": "soft-skills",
            "day": day_num,
            "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
            "model": "anthropic/claude-3.5-sonnet",
            "entries": entries
        }

        vis_path = f"src/lib/data/lessonVisuals/soft-skills/{day_padded}"
        with open(vis_path, "w", encoding="utf-8") as vf:
            json.dump(day_file, vf, indent=2, ensure_ascii=False)
        print(f"Wrote {vis_path}")

    ts_path = "src/lib/data/softSkillsLongLessons.ts"
    with open(ts_path, "r", encoding="utf-8") as tf:
        ts_content = tf.read()

    if '"day": 46' in ts_content or 'day: 46' in ts_content:
        print("Days 46-50 already present in softSkillsLongLessons.ts; replacing tail...")
        idx46 = ts_content.find('{\n  "coursePrefix": "soft_skills",\n  "day": 46')
        if idx46 == -1:
            idx46 = ts_content.find('{\n    "day": 46')
        if idx46 == -1:
            idx46 = ts_content.find('{\n  "day": 46')
        if idx46 != -1:
            ts_content = ts_content[:idx46].rstrip().rstrip(",") + "\n];\n"

    closing_idx = ts_content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing ]; in softSkillsLongLessons.ts")

    before = ts_content[:closing_idx].rstrip()
    if not before.endswith(","):
        before += ","

    serialized_days = []
    for d in days_data:
        serialized_days.append(json.dumps(d, indent=2, ensure_ascii=False))

    new_ts = before + "\n" + ",\n".join(serialized_days) + "\n];\n"
    with open(ts_path, "w", encoding="utf-8") as tf:
        tf.write(new_ts)
    print(f"Updated {ts_path} with Days 46-50 successfully.")

if __name__ == "__main__":
    assemble()
