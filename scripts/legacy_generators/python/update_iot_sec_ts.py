import json

with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Find where day 46 starts
import re
match = re.search(r'\{\s*["\']?day["\']?\s*:\s*46\b', text)
if not match:
    raise ValueError("Could not find Day 46 start!")

idx = match.start()
print(f"Found Day 46 start at index {idx}")

truncated = text[:idx].rstrip()
if truncated.endswith(","):
    truncated = truncated[:-1]

with open("scripts/block10_iot_sec_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

formatted_days = []
for d in days:
    ts_day = json.dumps(d, indent=2, ensure_ascii=False)
    formatted_days.append(ts_day)

new_content = truncated + ",\n  " + ",\n  ".join(formatted_days) + "\n];\n"

with open("src/lib/data/iotSecLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated src/lib/data/iotSecLongLessons.ts with latest Days 46-50!")
