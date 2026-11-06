import json
import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from design_day51_data import DAY_51
from design_day52_data import DAY_52
from design_day53_data import DAY_53
from design_day54_data import DAY_54
from design_day55_data import DAY_55

days = [DAY_51, DAY_52, DAY_53, DAY_54, DAY_55]

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

print("Successfully appended Days 51-55 to designWebLongLessons.ts!")
