import json
import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from design_day56_data import DAY_56
from design_day57_data import DAY_57
from design_day58_data import DAY_58
from design_day59_data import DAY_59
from design_day60_data import DAY_60

days = [DAY_56, DAY_57, DAY_58, DAY_59, DAY_60]

for d in days:
    assert isinstance(d['recap'], str), f"Day {d['day']} recap is not string!"
    assert 'theme' not in d, f"Day {d['day']} has theme property!"
    assert d['minutes'] == 25, f"Day {d['day']} minutes is not 25!"

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

r_idx = content.rfind('];')
assert r_idx != -1, "Could not find '];' in file"

formatted_entries = []
for d in days:
    formatted_entries.append(json.dumps(d, indent=2))

days_json_str = ',\n' + ',\n'.join(formatted_entries)

new_content = content[:r_idx].rstrip() + days_json_str + '\n];\n'

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Days 56-60 to designWebLongLessons.ts! Course 06 now has all 60 days!")
