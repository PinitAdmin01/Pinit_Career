import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

lines = Path('src/app/quests/lesson/hooks/useLessonState.ts').read_text(encoding='utf-8', errors='ignore').splitlines()
print(f"Total lines in useLessonState.ts: {len(lines)}")
for i, l in enumerate(lines[:120]):
    print(f"{i}: {l}")
