import sys
import json
sys.path.append('.')

from scripts.fullstack_day41_data import DAY_41
from scripts.fullstack_day42_data import DAY_42
from scripts.fullstack_day43_data import DAY_43
from scripts.fullstack_day44_data import DAY_44
from scripts.fullstack_day45_data import DAY_45

days = [DAY_41, DAY_42, DAY_43, DAY_44, DAY_45]

target_file = 'src/lib/data/fullstackJsLongLessons.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify day 40 is in file and day 41 is not
assert '"day": 40' in content, "Day 40 not found in file"
assert '"day": 41' not in content, "Day 41 already in file"

# Find the last closing bracket of FULLSTACK_JS_LONG_LESSONS array
last_bracket_idx = content.rfind('];')
assert last_bracket_idx != -1, "Could not find closing ];"

# Format the 5 days as JSON
formatted_days = []
for d in days:
    day_json = json.dumps(d, indent=2)
    indented = '\n'.join('  ' + line for line in day_json.splitlines())
    formatted_days.append(indented)

new_content = (
    content[:last_bracket_idx].rstrip()
    + ',\n'
    + ',\n'.join(formatted_days)
    + '\n];\n'
)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully appended Days 41-45 to {target_file}!")
