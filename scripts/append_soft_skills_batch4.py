import os
import json

def append_batch4():
    with open("scripts/soft_skills_days46_50_generated.json", "r", encoding="utf-8") as f:
        days_data = json.load(f)

    ts_path = "src/lib/data/softSkillsLongLessons.ts"
    with open(ts_path, "r", encoding="utf-8") as tf:
        ts_content = tf.read()

    if '"day": 46' in ts_content or 'day: 46' in ts_content:
        print("Days 46-50 already present in softSkillsLongLessons.ts; replacing tail...")
        idx46 = ts_content.find('{\n  "coursePrefix": "soft_skills",\n  "day": 46')
        if idx46 == -1:
            idx46 = ts_content.find('{\n    "day": 46')
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
    append_batch4()
