# scripts/append_iot_net_days11_15.py
import json

print("=== APPENDING IOT_NET DAYS 11-15 TO iotNetLongLessons.ts ===")

with open("scripts/block3_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block3_days = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Verify that Days 11-15 are not already present
for d in range(11, 16):
    assert f'"day": {d}' not in content and f'day: {d}' not in content, f"Day {d} already in iotNetLongLessons.ts!"

# Find trailing "];"
strip_content = content.rstrip()
if strip_content.endswith("];"):
    base_content = strip_content[:-2].rstrip()
else:
    raise ValueError("File does not end with '];'")

# Format block 3 days into TypeScript/JSON objects
appended_blocks = []
for day_obj in block3_days:
    day_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
    appended_blocks.append(day_str)

new_content = base_content + ",\n" + ",\n".join(appended_blocks) + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended {len(block3_days)} days (Days 11-15) to iotNetLongLessons.ts!")
