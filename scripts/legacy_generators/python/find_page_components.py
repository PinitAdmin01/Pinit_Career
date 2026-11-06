import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path('src/app/quests/lesson/page.tsx').read_text(encoding='utf-8', errors='ignore').splitlines()
for i, l in enumerate(lines):
    if 'function' in l or 'const Lesson' in l:
        print(f"Line {i}: {l}")
