import json

for d in (54, 55):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for extra in ['course', 'track', 'declaredMinutes']:
        if extra in data:
            del data[extra]
    with open(f'scripts/react_day{d}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

# Now update reactLongLessons.ts
with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    rll_text = f.read()

idx51 = rll_text.find('"day": 51')
if idx51 != -1:
    comma_idx = rll_text.rfind(',', 0, idx51)
    rll_text = rll_text[:comma_idx] + '\n];\n'

new_lessons = []
for d in range(51, 56):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        for extra in ['course', 'track', 'declaredMinutes']:
            if extra in lesson:
                del lesson[extra]
        if 'desc' in lesson.get('projectStep', {}):
            del lesson['projectStep']['desc']
        for p in lesson['parts']:
            if 'id' in p:
                del p['id']
        new_lessons.append(lesson)

last_bracket_idx = rll_text.rfind('];')
new_lessons_json = [json.dumps(l, indent=2) for l in new_lessons]
insertion_text = ",\n" + ",\n".join(new_lessons_json) + "\n"
updated_rll_text = rll_text[:last_bracket_idx] + insertion_text + rll_text[last_bracket_idx:]

with open('src/lib/data/reactLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_rll_text)

print("Stripped extraneous properties from Days 54 and 55 in reactLongLessons.ts successfully!")
