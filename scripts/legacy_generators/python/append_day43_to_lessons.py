import json

with open("scripts/day-43-data.json", "r", encoding="utf-8") as f:
    day43_data = json.load(f)

# Format day43 as pretty json string with indent
day43_str = json.dumps(day43_data, indent=2, ensure_ascii=False)
# Indent it by 2 spaces for array placement
indented_day43 = "\n".join("  " + line for line in day43_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Check if day 43 already present
if '"day": 43' in content or 'day: 43' in content:
    print("Day 43 is already present in iotNetLongLessons.ts!")
else:
    # Find the last closing bracket of array
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")
    
    # We want a comma before the new object
    new_content = content[:idx].rstrip() + ",\n" + indented_day43 + "\n];\n"
    with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Day 43 to src/lib/data/iotNetLongLessons.ts!")
