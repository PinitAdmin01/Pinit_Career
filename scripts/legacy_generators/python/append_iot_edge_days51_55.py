import json

# Load days 51-55
lessons = []
for day in range(51, 56):
    with open(f"scripts/iot_edge_day{day}.json", "r", encoding="utf-8") as f:
        lessons.append(json.load(f))

# Also save block11_all_days.json
with open("scripts/block11_all_days.json", "w", encoding="utf-8") as f:
    json.dump(lessons, f, indent=2)
print("Saved scripts/block11_all_days.json")

# Read existing iotEdgeLongLessons.ts
with open("src/lib/data/iotEdgeLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Locate the closing bracket `];` at the end of the array
closing_idx = ts_content.rfind("];")
if closing_idx == -1:
    raise ValueError("Could not find closing bracket in iotEdgeLongLessons.ts")

# Convert python dictionaries to clean JSON string, then format as TypeScript object literals
formatted_lessons = []
for lesson in lessons:
    # Serialize to JSON with 2 space indent
    raw_json = json.dumps(lesson, indent=2, ensure_ascii=False)
    # Indent entire object by 2 spaces
    indented_json = "\n".join("  " + line if line.strip() else "" for line in raw_json.splitlines())
    formatted_lessons.append(indented_json)

appended_ts = ",\n" + ",\n".join(formatted_lessons) + "\n"

# Insert before closing bracket
new_ts_content = ts_content[:closing_idx].rstrip() + appended_ts + "];\n"

with open("src/lib/data/iotEdgeLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print("Successfully appended Days 51-55 to src/lib/data/iotEdgeLongLessons.ts")
