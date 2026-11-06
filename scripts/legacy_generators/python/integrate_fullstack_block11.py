import sys
import json
sys.path.append('.')

from scripts.fullstack_day51_data import DAY_51
from scripts.fullstack_day52_data import DAY_52
from scripts.fullstack_day53_data import DAY_53
from scripts.fullstack_day54_data import DAY_54
from scripts.fullstack_day55_data import DAY_55

days = [DAY_51, DAY_52, DAY_53, DAY_54, DAY_55]

target_file = 'src/lib/data/fullstackJsLongLessons.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify day 50 is in file and day 51 is not
assert '"day": 50' in content, "Day 50 not found in file"
assert '"day": 51' not in content, "Day 51 already in file"

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

print(f"Successfully appended Days 51-55 to {target_file}!")
