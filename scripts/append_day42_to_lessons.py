import json

with open("scripts/day-42-data.json", "r", encoding="utf-8") as f:
    day42_data = json.load(f)

# Format day42 as pretty json string with indent
day42_str = json.dumps(day42_data, indent=2, ensure_ascii=False)
# Indent it by 2 spaces for array placement
indented_day42 = "\n".join("  " + line for line in day42_str.split("\n"))

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Check if day 42 already present
if '"day": 42' in content or 'day: 42' in content:
    print("Day 42 is already present in iotNetLongLessons.ts!")
else:
    # Find the last closing bracket of array
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in iotNetLongLessons.ts")
    
    # We want a comma before the new object
    new_content = content[:idx].rstrip() + ",\n" + indented_day42 + "\n];\n"
    with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Day 42 to src/lib/data/iotNetLongLessons.ts!")
