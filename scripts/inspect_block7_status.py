import json

# 1. Check iotNetLongLessons.ts for Day 35 Part 5 output
with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's see what days are present
for day in [31, 32, 33, 34, 35]:
    target = f'"day": {day}'
    idx = text.find(target)
    print(f"Day {day} in ts file: {idx != -1}")

# 2. Check getVisual issue:
# In loadVisuals.ts:
# How does getVisual work?
with open("src/lib/visuals/loadVisuals.ts", "r", encoding="utf-8") as f:
    lv = f.read()
print("--- loadVisuals snippet ---")
print(lv[:600])
