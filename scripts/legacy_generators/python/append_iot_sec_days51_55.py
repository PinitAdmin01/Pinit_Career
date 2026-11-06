# scripts/append_iot_sec_days51_55.py
import json
import re

def append_days():
    with open("scripts/block11_iot_sec_all_days.json", "r", encoding="utf-8") as f:
        days = json.load(f)

    with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # Find the closing ];
    last_bracket_idx = content.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in iotSecLongLessons.ts")

    prefix_content = content[:last_bracket_idx].rstrip()

    # If the last character before closing is not a comma, add one
    if not prefix_content.endswith(","):
        prefix_content += ","

    formatted_days = []
    for d in days:
        ts_day = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(ts_day)

    new_content = prefix_content + "\n  " + ",\n  ".join(formatted_days) + "\n];\n"

    with open("src/lib/data/iotSecLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Successfully appended Days 51-55 to src/lib/data/iotSecLongLessons.ts!")

    # Verify
    with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
        verified_text = f.read()
    found_days = [int(x) for x in re.findall(r'"day":\s*(\d+)', verified_text)]
    print(f"Total days now in iotSecLongLessons.ts: {len(found_days)} (Range: {min(found_days)} to {max(found_days)})")

if __name__ == "__main__":
    append_days()
