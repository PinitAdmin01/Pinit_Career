import os
import json

def append_batch6():
    with open("scripts/soft_skills_days56_60_generated.json", "r", encoding="utf-8") as f:
        days_data = json.load(f)

    ts_path = "src/lib/data/softSkillsLongLessons.ts"
    with open(ts_path, "r", encoding="utf-8") as tf:
        ts_content = tf.read()

    if '"day": 56' in ts_content or 'day: 56' in ts_content:
        print("Days 56-60 already present in softSkillsLongLessons.ts; replacing tail...")
        idx56 = ts_content.find('{\n  "coursePrefix": "soft_skills",\n  "day": 56')
        if idx56 == -1:
            idx56 = ts_content.find('{\n    "day": 56')
        if idx56 != -1:
            ts_content = ts_content[:idx56].rstrip().rstrip(",") + "\n];\n"

    closing_idx = ts_content.rfind("];")
    if closing_idx == -1:
        raise RuntimeError("Could not find closing ]; in softSkillsLongLessons.ts")

    before = ts_content[:closing_idx].rstrip()
    if not before.endswith(","):
        before += ","

    serialized_days = []
    for d in days_data:
        serialized_days.append(json.dumps(d, indent=2))

    insertion = "\n" + ",\n".join(serialized_days) + "\n"
    after = ts_content[closing_idx:]

    new_content = before + insertion + after

    with open(ts_path, "w", encoding="utf-8") as tf:
        tf.write(new_content)

    print(f"Appended Days 56-60 to {ts_path} successfully!")

if __name__ == "__main__":
    append_batch6()
