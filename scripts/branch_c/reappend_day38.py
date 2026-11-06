import json

target_file = "src/lib/data/dsaWebLongLessons.ts"
lesson_file = "scripts/branch_c/day38_lesson.json"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

with open(lesson_file, "r", encoding="utf-8") as f:
    day38 = json.load(f)

# Find where day 37 ends and day 38 starts
# Day 38 was appended right after day 37
pos = content.rfind('"day": 38')
if pos != -1:
    # Find the preceding "  {\n" or ",\n  {\n"
    comma_pos = content.rfind(",\n  {\n", 0, pos)
    if comma_pos != -1:
        content = content[:comma_pos] + "\n];\n"

# Now re-append day 38
day38_str = json.dumps(day38, indent=2)
indented_day38 = "\n".join("  " + line for line in day38_str.split("\n"))

rpos = content.rfind("\n];")
if rpos == -1:
    print("Could not find array end \\n];")
    exit(1)

new_content = content[:rpos] + ",\n" + indented_day38 + "\n];\n"

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully re-appended Day 38 with coursePrefix and minutes.")
