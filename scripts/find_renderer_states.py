import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx").read_text(encoding="utf-8").splitlines()
for i, l in enumerate(lines[70:120], 70):
    print(f"{i}: {l}")
