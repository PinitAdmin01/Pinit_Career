# scripts/check_ts_block8.py
import json
import re

with open("scripts/block8_iot_sec_all_days.json", "r", encoding="utf-8") as f:
    verified_block8 = json.load(f)

with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    txt = f.read()

m = re.search(r'\{\s*[\'"]?day[\'"]?\s*:\s*36', txt)
if m:
    pos36 = m.start()
    print("Found Day 36 at pos:", pos36)
    # Everything before Day 36 is Days 1-35!
    clean_prefix = txt[:pos36].rstrip()
    if not clean_prefix.endswith(","):
        clean_prefix += ","
    
    formatted_days = []
    for d in verified_block8:
        ts_day = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(ts_day)
    
    new_ts_content = clean_prefix + "\n  " + ",\n  ".join(formatted_days) + "\n];\n"
    with open("src/lib/data/iotSecLongLessons.ts", "w", encoding="utf-8") as f:
        f.write(new_ts_content)
    print("Successfully replaced Days 36-40 with verified Block 8 in iotSecLongLessons.ts!")
else:
    print("Day 36 not found!")
