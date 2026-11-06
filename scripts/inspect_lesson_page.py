import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path('src/app/quests/lesson/page.tsx').read_text(encoding='utf-8', errors='ignore').splitlines()
print(f"Total lines in page.tsx: {len(lines)}")
for i, l in enumerate(lines[:120]):
    print(f"{i}: {l}")
