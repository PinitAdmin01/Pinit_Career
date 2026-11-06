import json

with open("scripts/day-46-data.json", "r", encoding="utf-8") as f:
    day46_data = json.load(f)

# Format day46 as pretty json string with indent
day46_str = json.dumps(day46_data, indent=2, ensure_ascii=False)
# Indent it by 2 spaces for array placement
indented_day46 = "\n".join("  " + line for line in day46_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Check if day 46 already present
if '"day": 46' in content or 'day: 46' in content:
    print("Day 46 is already present in iotNetLongLessons.ts!")
else:
    # Find the last closing bracket of array
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")
    
    # We want a comma before the new object
    new_content = content[:idx].rstrip() + ",\n" + indented_day46 + "\n];\n"
    with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Day 46 to src/lib/data/iotNetLongLessons.ts!")
