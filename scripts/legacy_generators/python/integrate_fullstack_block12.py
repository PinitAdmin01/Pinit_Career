import sys
import json
sys.path.append('.')

from scripts.fullstack_day56_data import DAY_56
from scripts.fullstack_day57_data import DAY_57
from scripts.fullstack_day58_data import DAY_58
from scripts.fullstack_day59_data import DAY_59
from scripts.fullstack_day60_data import DAY_60

days = [DAY_56, DAY_57, DAY_58, DAY_59, DAY_60]

target_file = 'src/lib/data/fullstackJsLongLessons.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify day 55 is in file and day 56 is not
assert '"day": 55' in content, "Day 55 not found in file"
assert '"day": 56' not in content, "Day 56 already in file"

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

print(f"Successfully appended Days 56-60 to {target_file}!")
