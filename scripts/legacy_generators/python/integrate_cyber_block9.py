# scripts/integrate_cyber_block9.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from cyber_day41_data import DAY_41_DATA
from cyber_day42_data import DAY_42_DATA
from cyber_day43_data import DAY_43_DATA
from cyber_day44_data import DAY_44_DATA
from cyber_day45_data import DAY_45_DATA

block9_days = [DAY_41_DATA, DAY_42_DATA, DAY_43_DATA, DAY_44_DATA, DAY_45_DATA]

file_path = "src/lib/data/cyberWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in cyberWebLongLessons.ts")

# Format block 9 days
formatted_days = []
for day in block9_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully integrated Block 9 (Days 41-45) into cyberWebLongLessons.ts!")
