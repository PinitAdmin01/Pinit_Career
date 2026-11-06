# scripts/integrate_cyber_block8.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from cyber_day36_data import DAY_36_DATA
from cyber_day37_data import DAY_37_DATA
from cyber_day38_data import DAY_38_DATA
from cyber_day39_data import DAY_39_DATA
from cyber_day40_data import DAY_40_DATA

block8_days = [DAY_36_DATA, DAY_37_DATA, DAY_38_DATA, DAY_39_DATA, DAY_40_DATA]

file_path = "src/lib/data/cyberWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in cyberWebLongLessons.ts")

# Format block 8 days
formatted_days = []
for day in block8_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully integrated Block 8 (Days 36-40) into cyberWebLongLessons.ts!")
