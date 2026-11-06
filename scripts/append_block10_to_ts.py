import json
import sys

sys.path.insert(0, 'scripts')
from design_day46_data import DAY_46
from design_day47_data import DAY_47
from design_day48_data import DAY_48
from design_day49_data import DAY_49
from design_day50_data import DAY_50

days = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]

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

print("Successfully appended Days 46-50 to designWebLongLessons.ts!")
