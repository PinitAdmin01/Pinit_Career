import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path('src/app/quests/lesson/hooks/useLessonEngine.ts').read_text(encoding='utf-8', errors='ignore')
matches = [m.start() for m in re.finditer('setSlides', text)]
print(f"Total setSlides occurrences in useLessonEngine: {len(matches)}")
for pos in matches:
    start = max(0, pos - 100)
    end = min(len(text), pos + 300)
    print("---")
    print(text[start:end])
