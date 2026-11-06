import json

target_file = "src/lib/data/dsaWebLongLessons.ts"
lesson_file = "scripts/branch_c/day45_lesson.json"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

with open(lesson_file, "r", encoding="utf-8") as f:
    day45 = json.load(f)

# Convert day45 to json formatted string with indentation
day45_str = json.dumps(day45, indent=2)

# Indent by 2 spaces
indented_day45 = "\n".join("  " + line for line in day45_str.split("\n"))

rpos = content.rfind("\n];")
if rpos == -1:
    print("Could not find array end \\n];")
    exit(1)

new_content = content[:rpos] + ",\n" + indented_day45 + "\n];\n"

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended Day 45 to {target_file}")
