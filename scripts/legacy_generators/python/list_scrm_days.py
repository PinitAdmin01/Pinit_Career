# scripts/list_scrm_days.py
import re

with open("src/lib/data/bcomScrmLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = re.findall(r'day:\s*(\d+),\s*\n\s*title:\s*[\'"](.*?)[\'"]', text)
for d, t in days:
    print(f"Day {int(d):02d}: {t}")
