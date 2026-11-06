import json
from design_day36_data import DAY_36
from design_day37_data import DAY_37
from design_day38_data import DAY_38
from design_day39_data import DAY_39
from design_day40_data import DAY_40

DAYS = [DAY_36, DAY_37, DAY_38, DAY_39, DAY_40]

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the closing ]; at the end of the file
assert content.strip().endswith('];'), "File does not end with ];"
last_bracket_idx = content.rfind('];')

# Format each day
formatted_days = []
for day in DAYS:
    # Ensure all options are lists of strings
    for p in day['parts']:
        assert len(p['check']['options']) == 4, f"Check in {p['title']} must have 4 options"
        assert p['check']['answer'] == 0, f"Check answer must be 0 in {p['title']}"
        assert p['check']['answerIndex'] == 0, f"Check answerIndex must be 0 in {p['title']}"
        assert len(p['check']['why']) >= 50, f"Check explanation < 50 chars in {p['title']}"
        
    day_json = json.dumps(day, indent=2)
    # indent by 2 spaces
    indented = ",\n" + "\n".join("  " + line for line in day_json.splitlines())
    formatted_days.append(indented)

new_content = content[:last_bracket_idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully appended Days 36-40 to designWebLongLessons.ts!")
