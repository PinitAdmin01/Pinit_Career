import json

print("=== REPLACING IOT_NET BLOCK 5 IN iotNetLongLessons.ts ===")

with open("scripts/block5_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block5_days = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

idx21 = ts_content.find('{\n  "coursePrefix": "iot_net",\n  "day": 21')
if idx21 == -1:
    idx21 = ts_content.find('"day": 21')
    idx21 = ts_content.rfind('{', 0, idx21)

base_1_20 = ts_content[:idx21].rstrip()
if base_1_20.endswith(','):
    base_1_20 = base_1_20[:-1].rstrip()

appended_blocks = []
for day_obj in block5_days:
    day_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
    appended_blocks.append(day_str)

new_content = base_1_20 + ",\n" + ",\n".join(appended_blocks) + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully wrote Days 1-25 to iotNetLongLessons.ts ({len(block5_days)} days in Block 5)!")
