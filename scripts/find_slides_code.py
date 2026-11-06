import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path('src/app/quests/lesson/hooks/useLessonEngine.ts').read_text(encoding='utf-8', errors='ignore').splitlines()
for i, l in enumerate(lines):
    if 'slides' in l and ('useMemo' in l or '=' in l):
        print(f"Line {i}: {l}")
        for j in range(i, min(len(lines), i + 40)):
            print(f"  {lines[j]}")
        break
