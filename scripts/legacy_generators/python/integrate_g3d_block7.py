import json
import sys
sys.path.insert(0, '.')

from scripts.g3d_day31_data import DAY_31 as day31
from scripts.g3d_day32_data import DAY_32 as day32
from scripts.g3d_day33_data import day33_data as day33
from scripts.g3d_day34_data import day34_data as day34
from scripts.g3d_day35_data import day35_data as day35

days = [day31, day32, day33, day34, day35]

# Read current g3dLongLessons.ts
target_file = 'src/lib/data/g3dLongLessons.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Assert target has ending
assert content.rstrip().endswith('];'), "File does not end with ];"

# Strip the trailing ];
prefix_content = content.rstrip()[:-2].rstrip()

appended_ts = []
for day in days:
    day_ts = json.dumps(day, indent=2)
    appended_ts.append(f",\n{day_ts}")

new_content = prefix_content + "".join(appended_ts) + "\n];\n"

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully integrated Days 31-35 into {target_file}!")
