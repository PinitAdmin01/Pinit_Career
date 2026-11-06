import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx").read_text(encoding="utf-8", errors="ignore").splitlines()
for i, l in enumerate(lines[950:1050], 950):
    print(f"{i}: {l}")
