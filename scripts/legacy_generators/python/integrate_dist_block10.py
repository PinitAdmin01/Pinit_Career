# scripts/integrate_dist_block10.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dist_day46_data import DAY_46_DATA
from dist_day47_data import DAY_47_DATA
from dist_day48_data import DAY_48_DATA
from dist_day49_data import DAY_49_DATA
from dist_day50_data import DAY_50_DATA

block10_days = [DAY_46_DATA, DAY_47_DATA, DAY_48_DATA, DAY_49_DATA, DAY_50_DATA]

file_path = "src/lib/data/distributedWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in distributedWebLongLessons.ts")

# Format block 10 days
formatted_days = []
for day in block10_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully integrated Block 10 (Days 46-50) into distributedWebLongLessons.ts!")
