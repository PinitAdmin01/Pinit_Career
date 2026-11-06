import sys
sys.path.append('scripts')

with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for b, d_range in [(2, range(6, 11)), (3, range(11, 16)), (4, range(16, 21))]:
    print(f"\n--- BLOCK {b} TITLES CHECK ---")
    for d in d_range:
        mod = __import__(f'block{b}_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        day_title = day_obj.get('title')
        
        # Search for title in java30DayData for this day
        m = re.search(r'\{\s*"title":\s*"([^"]+)",[\s\S]*?"day":\s*' + str(d) + r'\b', text)
        cfg_title = m.group(1) if m else "NOT FOUND"
        
        match = (day_title == cfg_title)
        print(f"Day {d}: match={match}")
        if not match:
            print(f"  Script: '{day_title}'")
            print(f"  Config: '{cfg_title}'")
