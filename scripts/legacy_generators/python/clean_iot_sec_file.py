import json

with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Line 4678 was the closing },
clean_prefix_lines = lines[:4678]

# Load block5 days
with open("scripts/block5_iot_sec_all_days.json", "r", encoding="utf-8") as f:
    b5_days = json.load(f)

print(f"Loaded {len(b5_days)} days for Block 5 (Days 21-25)")

formatted_days = []
for d in b5_days:
    ts_day = json.dumps(d, indent=2, ensure_ascii=False)
    formatted_days.append(ts_day)

# Notice: clean_prefix_lines[-1] is "},\n", so we simply add "\n  " + ",\n  ".join(formatted_days) + "\n];\n"
addition = "\n  " + ",\n  ".join(formatted_days) + "\n];\n"
new_content = "".join(clean_prefix_lines) + addition

with open("src/lib/data/iotSecLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Rewrote src/lib/data/iotSecLongLessons.ts cleanly without double comma!")
