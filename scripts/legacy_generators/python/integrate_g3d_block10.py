import json
import sys
sys.path.insert(0, '.')

from scripts.g3d_day46_data import DAY_46_DATA as day46
from scripts.g3d_day47_data import DAY_47_DATA as day47
from scripts.g3d_day48_data import DAY_48_DATA as day48
from scripts.g3d_day49_data import DAY_49_DATA as day49
from scripts.g3d_day50_data import DAY_50_DATA as day50

days = [day46, day47, day48, day49, day50]

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

print(f"Successfully integrated Days 46-50 into {target_file}!")
