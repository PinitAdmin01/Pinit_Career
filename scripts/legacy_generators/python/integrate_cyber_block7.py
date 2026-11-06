# scripts/integrate_cyber_block7.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from cyber_day31_data import DAY_31_DATA
from cyber_day32_data import DAY_32_DATA
from cyber_day33_data import DAY_33_DATA
from cyber_day34_data import DAY_34_DATA
from cyber_day35_data import DAY_35_DATA

block7_days = [DAY_31_DATA, DAY_32_DATA, DAY_33_DATA, DAY_34_DATA, DAY_35_DATA]

file_path = "src/lib/data/cyberWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in cyberWebLongLessons.ts")

# Format block 7 days
formatted_days = []
for day in block7_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully integrated Block 7 (Days 31-35) into cyberWebLongLessons.ts!")
