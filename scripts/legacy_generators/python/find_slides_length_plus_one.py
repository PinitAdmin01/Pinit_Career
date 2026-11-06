import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path("src/app/quests/lesson/hooks/useLessonEngine.ts").read_text(encoding="utf-8", errors="ignore")
matches = [m.start() for m in re.finditer(r'slidesLength\s*\+\s*1', text)]
print(f"Total slidesLength + 1 in useLessonEngine: {len(matches)}")
for pos in matches:
    start = max(0, pos - 60)
    end = min(len(text), pos + 100)
    print("  Context:", text[start:end].replace('\n', ' '))
