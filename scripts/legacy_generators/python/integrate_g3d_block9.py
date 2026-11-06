import json
import sys
sys.path.insert(0, '.')

from scripts.g3d_day41_data import DAY_41_DATA as day41
from scripts.g3d_day42_data import DAY_42_DATA as day42
from scripts.g3d_day43_data import DAY_43_DATA as day43
from scripts.g3d_day44_data import DAY_44_DATA as day44
from scripts.g3d_day45_data import DAY_45_DATA as day45

days = [day41, day42, day43, day44, day45]

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

print(f"Successfully integrated Days 41-45 into {target_file}!")
