comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    text = f.read()

# Find marker for Day 12
day12_marker = '\n{\n  "day": 12,'
pos = text.find(day12_marker)
if pos != -1:
    trimmed = text[:pos].rstrip()
    if trimmed.endswith(','):
        trimmed = trimmed[:-1]
    trimmed += "\n];\n"
    with open(comp_path, "w", encoding="utf-8") as f:
        f.write(trimmed)
    print("Reset compFundLongLessons.ts to Day 11 cleanly.")
else:
    print("Day 12 marker not found, file already trimmed or different structure.")
