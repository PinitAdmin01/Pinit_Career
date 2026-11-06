# scripts/append_iot_net_days26_30.py
import json

print("=== APPENDING IOT_NET DAYS 26-30 TO iotNetLongLessons.ts ===")

with open("scripts/block6_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block6_days = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Verify that Days 26-30 are not already present
for d in range(26, 31):
    assert f'"day": {d}' not in content and f'day: {d}' not in content, f"Day {d} already in iotNetLongLessons.ts!"

# Find trailing "];"
strip_content = content.rstrip()
if strip_content.endswith("];"):
    base_content = strip_content[:-2].rstrip()
else:
    raise ValueError("File does not end with '];'")

appended_blocks = []
for day_obj in block6_days:
    day_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
    appended_blocks.append(day_str)

new_content = base_content + ",\n" + ",\n".join(appended_blocks) + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended {len(block6_days)} days (Days 26-30) to iotNetLongLessons.ts!")
