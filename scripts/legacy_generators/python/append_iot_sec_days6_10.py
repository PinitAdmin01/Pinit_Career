# scripts/append_iot_sec_days6_10.py
import json, re

def append_days():
    with open("scripts/block2_iot_sec_all_days.json", "r", encoding="utf-8") as f:
        days = json.load(f)

    with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # Find the closing ];
    last_bracket_idx = content.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in iotSecLongLessons.ts")

    prefix_content = content[:last_bracket_idx].rstrip()
    if not prefix_content.endswith(","):
        prefix_content += ","

    # Format days as TS objects
    formatted_days = []
    for d in days:
        ts_day = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(ts_day)

    addition = "\n  " + ",\n  ".join(formatted_days) + "\n];\n"
    new_content = prefix_content + addition

    with open("src/lib/data/iotSecLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Successfully appended Days 6-10 to src/lib/data/iotSecLongLessons.ts!")

append_days()
