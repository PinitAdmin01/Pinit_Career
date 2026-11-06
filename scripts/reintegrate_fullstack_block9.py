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

# Find where day 41 starts
day41_marker = '    "coursePrefix": "fullstack-js",\n    "day": 41,'
marker_idx = content.find(day41_marker)
assert marker_idx != -1, "Day 41 marker not found"

# Find opening brace of day 41 object
open_brace_idx = content.rfind('{\n', 0, marker_idx)
assert open_brace_idx != -1, "Opening brace of day 41 not found"

# Format the 5 days as JSON
formatted_days = []
for d in days:
    day_json = json.dumps(d, indent=2)
    indented = '\n'.join('  ' + line for line in day_json.splitlines())
    formatted_days.append(indented)

# Content up to before day 41
base_content = content[:open_brace_idx].rstrip()

new_content = (
    base_content + '\n'
    + ',\n'.join(formatted_days)
    + '\n];\n'
)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully re-integrated updated Days 41-45 into {target_file}!")
