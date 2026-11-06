import sys
import json
import re

sys.path.append('.')
from scripts.fullstack_day31_data import DAY_31
from scripts.fullstack_day32_data import DAY_32
from scripts.fullstack_day33_data import DAY_33
from scripts.fullstack_day34_data import DAY_34
from scripts.fullstack_day35_data import DAY_35

days = [DAY_31, DAY_32, DAY_33, DAY_34, DAY_35]

with open('src/lib/data/fullstackJsLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify day 30 is present
assert '"day": 30' in content or 'day: 30' in content, "Day 30 not found in fullstackJsLongLessons.ts"

# Verify days 31-35 not already present
for d in range(31, 36):
    assert f'"day": {d}' not in content and f'day: {d}' not in content, f"Day {d} already present!"

# Find the last `];`
last_bracket_idx = content.rfind('];')
assert last_bracket_idx != -1, "Closing bracket ]; not found!"

# Serialize Days 31-35 to clean JSON/JS object string
serialized_days = []
for d in days:
    serialized_days.append(json.dumps(d, indent=2))

days_joined = ',\n' + ',\n'.join(serialized_days) + '\n'

new_content = content[:last_bracket_idx].rstrip() + days_joined + '];\n'

with open('src/lib/data/fullstackJsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Days 31-35 to src/lib/data/fullstackJsLongLessons.ts!")
