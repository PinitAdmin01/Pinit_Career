import json

print("=== REPLACING IOT_NET BLOCK 6 IN iotNetLongLessons.ts ===")

with open("scripts/block6_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block6_days = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

idx26 = ts_content.find('{\n  "day": 26,\n  "coursePrefix": "iot_net"')
if idx26 == -1:
    idx26 = ts_content.find('"day": 26')
    idx26 = ts_content.rfind('{', 0, idx26)

base_1_25 = ts_content[:idx26].rstrip()
if base_1_25.endswith(','):
    base_1_25 = base_1_25[:-1].rstrip()

appended_blocks = []
for day_obj in block6_days:
    day_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
    appended_blocks.append(day_str)

new_content = base_1_25 + ",\n" + ",\n".join(appended_blocks) + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully wrote Days 1-30 to iotNetLongLessons.ts ({len(block6_days)} days in Block 6)!")
