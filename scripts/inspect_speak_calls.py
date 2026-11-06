import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
import re

text = Path('src/app/quests/lesson/hooks/useLessonEngine.ts').read_text(encoding='utf-8', errors='ignore')
matches = [m.start() for m in re.finditer('speakWithAvatar', text)]
print(f"Total speakWithAvatar occurrences: {len(matches)}")
for pos in matches[:4]:
    start = max(0, pos - 150)
    end = min(len(text), pos + 250)
    print("---")
    print(text[start:end])
