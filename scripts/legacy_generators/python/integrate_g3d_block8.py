import json
import sys
sys.path.insert(0, '.')

from scripts.g3d_day36_data import day36_data as day36
from scripts.g3d_day37_data import day37_data as day37
from scripts.g3d_day38_data import DAY_38_DATA as day38
from scripts.g3d_day39_data import DAY_39_DATA as day39
from scripts.g3d_day40_data import DAY_40_DATA as day40

days = [day36, day37, day38, day39, day40]

target_file = 'src/lib/data/g3dLongLessons.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

assert content.rstrip().endswith('];'), "File does not end with ];"

prefix_content = content.rstrip()[:-2].rstrip()

appended_ts = []
for day in days:
    day_ts = json.dumps(day, indent=2)
    appended_ts.append(f",\n{day_ts}")

new_content = prefix_content + "".join(appended_ts) + "\n];\n"

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully integrated Days 36-40 into {target_file}!")
