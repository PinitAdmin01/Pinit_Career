import json
import re

with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text30 = f.read()

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    textLong = f.read()

print("=== DAYS 16 TO 30 AUDIT ===")
for day in range(16, 31):
    # From java30DayData.ts
    # find object with "day": day
    m30 = re.search(r'\{\s*"title":\s*"([^"]+)",\s*"desc":\s*"([^"]+)",.*?eTitle":\s*"([^"]+)",.*?"day":\s*' + str(day), text30, re.DOTALL)
    if m30:
        t30, d30, e30 = m30.group(1), m30.group(2), m30.group(3)
    else:
        t30, d30, e30 = "N/A", "N/A", "N/A"
    
    # From javaBasicsLongLessons.ts
    mLong = re.search(r'\{\s*"day":\s*' + str(day) + r',\s*"title":\s*"([^"]+)"', textLong)
    if mLong:
        tLong = mLong.group(1)
    else:
        tLong = "N/A"
        
    print(f"Day {day:02d}:")
    print(f"  30Day Title:  {t30}")
    print(f"  30Day Desc:   {d30}")
    print(f"  30Day eTitle: {e30}")
    print(f"  LongLesson:   {tLong}")
