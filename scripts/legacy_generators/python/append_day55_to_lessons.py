import json

with open("scripts/day-55-data.json", "r", encoding="utf-8") as f:
    day55_data = json.load(f)

# Format day55 as pretty json string with indent
day55_str = json.dumps(day55_data, indent=2, ensure_ascii=False)
# Indent it by 2 spaces for array placement
indented_day55 = "\n".join("  " + line for line in day55_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Check if day 55 already present
if '"day": 55' in content or 'day: 55' in content:
    print("Day 55 is already present in iotNetLongLessons.ts!")
else:
    # Find the last closing bracket of array
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")
    
    # We want a comma before the new object
    new_content = content[:idx].rstrip() + ",\n" + indented_day55 + "\n];\n"
    with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Day 55 to src/lib/data/iotNetLongLessons.ts!")
