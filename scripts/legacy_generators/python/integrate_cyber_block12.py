# scripts/integrate_cyber_block12.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from cyber_day56_data import DAY_56_DATA
from cyber_day57_data import DAY_57_DATA
from cyber_day58_data import DAY_58_DATA
from cyber_day59_data import DAY_59_DATA
from cyber_day60_data import DAY_60_DATA

block12_days = [DAY_56_DATA, DAY_57_DATA, DAY_58_DATA, DAY_59_DATA, DAY_60_DATA]

file_path = "src/lib/data/cyberWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in cyberWebLongLessons.ts")

# Format block 12 days
formatted_days = []
for day in block12_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully integrated Block 12 (Days 56-60) into cyberWebLongLessons.ts!")
