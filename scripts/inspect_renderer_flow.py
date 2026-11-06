import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx").read_text(encoding="utf-8", errors="ignore").splitlines()
print(f"Total lines: {len(lines)}")
for i, l in enumerate(lines[500:650], 500):
    print(f"{i}: {l}")
