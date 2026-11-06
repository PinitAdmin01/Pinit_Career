import json

target_file = "src/lib/data/dsaWebLongLessons.ts"
lesson_file = "scripts/branch_c/day35_lesson.json"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

with open(lesson_file, "r", encoding="utf-8") as f:
    day35 = json.load(f)

# Convert day35 to json formatted string with indentation
day35_str = json.dumps(day35, indent=2)

# Indent by 2 spaces
indented_day35 = "\n".join("  " + line for line in day35_str.split("\n"))

pos35 = content.find('  {\n    "day": 35')
if pos35 == -1:
    pos35 = content.find('    "day": 35')

# Find the end of day 35 (which is the end of array "\n];")
rpos = content.rfind("\n];")

new_content = content[:pos35] + indented_day35 + "\n];\n"

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully replaced Day 35 in {target_file}")
