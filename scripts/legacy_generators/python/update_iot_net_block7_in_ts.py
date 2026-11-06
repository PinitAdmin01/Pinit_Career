import json

print("=== APPENDING IOT_NET BLOCK 7 (DAYS 31-35) IN iotNetLongLessons.ts ===")

with open("scripts/block7_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block7_days = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 31 is already present
idx31 = ts_content.find('"day": 31')
if idx31 != -1:
    idx31_brace = ts_content.rfind('{', 0, idx31)
    base_content = ts_content[:idx31_brace].rstrip()
    if base_content.endswith(','):
        base_content = base_content[:-1].rstrip()
else:
    # Find last occurrence of ];
    last_bracket = ts_content.rfind('];')
    base_content = ts_content[:last_bracket].rstrip()
    if base_content.endswith(','):
        base_content = base_content[:-1].rstrip()

appended_blocks = []
for day_obj in block7_days:
    day_str = json.dumps(day_obj, indent=2, ensure_ascii=False)
    appended_blocks.append(day_str)

new_content = base_content + ",\n" + ",\n".join(appended_blocks) + "\n];\n"

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully wrote Days 1-35 to iotNetLongLessons.ts ({len(block7_days)} days in Block 7)!")
