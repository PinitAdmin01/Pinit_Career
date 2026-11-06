import json

print("Reading iotSecLongLessons.ts...")
with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Part 1: Days 1-45
part1 = lines[:9979]

# Part 2: Days 46-55
part2 = lines[10914:12926]

# Part 3: Days 56-60 from clean JSON files
days_56_60 = []
for d in range(56, 61):
    with open(f'scripts/iot_sec_day{d}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        # Ensure projectStep has NO 'desc'
        if 'desc' in lesson.get('projectStep', {}):
            del lesson['projectStep']['desc']
        days_56_60.append(lesson)

# Convert Days 56-60 to formatted text
formatted_days = []
for l in days_56_60:
    formatted_days.append(json.dumps(l, indent=2, ensure_ascii=False))

part3_text = ",\n".join(formatted_days) + "\n];\n"

# Combine everything
full_text = "".join(part1) + "".join(part2) + part3_text

with open('src/lib/data/iotSecLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(full_text)

print("Successfully cleaned and rebuilt iotSecLongLessons.ts!")
