import json
import re

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find where day 16 starts
idx16 = content.find('"day": 16')
if idx16 == -1:
    idx16 = content.find('day: 16')

print("Index of day 16:", idx16)

if idx16 != -1:
    # Walk backwards to find the opening '{' before day 16
    start_brace = content.rfind('{', 0, idx16)
    # And the comma before that
    comma_before = content.rfind(',', 0, start_brace)
    print("Slicing content at comma_before:", comma_before)
    base_content = content[:comma_before].rstrip()
else:
    # If not found, slice before trailing ];
    strip_content = content.rstrip()
    if strip_content.endswith("];"):
        base_content = strip_content[:-2].rstrip()
    else:
        raise ValueError("Cannot locate end")

with open("scripts/block4_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block4_days = json.load(f)

appended_blocks = []
for day_obj in block4_days:
    day_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
    appended_blocks.append(day_str)

new_content = base_content + ",\n" + ",\n".join(appended_blocks) + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully re-appended {len(block4_days)} days (Days 16-20) with checks to iotNetLongLessons.ts!")
