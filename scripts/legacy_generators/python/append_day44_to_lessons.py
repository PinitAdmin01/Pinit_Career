import json

with open("scripts/day-44-data.json", "r", encoding="utf-8") as f:
    day44_data = json.load(f)

# Format day44 as pretty json string with indent
day44_str = json.dumps(day44_data, indent=2, ensure_ascii=False)
# Indent it by 2 spaces for array placement
indented_day44 = "\n".join("  " + line for line in day44_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Check if day 44 already present
if '"day": 44' in content or 'day: 44' in content:
    print("Day 44 is already present in iotNetLongLessons.ts!")
else:
    # Find the last closing bracket of array
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")
    
    # We want a comma before the new object
    new_content = content[:idx].rstrip() + ",\n" + indented_day44 + "\n];\n"
    with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Day 44 to src/lib/data/iotNetLongLessons.ts!")
