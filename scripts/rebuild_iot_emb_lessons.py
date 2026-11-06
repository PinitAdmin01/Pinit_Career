import json

with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the end of Day 50
# Looking around pos_json (1558227)
pos_json = text.find('{\n    "day": 51')
print("pos_json:", pos_json)

# Cut the file right after Day 50:
# The end of Day 50 is before pos_json:
# "lestone 9 Gate Verdict.\"\n      ]\n    }\n  }"
day50_end = text.rfind('  }', 0, pos_json)
print("day50_end:", day50_end)
print("Context at cut:")
print(text[day50_end-100:day50_end+50])

base_content = text[:day50_end+3]

# Now append Days 51 through 60 cleanly!
new_lessons = []
for d in range(51, 61):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
    new_lessons.append(lesson)

appended_ts = ""
for lesson in new_lessons:
    json_str = json.dumps(lesson, indent=2)
    lines = json_str.split('\n')
    indented = "\n".join("  " + l for l in lines)
    appended_ts += ",\n" + indented

final_ts = base_content + appended_ts + "\n];\n"

with open('src/lib/data/iotEmbLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(final_ts)

print("Successfully rebuilt src/lib/data/iotEmbLongLessons.ts with exactly Days 1 to 60!")
