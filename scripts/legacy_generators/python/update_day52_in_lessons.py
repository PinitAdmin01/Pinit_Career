import json

with open("scripts/day-52-data.json", "r", encoding="utf-8") as f:
    day52_data = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# We need to replace the day 52 object in the array
# Let's find `"day": 52`
d52_idx = content.find('"day": 52')
if d52_idx == -1:
    raise ValueError("Day 52 not found in iotNetLongLessons.ts")

# Find the start of the object: scan backward from d52_idx for '{'
brace_start = content.rfind("{", 0, d52_idx)

# Find the end of the day 52 object: it ends before the array closing '];'
# Since day 52 is the last item in the array, it goes up to '];'
closing_idx = content.rfind("];")

# Check if there is anything after day 52 before '];'
after_d52 = content[d52_idx:closing_idx]
brace_end = content.rfind("}", 0, closing_idx) + 1

day52_str = json.dumps(day52_data, indent=2, ensure_ascii=False)
indented_day52 = "\n".join("  " + line for line in day52_str.split("\n"))

new_content = content[:brace_start] + indented_day52 + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated Day 52 in src/lib/data/iotNetLongLessons.ts successfully.")
