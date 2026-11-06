import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('scripts')

with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Split by objects in JAVA_30_DAYS_CONFIGS
chunks = text.split('"day":')

for b, d_range in [(2, range(6, 11)), (3, range(11, 16)), (4, range(16, 21))]:
    print(f"\n--- BLOCK {b} TITLES CHECK ---")
    for d in d_range:
        mod = __import__(f'block{b}_day{d}')
        day_obj = getattr(mod, f'DAY_{d}')
        day_title = day_obj.get('title')
        
        # In chunks, find the chunk that corresponds to day d
        # The title for day d is in the chunk before `"day": d`
        found_title = "NOT FOUND"
        for i in range(1, len(chunks)):
            # Check if this chunk starts with ` d` or ` d\n`
            if re.match(r'^\s*' + str(d) + r'\b', chunks[i]):
                prev_chunk = chunks[i-1]
                m_title = re.findall(r'"title":\s*"([^"]+)"', prev_chunk)
                if m_title:
                    found_title = m_title[-1]
                break

        match = (day_title == found_title)
        print(f"Day {d}: match={match}")
        if not match:
            print(f"  Script: '{day_title}'")
            print(f"  Config: '{found_title}'")
