import sys
import json
sys.path.append('.')

from scripts.fullstack_day36_data import DAY_36
from scripts.fullstack_day37_data import DAY_37
from scripts.fullstack_day38_data import DAY_38
from scripts.fullstack_day39_data import DAY_39
from scripts.fullstack_day40_data import DAY_40

days = [DAY_36, DAY_37, DAY_38, DAY_39, DAY_40]

target_file = 'src/lib/data/fullstackJsLongLessons.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify day 35 is in file and day 36 is not
assert '"day": 35' in content, "Day 35 not found in file"
assert '"day": 36' not in content, "Day 36 already in file"

# Find the last closing bracket of FULLSTACK_JS_LONG_LESSONS array
last_bracket_idx = content.rfind('];')
assert last_bracket_idx != -1, "Could not find closing ];"

# Format the 5 days as JSON
formatted_days = []
for d in days:
    day_json = json.dumps(d, indent=2)
    # Indent 2 spaces to match existing array style
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

print(f"Successfully appended Days 36-40 to {target_file}!")
