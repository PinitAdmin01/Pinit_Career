import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

for filename in ['bcomAccountingLongLessons.ts', 'pythonLongLessons.ts', 'reactLongLessons.ts', 'javaBasicsLongLessons.ts']:
    p = Path('src/lib/data') / filename
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8', errors='ignore')
    # find first day
    day_match = re.search(r'day:\s*(\d+)', text)
    print(f"=== {filename} ===")
    # find say array
    say_match = re.search(r'say:\s*\[(.*?)\]\s*,', text, re.DOTALL)
    if say_match:
        content = say_match.group(1).strip()
        lines = [line.strip() for line in content.split('\n') if line.strip().startswith('"') or line.strip().startswith("'")]
        print(f"Number of speech bubbles in Part 1 say array: {len(lines)}")
        for l in lines[:4]:
            print(f"  Bubble: {l[:90]}...")
    else:
        # maybe quoted key "say": [ ... ]
        say_match = re.search(r'\"say\":\s*\[(.*?)\]\s*,', text, re.DOTALL)
        if say_match:
            content = say_match.group(1).strip()
            lines = [line.strip() for line in content.split('\n') if line.strip().startswith('"') or line.strip().startswith("'")]
            print(f"Number of speech bubbles in Part 1 say array: {len(lines)}")
            for l in lines[:4]:
                print(f"  Bubble: {l[:90]}...")
    print()
