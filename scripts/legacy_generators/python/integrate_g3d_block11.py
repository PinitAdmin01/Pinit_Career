import os
import json
import sys
sys.path.insert(0, '.')

from scripts.g3d_day51_data import DAY_51_DATA as day51
from scripts.g3d_day52_data import DAY_52_DATA as day52
from scripts.g3d_day53_data import DAY_53_DATA as day53
from scripts.g3d_day54_data import DAY_54_DATA as day54
from scripts.g3d_day55_data import DAY_55_DATA as day55

days = [day51, day52, day53, day54, day55]

target_file = os.path.join('src', 'lib', 'data', 'g3dLongLessons.ts')
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

assert content.rstrip().endswith('];'), "File does not end with ];"

prefix_content = content.rstrip()[:-2].rstrip()

appended_ts = []
for day in days:
    day_ts = json.dumps(day, indent=2)
    appended_ts.append(',\n' + day_ts)

new_content = prefix_content + ''.join(appended_ts) + '\n];\n'

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully integrated Days 51-55 into {target_file}!")
