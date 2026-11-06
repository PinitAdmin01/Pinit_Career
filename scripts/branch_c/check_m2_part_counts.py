import json, re

for f in ["src/lib/data/sqlLongLessons.ts", "src/lib/data/bcomEntLongLessons.ts", "src/lib/data/bcomOpsLongLessons.ts"]:
    try:
        with open(f, "r", encoding="utf-8") as jf:
            text = jf.read()
            m = re.search(r'"day":\s*31,.*?(?="day":\s*32)', text, re.DOTALL)
            if m:
                parts = re.findall(r'"title":\s*"([^"]+)"', m.group(0))
                print(f"{f} Day 31 parts count: {len(parts)-2}")
    except Exception as e:
        print(f"{f}: {e}")
