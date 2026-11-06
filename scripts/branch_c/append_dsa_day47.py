import json

target_file = "src/lib/data/dsaWebLongLessons.ts"
lesson_file = "scripts/branch_c/day47_lesson.json"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

with open(lesson_file, "r", encoding="utf-8") as f:
    day47 = json.load(f)

# Convert day47 to json formatted string with indentation
day47_str = json.dumps(day47, indent=2)

# Indent by 2 spaces
indented_day47 = "\n".join("  " + line for line in day47_str.split("\n"))

rpos = content.rfind("\n];")
if rpos == -1:
    print("Could not find array end \\n];")
    exit(1)

new_content = content[:rpos] + ",\n" + indented_day47 + "\n];\n"

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended Day 47 to {target_file}")
