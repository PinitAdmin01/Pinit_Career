import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx").read_text(encoding="utf-8").splitlines()
print("Lines 1015-1045:")
for i, l in enumerate(lines[1015:1045], 1015):
    print(f"{i}: {l}")
