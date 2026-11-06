# scripts/append_day60_to_lessons.py
import json

with open("scripts/day-60-data.json", "r", encoding="utf-8") as f:
    day60_data = json.load(f)

# Format day60 as pretty json string with indent
day60_str = json.dumps(day60_data, indent=2, ensure_ascii=False)
# Indent it by 2 spaces for array placement
indented_day60 = "\n".join("  " + line for line in day60_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Check if day 60 already present
if '"day": 60' in content or 'day: 60' in content:
    print("Day 60 is already present in iotNetLongLessons.ts!")
else:
    # Find the last closing bracket of array
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")
    
    # We want a comma before the new object
    new_content = content[:idx].rstrip() + ",\n" + indented_day60 + "\n];\n"
    with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Day 60 to src/lib/data/iotNetLongLessons.ts!")
