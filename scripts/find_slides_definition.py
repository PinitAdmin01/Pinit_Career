import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path('src/app/quests/lesson/hooks/useLessonEngine.ts').read_text(encoding='utf-8', errors='ignore').splitlines()
for i, l in enumerate(lines):
    if 'slides =' in l or 'const slides' in l or 'slides:' in l:
        print(f"Line {i}: {l}")
        for j in range(max(0, i-5), min(len(lines), i + 25)):
            print(f"  [{j}] {lines[j]}")
        print("="*50)
