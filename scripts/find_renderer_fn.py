import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx").read_text(encoding="utf-8").splitlines()
for i, l in enumerate(lines):
    if 'function LessonContentRenderer' in l:
        print(f"Line {i}: {l}")
        for j in range(i, i + 35):
            print(f"  [{j}] {lines[j]}")
        break
