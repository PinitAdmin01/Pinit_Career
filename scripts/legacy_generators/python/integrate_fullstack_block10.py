import sys
import json
sys.path.append('.')

from scripts.fullstack_day46_data import DAY_46
from scripts.fullstack_day47_data import DAY_47
from scripts.fullstack_day48_data import DAY_48
from scripts.fullstack_day49_data import DAY_49
from scripts.fullstack_day50_data import DAY_50

days = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]

target_file = 'src/lib/data/fullstackJsLongLessons.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify day 45 is in file and day 46 is not
assert '"day": 45' in content, "Day 45 not found in file"
assert '"day": 46' not in content, "Day 46 already in file"

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

print(f"Successfully appended Days 46-50 to {target_file}!")
