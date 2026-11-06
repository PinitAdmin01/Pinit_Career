# scripts/integrate_dist_block8.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dist_day36_data import DAY_36_DATA
from dist_day37_data import DAY_37_DATA
from dist_day38_data import DAY_38_DATA
from dist_day39_data import DAY_39_DATA
from dist_day40_data import DAY_40_DATA

block8_days = [DAY_36_DATA, DAY_37_DATA, DAY_38_DATA, DAY_39_DATA, DAY_40_DATA]

file_path = "src/lib/data/distributedWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in distributedWebLongLessons.ts")

# Format block 8 days
formatted_days = []
for day in block8_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully integrated Block 8 (Days 36-40) into {file_path}!")
