import json

with open("scripts/block7_iot_net_all_days.json", "r", encoding="utf-8") as f:
    block7_days = json.load(f)

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    ts_text = f.read()

end_marker = "\n];\n"
if not ts_text.endswith(end_marker):
    end_marker = "];\n"

idx = ts_text.rfind(end_marker)
if idx == -1:
    raise ValueError("Could not find array end marker in TS file")

prefix = ts_text[:idx].rstrip()

# Format each day object as JSON
day_strings = []
for day in block7_days:
    # 2 space indent
    day_str = json.dumps(day, indent=2)
    day_strings.append(day_str)

appended = ",\n" + ",\n".join(day_strings) + "\n];\n"

full_ts = prefix + appended

with open("src/lib/data/iotNetLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(full_ts)

print(f"Successfully appended {len(block7_days)} days to src/lib/data/iotNetLongLessons.ts!")
