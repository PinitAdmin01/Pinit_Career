import json

with open("scripts/day-54-data.json", "r", encoding="utf-8") as f:
    day54_data = json.load(f)

day54_str = json.dumps(day54_data, indent=2, ensure_ascii=False)
indented_day54 = "\n".join("  " + line for line in day54_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find where Day 54 starts
day54_marker = '{\n    "day": 54,'
idx54 = content.find(day54_marker)
if idx54 == -1:
    day54_marker = '{\n  "day": 54,'
    idx54 = content.find(day54_marker)
if idx54 == -1:
    raise ValueError("Could not find Day 54 start in iotNetLongLessons.ts")

# Find the end of Day 54 object (right before the final `];\n`)
idx_end = content.rfind("];")
if idx_end == -1:
    raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")

new_content = content[:idx54].rstrip() + "\n" + indented_day54 + "\n];\n"
with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated Day 54 in src/lib/data/iotNetLongLessons.ts with summary property!")
