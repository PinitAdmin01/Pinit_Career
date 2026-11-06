import json

# 1. Fix Day 60 summary
with open('scripts/react_day60.json', 'r', encoding='utf-8') as f:
    d60 = json.load(f)

d60['summary'] = [
    "You have conquered Day 60 and completed Course 02 in its entirety!",
    "Over 60 intensive days, you evolved from core React component models into an elite Principal Full-Stack React Architect.",
    "Synthesized HyperGrid: a production-grade autonomous trading and edge streaming platform.",
    "Verified 10-vector SLA audit: sub-25ms static shell TTFB, 0.000 CLS, 120 FPS, and zero memory leaks.",
    "Passed automated chaos engineering disaster recovery failover under 50ms SLA.",
    "Conferred official credential: Distinguished Full-Stack React Architect (Summa Cum Laude)."
]

with open('scripts/react_day60.json', 'w', encoding='utf-8') as f:
    json.dump(d60, f, indent=2)

with open('scripts/react_day60_data.py', 'w', encoding='utf-8') as f:
    f.write(f"DAY_60 = {json.dumps(d60, indent=2)}\n")

print("Fixed Day 60 summary to list of strings!")

# 2. Fix react30DayData.ts title for Day 56
with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    r30 = f.read()

old_title = 'title: "Industrial Architecture Case Study 1: Large-Scale High-Frequency Trading Desk & Financial Telemetry"'
new_title = 'title: "Industrial Architecture Case Study 1: High-Frequency Trading Desk & Financial Telemetry"'

assert old_title in r30, "Old title not found in react30DayData.ts"
r30 = r30.replace(old_title, new_title, 1)

with open('src/lib/data/react30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(r30)

print("Fixed Day 56 title in react30DayData.ts!")

# 3. Patch Day 60 in reactLongLessons.ts
# Let's read reactLongLessons.ts, find where Day 56 begins, and re-append Days 56 to 60 cleanly.
with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    rll = f.read()

# Find the start of Day 56:
marker = '"day": 56,'
if marker not in rll:
    marker = 'day: 56,'

idx_d56 = rll.find(marker)
assert idx_d56 != -1, "Day 56 marker not found in reactLongLessons.ts"

# Trace backwards to find the opening brace `{` of Day 56 object
idx_brace = rll.rfind('{', 0, idx_d56)

# Truncate at idx_brace
clean_rll = rll[:idx_brace].rstrip().rstrip(',')

# Now append Days 56 to 60 cleanly
new_lessons = []
for d in range(56, 61):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        if 'desc' in lesson.get('projectStep', {}):
            del lesson['projectStep']['desc']
        new_lessons.append(lesson)

new_lessons_json = [json.dumps(l, indent=2) for l in new_lessons]
insertion = ",\n" + ",\n".join(new_lessons_json) + "\n];\n"

final_rll = clean_rll + insertion

with open('src/lib/data/reactLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(final_rll)

print("Re-appended Days 56-60 to reactLongLessons.ts successfully!")
