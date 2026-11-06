# scripts/append_design_block9_to_lessons.py
import json
import sys

sys.path.insert(0, 'scripts')
from design_day41_data import DAY_41
from design_day42_data import DAY_42
from design_day43_data import DAY_43
from design_day44_data import DAY_44
from design_day45_data import DAY_45

DAYS = [DAY_41, DAY_42, DAY_43, DAY_44, DAY_45]

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

assert content.strip().endswith('];'), "File does not end with ];"
last_bracket_idx = content.rfind('];')

formatted_days = []
for day in DAYS:
    # Validate pedagogical invariants
    assert 'theme' not in day, f"Theme must not be in day {day['day']}"
    assert len(day['parts']) == 5, f"Day {day['day']} must have 5 parts"
    assert len(day['summary']) == 5, f"Day {day['day']} must have 5 summaries"
    assert len(day['projectStep']['steps']) >= 4, f"Day {day['day']} must have >= 4 project steps"
    
    for p in day['parts']:
        assert len(p['check']['options']) == 4, f"Check in {p['title']} must have 4 options"
        assert p['check']['answer'] == 0, f"Check answer must be 0 in {p['title']}"
        assert p['check']['answerIndex'] == 0, f"Check answerIndex must be 0 in {p['title']}"
        assert len(p['check']['why']) >= 50, f"Check explanation < 50 chars in {p['title']}"
        
    day_json = json.dumps(day, indent=2)
    indented = ",\n" + "\n".join("  " + line for line in day_json.splitlines())
    formatted_days.append(indented)

new_content = content[:last_bracket_idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Block 9 (Days 41-45) to designWebLongLessons.ts!")
