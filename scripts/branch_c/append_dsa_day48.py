import json

target_file = "src/lib/data/dsaWebLongLessons.ts"
lesson_file = "scripts/branch_c/day48_lesson.json"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

with open(lesson_file, "r", encoding="utf-8") as f:
    day48 = json.load(f)

# Convert day48 to json formatted string with indentation
day48_str = json.dumps(day48, indent=2)

# Indent by 2 spaces
indented_day48 = "\n".join("  " + line for line in day48_str.split("\n"))

rpos = content.rfind("\n];")
if rpos == -1:
    print("Could not find array end \\n];")
    exit(1)

new_content = content[:rpos] + ",\n" + indented_day48 + "\n];\n"

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended Day 48 to {target_file}")
